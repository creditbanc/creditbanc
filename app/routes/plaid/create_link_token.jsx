import { PlaidApi } from "plaid";
import { configuration } from "~/api/client/plaid";

const PlaidClient = new PlaidApi(configuration);

export const action = async ({ request }) => {
	console.log("create_link_token_action");
	let location = new URL(request.url);
	let { origin } = location;

	const plaid_request = {
		user: {
			client_user_id: "user", // this needs to be changed to the user id
		},
		client_name: "Plaid Test App",
		products: ["auth", "transactions"],
		language: "en",
		// redirect_uri: `${origin}/plaid/oauth`,
		country_codes: ["US"],
	};

	console.log("plaid_request");
	console.log(plaid_request);

	try {
		const response = await PlaidClient.linkTokenCreate(plaid_request);
		let { data } = response;
		return data;
	} catch (error) {
		console.log("error");
		console.log(error);
		return null;
	}
};
