import { useState } from "react";
import InputField from "~/components/InputField";
import { signin } from "../../utils/auth.server";
import { Form, useSubmit, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { get_user } from "../../utils/auth.server";

export const loader = async ({ request }) => {
	return (await get_user(request)) ? redirect("/") : null;
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
							src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
							alt="Your Company"
						/>
						<h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
							Sign in to your account
						</h2>
						<p className="mt-2 text-sm text-gray-600">
							Or{" "}
							<a
								href="#"
								className="font-medium text-indigo-600 hover:text-indigo-500"
							>
								start your 14-day free trial
							</a>
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
											className="font-medium text-indigo-600 hover:text-indigo-500"
										>
											Forgot your password?
										</a>
									</div>
								</div>

								<div>
									<button
										type="submit"
										className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
					src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
					alt=""
				/>
			</div>
		</div>
		// <div className="relative h-full w-full flex flex-col items-center justify-center p-[10px] z-[1]">
		// 	<div className="flex flex-col w-full max-w-sm p-[15px] bg-white border border-gray-200 rounded-lg shadow-sm">
		// 		<div>{formError}</div>
		// 		<form onSubmit={onSubmit}>
		// 			<div className="my-[10px]">
		// 				<InputField
		// 					name={"email"}
		// 					type={"email"}
		// 					id={"email"}
		// 					label={"Email"}
		// 					placeholder={"you@example.com"}
		// 					onChange={handleFormChange}
		// 					value={formData.email}
		// 					icon={
		// 						<svg
		// 							className="h-5 w-5 text-gray-200"
		// 							xmlns="http://www.w3.org/2000/svg"
		// 							viewBox="0 0 20 20"
		// 							fill="currentColor"
		// 							aria-hidden="true"
		// 						>
		// 							<path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
		// 							<path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
		// 						</svg>
		// 					}
		// 				/>
		// 			</div>

		// 			<div className="my-[10px]">
		// 				<InputField
		// 					name={"password"}
		// 					type={"password"}
		// 					id={"password"}
		// 					label={"Password"}
		// 					placeholder={"••••••••"}
		// 					onChange={handleFormChange}
		// 					value={formData.password}
		// 					icon={
		// 						<svg
		// 							xmlns="http://www.w3.org/2000/svg"
		// 							viewBox="0 0 20 20"
		// 							fill="currentColor"
		// 							className="h-5 w-5 text-gray-200"
		// 						>
		// 							<path
		// 								fillRule="evenodd"
		// 								d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
		// 								clipRule="evenodd"
		// 							/>
		// 						</svg>
		// 					}
		// 				/>
		// 			</div>

		// 			<div className="w-full mt-[15px]">
		// 				<button
		// 					type="submit"
		// 					className="
		// 						w-full
		// 						text-white
		// 						bg-blue-600
		// 						hover:bg-blue-700
		// 						focus:ring-4
		// 						focus:outline-none
		// 						focus:ring-blue-300
		// 						font-medium
		// 						rounded-md
		// 						text-sm
		// 						px-5
		// 						py-2.5
		// 						text-center
		// 						"
		// 				>
		// 					Sign in
		// 				</button>
		// 			</div>
		// 		</form>
		// 	</div>
		// </div>
	);
}
