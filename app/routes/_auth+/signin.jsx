import { useState } from "react";
import InputField from "~/components/InputField";
import { signin } from "../../utils/auth.server";
import { Form, useSubmit, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { get_user } from "../../utils/auth.server";

export const loader = async ({ request }) => {
	return (await get_user(request)) ? redirect("/") : null;
};

export async function action({ request }) {
	console.log("action");
	var form = await request.formData();

	const email = form.get("email");
	const password = form.get("password");

	if (typeof email !== "string" || typeof password !== "string") {
		return json({ error: "Invalid form data" }, { status: 400 });
	}

	return await signin({ email, password });
}

export default function SignIn() {
	const actionData = useActionData();
	const [formError, setFormError] = useState(actionData?.error || "");
	const submit = useSubmit();
	const [formData, setFormData] = useState({ email: "", password: "" });

	const onSubmit = (event) => {
		console.log("onSubmit");
		event.preventDefault();
		let form = event.currentTarget;
		submit(form, { method: "post", action: "/signin" });
	};

	const handleFormChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className="relative h-full w-full flex flex-col items-center justify-center p-[10px] z-[1]">
			<div className="flex flex-col w-full max-w-sm p-[15px] bg-white border border-gray-200 rounded-lg shadow-sm">
				<div>{formError}</div>
				<form onSubmit={onSubmit}>
					<div className="my-[10px]">
						<InputField
							name={"email"}
							type={"email"}
							id={"email"}
							label={"Email"}
							placeholder={"you@example.com"}
							onChange={handleFormChange}
							value={formData.email}
							icon={
								<svg
									className="h-5 w-5 text-gray-200"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
									<path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
								</svg>
							}
						/>
					</div>

					<div className="my-[10px]">
						<InputField
							name={"password"}
							type={"password"}
							id={"password"}
							label={"Password"}
							placeholder={"••••••••"}
							onChange={handleFormChange}
							value={formData.password}
							icon={
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="h-5 w-5 text-gray-200"
								>
									<path
										fillRule="evenodd"
										d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
										clipRule="evenodd"
									/>
								</svg>
							}
						/>
					</div>

					<div className="w-full mt-[15px]">
						<button
							type="submit"
							className="
								w-full 
								text-white 
								bg-blue-600 
								hover:bg-blue-700 
								focus:ring-4 
								focus:outline-none 
								focus:ring-blue-300 
								font-medium 
								rounded-md
								text-sm 
								px-5 
								py-2.5 
								text-center
								"
						>
							Sign in
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
