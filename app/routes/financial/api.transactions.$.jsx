import { isEmpty, pipe } from "ramda";
import { lastValueFrom, of as rxof, timeout } from "rxjs";
import Finance from "~/api/client/Finance";
import Plaid from "~/api/client/plaid";
import { get_session_entity_id } from "~/utils/auth.server";
import { get_group_id } from "~/utils/helpers";

export const loader = async ({ request }) => {
	let { pathname } = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(pathname);
	// let { account_id } = use_search_params(request);

	// console.log("params");
	// console.log({ account_id, group_id, entity_id });

	let finance = new Finance(entity_id, group_id);
	let transactions = await lastValueFrom(finance._transactions_.pipe(timeout({ each: 5000, with: () => rxof({}) })));

	// console.log("api.transactions______");
	// console.log(transactions);

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
