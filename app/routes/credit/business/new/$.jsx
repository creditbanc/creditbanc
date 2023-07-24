import { useState, Fragment } from "react";
import CreditNav from "~/components/CreditNav";
import axios from "axios";
import { head, pipe } from "ramda";
import { filter, get, mod, set } from "shades";
import { create } from "zustand";
import { useLocation, useSubmit } from "@remix-run/react";
import {
	inspect,
	to_resource_pathname,
	get_group_id,
	get_search_params_obj,
} from "~/utils/helpers";
import { json, redirect } from "@remix-run/node";
import {
	test_identity_three,
	test_identity_four,
	test_identity_five,
	test_identity_six,
	test_identity_seven,
	mrm_credit_report,
} from "~/data/lendflow";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { create as create_new_report } from "~/utils/business_credit_report.server";
import Cookies from "js-cookie";
import { plan_product_requests } from "~/data/plan_product_requests";
import { prisma } from "~/utils/prisma.server";
import { get_lendflow_report } from "~/utils/lendflow.server";
import { get_doc, set_doc } from "~/utils/firebase";

const useReportStore = create((set) => ({
	form: {
		basic_info: {
			first_name: "",
			last_name: "",
			email_address: "",
			telephone: "",
			doing_business_as: "",
		},
		business_address: {
			address_line: "",
			address_line2: "",
			city: "",
			state: "",
			country: "US",
			zip: "",
		},
		business_start_date: {
			month: "",
			day: "",
			year: "",
		},
		business_entity: "business_entity_type_1",
		business_legal_name: "",
		employee_identification_number: "",
		terms_of_service: true,
		requested_products: ["experian_intelliscore"],
	},
	set_state: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
	setForm: (path, value) =>
		set((state) => pipe(mod("form", ...path)(() => value))(state)),
}));

export const action = async ({ request }) => {
	console.log("new_business_credit_action");

	const bearer = process.env.LENDFLOW;
	const group_id = get_group_id(request.url);
	const form = await request.formData();
	const entity_id = await get_session_entity_id(request);

	let { plan_id } = await get_doc(["entity", entity_id]);

	// let { plan_id } = await prisma.entity.findUnique({
	// 	where: { id: entity_id },
	// 	select: {
	// 		plan_id: true,
	// 	},
	// });

	let experian_requested_products = pipe(get(plan_id))(
		plan_product_requests.experian
	);

	let dnb_requested_products = pipe(get(plan_id))(plan_product_requests.dnb);

	let requested_products = [
		...experian_requested_products,
		...dnb_requested_products,
	];

	const payload = pipe(
		mod("requested_products")((value) => requested_products)
	)(JSON.parse(form.get("payload")));

	var options = {
		method: "post",
		maxBodyLength: Infinity,
		url: "https://api.lendflow.com/api/v1/applications/business_credit",
		headers: {
			Authorization: `Bearer ${bearer}`,
			"Content-Type": "application/json",
		},
		data: payload,
	};

	// let report = {
	// 	group_id,
	// 	entity_id,
	// 	plan_id,
	// 	type: "business_credit_report",
	// 	...mrm_credit_report,
	// };

	// return redirect(
	// 	`/credit/report/business/experian/overview/resource/e/${entity_id}/g/${group_id}`
	// );

	// return null;

	try {
		console.log("request_report");
		let response = await axios(options);
		let { application_id } = response?.data?.data;

		console.log("application_id_response");
		// console.log(payload);
		console.log(application_id);

		// return null;

		if (application_id) {
			console.log("start");
			await new Promise((resolve) => setTimeout(resolve, 10000));
			console.log("end");

			let report = await get_lendflow_report(application_id);
			console.log("report_____");
			inspect(report);

			let payload = {
				group_id,
				entity_id,
				plan_id,
				application_id,
				type: "business_credit_report",
				...report,
			};

			await create_new_report(payload);

			await set_doc(
				["onboard", entity_id],
				{
					business_credit_report: {
						id: "business_credit_report",
						completed: true,
					},
					entity_id,
					group_id,
				},
				true
			);

			// let { file } = await create_new_report({
			// 	group_id,
			// 	entity_id,
			// 	plan_id,
			// 	application_id,
			// 	...report,
			// });

			// console.log("file");
			// console.log(file.id);

			return redirect(
				`/credit/report/business/experian/overview/resource/e/${entity_id}/g/${group_id}`
			);
		}

		return json({ error: "No application_id" }, { status: 500 });
	} catch (error) {
		console.log("error");
		console.log(error.response.data);
		return json({ error: error.message }, { status: 500 });
	}
};

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const business_entities = [
	{ id: "business_entity_type_1", name: "LLC" },
	{ id: "business_entity_type_2", name: "Sole Proprietorship" },
	{ id: "business_entity_type_3", name: "Partnership" },
	{ id: "business_entity_type_4", name: "Corporation" },
	{ id: "business_entity_type_41", name: "Cooperative" },
	{ id: "business_entity_type_5", name: "Non-profit" },
	{ id: "business_entity_type_6", name: "I'm not sure" },
	{ id: "business_entity_type_7", name: "I haven't registered it yet" },
	{ id: "business_entity_type_8", name: "Joint Venture" },
];

