import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import "dotenv/config";
import { inspect } from "~/utils/helpers";
import { curry, keys, map, pipe, prop, sortBy } from "ramda";

const configuration = new Configuration({
	basePath: PlaidEnvironments.sandbox,
	baseOptions: {
		headers: {
			"PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
			"PLAID-SECRET": process.env.PLAID_SECRET,
		},
	},
});

const plaidClient = new PlaidApi(configuration);
let access_token = "access-sandbox-0428200f-e7ff-4d9e-94c2-288d568b20a7";

export const get_identities = async ({ access_token }) => {
	const request = {
		access_token,
	};

	try {
		const response = await plaidClient.identityGet(request);

		let { data } = response;
		// console.log("response");
		// inspect(data);

		return data;
	} catch (error) {
		// handle error
		console.log("error");
		console.log(error);
	}
};

export const get_accounts = async ({ access_token }) => {
	const request = {
		access_token,
	};

	try {
		const response = await plaidClient.accountsGet(request);

		let { data } = response;
		// console.log("response");
		// inspect(data);

		return data;
	} catch (error) {
		// handle error
		console.log("error");
		console.log(error);
	}
};

export const get_auths = async ({ access_token }) => {
	const request = {
		access_token,
	};

	try {
		const response = await plaidClient.authGet(request);

		let { data } = response;
		// console.log("response");
		// inspect(data);

		return data;
	} catch (error) {
		// handle error
		console.log("error");
		console.log(error);
	}
};

export const get_transactions = async ({
	start_date,
	end_date,
	access_token,
	account_ids,
}) => {
	console.log("get_transactions");
	console.log(start_date);
	console.log(end_date);
	console.log(access_token);
	console.log(account_ids);

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

	try {
		const response = await plaidClient.transactionsGet(request);
		let transactions = response.data.transactions;

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

			const paginatedResponse = await plaidClient.transactionsGet(
				paginatedRequest
			);

			transactions = transactions.concat(
				paginatedResponse.data.transactions
			);
		}

		console.log("response____");
		console.log(transactions.length);

		return { transactions: pipe(sortBy(prop("date")))(transactions) };
	} catch (error) {
		// handle error
		console.log("error_________");
		// console.log(error);

		// let { data } = error;

		// console.log(keys(error));
		console.log(error.response.data);

		return { is_error: true, error: error.response.data };
	}
};

export const sync_transactions = async () => {
	let cursor = null;
	let hasMore = true;

	let added = [];
	let modified = [];
	let removed = [];

	// Iterate through each page of new transaction updates for item
	while (hasMore) {
		const request = {
			access_token,
			cursor,
			options: {
				include_personal_finance_category: true,
				include_original_description: true,
			},
		};

		const response = await plaidClient.transactionsSync(request);
		const data = response.data;

		const add_type = curry((label, data) =>
			pipe(map((value) => ({ ...value, type: label })))(data)
		);

		added = added.concat(pipe(add_type("added"))(data.added));
		modified = modified.concat(pipe(add_type("modified"))(data.modified));
		removed = removed.concat(pipe(add_type("removed"))(data.removed));

		hasMore = data.has_more;
		cursor = data.next_cursor;
	}

	let payload = pipe(sortBy(prop("date")))([
		...added,
		...modified,
		...removed,
	]);

	return payload;
};

export const institutions = async () => {
	// Pull institutions
	const request = {
		count: 500,
		offset: 0,
		country_codes: ["US"],
	};
	try {
		const response = await plaidClient.institutionsGet(request);
		const institutions = response.data.institutions;
		console.log("institutions");
		console.log(institutions.length);
		// inspect(institutions);
	} catch (error) {
		// Handle error
	}
};

export const get_balances = async () => {
	const request = {
		access_token,
	};

	try {
		const response = await plaidClient.accountsBalanceGet(request);
		const { data } = response;

		if (data.accounts.length > 0) {
			return data.accounts;
		} else {
			return [];
		}
	} catch (error) {
		// handle error
		console.log("error");
		console.log(error);
	}
};
