import { get_collection, get_doc, set_doc } from "~/utils/firebase";
import { form_params, get_entity_id, get_group_id } from "~/utils/helpers";
import { get_auths, get_identities } from "~/api/plaid.server";
import { groupBy, isEmpty, map, mergeAll, pipe, prop, values } from "ramda";
import { get_session_entity_id } from "~/utils/auth.server";
import { lastValueFrom, of as rxof, timeout } from "rxjs";
import Finance from "~/api/client/Finance";
import Plaid from "~/api/client/plaid";
import { cons } from "shades";

export const loader = async ({ request }) => {
	let { pathname } = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(pathname);

	// let accounts = await get_plaid_accounts_from_db(group_id);

	let finance = new Finance(entity_id, group_id);
	let { accounts } = await lastValueFrom(finance.plaid_accounts.pipe(timeout({ each: 5000, with: () => rxof({}) })));

	// console.log("api.accounts______");
	// console.log(accounts);

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