const BusinessEntity = () => {
	const [selected, setSelected] = useState(business_entities[0]);
	const setForm = useReportStore((state) => state.setForm);

	const onSelect = (event) => {
		let selected = pipe(filter({ id: event.id }), head)(business_entities);
		setSelected(selected);
		setForm(["business_entity"], event.id);
	};

	return (
		<Listbox value={selected} onChange={onSelect}>
			{({ open }) => (
				<>
					<div className="relative mt-1">
						<Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
							<span className="block truncate">
								{selected.name}
							</span>
							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon
									className="h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{business_entities.map((person) => (
									<Listbox.Option
										key={person.id}
										className={({ active }) =>
											classNames(
												active
													? "text-white bg-indigo-600"
													: "text-gray-900",
												"relative cursor-default select-none py-2 pl-3 pr-9"
											)
										}
										value={person}
									>
										{({ selected, active }) => (
											<>
												<span
													className={classNames(
														selected
															? "font-semibold"
															: "font-normal",
														"block truncate"
													)}
												>
													{person.name}
												</span>

												{selected ? (
													<span
														className={classNames(
															active
																? "text-white"
																: "text-indigo-600",
															"absolute inset-y-0 right-0 flex items-center pr-4"
														)}
													>
														<CheckIcon
															className="h-5 w-5"
															aria-hidden="true"
														/>
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
};

const Form = () => {
	const form = useReportStore((state) => state.form);
	const setForm = useReportStore((state) => state.setForm);
	const first_name = useReportStore(
		(state) => state.form.basic_info.first_name
	);
	const last_name = useReportStore(
		(state) => state.form.basic_info.last_name
	);
	const email = useReportStore(
		(state) => state.form.basic_info.email_address
	);
	const telephone = useReportStore(
		(state) => state.form.basic_info.telephone
	);
	const doing_business_as = useReportStore(
		(state) => state.form.basic_info.doing_business_as
	);
	const street = useReportStore(
		(state) => state.form.business_address.address_line
	);
	const city = useReportStore((state) => state.form.business_address.city);
	const state = useReportStore((state) => state.form.business_address.state);
	const country = useReportStore(
		(state) => state.form.business_address.country
	);
	const zip = useReportStore((state) => state.form.business_address.zip);
	const business_start_date = useReportStore(
		(state) => state.form.business_start_date
	);

	const business_legal_name = useReportStore(
		(state) => state.form.business_legal_name
	);
	const employee_identification_number = useReportStore(
		(state) => state.form.employee_identification_number
	);
	const terms_of_service = useReportStore(
		(state) => state.form.terms_of_service
	);

	const month = useReportStore(
		(state) => state.form.business_start_date.month
	);
	const day = useReportStore((state) => state.form.business_start_date.day);
	const year = useReportStore((state) => state.form.business_start_date.year);

	const submit = useSubmit();

	const onSubmit = (e) => {
		e.preventDefault();
		console.log("submitting");
		let resource_path = to_resource_pathname(window.location.pathname);

		let { business_start_date, ...rest } = form;

		let business_start_date_string = `${business_start_date.year}-${business_start_date.month}-${business_start_date.day}`;
		let payload = {
			business_start_date: business_start_date_string,
			...rest,
		};

		submit(
			{ payload: JSON.stringify(payload) },
			{
				method: "post",
				action: "/credit/business/new" + resource_path,
			}
		);
	};

	const onCancel = (e) => {
		console.log("onCancel");
		e.preventDefault();
		Cookies.set("allow_empty", true);
		window.location = "/home";
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
						htmlFor="first_name"
						className="block text-sm font-medium text-gray-700"
					>
						First name
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="first_name"
							id="first_name"
							autoComplete="first_name"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={first_name}
							onChange={(e) =>
								setForm(
									["basic_info", "first_name"],
									e.target.value
								)
							}
						/>
					</div>
				</div>

				<div className="sm:col-span-3">
					<label
						htmlFor="last_name"
						className="block text-sm font-medium text-gray-700"
					>
						Last name
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="last_name"
							id="last_name"
							autoComplete="last_name"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={last_name}
							onChange={(e) =>
								setForm(
									["basic_info", "last_name"],
									e.target.value
								)
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
							type="text"
							name="email"
							id="email"
							autoComplete="email"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={email}
							onChange={(e) =>
								setForm(
									["basic_info", "email_address"],
									e.target.value
								)
							}
						/>
					</div>
				</div>

				<div className="sm:col-span-6">
					<label
						htmlFor="telephone"
						className="block text-sm font-medium text-gray-700"
					>
						Telephone
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="telephone"
							id="telephone"
							autoComplete="telephone"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={telephone}
							onChange={(e) =>
								setForm(
									["basic_info", "telephone"],
									e.target.value
								)
							}
						/>
					</div>
				</div>

				<div className="border-b border-gray-300 sm:col-span-6">
					<h3 className="text-lg font-medium leading-6 text-gray-900 pb-2">
						Business information
					</h3>
				</div>

				<div className="sm:col-span-6">
					<label
						htmlFor="business_legal_name"
						className="block text-sm font-medium text-gray-700"
					>
						Business legal name
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="business_legal_name"
							id="business_legal_name"
							autoComplete="business_legal_name"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={business_legal_name}
							onChange={(e) =>
								setForm(["business_legal_name"], e.target.value)
							}
						/>
					</div>
				</div>

				<div className="sm:col-span-6">
					<label
						htmlFor="doing_business_as"
						className="block text-sm font-medium text-gray-700"
					>
						Doing business as (optional)
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="doing_business_as"
							id="doing_business_as"
							autoComplete="doing_business_as"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={doing_business_as}
							onChange={(e) =>
								setForm(
									["basic_info", "doing_business_as"],
									e.target.value
								)
							}
						/>
					</div>
				</div>

				<div className="sm:col-span-6">
					<label
						htmlFor="business_type"
						className="block text-sm font-medium text-gray-700"
					>
						Business type
					</label>
					<div className="mt-1">
						<BusinessEntity />
					</div>
				</div>

				<div className="sm:col-span-6">
					<label
						htmlFor="employee_identification_number"
						className="block text-sm font-medium text-gray-700"
					>
						Employee identification number
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="employee_identification_number"
							id="employee_identification_number"
							autoComplete="employee_identification_number"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={employee_identification_number}
							onChange={(e) =>
								setForm(
									["employee_identification_number"],
									e.target.value
								)
							}
						/>
					</div>
				</div>

				<div className=" sm:col-span-6">
					<h3 className="text-sm font-medium text-gray-700 -mb-6">
						Business start date
					</h3>
				</div>

				<div className="sm:col-span-2">
					<div className="mt-1">
						<input
							type="number"
							name="month"
							id="month"
							autoComplete="month"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2 "
							placeholder="MM"
							value={month}
							onChange={(e) =>
								setForm(
									["business_start_date", "month"],
									e.target.value
								)
							}
						/>
					</div>
				</div>

				<div className="sm:col-span-2">
					<div className="mt-1">
						<input
							type="number"
							name="day"
							id="day"
							autoComplete="day"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2 "
							value={day}
							placeholder="DD"
							onChange={(e) =>
								setForm(
									["business_start_date", "day"],
									e.target.value
								)
							}
						/>
					</div>
				</div>

				<div className="sm:col-span-2">
					<div className="mt-1">
						<input
							type="number"
							name="year"
							id="year"
							autoComplete="year"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2 "
							value={year}
							placeholder="YYYY"
							onChange={(e) =>
								setForm(
									["business_start_date", "year"],
									e.target.value
								)
							}
						/>
					</div>
				</div>

				<div className="border-b border-gray-300 sm:col-span-6">
					<h3 className="text-lg font-medium leading-6 text-gray-900 pb-2">
						Business address information
					</h3>
				</div>

				<div className="sm:col-span-6">
					<label
						htmlFor="street_address"
						className="block text-sm font-medium text-gray-700"
					>
						Street address
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="street_address"
							id="street_address"
							autoComplete="street_address"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={street}
							onChange={(e) =>
								setForm(
									["business_address", "address_line"],
									e.target.value
								)
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
							autoComplete="city"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={city}
							onChange={(e) =>
								setForm(
									["business_address", "city"],
									e.target.value
								)
							}
						/>
					</div>
				</div>

				<div className="sm:col-span-2">
					<label
						htmlFor="state"
						className="block text-sm font-medium text-gray-700"
					>
						State / Province
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="state"
							id="state"
							autoComplete="state"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={state}
							onChange={(e) =>
								setForm(
									["business_address", "state"],
									e.target.value
								)
							}
						/>
					</div>
				</div>

				<div className="sm:col-span-2">
					<label
						htmlFor="zip_code"
						className="block text-sm font-medium text-gray-700"
					>
						ZIP / Postal code
					</label>
					<div className="mt-1">
						<input
							type="number"
							name="zip_code"
							id="zip_code"
							autoComplete="zip_code"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={zip}
							onChange={(e) =>
								setForm(
									["business_address", "zip"],
									e.target.value
								)
							}
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-row w-full justify-end pt-3">
				<button
					onClick={onCancel}
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
					<p className="mt-1 text-2xl font-bold tracking-tight text-[#55CF9E]">
						TELL US A LITTLE BIT ABOUT YOUR BUSINESS
					</p>
					<p className="text-lg font-semibold text-[#202536] mt-6">
						We don’t need your firstborn, a blood sample, or a DNA
						swab, but we need to know what to call you and how to
						reach you
					</p>
				</div>
			</div>
		</div>
	);
};

const PreFills = () => {
	let set_state = useReportStore((state) => state.set_state);

	const onPreFill = (identity) => {
		set_state(["form"], identity);
	};

	return (
		<div className="absolute top-0 right-[10px] z-[101] space-y-2 py-5">
			<div
				className="cursor-pointer"
				onClick={() => onPreFill(test_identity_three)}
			>
				MRM
			</div>

			<div
				className="cursor-pointer"
				onClick={() => onPreFill(test_identity_four)}
			>
				Meta
			</div>

			<div
				className="cursor-pointer"
				onClick={() => onPreFill(test_identity_five)}
			>
				McDonalds
			</div>

			<div
				className="cursor-pointer"
				onClick={() => onPreFill(test_identity_six)}
			>
				Lkq Auto Parts Of North Texas, Inc.
			</div>

			<div
				className="cursor-pointer"
				onClick={() => onPreFill(test_identity_seven)}
			>
				Nuveen New York Quality Income Municipal Fund Inc
			</div>
		</div>
	);
};

export default function NewBusinessReport() {
	let location = useLocation();
	let search_obj = get_search_params_obj(location.search);

	return (
		<div className="flex flex-col w-full">
			{search_obj.cookie == "monster" && <PreFills />}
			<CreditNav />
			<div className="flex flex-col w-full p-[20px] max-w-2xl mx-auto">
				<Heading />
				<Form />
			</div>
		</div>
	);
}
