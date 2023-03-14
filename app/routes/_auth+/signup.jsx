import { useState } from "react";
import CreditNav from "~/components/CreditNav";
import InputField from "~/components/InputField";
import { useSubmit } from "@remix-run/react";
import { signup } from "../../utils/auth.server";
import { create } from "zustand";
import CreditHeroGradient from "~/components/CreditHeroGradient";
import { pipe } from "ramda";
import { mod } from "shades";

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
		return await signup({ email, password, redirect_to });
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

		console.log("submitform");
		console.log(form);

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
	// const submit = useSubmit();
	// const [formData, setFormData] = useState({ email: "", password: "" });

	// const onSubmit = (event) => {
	// 	console.log("onSubmit");
	// 	event.preventDefault();
	// 	let form = event.currentTarget;
	// 	console.log(window.location.search);
	// 	submit(form, {
	// 		method: "post",
	// 		action: "/signup" + window.location.search,
	// 	});
	// };

	// const handleFormChange = (e) => {
	// 	const { name, value } = e.target;
	// 	setFormData((prev) => ({ ...prev, [name]: value }));
	// };

	return (
		<div className="flex flex-col w-full h-full">
			<CreditNav />
			<CreditHeroGradient />
			<div className="flex flex-col w-full p-[20px] max-w-2xl mx-auto h-full">
				<div className="flex flex-col justify-center h-full -mt-10">
					<Heading />
					<Form />
				</div>
				{/* <form onSubmit={onSubmit}>
					<div className="my-[10px]">
						<InputField
							name={"email"}
							type={"email"}
							id={"email"}
							label={"Email"}
							placeholder={"you@example.com"}
							onChange={handleFormChange}
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

					<div className="my-[10px]">
						<InputField
							name={"confirm_password"}
							type={"password"}
							id={"confirm_password"}
							label={"Confirm password"}
							placeholder={"••••••••"}
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
							Sign up
						</button>
					</div>
				</form> */}
			</div>
		</div>
	);
}
