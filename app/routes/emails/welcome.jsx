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
		subject: "Urgent: Missing Documents for Your Funding Application",
		html: emailHtml,
	};

	await sendgrid.send(options);

	return new Response("Email sent", { status: 200 });
};

export default function Email({ entity_id, origin }) {
	const Block = ({ children }) => {
		return <div className={`block w-full py-[15px] px-[10px]`}>{children}</div>;
	};

	return (
		<Tailwind>
			<div className="block w-[700px] border border-solid border-gray-300 text-sm break-words">
				<div className="block border-0 border-b border-solid border-gray-300 w-full">
					<img
						className="block h-[30px] py-[15px] px-[10px]"
						src={"http://creditbanc.io/images/logos/cb_logo_3.png"}
						alt="CreditBanc"
					/>
				</div>
				<div className="block w-[90%] mx-auto">
					<div className="block w-full my-[15px]">
						<div className="block py-1 my-1">Hi Daniel,</div>
						<div className="block py-1 my-1">
							We're thrilled to join you on the path to securing the funding your business deserves. At
							Creditbanc, your success is our mission.
						</div>
						<div className="block py-1 my-1">
							<div className="font-semibold">Take the Next Steps:</div>
						</div>
						<div className="block py-1 my-1">
							Complete Your Application: You're on the right track. Let's finish strong:
						</div>
						<div className="block py-1 my-1">
							<a href="#" className="text-blue-600 underline">
								Resume Application
							</a>
						</div>
						<div className="block py-1 my-1">
							<a href="#" className="text-blue-600 underline">
								Upload Past 4 Months Bank Statements
							</a>
						</div>
						<div className="block py-1 my-1">
							<div className="font-semibold">Quick Intro to Creditbanc Network Finance:</div>
						</div>
						<div className="block py-1 my-1">
							<div className="ml-[20px]">
								<div className="block my-[10px]">
									- We're Your Advocate: As a FinTech company with a vast network of 75+ trusted
									lenders, we secure the best rates and terms for you.
								</div>
								<div className="block my-[10px]">
									- One-Stop Funding Hub: Say goodbye to complexity. Explore SBA loans, credit lines,
									revenue-based financing, and more – all in one place.
								</div>
								<div className="block my-[10px]">
									- No Credit Score Impact: Soft credit checks by our lenders ensure your score stays
									untouched.
								</div>
							</div>
						</div>
						<div className="block py-1 my-1">
							Ready to Accelerate? Schedule a chat with our funding advisors:
						</div>
						<div className="block py-1 my-1">
							<a href="#" className="text-blue-600 underline">
								Schedule a call here
							</a>
						</div>
						<div className="block py-1 my-1">
							or Call: 5125372291 to reach Daniel Bedoya, your funding analyst.
						</div>
						<div className="block py-1 my-1">Thanks for choosing Creditbanc. Exciting times are ahead!</div>
					</div>
				</div>
			</div>
		</Tailwind>
	);
}
