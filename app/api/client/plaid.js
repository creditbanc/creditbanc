import { Configuration, PlaidEnvironments, PlaidApi } from "plaid";
import { delete_collection, delete_doc, get_doc, get_collection } from "~/utils/firebase";
import { forkJoin, from, lastValueFrom, merge, of as rxof, throwError, zip } from "rxjs";
import { map as rxmap, concatMap, catchError, reduce as rxreduce, filter as rxfilter, tap } from "rxjs/operators";
import { get, inspect } from "~/utils/helpers";
import {
	curry,
	head,
	identity,
	last,
	pickAll,
	pipe,
	prop,
	uniqBy,
	values,
	groupBy,
	mergeAll,
	map,
	sortBy,
	sum,
	isEmpty,
	not,
} from "ramda";
import moment from "moment";
import { all, cons } from "shades";

export const configuration = new Configuration({
	basePath: PlaidEnvironments.sandbox,
	baseOptions: {
		headers: {
			"PLAID-CLIENT-ID": process?.env?.PLAID_CLIENT_ID,
			"PLAID-SECRET": process?.env?.PLAID_SECRET,
		},
	},
});

export const disconnect_plaid = async ({ group_id }) => {
	await delete_doc(["plaid_credentials", group_id]);

	let accounts_queries = [
		{
			param: "group_id",
			predicate: "==",
			value: group_id,
		},
	];

	await delete_collection({
		path: ["plaid_accounts"],
		queries: accounts_queries,
	});

	return true;
};

export default class Plaid {
	constructor(group_id) {
		this.group_id = group_id;
		this.plaid = new PlaidApi(configuration);
	}

	get _credentials_() {
		return from(get_doc(["plaid_credentials", this.group_id]));
	}

	get has_credentials() {
		return this._credentials_.pipe(rxmap(pipe(isEmpty, not)));
	}

	auths = async () => {
		console.log("auths");
		let { access_token } = await lastValueFrom(this._credentials_);
		const request = { access_token };
		return from(this.plaid.authGet(request)).pipe(rxmap(prop("data")));
	};

	identities = async () => {
		console.log("identities");
		let { access_token } = await lastValueFrom(this._credentials_);
		const request = { access_token };
		return from(this.plaid.identityGet(request)).pipe(rxmap(prop("data")));
	};

	accounts = async () => {
		console.log("plaid.accounts");

		let has_credentials = await lastValueFrom(this.has_credentials);

		console.log("has_credentials");
		console.log(has_credentials);

		if (!has_credentials) {
			return rxof({ accounts: [] });
		}

		let { accounts: identities } = await lastValueFrom(await this.identities());
		let auth_accounts = await lastValueFrom(await this.auths());

		// console.log("auth_accounts");
		// console.log(auth_accounts);

		let {
			accounts,
			numbers: { ach, bacs, eft, international },
		} = auth_accounts;

		let all_accounts = [...accounts, ...identities, ...ach, ...bacs, ...eft, ...international];
		let accounts_payload = pipe(groupBy(prop("account_id")), map(mergeAll), values)(all_accounts);

		// console.log("accounts_payload");
		// console.log(accounts_payload);

		return rxof({ accounts: accounts_payload });
	};

	get current_balance() {
		let accounts = from(this.accounts());
		// console.log("current_balance");
		// console.log(accounts);
		return accounts.pipe(
			concatMap(identity),
			// tap(() => console.log("current_balance")),
			// tap(console.log),
			rxmap(pipe(prop("accounts"), get(all, "balances", "available"), sum))
		);
	}

	async transactions({ months = 12 } = {}) {
		console.log("transactions");
		let { access_token } = await lastValueFrom(this._credentials_);
		let start_date = moment().subtract(months, "months").format("YYYY-MM-DD");
		let end_date = moment().format("YYYY-MM-DD");
		let { accounts = [] } = await lastValueFrom(await this.accounts());

		// console.log("plaid.accounts");
		// console.log(accounts);

		let account_ids = pipe(map(prop("account_id")))(accounts);

		const request = {
			access_token,
			start_date,
			end_date,
			options: {
				account_ids,
				include_personal_finance_category: true,
				include_original_description: true,
			},
		};

		// console.log("transactions.request");
		// console.log(request);

		try {
			const response = await this.plaid.transactionsGet(request);
			let transactions = response.data.transactions;

			// console.log("transactions.length");
			// console.log(transactions);

			const total_transactions = response.data.total_transactions;

			while (transactions.length < total_transactions) {
				const paginatedRequest = {
					access_token,
					start_date,
					end_date,
					options: {
						account_ids,
						offset: transactions.length,
						include_personal_finance_category: true,
						include_original_description: true,
					},
				};

				const paginatedResponse = await this.plaid.transactionsGet(paginatedRequest);

				transactions = transactions.concat(paginatedResponse.data.transactions);
			}

			return rxof({ transactions: pipe(sortBy(prop("date")))(transactions) });
		} catch (error) {
			console.log("error_________");
			console.log(error.response.data);
			return rxof({ is_error: true, error: error.response.data });
		}
	}
}
