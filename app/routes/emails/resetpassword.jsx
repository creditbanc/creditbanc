import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import { form_params } from "~/utils/helpers";
const cb_logo = "/images/logos/cb_logo_3.png";
import { Tailwind } from "@react-email/components";

sendgrid.setApiKey(process.env.SENDGRID);
// sendgrid.setApiKey(sg);

export const action = async ({ request }) => {
	let location = new URL(request.url);

	let form = await form_params(request);

	let { entity_id } = form;

	const emailHtml = render(<Email entity_id={entity_id} origin={location.origin} />, { pretty: true });

	const options = {
		from: "daniel@creditbanc.io",
		to: "1infiniteloop.end@gmail.com",
		subject: "CreditBanc: Reset Password",
		html: emailHtml,
	};

	await sendgrid.send(options);

	return null;
};

export default function Email({ entity_id, origin }) {
	// let { origin } = location;

	return (
		<Tailwind>
			<div className="block w-[700px] border border-solid border-gray-300">
				<div className="block border-0 border-b border-solid border-gray-300 w-full">
					<img
						className="block h-[30px] py-[15px] px-[10px]"
						src={"http://creditbanc.io/images/logos/cb_logo_3.png"}
						alt="CreditBanc"
					/>
				</div>
				<div className="block w-full my-[15px] px-[20px]">
					<div className="block my-[15px]">
						You told us you forgot your password. If you really did, click here to choose a new one:
					</div>
					<a
						href={`${origin}/reset?entity_id=${entity_id}`}
						className="block bg-red-500 py-[15px] my-[10px] rounded w-[300px] text-white font-semibold cursor-pointer text-center"
					>
						Choose a new password
					</a>
					<div className="block my-[15px]">
						<div>If you ddin't mean to reset your password, then you can just ignore this email; </div>
						<div>your password will not change</div>
					</div>
				</div>
			</div>
		</Tailwind>
	);
}
