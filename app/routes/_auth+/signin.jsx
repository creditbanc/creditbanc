import { useState } from "react";
import InputField from "~/components/InputField";
import { get_entity, signin } from "../../utils/auth.server";
import { useSubmit, useActionData, Link, useNavigate } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { get_user } from "../../utils/auth.server";
import { form_params } from "~/utils/helpers";
import { from, lastValueFrom, map } from "rxjs";
import { get_collection, get_doc } from "~/utils/firebase";
import { defaultTo, head, pipe } from "ramda";
const cb_logo = "/images/logos/cb_logo_3.png";
const bg = "/images/credit_banc_auth_bg.png";

export const loader = async ({ request }) => {
	return (await get_entity(request)) ? redirect("/root") : null;
};

export const action = async ({ request }) => {
	console.log("action");
	let form = await form_params(request);
	let { email, password } = form;

	if (typeof email !== "string" || typeof password !== "string") {
		return json({ error: "Invalid form data" }, { status: 400 });
	}

	return await signin({ email, password });
};

export default function SignIn() {
	const actionData = useActionData();
	const submit = useSubmit();
	const [formError, setFormError] = useState(actionData?.error || "");
	const [formData, setFormData] = useState({ email: "", password: "", visible: "email" });
	const navigate = useNavigate();

	const onSubmit = async (event) => {
		console.log("onSubmit");
		event.preventDefault();

		if (formData.visible === "email") {
			let entity_query = [
				{
					param: "email",
					predicate: "==",
					value: formData.email,
				},
			];

			let entity = await lastValueFrom(
				from(get_collection({ path: ["entity"], queries: entity_query })).pipe(map(pipe(head, defaultTo({}))))
			);

			if (entity?.default_password) {
				console.log("hi");
				navigate(`/create_password?entity_id=${entity.id}`);
			} else {
				setFormData((prev) => ({ ...prev, visible: "password" }));
			}
		}

		if (formData.visible === "password") {
			submit(formData, { method: "post" });
		}
	};

	const handleFormChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const ActiveSigninButton = () => {
		return (
			<div
				onClick={onSubmit}
				className="flex w-full justify-center rounded-md border border-transparent bg-[#55CF9E] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#55CF9E] focus:outline-none focus:ring-2 focus:ring-[#55CF9E] focus:ring-offset-2 cursor-pointer"
			>
				Sign in
			</div>
		);
	};

	const DisabledSigninButton = () => {
		return (
			<div className="flex w-full justify-center rounded-md border border-transparent bg-gray-200 py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-not-allowed">
				Sign in
			</div>
		);
	};

	return (
		<div className="flex min-h-full">
			<div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
				<div className="mx-auto w-full max-w-sm lg:w-96">
					<div>
						<img className="h-12 w-auto" src={cb_logo} alt="Your Company" />
						<h2 className="my-2 mt-6 text-xl font-bold text-[#55CF9E]">AREN’T YOU A SIGHT FOR SORE EYES</h2>
						<h2 className="my-3 text-3xl font-bold text-[#202536]">Sign in below to access your account</h2>
						<p className="mt-2 text-sm text-gray-600 ">
							First time here? Click{" "}
							<a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 underline">
								this link
							</a>{" "}
							to start your 14-day free trial!
						</p>
					</div>

					<div className="mt-8">
						<div className="mt-6">
							<div className="space-y-6">
								{formData.visible === "email" && (
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
								)}

								{formData.visible === "password" && (
									<div className="space-y-1">
										<label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
								)}

								<div className="flex items-center justify-between">
									{/* <div className="flex items-center">
										<input
											id="remember-me"
											name="remember-me"
											type="checkbox"
											className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
										/>
										<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
											Remember me
										</label>
									</div> */}

									<div className="text-sm">
										<Link
											to={`/recover`}
											className="font-medium text-indigo-600 hover:text-indigo-500 underline"
										>
											Help! I can’t remember my password!
										</Link>
									</div>
								</div>

								<div>
									{formData.visible == "email" && formData.email !== "" && <ActiveSigninButton />}
									{formData.visible == "password" && formData.password !== "" && (
										<ActiveSigninButton />
									)}
									{formData.visible == "email" && formData.email == "" && <DisabledSigninButton />}
									{formData.visible == "password" && formData.password == "" && (
										<DisabledSigninButton />
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="relative hidden w-0 flex-1 lg:block">
				<img className="absolute inset-0 h-full w-full object-cover" src={bg} />
			</div>
		</div>
	);
}
