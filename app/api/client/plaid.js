import { Configuration, PlaidEnvironments } from "plaid";
import { delete_collection, delete_doc } from "~/utils/firebase";

export const configuration = new Configuration({
	basePath: PlaidEnvironments.sandbox,
	baseOptions: {
		headers: {
			"PLAID-CLIENT-ID": "5e5a8afbd52ab60013b29008",
			"PLAID-SECRET": "8497df66be1b4e84b033b5734db348",
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
