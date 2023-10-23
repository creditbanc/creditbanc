import moment from "moment";
import { isEmpty, pipe } from "ramda";
import { lastValueFrom } from "rxjs";
import { mod, all } from "shades";
import Finance from "~/api/client/Finance";
import Plaid from "~/api/client/plaid";
import { get_transactions } from "~/api/plaid.server";
import { get_session_entity_id } from "~/utils/auth.server";
import { get_collection, get_doc, set_doc } from "~/utils/firebase";
import { get_entity_id, get_group_id, use_search_params } from "~/utils/helpers";

let get_plaid_account_transactions_from_db = async ({ group_id, account_id }) => {
	let transactions_queries = [
		{
			param: "group_id",
			predicate: "==",
			value: group_id,
		},
		{
			param: "account_id",
			predicate: "==",
			value: account_id,
		},
	];

	let transactions = await get_collection({
		path: ["transactions"],
		queries: transactions_queries,
	});

	return transactions;
};

let get_plaid_transactions_from_db = async ({ group_id }) => {
	let transactions_queries = [
		{
			param: "group_id",
			predicate: "==",
			value: group_id,
		},
	];

	let transactions = await get_collection({
		path: ["transactions"],
		queries: transactions_queries,
	});

	return transactions;
};

export const loader = async ({ request }) => {
	let { pathname } = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(pathname);
	// let { account_id } = use_search_params(request);

	// console.log("params");
	// console.log({ account_id, group_id, entity_id });

	let finance = new Finance(entity_id, group_id);
	let transactions = await lastValueFrom(finance._transactions_);

	console.log("api.transactions______");
	console.log(transactions);

	if (isEmpty(transactions)) {
		// let finance = new Finance(entity_id, group_id);
		let has_credentials = await lastValueFrom(finance.has_plaid_credentials);

		if (has_credentials) {
			let plaid = new Plaid(group_id);
			let plaid_transactions = await lastValueFrom(await plaid.transactions());

			// console.log("api.plaid_transactions______");
			// console.log(plaid_transactions);

			if (!isEmpty(plaid_transactions)) {
				let transactions = await finance.set_transactions(plaid_transactions);

				return transactions;
			}
		} else {
			return { transactions: [] };
		}
	}

	return { transactions };
};
