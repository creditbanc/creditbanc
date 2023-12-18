// import { form_params } from "~/utils/helpers";

// const client = require("twilio")(process.env.TWILLIO_ACCOUNT_SID, process.env.TWILLIO_AUTH_TOKEN);

// export const action = async ({ request }) => {
// 	let form = await form_params(request);

// 	console.log("emailform");
// 	console.log(form);

// 	let { payload } = form;
// 	let { group_id, entity_id, to, from } = JSON.parse(payload);

// 	try {
// 		client.messages
// 			.create({
// 				body: "A new application has been submitted.",
// 				to,
// 				from: "3526448623",
// 			})
// 			.then((message) => console.log(message.sid));
// 	} catch (error) {
// 		console.log(error);
// 	}

// 	return null;
// };
