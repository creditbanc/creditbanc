const accountSid = "AC87fa36781fb2bf1cf29cc5da41ac850c";
const authToken = "03d3abb6b89af50f0d0093c427b06041";

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
