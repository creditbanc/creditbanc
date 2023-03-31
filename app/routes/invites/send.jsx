import { json } from "@remix-run/node";
import sendgrid from "@sendgrid/mail";
import { get_user } from "~/utils/auth.server";

sendgrid.setApiKey(process.env.SENDGRID);

export const action = async ({ request }) => {
	const entity = await get_user(request);
	console.log("send_invite");
	console.log(entity);
	return null;
	const form = await request.formData();
	const share_link = form.get("share_link");
	const member_email = form.get("member_email");

	let invite_link = share_link + "&email=" + member_email;

	const msg = {
		from: "report@creditbanc.io",
		to: `${member_email}`,
		subject: "Someone just shared their credit report with you!",
		text: `
			Someone has shared a credit report with you

			${invite_link}

			Here at Credit Banc, we’ve simplified the process so that our users can pull and monitor both their personal AND business credit - and share it with anyone who needs to have it. And that includes you. You now have real-time access to their information with just a few clicks. Pretty neat, huh? 

			And if you’re thinking, “I wish it were always this easy to get my hands on a client’s credit history,” we tend to agree. That’s why we’ve set it up so you can monitor multiple reports all in one place. Simply log into your Credit Banc account for quick access to any client who shared their information with you.

			But why stop here? Do yourself a favor and make your life (and the lives of your other clients) a bit simpler and direct them to Credit Banc the next time you need access to their credit reports. It takes less than 3 minutes, and everyone can get on with their day. You’re happy. They’re happy. Wham, bam, thank you, ma’am. (Or, sir.)

			Work smarter, not harder, with Credit Banc. 
			The Creditbanc Team
		`,
		html: `
			<div style="width:100%; display:flex; flex-direction:column; align-items:center; ">
				<div style=" width: 580px; border:1px solid #eee; display:flex-root; flex-direction:column; border-radius:5px; padding:20px;">

					<div style="margin:15px 10px;">
						Someone has shared a credit report with you
					</div>	

					<a href=${invite_link} style="text-align:center; display:flex; flex-direction:column; background:#2563eb; align-items:center; justify-content:center; padding: 10px 10px; border-radius: 5px; width: 200px; align-self:center; color:#fff; margin:20px 0px; cursor:pointer; margin:20px auto;">
						<div style="width: 100%; text-align:center;">
							View Credit Report
						</div>
					</a>

					<div style="margin: 15px 10px;">
						Here at Credit Banc, we’ve simplified the process so that our users can pull and monitor both their personal AND business credit - and share it with anyone who needs to have it. And that includes you. You now have real-time access to their information with just a few clicks. Pretty neat, huh? 
					</div>

					<div style="margin: 15px 10px;">
						And if you’re thinking, “I wish it were always this easy to get my hands on a client’s credit history,” we tend to agree. That’s why we’ve set it up so you can monitor multiple reports all in one place. Simply log into your Credit Banc account for quick access to any client who shared their information with you. 
					</div>

					<div style="margin: 15px 10px;">
						But why stop here? Do yourself a favor and make your life (and the lives of your other clients) a bit simpler and direct them to Credit Banc the next time you need access to their credit reports. It takes less than 3 minutes, and everyone can get on with their day. You’re happy. They’re happy. Wham, bam, thank you, ma’am. (Or, sir.) 
					</div>

					<div style="margin: 5px 10px;">
						Work smarter, not harder, with Credit Banc. 
					</div>

					<div style="margin: 5px 10px;">
						The Creditbanc Team
					</div>
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
