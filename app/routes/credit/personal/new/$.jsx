import CreditNav from "~/components/CreditNav";
import CreditHeroGradient from "~/components/CreditHeroGradient";
import axios from "axios";
import { pipe } from "ramda";
import { mod } from "shades";
import { create } from "zustand";
import { useSubmit } from "@remix-run/react";
import {
	inspect,
	to_resource_pathname,
	get_group_id,
	sample,
} from "~/utils/helpers";
import { json, redirect } from "@remix-run/node";
import { test_identity_two, test_identity_four } from "~/data/array";
import {
	getSession,
	commitSession,
} from "~/sessions/personal_credit_report_session";

const useReportStore = create((set) => ({
	form: {
		appKey: "F5C7226A-4F96-43BF-B748-09278FFE0E36",
		firstName: "",
		lastName: "",
		dob: {
			month: "",
			day: "",
			year: "",
		},
		ssn: "",
		address: {
			street: "",
			city: "",
			state: "",
			zip: "",
		},
	},
	setForm: (path, value) =>
		set((state) => pipe(mod("form", ...path)(() => value))(state)),
}));

let api_url = "https://sandbox.array.io/api/user/v2";
// let api_url = 'https://array.io/api/user/v2'

export const action = async ({ request }) => {
	console.log("new_credit_action");

	const group_id = get_group_id(request.url);
	const form = await request.formData();
	const payload = JSON.parse(form.get("payload"));
	let data = test_identity_two;

	// console.log("payloaddddd");
	// console.log(data);

	const options = {
		method: "POST",
		url: api_url,
		headers: {
			accept: "application/json",
			"content-type": "application/json",
		},
		data,
	};

	let session = await getSession(request.headers.get("Cookie"));
	session.set("personal_credit_report", JSON.stringify(payload));

	// return null;

	try {
		let response = await axios(options);
		let { clientKey, authToken } = response.data;
		// console.log("response");
		// console.log(response.data);

		return redirect(
			`/credit/personal/verification?clientKey=${clientKey}&authToken=${authToken}&group_id=${group_id}`,
			{
				headers: {
					"Set-Cookie": await commitSession(session),
				},
			}
		);
	} catch (error) {
		console.log("error");
		// console.log(error.response.data);
		return json({ error: error.message }, { status: 500 });
	}
};

// export const loader = async ({ request }) => {
// 	let entity_id = await get_user_id(request);
// 	console.log("entity_id");
// 	console.log(entity_id);

// 	if (!entity_id) return redirect("/signup");

// 	return null;
// };

