import CreditNav from "~/components/CreditNav";
import CreditHeroGradient from "~/components/CreditHeroGradient";
import axios from "axios";
import { pipe } from "ramda";
import { mod } from "shades";
import { create } from "zustand";
import { useSubmit } from "@remix-run/react";
import { inspect } from "~/utils/helpers";
import { redirect } from "@remix-run/node";

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

let test_data_one = {
	appKey: "F5C7226A-4F96-43BF-B748-09278FFE0E36",
	firstName: "MATHEW",
	lastName: "MEEHAN",
	dob: "1981-06-17",
	ssn: "053723148",
	address: {
		street: "9315 trinana circle",
		city: "Winter garden",
		state: "FL",
		zip: "34787",
	},
};

let test_data_two = {
	appKey: "F5C7226A-4F96-43BF-B748-09278FFE0E36",
	firstName: "DONALD",
	lastName: "BLAIR",
	dob: "1939-09-20",
	ssn: "666285344",
	address: {
		street: "3627 W POPLAR ST",
		city: "SAN ANTONIO",
		state: "TX",
		zip: "78228",
	},
};

export const action = async ({ request }) => {
	console.log("new_credit_action");

	var form = await request.formData();
	let url = new URL(request.url);
	let pathname = url.pathname;

	const payload = JSON.parse(form.get("payload"));

	var data = JSON.stringify(test_data_two);

	var config = {
		method: "post",
		url: "https://array.io/api/user/v2",
		headers: {
			accept: "application/json",
			"content-type": "application/json",
		},
		data,
	};

	let response = await axios(config);
	console.log(response);
	let { clientKey } = response.data;

	return redirect(`/credit/personal/questions?clientKey=${clientKey}`);
};

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

		let { dob, ...rest } = form;
		let dob_string = `${dob.year}-${dob.month}-${dob.day}`;
		let payload = JSON.stringify({ ...rest, dob: dob_string });

		submit(
			{ payload },
			{
				method: "post",
				action: "/credit/personal/new/1",
			}
		);
	};

	return (
		<form className="space-y-8" onSubmit={onSubmit}>
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
					className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
					<h2 className="text-lg font-semibold text-indigo-600">
						New
					</h2>
					<p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
						Credit report
					</p>
				</div>
			</div>
		</div>
	);
};

export default function NewPersonalCreditReport() {
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
