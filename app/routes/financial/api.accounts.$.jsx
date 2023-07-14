import { get_collection, get_doc, set_doc } from "~/utils/firebase";
import { form_params, get_entity_id, get_group_id } from "~/utils/helpers";
import { get_auths, get_identities } from "~/api/plaid.server";
import { groupBy, map, mergeAll, pipe, prop, values } from "ramda";

export const action = async ({ request }) => {
	console.log("plaid_action");
	let { pathname } = new URL(request.url);
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let form = await form_params(request);
	let { access_token } = form;

	let { accounts: identities } = await get_identities({ access_token });
	let auth_accounts = await get_auths({ access_token });

	let {
		accounts,
		numbers: { ach, bacs, eft, international },
	} = auth_accounts;

	let all_accounts = [
		...accounts,
		...identities,
		...ach,
		...bacs,
		...eft,
		...international,
	];

	let accounts_payload = pipe(
		groupBy(prop("account_id")),
		map(mergeAll),
		values
	)(all_accounts);

	await Promise.all(
		pipe(
			map(async (account) => {
				let { account_id } = account;
				await set_doc(["plaid_accounts", account_id], {
					entity_id,
					group_id,
					...account,
				});
				return account;
			})
		)(accounts_payload)
	);

	return accounts_payload;
};

export const loader = async ({ request }) => {
	let { pathname } = new URL(request.url);
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	let accounts_queries = [
		{
			param: "group_id",
			predicate: "==",
			value: group_id,
		},
	];

	let accounts = await get_collection({
		path: ["plaid_accounts"],
		queries: accounts_queries,
	});

	return accounts;
};
