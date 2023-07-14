import moment from "moment";
import { isEmpty, pipe } from "ramda";
import { mod, all } from "shades";
import { get_transactions } from "~/api/plaid.server";
import { get_collection, get_doc, set_doc } from "~/utils/firebase";
import {
	get_entity_id,
	get_group_id,
	use_search_params,
} from "~/utils/helpers";

let get_plaid_account_transactions_from_db = async ({
	group_id,
	account_id,
}) => {
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
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let { account_id } = use_search_params(request);

	// console.log("params");
	// console.log({ account_id, group_id, entity_id });

	let transactions = await get_plaid_account_transactions_from_db({
		group_id,
		account_id,
	});

	// console.log("transactions");
	// console.log(transactions);

	if (isEmpty(transactions)) {
		let plaid_credentials = await get_doc(["plaid_credentials", group_id]);
		let { access_token } = plaid_credentials;

		let end_date = moment().format("YYYY-MM-DD");
		let start_date = moment().subtract(12, "months").format("YYYY-MM-DD");

		let transactions = await get_transactions({
			start_date,
			end_date,
			access_token,
			account_ids: [account_id],
		});

		// console.log("transactions");
		// console.log(transactions);

		transactions = await Promise.all(
			pipe(
				mod(all)(async (transaction) => {
					await set_doc(
						["transactions", transaction.transaction_id],
						{ ...transaction, entity_id, group_id }
					);
					return transaction;
				})
			)(transactions)
		);
	}

	return transactions;
};
