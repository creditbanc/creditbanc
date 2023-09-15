import { useState, Fragment } from "react";
import CreditNav from "~/components/CreditNav";
import axios from "axios";
import {
	head,
	identity,
	pipe,
	tryCatch,
	evolve,
	isNil,
	allPass,
	isEmpty,
	of,
	values,
	any,
	includes,
	not,
} from "ramda";
import { filter, get, mod, set, sub } from "shades";
import { create } from "zustand";
import { useActionData, useLocation, useSubmit } from "@remix-run/react";
import {
	inspect,
	to_resource_pathname,
	get_group_id,
	get_search_params_obj,
	classNames,
	formData,
	json_response,
	validate_form,
	is_valid,
	from_validations,
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

import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";
import { get_doc, set_doc } from "~/utils/firebase";
import { v4 as uuidv4 } from "uuid";
import {
	catchError,
	partition,
	map as rxmap,
	tap,
	skip,
	filter as rxfilter,
	mergeMap,
	switchMap,
	concatMap,
	mapTo,
	take,
} from "rxjs/operators";
import {
	from,
	of as rxof,
	BehaviorSubject,
	Subject,
	ReplaySubject,
	zip,
	lastValueFrom,
	Observable,
	takeLast,
	firstValueFrom,
	iif,
	throwError,
	forkJoin,
} from "rxjs";
import Entity from "~/api/internal/entity";
import { fold, ifFalse } from "~/utils/operators";
import flatten from "flat";
import { is_authorized_f } from "~/api/auth";

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

interface CBEvent {
	id: string;
	args: {
		request: any;
	};
}

const isNotEmpty = (value) => !isEmpty(value);
const isNotNil = (value) => !isNil(value);

let lendflow_validator = {
	business_start_date: pipe(allPass([isNotEmpty, isNotNil])),
	basic_info: {
		first_name: pipe(allPass([isNotEmpty, isNotNil])),
		last_name: pipe(allPass([isNotEmpty, isNotNil])),
		email_address: pipe(allPass([isNotEmpty, isNotNil])),
		telephone: pipe(allPass([isNotEmpty, isNotNil])),
	},
	business_address: {
		address_line: pipe(allPass([isNotEmpty, isNotNil])),
		city: pipe(allPass([isNotEmpty, isNotNil])),
		state: pipe(allPass([isNotEmpty, isNotNil])),
		country: pipe(allPass([isNotEmpty, isNotNil])),
		zip: pipe(allPass([isNotEmpty, isNotNil])),
	},
	business_entity: pipe(allPass([isNotEmpty, isNotNil])),
	business_legal_name: pipe(allPass([isNotEmpty, isNotNil])),
	employee_identification_number: pipe(allPass([isNotEmpty, isNotNil])),
};

const subject = new Subject();

const new_lendflow_application = subject.pipe(
	rxfilter((event: any) => event.id === "new_application_start"),
	concatMap(({ args: { request } }: CBEvent) => {
		let $formData = from(formData(request)).pipe(
			rxmap((form) => form.payload)
		);

		let $entity_id = from(get_session_entity_id(request)).pipe(
			rxmap((entity_id) => (entity_id ? entity_id : ""))
		);

		let $plan_id = $entity_id.pipe(
			rxmap((entity_id) => new Entity(entity_id)),
			concatMap((entity) => entity.plan_id())
		);

		let $group_id = rxof(get_group_id(request.url));

		let fake_response = {
			data: {
				data: {
					application_id: "8ff74aef-4a97-49ea-b0a2-7798c466a27b",
				},
			},
		};

		return from($formData).pipe(
			concatMap((form) =>
				from_validations(validate_form(lendflow_validator, form))
			),

			concatMap(() => zip($plan_id, $formData)),
			rxmap(([plan_id, form]) =>
				LendflowExternal.new_application_request_creator({
					...form,
					requested_products:
						LendflowExternal.plan_request_products(plan_id),
				})
			),
			// concatMap((request) => from(axios(request))),
			rxmap(() => fake_response),
			rxmap(pipe(get("data", "data", "application_id"))),
			concatMap((application_id) =>
				zip($group_id, $entity_id, $plan_id, rxof(application_id))
			),
			concatMap(([group_id, entity_id, plan_id, application_id]) =>
				LendflowInternal.save_application({
					group_id,
					entity_id,
					plan_id,
					application_id,
					type: "business_credit_report",
					id: application_id,
				})
			)
		);
	})
);

const credit_report = subject.pipe(
	rxfilter((message) => message.id == "get_credit_report"),
	concatMap(({ args: { request } }) => {
		let url = new URL(request.url);

		let group_id = rxof(get_group_id(url.pathname));
		let entity_id = from(get_session_entity_id(request));

		let entity_group_id = forkJoin({
			entity_id,
			group_id,
		});

		let redirect_home = entity_group_id.pipe(
			concatMap(({ entity_id, group_id }) =>
				throwError(() =>
					Response.redirect(
						`${url.origin}/home/resource/e/${entity_id}/g/${group_id}`
					)
				)
			)
		);

		let is_authorized = entity_group_id.pipe(
			concatMap(({ entity_id, group_id }) =>
				is_authorized_f(entity_id, group_id, "credit", "edit")
			),
			concatMap(ifFalse(redirect_home))
		);

		return is_authorized.pipe(
			tap((value) => {
				console.log("___tap___");
				console.log(value);
			})
		);
	})
);

export const action = async ({ request }) => {
	console.log("new_business_credit_action");

	const on_success = async () => {
		console.log("___success___");
		let { origin } = new URL(request.url);

		let entity_id = await get_session_entity_id(request);
		let group_id = get_group_id(request.url);

		let redirect_url = `${origin}/credit/report/business/experian/overview/resource/e/${entity_id}/g/${group_id}`;

		console.log("redirect_url");
		console.log(redirect_url);

		subject.next({
			id: "new_application_response",
			next: () => Response.redirect(redirect_url),
		});
	};

	const on_error = (error) => {
		// console.log("___error___");
		// console.log(error);
		subject.next({
			id: "new_application_response",
			next: () => json_response(error),
		});
	};

	const on_complete = (value) => value.id === "new_application_response";

	new_lendflow_application.pipe(fold(on_success, on_error)).subscribe();

	subject.next({ id: "new_application_start", args: { request } });

	let response = await lastValueFrom(
		subject.pipe(rxfilter(on_complete), take(1))
	);

	return response.next();
};

export const loader = async ({ request }) => {
	console.log("new______");
	const on_success = async (response) => {
		console.log("___success___");
		let entity_id = await get_session_entity_id(request);
		// let { plan_id } = await get_doc(["entity", entity_id]);

		let payload = { ...response };

		subject.next({
			id: "credit_report_response",
			next: () => payload,
		});
	};

	const on_error = (error) => {
		console.log("___error___");
		console.log(error);

		subject.next({
			id: "credit_report_response",
			next: () => error,
		});
	};

	const on_complete = (value) => value.id === "credit_report_response";

	credit_report.pipe(fold(on_success, on_error)).subscribe();

	subject.next({ id: "get_credit_report", args: { request } });

	let response = await lastValueFrom(
		subject.pipe(rxfilter(on_complete), take(1))
	);

	return response.next();
};

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
	let error = useActionData();
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

	console.log("errorrrr");
	console.log(error);

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
					{error?.basic_info?.first_name == false && (
						<div className="text-xs text-red-500 py-1">
							First name is required
						</div>
					)}
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
					{error?.basic_info?.last_name == false && (
						<div className="text-xs text-red-500 py-1">
							Last name is required
						</div>
					)}
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

					{error?.basic_info?.email_address == false && (
						<div className="text-xs text-red-500 py-1">
							Email is required
						</div>
					)}
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

					{error?.basic_info?.telephone == false && (
						<div className="text-xs text-red-500 py-1">
							Telephone is required
						</div>
					)}
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

					{error?.business_legal_name == false && (
						<div className="text-xs text-red-500 py-1">
							Business name is required
						</div>
					)}
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

					{error?.business_entity == false && (
						<div className="text-xs text-red-500 py-1">
							Business type is required
						</div>
					)}
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

					{error?.employee_identification_number == false && (
						<div className="text-xs text-red-500 py-1">
							Employee identification number is required
						</div>
					)}
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
					<div className="text-xs text-red-500 py-1">
						Month is required
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
					<div className="text-xs text-red-500 py-1">
						Day is required
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
					<div className="text-xs text-red-500 py-1">
						Year is required
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

					{error?.business_address?.address_line == false && (
						<div className="text-xs text-red-500 py-1">
							Street address is required
						</div>
					)}
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

					{error?.business_address?.city == false && (
						<div className="text-xs text-red-500 py-1">
							City is required
						</div>
					)}
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

					{error?.business_address?.state == false && (
						<div className="text-xs text-red-500 py-1">
							State / Province is required
						</div>
					)}
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

					{error?.business_address?.zip == false && (
						<div className="text-xs text-red-500 py-1">
							Zip / Postal code is required
						</div>
					)}
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
		<div className="flex flex-col w-full overflow-y-scroll">
			{search_obj.cookie == "monster" && <PreFills />}
			{/* <CreditNav /> */}
			<div className="flex flex-col w-full p-[20px] max-w-2xl mx-auto">
				<Heading />
				<Form />
			</div>
		</div>
	);
}
