import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import { Html } from "@react-email/html";
import { json } from "@remix-run/node";
import axios from "axios";
import { get_session_entity_id } from "~/utils/auth.server";
import { get_group_id } from "~/utils/helpers";

// sendgrid.setApiKey(process.env.SENDGRID);

export const action = async ({ request }) => {
	// const emailHtml = render(<Email />);

	// const options = {
	// 	from: "1infiniteloop.end@gmail.com",
	// 	to: "1infiniteloop.end@gmail.com",
	// 	subject: "Welcome to CreditBanc",
	// 	html: emailHtml,
	// };

	// await sendgrid.send(options);
	return json({ message: "success" });
};

export const loader = async ({ request }) => {
	let { origin, pathname } = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(pathname);

	let response = await axios({
		method: "post",
		url: `${origin}/emails/welcome/resource/e/${entity_id}/g/${group_id}`,
	});

	return null;
};

export default function Email() {
	return (
		<Html lang="en">
			<div className="flex flex-col h-full border rounded gap-y-3 w-[700px] p-6">
				<div>Welcome to CreditBanc</div>
				<div>We're excited to help you understand your business credit</div>
				<div>
					knowing your business and personal credit scores is one of the best investments you can do for your
					business. This is what lenders look at when deciding to give you a loan or credit card.
				</div>

				<div>Now what? Watch this 3-minute video to learn what creditbanc can do.</div>
				<div>
					<div>Cheers,</div>
					<div>The CreditBanc Team</div>
				</div>
			</div>
		</Html>
	);
}
