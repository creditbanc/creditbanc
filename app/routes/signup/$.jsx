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
import { form_params } from "~/utils/helpers";

const useForm = create((set) => ({
	form: {
		first_name: "",
		last_name: "",
		email: "",
		password: "",
	},
	setForm: (path, value) => set((state) => pipe(mod("form", ...path)(() => value))(state)),
}));

export async function action({ request }) {
	console.log("signupaction");

	let form = await form_params(request);
	let { email, password, redirect_url, first_name, last_name } = form;

	// console.log("formform2");
	// console.log(form);

	if (typeof email !== "string" || typeof password !== "string") {
		return json({ error: "Invalid form data" }, { status: 400 });
	}

	// return null;

	if (redirect_url) {
		// console.log("here1");

		return await signup({ email, password, first_name, last_name, redirect_to: redirect_url });
	} else {
		// console.log("here2");
		// console.log("noDisplayToken");
		// let redirect_to = `/credit/personal/create?${url.searchParams.toString()}`;
		return await signup({ email, password });
	}
}

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let email = url.searchParams.get("email");
	let redirect_url = url.pathname.replace("/signup", "") + url.search;
	// console.log("loader.redirect_url");
	// console.log(url);

	return { email, redirect_url };
};

const Form = () => {
	const { email, redirect_url } = useLoaderData();
	const form = useForm((state) => state.form);
	const setForm = useForm((state) => state.setForm);
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
					<label htmlFor="name" className="block text-sm font-medium text-gray-700">
						First Name
					</label>
					<div className="mt-1">
						<input
							type="name"
							name="name"
							id="name"
							autoComplete="name"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={form.first_name}
							onChange={(e) => setForm(["first_name"], e.target.value)}
						/>
					</div>
				</div>

				<div className="sm:col-span-6">
					<label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
						Last Name
					</label>
					<div className="mt-1">
						<input
							type="last_name"
							name="last_name"
							id="last_name"
							autoComplete="last_name"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={form.last_name}
							onChange={(e) => setForm(["last_name"], e.target.value)}
						/>
					</div>
				</div>

				<div className="sm:col-span-6">
					<label htmlFor="email" className="block text-sm font-medium text-gray-700">
						Email
					</label>
					<div className="mt-1">
						<input
							type="email"
							name="email"
							id="email"
							autoComplete="email"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={form.email}
							onChange={(e) => setForm(["email"], e.target.value)}
						/>
					</div>
				</div>

				<div className="sm:col-span-6">
					<label htmlFor="password" className="block text-sm font-medium text-gray-700">
						Password
					</label>
					<div className="mt-1">
						<input
							type={"password"}
							name="password"
							id="password"
							autoComplete="password"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={form.password}
							onChange={(e) => setForm(["password"], e.target.value)}
						/>
					</div>
				</div>

				<div className="sm:col-span-6">
					<label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
					className="w-full inline-flex justify-center rounded-md border border-transparent bg-[#55CF9E] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#55CF9E] focus:outline-none focus:ring-2 focus:ring-[#55CF9E] focus:ring-offset-2"
				>
					Sign me up
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
					<p className="text-3xl font-bold my-2 text-[#55CF9E]">WELL, HEY THERE</p>
					<p className="text-5xl font-bold my-2 text-[#202536]">First time here?</p>
					<p className="text-lg mt-4 font-semibold">
						Let’s get you set up with a new account. It’ll be painless, we swear.
					</p>
				</div>
			</div>
		</div>
	);
};

export default function SignUp() {
	return (
		<div className="flex flex-col w-full h-full">
			{/* <CreditNav /> */}
			{/* <CreditHeroGradient /> */}
			<div className="flex flex-col w-full p-[20px] max-w-2xl mx-auto h-full">
				<div className="flex flex-col justify-center h-full -mt-10">
					<Heading />
					<Form />
				</div>
			</div>
		</div>
	);
}
