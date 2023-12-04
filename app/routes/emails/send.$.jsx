import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import { form_params } from "~/utils/helpers";
import WelcomeEmail from "./welcome.$";

sendgrid.setApiKey(process.env.SENDGRID);

const email_components = {
	welcome: WelcomeEmail,
};

export const action = async ({ request }) => {
	console.log("emailsend");
	let location = new URL(request.url);

	let form = await form_params(request);

	console.log("emailform");
	console.log(form);

	let { payload } = form;
	let { group_id, entity_id, email_id } = JSON.parse(payload);

	console.log("email_id");
	console.log(payload);

	let Email = email_components[email_id];
	const emailHtml = render(<Email entity_id={entity_id} origin={location.origin} />, { pretty: true });

	const options = {
		from: "daniel@creditbanc.io",
		to: "1infiniteloop.end@gmail.com",
		subject: "Urgent: Missing Documents for Your Funding Application",
		html: emailHtml,
	};

	await sendgrid.send(options);

	return new Response("Email sent", { status: 200 });
};
