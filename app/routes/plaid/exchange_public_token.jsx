import { PlaidApi } from "plaid";
import { form_params } from "~/utils/helpers";
import { configuration } from "~/api/client/plaid";

const PlaidClient = new PlaidApi(configuration);

export const action = async ({ request }) => {
	console.log("exchange_public_token_action");
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
