import { useState } from "react";
import InputField from "~/components/InputField";
import { get_entity, signin } from "../../utils/auth.server";
import { useSubmit, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { get_user } from "../../utils/auth.server";
const cb_logo = "/images/logos/cb_logo_3.png";
const bg = "/images/credit_banc_auth_bg.png";

export const loader = async ({ request }) => {
	return (await get_entity(request)) ? redirect("/root") : null;
};

export const action = async ({ request }) => {
	console.log("action");
	var form = await request.formData();

	const email = form.get("email");
	const password = form.get("password");

	if (typeof email !== "string" || typeof password !== "string") {
		return json({ error: "Invalid form data" }, { status: 400 });
	}

	return await signin({ email, password });
};

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
		<div className="flex min-h-full">
			<div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
				<div className="mx-auto w-full max-w-sm lg:w-96">
					<div>
						<img
							className="h-12 w-auto"
							src={cb_logo}
							alt="Your Company"
						/>
						<h2 className="my-2 mt-6 text-xl font-bold text-[#55CF9E]">
							AREN’T YOU A SIGHT FOR SORE EYES
						</h2>
						<h2 className="my-3 text-3xl font-bold text-[#202536]">
							Sign in below to access your account
						</h2>
						<p className="mt-2 text-sm text-gray-600 ">
							First time here? Click{" "}
							<a
								href="/signup"
								className="font-medium text-indigo-600 hover:text-indigo-500 underline"
							>
								this link
							</a>{" "}
							to start your 14-day free trial!
						</p>
					</div>

					<div className="mt-8">
						<div className="mt-6">
							<form
								action="#"
								method="POST"
								className="space-y-6"
							>
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium text-gray-700"
									>
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

								<div className="space-y-1">
									<label
										htmlFor="password"
										className="block text-sm font-medium text-gray-700"
									>
										Password
									</label>
									<div className="mt-1">
										<input
											id="password"
											name="password"
											type="password"
											autoComplete="current-password"
											required
											className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
											placeholder={"••••••••"}
											onChange={handleFormChange}
											value={formData.password}
										/>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<input
											id="remember-me"
											name="remember-me"
											type="checkbox"
											className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
										/>
										<label
											htmlFor="remember-me"
											className="ml-2 block text-sm text-gray-900"
										>
											Remember me
										</label>
									</div>

									<div className="text-sm">
										<a
											href="#"
											className="font-medium text-indigo-600 hover:text-indigo-500 underline"
										>
											Help! I can’t remember my password!
										</a>
									</div>
								</div>

								<div>
									<button
										type="submit"
										className="flex w-full justify-center rounded-md border border-transparent bg-[#55CF9E] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#55CF9E] focus:outline-none focus:ring-2 focus:ring-[#55CF9E] focus:ring-offset-2"
									>
										Sign in
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			<div className="relative hidden w-0 flex-1 lg:block">
				<img
					className="absolute inset-0 h-full w-full object-cover"
					src={bg}
				/>
			</div>
		</div>
	);
}
