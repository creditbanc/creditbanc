import { useState } from "react";
import CreditNav from "~/components/CreditNav";
import InputField from "~/components/InputField";
import { useSubmit } from "@remix-run/react";
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
	const url = new URL(request.url);
	let search = Object.fromEntries(url.searchParams);
	let { displayToken } = search;

	// console.log("displayToken");
	// console.log(displayToken);
	// console.log(url.searchParams.toString());

	const email = form.get("email");
	const password = form.get("password");

	// console.log("formform");
	// console.log(email);
	// console.log(password);

	if (typeof email !== "string" || typeof password !== "string") {
		return json({ error: "Invalid form data" }, { status: 400 });
	}

	if (!displayToken) {
		// console.log("yesDisplayToken");
		return await signup({ email, password });
	} else {
		// console.log("noDisplayToken");
		let redirect_to = `/credit/personal/create?${url.searchParams.toString()}`;
		return await signup({ email, password, redirect_to, new_entity: true });
	}
}

const Form = () => {
	const form = useForm((state) => state.form);
	const setForm = useForm((state) => state.setForm);
	const email = useForm((state) => state.form.firstName);
	const password = useForm((state) => state.form.lastName);
	const submit = useSubmit();

	const onSubmit = (e) => {
		console.log("submittingssssss");
		e.preventDefault();
		// let form_id = uuidv4();
		// let resource_path = to_resource_pathname(window.location.pathname);

		// let { dob, ...rest } = form;
		// let dob_string = `${dob.year}-${dob.month}-${dob.day}`;
		// let payload = { ...rest, dob: dob_string };

		// event.preventDefault();
		// let form = event.currentTarget;
		// console.log(window.location.search);

		// console.log("submitform");
		// console.log(form);

		submit(form, {
			method: "post",
			action: "/signup" + window.location.search,
		});

		// submit(
		// 	{ payload: JSON.stringify(payload) },
		// 	{
		// 		method: "post",
		// 		action: "/credit/personal/new" + resource_path,
		// 	}
		// );
	};

	return (
		<form className="space-y-8" onSubmit={onSubmit}>
			<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
				{/* <div className="border-b border-gray-300 sm:col-span-6">
					<h3 className="text-lg font-medium leading-6 text-gray-900 pb-2">
						Create An Account
					</h3>
				</div> */}

				<div className="sm:col-span-6">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700"
					>
						Email
					</label>
					<div className="mt-1">
						<input
							type="email"
							name="email"
							id="email"
							autoComplete="email"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={email}
							onChange={(e) => setForm(["email"], e.target.value)}
						/>
					</div>
				</div>

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
							// value={password}
							// onChange={(e) => setForm(["email"], e.target.value)}
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
