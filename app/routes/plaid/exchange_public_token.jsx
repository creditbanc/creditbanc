import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { form_params } from "~/utils/helpers";

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
	let { public_token } = await form_params(request);

	try {
		const response = await PlaidClient.itemPublicTokenExchange({
			public_token,
		});

		let { data } = response;
		return data;
	} catch (error) {
		return null;
	}
};
