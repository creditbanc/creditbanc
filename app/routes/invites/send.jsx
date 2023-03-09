import { json } from "@remix-run/node";
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(
	"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"
);

export const action = async ({ request }) => {
	console.log("teszzzz");
	console.log("onInvite");

	const form = await request.formData();
	const share_link = form.get("share_link");
	const member_email = form.get("member_email");
	console.log("member_email", member_email);

	console.log("share_link", share_link);

	const msg = {
		from: "1infiniteloop.end@gmail.com",
		to: `${member_email}`,
		subject: "Daniel has shared a credit report with you",
		text: "and easy to do anywhere, even with Node.js",
		html: `
			<div style="width:100%; display:flex; flex-direction:column; align-items:center; ">
				<div style=" width: 580px; border:1px solid #eee; display:flex-root; flex-direction:column; border-radius:5px; padding:20px; ">
					<div style="margin:5px; 0px">Daniel has shared a document with you.</div>
					<a href=${share_link} style="text-align:center; display:flex; flex-direction:column; background:#2563eb; align-items:center; justify-content:center; padding: 10px 10px; border-radius: 5px; width: 200px; align-self:center; color:#fff; margin:20px 0px; cursor:pointer; margin:20px auto;">
						<div style="width: 100%; text-align:center;">
							View report
						</div>
					</a>
					<div>Thank you!</div>
					<div>The Creditbanc Team</div>
				</div>
			</div>
		`,
	};

	try {
		await sendgrid.send(msg);
		return json({ success: true });
	} catch (error) {
		console.error(error);

		if (error.response) {
			console.error(error.response.body);
			return json({ error: error.response.body });
		}
	}
};
