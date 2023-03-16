import { useState } from "react";
import CreditNav from "~/components/CreditNav";
import InputField from "~/components/InputField";
import { useLoaderData, useLocation, useSubmit } from "@remix-run/react";
import { get_user_id, signup } from "../../utils/auth.server";
import { create } from "zustand";
import CreditHeroGradient from "~/components/CreditHeroGradient";
import { pipe } from "ramda";
import { mod } from "shades";
import { redirect } from "@remix-run/node";

const useForm = create((set) => ({
	form: {
		email: "",
		password: "",
	},
	setForm: (path, value) =>
		set((state) => pipe(mod("form", ...path)(() => value))(state)),
}));

export async function action({ request }) {
	var form = await request.formData();
	// console.log("actionaction");
	// console.log(request.url);
	// const url = new URL(request.url);
	// let search = Object.fromEntries(url.searchParams);
	// let { displayToken } = search;

	// console.log("displayToken");
	// console.log(displayToken);
	// console.log(url.searchParams.toString());

	const email = form.get("email");
	const password = form.get("password");
	const redirect_url = form.get("redirect_url");

	// console.log("formform2");
	// console.log(email);
	// console.log(password);
	// console.log(redirect_url);

	if (typeof email !== "string" || typeof password !== "string") {
		return json({ error: "Invalid form data" }, { status: 400 });
	}

	// return null;

	if (redirect_url) {
		// console.log("yesDisplayToken");
		return await signup({ email, password, redirect_to: redirect_url });
	} else {
		// console.log("noDisplayToken");
		// let redirect_to = `/credit/personal/create?${url.searchParams.toString()}`;
		return await signup({ email, password, redirect_to: "/root" });
	}
}

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let email = url.searchParams.get("email");
	let redirect_url = url.pathname.replace("/signup", "");

	// console.log("loader");
	// console.log(email);
	// console.log(redirect_url);

	return { email, redirect_url };
};

const Form = () => {
	const { email, redirect_url } = useLoaderData();
	const form = useForm((state) => state.form);
	const setForm = useForm((state) => state.setForm);
	const password = useForm((state) => state.form.password);
	const submit = useSubmit();
	const location = useLocation();

	const onSubmit = (e) => {
		e.preventDefault();

		let payload = {
			...form,
			email,
			redirect_url,
		};

		// console.log("submitform");
		// console.log(payload);
		// console.log(redirect_url);

		// console.log(location);

		submit(payload, {
			method: "post",
			action: "/signup" + redirect_url + location.search,
		});
	};

	return (
		<form className="space-y-8" onSubmit={onSubmit}>
			<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
				<div className="sm:col-span-6">
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700"
					>
						Password
					</label>
					<div className="mt-1">
						<input
							type={"password"}
							name="password"
							id="password"
							autoComplete="password"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={password}
							onChange={(e) =>
								setForm(["password"], e.target.value)
							}
						/>
					</div>
				</div>

				<div className="sm:col-span-6">
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700"
					>
						Confirmm Password
					</label>
					<div className="mt-1">
						<input
							type={"password"}
							name="password"
							id="confirm-password"
							autoComplete="password"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-row w-full justify-center pt-3">
				<button
					type="submit"
					className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Sign Up
				</button>
			</div>
		</form>
	);
};

const Heading = () => {
	return (
		<div className="bg-transparent">
			<div className="mx-auto max-w-7xl py-4 pb-6 px-2">
				<div className="text-center">
					<h2 className="text-lg font-semibold text-indigo-600">
						Create A New
					</h2>
					<p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
						Account
					</p>
				</div>
			</div>
		</div>
	);
};

export default function SignUp() {
	return (
		<div className="flex flex-col w-full h-full">
			<CreditNav />
			<CreditHeroGradient />
			<div className="flex flex-col w-full p-[20px] max-w-2xl mx-auto h-full">
				<div className="flex flex-col justify-center h-full -mt-10">
					<Heading />
					<Form />
				</div>
			</div>
		</div>
	);
}
