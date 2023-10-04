import { useState } from "react";
import InputField from "~/components/InputField";
import { get_entity, signin } from "../../utils/auth.server";
import { useSubmit, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { get_user } from "../../utils/auth.server";
import { create_axios_form, form_params } from "~/utils/helpers";
import axios from "axios";
import { get_collection } from "~/utils/firebase";
const cb_logo = "/images/logos/cb_logo_3.png";
const bg = "/images/credit_banc_auth_bg.png";
const recover = "/images/recover.png";

export const action = async ({ request }) => {
	console.log("action");
	let { origin } = new URL(request.url);
	let form = await form_params(request);
	let { email } = form;

	let entity_collection = await get_collection({
		path: ["entity"],
		queries: [{ param: "email", predicate: "==", value: email }],
		limit: [1],
	});

	let entity = entity_collection[0];
	let { id: entity_id } = entity;

	let response = axios({
		method: "post",
		url: `${origin}/emails/resetpassword`,
		headers: { "Content-Type": "multipart/form-data" },
		data: create_axios_form({ entity_id }),
	});

	return json({ message: "success" });
	// return await signin({ email, password });
};

export default function Recover() {
	const actionData = useActionData();
	const [formError, setFormError] = useState(actionData?.error || "");
	const [formData, setFormData] = useState({ email: "", password: "" });
	const submit = useSubmit();
	console.log("actionData", actionData);

	const onSubmit = (event) => {
		console.log("onSubmit");
		event.preventDefault();
		submit(formData, { method: "post" });
	};

	const handleFormChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className="flex min-h-full">
			<div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
				<div className="mx-auto w-full max-w-sm lg:w-96">
					<div>
						<img className="h-12 w-auto" src={cb_logo} alt="Your Company" />
						{actionData?.message == "success" && (
							<h2 className="my-3 text-lg font-bold text-[#202536]">
								Check your email for a link to reset your password.
							</h2>
						)}
						{actionData?.message !== "success" && (
							<h2 className="my-3 text-3xl font-bold text-[#202536]">
								Enter your email below to reset your password
							</h2>
						)}
					</div>
					{actionData?.message !== "success" && (
						<div className="mt-8 space-y-6">
							<div>
								<label htmlFor="email" className="block text-sm font-medium text-gray-700">
									Email address
								</label>
								<div className="mt-1">
									<input
										id="email"
										name="email"
										type="email"
										autoComplete="email"
										required
										className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
										placeholder={"Email address"}
										onChange={handleFormChange}
										value={formData.email}
									/>
								</div>
							</div>

							<div>
								<div
									onClick={onSubmit}
									className="flex w-full justify-center rounded-md border border-transparent bg-[#55CF9E] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#55CF9E] focus:outline-none focus:ring-2 focus:ring-[#55CF9E] focus:ring-offset-2 cursor-pointer"
								>
									Send Reset Link
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="relative hidden w-0 flex-1 lg:block">
				<img className="absolute inset-0 h-full w-full object-cover" src={recover} />
			</div>
		</div>
	);
}