const Form = () => {
	const form = useReportStore((state) => state.form);
	const setForm = useReportStore((state) => state.setForm);
	const first_name = useReportStore((state) => state.form.firstName);
	const last_name = useReportStore((state) => state.form.lastName);
	const month = useReportStore((state) => state.form.dob.month);
	const day = useReportStore((state) => state.form.dob.day);
	const year = useReportStore((state) => state.form.dob.year);
	const ssn = useReportStore((state) => state.form.ssn);
	const street = useReportStore((state) => state.form.address.street);
	const city = useReportStore((state) => state.form.address.city);
	const state = useReportStore((state) => state.form.address.state);
	const zip = useReportStore((state) => state.form.address.zip);
	const submit = useSubmit();

	const onSubmit = (e) => {
		e.preventDefault();
		console.log("submitting");
		// let form_id = uuidv4();
		let resource_path = to_resource_pathname(window.location.pathname);

		let { dob, ...rest } = form;
		let dob_string = `${dob.year}-${dob.month}-${dob.day}`;
		let payload = { ...rest, dob: dob_string };

		sessionStorage.setItem("personal_credit_report", payload);

		submit(
			{ payload: JSON.stringify(payload) },
			{
				method: "post",
				action: "/credit/personal/new" + resource_path,
			}
		);
	};

	return (
		<form className="space-y-8 mb-[30px]" onSubmit={onSubmit}>
			<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
				<div className="border-b border-gray-300 sm:col-span-6">
					<h3 className="text-lg font-medium leading-6 text-gray-900 pb-2">
						Personal information
					</h3>
				</div>

				<div className="sm:col-span-3">
					<label
						htmlFor="first-name"
						className="block text-sm font-medium text-gray-700"
					>
						First name
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="first-name"
							id="first-name"
							autoComplete="given-name"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={first_name}
							onChange={(e) =>
								setForm(["firstName"], e.target.value)
							}
						/>
					</div>
				</div>

				<div className="sm:col-span-3">
					<label
						htmlFor="last-name"
						className="block text-sm font-medium text-gray-700"
					>
						Last name
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="last-name"
							id="last-name"
							autoComplete="family-name"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={last_name}
							onChange={(e) =>
								setForm(["lastName"], e.target.value)
							}
						/>
					</div>
				</div>

				<div className="sm:col-span-6">
					<label
						htmlFor="street-address"
						className="block text-sm font-medium text-gray-700"
					>
						Social security number
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="street-address"
							id="street-address"
							autoComplete="street-address"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={ssn}
							onChange={(e) => setForm(["ssn"], e.target.value)}
						/>
					</div>
				</div>

				<div className="border-b border-gray-300 sm:col-span-6">
					<h3 className="text-lg font-medium leading-6 text-gray-900 pb-2">
						Date of birth
					</h3>
				</div>

				<div className="sm:col-span-2">
					<label
						htmlFor="city"
						className="block text-sm font-medium text-gray-700"
					>
						Month
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="city"
							id="city"
							autoComplete="address-level2"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={month}
							onChange={(e) =>
								setForm(["dob", "month"], e.target.value)
							}
						/>
					</div>
				</div>

				<div className="sm:col-span-2">
					<label
						htmlFor="region"
						className="block text-sm font-medium text-gray-700"
					>
						Day
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="region"
							id="region"
							autoComplete="address-level1"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={day}
							onChange={(e) =>
								setForm(["dob", "day"], e.target.value)
							}
						/>
					</div>
				</div>

				<div className="sm:col-span-2">
					<label
						htmlFor="postal-code"
						className="block text-sm font-medium text-gray-700"
					>
						Year
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="postal-code"
							id="postal-code"
							autoComplete="postal-code"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={year}
							onChange={(e) =>
								setForm(["dob", "year"], e.target.value)
							}
						/>
					</div>
				</div>

				<div className="border-b border-gray-300 sm:col-span-6">
					<h3 className="text-lg font-medium leading-6 text-gray-900 pb-2">
						Address
					</h3>
				</div>

				<div className="sm:col-span-6">
					<label
						htmlFor="street-address"
						className="block text-sm font-medium text-gray-700"
					>
						Street address
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="street-address"
							id="street-address"
							autoComplete="street-address"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={street}
							onChange={(e) =>
								setForm(["address", "street"], e.target.value)
							}
						/>
					</div>
				</div>

				<div className="sm:col-span-2">
					<label
						htmlFor="city"
						className="block text-sm font-medium text-gray-700"
					>
						City
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="city"
							id="city"
							autoComplete="address-level2"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={city}
							onChange={(e) =>
								setForm(["address", "city"], e.target.value)
							}
						/>
					</div>
				</div>

				<div className="sm:col-span-2">
					<label
						htmlFor="region"
						className="block text-sm font-medium text-gray-700"
					>
						State / Province
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="region"
							id="region"
							autoComplete="address-level1"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={state}
							onChange={(e) =>
								setForm(["address", "state"], e.target.value)
							}
						/>
					</div>
				</div>

				<div className="sm:col-span-2">
					<label
						htmlFor="postal-code"
						className="block text-sm font-medium text-gray-700"
					>
						ZIP / Postal code
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="postal-code"
							id="postal-code"
							autoComplete="postal-code"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={zip}
							onChange={(e) =>
								setForm(["address", "zip"], e.target.value)
							}
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-row w-full justify-end pt-3">
				<button
					type="button"
					className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Cancel
				</button>
				<button
					type="submit"
					className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-[#55CF9E] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#55CF9E] focus:outline-none focus:ring-2 focus:ring-[#55CF9E] focus:ring-offset-2"
				>
					Next
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
					<p className="mt-1 text-3xl font-bold tracking-tight text-[#55CF9E]">
						TELL US A LITTLE BIT ABOUT YOURSELF
					</p>
					<p className="text-lg font-semibold text-[#202536] mt-6">
						We don’t need your firstborn, a blood sample, or a DNA
						swab, but we need to know what to call you and how to
						reach you.
					</p>
				</div>
			</div>
		</div>
	);
};

export default function New() {
	return (
		<div className="flex flex-col w-full">
			<CreditNav />
			<CreditHeroGradient />
			<div className="flex flex-col w-full p-[20px] max-w-2xl mx-auto">
				<Heading />
				<Form />
			</div>
		</div>
	);
}
