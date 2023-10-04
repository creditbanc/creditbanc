import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import { form_params } from "~/utils/helpers";
const cb_logo = "/images/logos/cb_logo_3.png";

sendgrid.setApiKey(process.env.SENDGRID);
// sendgrid.setApiKey(sg);

export const action = async ({ request }) => {
	let location = new URL(request.url);

	let form = await form_params(request);

	let { entity_id } = form;

	const emailHtml = render(<Email entity_id={entity_id} origin={location.origin} />);

	const options = {
		from: "1infiniteloop.end@gmail.com",
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
		<div
			style={{
				display: "block",
				width: 700,
				border: "1px solid #ddd",
			}}
		>
			<div
				style={{
					display: "block",

					borderBottom: "1px solid #ddd",
					justifyContent: "center",
					width: "100%",
				}}
			>
				<img
					style={{
						display: "block",
						width: "fit-content",
						height: 30,
						padding: "15px 10px",
					}}
					src={"http://creditbanc.io/images/logos/cb_logo_3.png"}
					alt="CreditBanc"
				/>
			</div>
			<div
				style={{
					display: "block",
					margin: "15px 0px",
					padding: "0px 20px",
					fontSize: 16,
				}}
			>
				<div style={{ margin: "15px 0px" }}>
					You told us you forgot your password. If you really did, click here to choose a new one:
				</div>
				<a
					href={`${origin}/reset?entity_id=${entity_id}`}
					style={{
						margin: "15px 0px",
						padding: "10px 20px",
						backgroundColor: "#28B077",
						borderRadius: "7px",
						width: "300px",
						display: "block",
						color: "white",
						fontWeight: "semibold",
						cursor: "pointer",
						textAlign: "center",
					}}
				>
					Choose a new password
				</a>
				<div style={{ margin: "15px 0px" }}>
					<div>If you ddin't mean to reset your password, then you can just ignore this email; </div>
					<div>your password will not change</div>
				</div>
			</div>
		</div>
	);
}
