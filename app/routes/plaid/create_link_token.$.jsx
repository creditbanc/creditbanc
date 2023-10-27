import { PlaidApi } from "plaid";
import { configuration } from "~/api/client/plaid";
import { get_session_entity_id } from "~/utils/auth.server";
import { get_entity_id } from "~/utils/helpers";

const PlaidClient = new PlaidApi(configuration);

export const action = async ({ request }) => {
	console.log("create_link_token_action");
	let location = new URL(request.url);
	let { origin, pathname } = location;
	let entity_id = get_entity_id(pathname);
	console.log("plaid.entity_id");
	console.log(location);
	console.log("entity_id");
	console.log(entity_id);

	const plaid_request = {
		user: {
			client_user_id: entity_id,
		},
		client_name: "Credit Banc",
		products: ["auth", "transactions"],
		language: "en",
		// redirect_uri: `${origin}/plaid/oauth`,
		country_codes: ["US"],
	};

	console.log("plaid_request");
	console.log(plaid_request);

	try {
		const response = await PlaidClient.linkTokenCreate(plaid_request);

		// console.log("create_link_token_action_response");
		// console.log(response);
		let { data } = response;
		return data;
	} catch (error) {
		console.log("create_link_token_action_error");
		console.log(error);
		return null;
	}
};
