import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const configuration = new Configuration({
	basePath: PlaidEnvironments.sandbox,
	baseOptions: {
		headers: {
			"PLAID-CLIENT-ID": "5e5a8afbd52ab60013b29008",
			"PLAID-SECRET": "e0f302dca329fa6db6e485c12e16be",
		},
	},
});

const PlaidClient = new PlaidApi(configuration);

export const action = async ({ request }) => {
	let location = new URL(request.url);
	let { origin } = location;

	const plaid_request = {
		user: {
			client_user_id: "user", // this needs to be changed to the user id
		},
		client_name: "Plaid Test App",
		products: ["auth"],
		language: "en",
		redirect_uri: `${origin}/plaid/oauth`,
		country_codes: ["US"],
	};

	try {
		const response = await PlaidClient.linkTokenCreate(plaid_request);
		let { data } = response;
		return data;
	} catch (error) {
		return null;
	}
};
