import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import "dotenv/config";
import { inspect } from "~/utils/helpers";
import { curry, map, pipe, prop, sortBy } from "ramda";

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
let access_token = "access-sandbox-82a61619-29cb-4f47-a39f-ac187056412e";

export const get_accounts = async () => {
	const request = {
		access_token,
	};

	try {
		const response = await plaidClient.accountsGet(request);

		let { data } = response;

		const accounts = response.data.accounts;
		// console.log("response");
		// inspect(accounts);

		return accounts;
	} catch (error) {
		// handle error
		console.log("error");
		console.log(error);
	}
};

export const get_transactions = async () => {
	const request = {
		access_token,
		start_date: "2020-01-01",
		end_date: "2023-06-01",
		options: {
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
				start_date: "2020-01-01",
				end_date: "2023-06-01",
				options: {
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

		return pipe(sortBy(prop("date")))(transactions);
	} catch (error) {
		// handle error
		console.log("error");
		console.log(error);
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
