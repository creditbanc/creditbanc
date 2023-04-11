import { useState } from "react";
import CreditNav from "~/components/CreditNav";
import InputField from "~/components/InputField";
import { useSubmit } from "@remix-run/react";
import { signup } from "../../utils/auth.server";
import { create } from "zustand";
import CreditHeroGradient from "~/components/CreditHeroGradient";
import { pipe } from "ramda";
import { mod } from "shades";
import { redirect } from "@remix-run/node";

const useForm = create((set) => ({
	form: {
		first_name: "",
		last_name: "",
		email: "",
		password: "",
	},
	has_accepted_tc: false,
	setTc: (value) => set({ has_accepted_tc: value }),
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
	const first_name = form.get("first_name");
	const last_name = form.get("last_name");

	// console.log("formform");
	// console.log(email);
	// console.log(password);

	if (typeof email !== "string" || typeof password !== "string") {
		return json({ error: "Invalid form data" }, { status: 400 });
	}

	if (!displayToken) {
		// console.log("yesDisplayToken");
		return await signup({ email, password, first_name, last_name });
	} else {
		// console.log("noDisplayToken");
		let redirect_to = `/credit/personal/create?${url.searchParams.toString()}`;
		return await signup({
			email,
			password,
			first_name,
			last_name,
			redirect_to,
			new_entity: true,
		});
	}
}

const Form = () => {
	const form = useForm((state) => state.form);
	const setForm = useForm((state) => state.setForm);
	const email = useForm((state) => state.form.firstName);
	const password = useForm((state) => state.form.lastName);
	const has_accepted_tc = useForm((state) => state.has_accepted_tc);
	const setTc = useForm((state) => state.setTc);
	const submit = useSubmit();

	const onSubmit = (e) => {
		e.preventDefault();

		submit(form, {
			method: "post",
			action: "/signup" + window.location.search,
		});
	};

	return (
		<form className="space-y-8" onSubmit={onSubmit}>
			<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
				<div className="sm:col-span-6">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700"
					>
						First Name
					</label>
					<div className="mt-1">
						<input
							type="name"
							name="name"
							id="name"
							autoComplete="name"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={email}
							onChange={(e) =>
								setForm(["first_name"], e.target.value)
							}
						/>
					</div>
				</div>

				<div className="sm:col-span-6">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700"
					>
						Last Name
					</label>
					<div className="mt-1">
						<input
							type="name"
							name="name"
							id="name"
							autoComplete="name"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={email}
							onChange={(e) =>
								setForm(["last_name"], e.target.value)
							}
						/>
					</div>
				</div>

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

			<div>
				<div className="relative flex items-start">
					<div className="flex h-6 items-center">
						<input
							id="comments"
							aria-describedby="comments-description"
							name="comments"
							type="checkbox"
							className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
							checked={has_accepted_tc}
							onChange={(e) => setTc(e.target.checked)}
						/>
					</div>
					<a
						className="ml-3 text-sm leading-6"
						href="/"
						target="_blank"
					>
						<label
							htmlFor="comments"
							className="font-medium text-gray-900"
						>
							Yes,
						</label>{" "}
						<span
							id="comments-description"
							className="text-gray-500"
						>
							I accept the{" "}
							<a href="/tc" className="text-blue-700 underline">
								terms and conditions
							</a>
							.
						</span>
					</a>
				</div>
			</div>

			<div className="flex flex-row w-full justify-center pt-3">
				<button
					disabled={!has_accepted_tc}
					type="submit"
					className={`w-full inline-flex justify-center rounded-md border border-transparent  py-2 px-4 text-sm font-medium text-white shadow-sm ${
						has_accepted_tc &&
						"bg-[#55CF9E] hover:bg-[#55CF9E] focus:ring-[#55CF9E]"
					} ${
						!has_accepted_tc &&
						"bg-gray-300 hover:bg-gray-300 focus:ring-gray-300"
					}
					focus:outline-none focus:ring-2  focus:ring-offset-2`}
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
					<p className="text-3xl font-bold my-2 text-[#55CF9E]">
						WELL, HEY THERE
					</p>
					<p className="text-5xl font-bold my-2 text-[#202536]">
						First time here?
					</p>
					<p className="text-lg mt-4 font-semibold">
						Let’s get you set up with a new account. It’ll be
						painless, we swear.
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
