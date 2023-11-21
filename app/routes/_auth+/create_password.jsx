import { useState } from "react";
import InputField from "~/components/InputField";
import { get_entity, signin } from "../../utils/auth.server";
import { useSubmit, useActionData, Link, useLocation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { get_user } from "../../utils/auth.server";
import { form_params, use_client_search_params } from "~/utils/helpers";
import Entity from "~/api/client/Entity";
const cb_logo = "/images/logos/cb_logo_3.png";
const reset = "/images/reset.png";

export const action = async ({ request }) => {
	console.log("reset_password");
	let form = await form_params(request);
	let { entity_id, password } = form;
	let entity = new Entity(entity_id);
	await entity.reset_password(password);
	return redirect("/signin");
};

export default function NewPassword() {
	let { search } = useLocation();
	let params = use_client_search_params(search);
	let { entity_id } = params;
	const actionData = useActionData();
	const [formError, setFormError] = useState(actionData?.error || "");
	const [formData, setFormData] = useState({ password: "" });
	const submit = useSubmit();

	const onSubmit = (event) => {
		event.preventDefault();
		submit({ entity_id, password: formData.password }, { method: "post" });
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
						<img className="h-12 w-auto" src={cb_logo} />

						<h2 className="my-3 text-3xl font-bold text-[#202536]">Create new password</h2>
					</div>

					<div className="mt-8">
						<div className="mt-6">
							<div className="space-y-6">
								<div className="space-y-1">
									<label htmlFor="password" className="block text-sm font-medium text-gray-700">
										New password
									</label>
									<div className="mt-1">
										<input
											id="password"
											name="password"
											type="password"
											required
											className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
											placeholder={"••••••••"}
											onChange={handleFormChange}
											value={formData.password}
										/>
									</div>
								</div>

								<div>
									<div
										onClick={onSubmit}
										className="flex w-full justify-center rounded-md border border-transparent bg-[#55CF9E] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#55CF9E] focus:outline-none focus:ring-2 focus:ring-[#55CF9E] focus:ring-offset-2 cursor-pointer"
									>
										create password and sign in
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="relative hidden w-0 flex-1 lg:block">
				<img className="absolute inset-0 h-full w-full object-cover" src={reset} />
			</div>
		</div>
	);
}
