import { form_params } from "~/utils/helpers";

const accountSid = "AC6747ef20287b68adcc399d4e29c9fbf5";
const authToken = "9e017ccb7e5fc206baab6b5a43ada791";

const client = require("twilio")(accountSid, authToken);

export const action = async ({ request }) => {
	let form = await form_params(request);

	console.log("emailform");
	console.log(form);

	let { payload } = form;
	let { group_id, entity_id, to, from } = JSON.parse(payload);

	try {
		client.messages
			.create({
				body: "A new application has been submitted.",
				to,
				from: "3526448623",
			})
			.then((message) => console.log(message.sid));
	} catch (error) {
		console.log(error);
	}

	return null;
};
