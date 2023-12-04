const accountSid = "AC6747ef20287b68adcc399d4e29c9fbf5";
const authToken = "9e017ccb7e5fc206baab6b5a43ada791";

const client = require("twilio")(accountSid, authToken);

export const loader = async ({ request }) => {
	try {
		client.messages
			.create({
				body: "Hello from twilio-node",
				to: "3052578007",
				from: "3526448623",
			})
			.then((message) => console.log(message.sid));
	} catch (error) {
		console.log(error);
	}

	return null;
};

export default function Container() {
	return <div>sms</div>;
}
