import { get_collection, get_doc, set_doc } from "~/utils/firebase";
import { form_params, get_entity_id, get_group_id } from "~/utils/helpers";
import { get_auths, get_identities } from "~/api/plaid.server";
import { groupBy, isEmpty, map, mergeAll, pipe, prop, values } from "ramda";
import { get_session_entity_id } from "~/utils/auth.server";
import { lastValueFrom } from "rxjs";
import Finance from "~/api/client/Finance";
import Plaid from "~/api/client/plaid";
import { cons } from "shades";

// const get_plaid_accounts = async ({ access_token }) => {
// 	let { accounts: identities } = await get_identities({ access_token });
// 	let auth_accounts = await get_auths({ access_token });

// 	let {
// 		accounts,
// 		numbers: { ach, bacs, eft, international },
// 	} = auth_accounts;

// 	let all_accounts = [...accounts, ...identities, ...ach, ...bacs, ...eft, ...international];

// 	let accounts_payload = pipe(groupBy(prop("account_id")), map(mergeAll), values)(all_accounts);

// 	return accounts_payload;
// };

// const set_plaid_account = async (account) => {
// 	let { account_id } = account;
// 	await set_doc(["plaid_accounts", account_id], account);
// 	return account;
// };

// export const set_plaid_accounts = async ({ access_token, entity_id, group_id }) => {
// 	let accounts = await get_plaid_accounts({ access_token });

// 	await Promise.all(
// 		pipe(
// 			map(async (account) => {
// 				await set_plaid_account({ ...account, entity_id, group_id });
// 				return account;
// 			})
// 		)(accounts)
// 	);

// 	return accounts;
// };

// let get_plaid_accounts_from_db = async (group_id) => {
// 	let accounts_queries = [
// 		{
// 			param: "group_id",
// 			predicate: "==",
// 			value: group_id,
// 		},
// 	];

// 	let accounts = await get_collection({
// 		path: ["plaid_accounts"],
// 		queries: accounts_queries,
// 	});

// 	return accounts;
// };

export const loader = async ({ request }) => {
	let { pathname } = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(pathname);

	// let accounts = await get_plaid_accounts_from_db(group_id);

	let finance = new Finance(entity_id, group_id);
	let { accounts } = await lastValueFrom(finance.plaid_accounts);

	console.log("api.accounts______");
	console.log(accounts);

	if (isEmpty(accounts)) {
		let finance = new Finance(entity_id, group_id);
		let has_credentials = await lastValueFrom(finance.has_plaid_credentials);

		if (has_credentials) {
			let plaid = new Plaid(group_id);
			let plaid_accounts = await lastValueFrom(await plaid.accounts());

			if (!isEmpty(plaid_accounts)) {
				let accounts = await finance.set_accounts(plaid_accounts);

				return accounts;
			}
		} else {
			return { accounts: [] };
		}
	}

	return { accounts };
};
