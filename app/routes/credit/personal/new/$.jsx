import CreditNav from "~/components/CreditNav";
import CreditHeroGradient from "~/components/CreditHeroGradient";
import axios from "axios";
import {
	allPass,
	flatten,
	head,
	includes,
	is,
	isEmpty,
	isNil,
	map,
	not,
	pipe,
	values,
} from "ramda";
import { get, mod } from "shades";
import { create } from "zustand";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import {
	inspect,
	to_resource_pathname,
	get_group_id,
	sample,
	get_entity_id,
	form_params,
	search_params,
	is_applicant_p,
	formData,
	validate_form,
	json_response,
} from "~/utils/helpers";
import { json, redirect } from "@remix-run/node";
import {
	test_identity_one,
	test_identity_two,
	test_identity_three,
	test_identity_four,
	test_identity_five,
	test_identity_ten,
	appKey,
	user_url,
	is_sandbox,
} from "~/data/array";
import {
	getSession,
	commitSession,
} from "~/sessions/personal_credit_report_session";
import Cookies from "js-cookie";
import ApplicantNav from "~/components/ApplicantNav";
import SimpleNav from "~/components/SimpleNav";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { UsaStates } from "usa-states";
import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import {
	map as rxmap,
	filter as rxfilter,
	concatMap,
	tap,
	take,
	catchError,
} from "rxjs/operators";
import {
	from,
	lastValueFrom,
	forkJoin,
	Subject,
	of as rxof,
	iif,
	throwError,
} from "rxjs";
import { fold, ifEmpty, ifFalse } from "~/utils/operators";
import { is_authorized_f } from "~/api/auth";
import { ArrayExternal } from "~/api/external/Array";
import { ArrayInternal } from "~/api/internal/Array";

const subject = new Subject();

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
				console.log("credit.personal.new.tap");
				console.log(value);
			})
		);
	})
);

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const useReportStore = create((set) => ({
	form: {
		appKey,
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

const isNotEmpty = (value) => !isEmpty(value);
const isNotNil = (value) => !isNil(value);

let validator = {
	firstName: pipe(allPass([isNotEmpty, isNotNil])),
	lastName: pipe(allPass([isNotEmpty, isNotNil])),
	ssn: pipe(allPass([isNotEmpty, isNotNil])),
	address: {
		street: pipe(allPass([isNotEmpty, isNotNil])),
		city: pipe(allPass([isNotEmpty, isNotNil])),
		state: pipe(allPass([isNotEmpty, isNotNil])),
		zip: pipe(allPass([isNotEmpty, isNotNil])),
	},
	dob: pipe(allPass([isNotEmpty, isNotNil])),
};

let is_valid = pipe(values, flatten, includes(false), not);

export const action = async ({ request }) => {
	console.log("credit.personal.new.action");
	// let { payload: form } = await form_params(request);
	let { plan_id, applicant } = search_params(request);
	let is_applicant = is_applicant_p(applicant);
	const group_id = get_group_id(request.url);
	const entity_id = get_entity_id(request.url);
	let form = await formData(request);
	var payload = is_sandbox ? test_identity_three : form.payload;
	console.log("credit.personal.new.action.payload");
	console.log(payload);

	let session = await getSession(request.headers.get("Cookie"));
	session.set("personal_credit_report", JSON.stringify({ ...payload }));

	let validations = validate_form(validator, payload);
	let from_validations = is_valid(validations);
	console.log("credit.personal.new.validations");
	console.log(from_validations);
	console.log(validations);

	if (!from_validations) {
		return json_response(validations);
	}

	// console.log("____null_____");
	// return null;

	try {
		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: user_url,
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
			},
			data: {
				appKey,
				...payload,
			},
		};

		// console.log("payload");
		// console.log(payload);

		let response = await axios(config);

		console.log("credit.personal.new.response");
		console.log(response.data);

		let { clientKey, authToken } = response.data;

		let params = [
			`clientKey=${clientKey}`,
			`authToken=${authToken}`,
			`group_id=${group_id}`,
		];

		let applicant_params = [
			`clientKey=${clientKey}`,
			`authToken=${authToken}`,
			`group_id=${group_id}`,
			`entity_id=${entity_id}`,
			`plan_id=${plan_id}`,
			`applicant=${applicant}`,
		];

		let redirect_search_params = is_applicant
			? applicant_params.join("&")
			: params.join("&");

		// console.log("search_params");
		// console.log(search_params);

		return redirect(
			`/credit/personal/verification?${redirect_search_params}`,
			{
				headers: {
					"Set-Cookie": await commitSession(session),
				},
			}
		);
	} catch (error) {
		console.log("credit.personal.new.catch.error");
		console.log(error.response.data);
		return json({ error: error.message }, { status: 500 });
	}
};

export const loader = async ({ request }) => {
	console.log("credit.personal.new.loader");
	const on_success = async (response) => {
		console.log("credit.personal.new.success");
		let entity_id = await get_session_entity_id(request);
		// let { plan_id } = await get_doc(["entity", entity_id]);

		let payload = { ...response };

		subject.next({
			id: "credit_report_response",
			next: () => payload,
		});
	};

	const on_error = (error) => {
		console.log("credit.personal.new.error");
		console.log(error);

		subject.next({
			id: "credit_report_response",
			next: () => error ?? null,
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

const StatesSelect = () => {
	var usStates = new UsaStates();
	let states = pipe(map(get("abbreviation")))(usStates.states);
	const [selected, setSelected] = useState(head(states));
	const setForm = useReportStore((state) => state.setForm);

	useEffect(() => {
		setForm(["address", "state"], selected);
	}, [selected]);

	return (
		<Listbox value={selected} onChange={setSelected}>
			{({ open }) => (
				<>
					<div className="relative">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
							<span className="block truncate">{selected}</span>
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
								{states.map((state, id) => (
									<Listbox.Option
										key={id}
										className={({ active }) =>
											classNames(
												active
													? "bg-indigo-600 text-white"
													: "text-gray-900",
												"relative cursor-default select-none py-2 pl-3 pr-9"
											)
										}
										value={state}
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
													{state}
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
		let resource_path =
			to_resource_pathname(window.location.pathname) +
			window.location.search;

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
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={first_name}
							onChange={(e) =>
								setForm(["firstName"], e.target.value)
							}
						/>
					</div>
					{error?.firstName == false && (
						<div className="text-xs text-red-500 py-1">
							First name is required
						</div>
					)}
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
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={last_name}
							onChange={(e) =>
								setForm(["lastName"], e.target.value)
							}
						/>
					</div>
					{error?.lastName == false && (
						<div className="text-xs text-red-500 py-1">
							Last name is required
						</div>
					)}
				</div>

				<div className="sm:col-span-6">
					<label
						htmlFor="ssn"
						className="block text-sm font-medium text-gray-700"
					>
						Social security number
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="ssn"
							id="ssn"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={ssn}
							onChange={(e) => setForm(["ssn"], e.target.value)}
						/>
					</div>

					{error?.ssn == false && (
						<div className="text-xs text-red-500 py-1">
							Social Security Number is required
						</div>
					)}
				</div>

				<div className="border-b border-gray-300 sm:col-span-6">
					<h3 className="text-lg font-medium leading-6 text-gray-900 pb-2">
						Date of birth
					</h3>
				</div>

				<div className="sm:col-span-2">
					<label
						htmlFor="month"
						className="block text-sm font-medium text-gray-700"
					>
						Month
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="month"
							placeholder="MM"
							id="month"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={month}
							onChange={(e) =>
								setForm(["dob", "month"], e.target.value)
							}
						/>
					</div>
					{error?.dob?.month == false && (
						<div className="text-xs text-red-500 py-1">
							Month is required
						</div>
					)}
				</div>

				<div className="sm:col-span-2">
					<label
						htmlFor="day"
						className="block text-sm font-medium text-gray-700"
					>
						Day
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="day"
							placeholder="DD"
							id="day"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={day}
							onChange={(e) =>
								setForm(["dob", "day"], e.target.value)
							}
						/>
					</div>
					{error?.dob?.day == false && (
						<div className="text-xs text-red-500 py-1">
							Day is required
						</div>
					)}
				</div>

				<div className="sm:col-span-2">
					<label
						htmlFor="year"
						className="block text-sm font-medium text-gray-700"
					>
						Year
					</label>
					<div className="mt-1">
						<input
							type="text"
							name="year"
							placeholder="YYYY"
							id="year"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={year}
							onChange={(e) =>
								setForm(["dob", "year"], e.target.value)
							}
						/>
					</div>
					{error?.dob?.year == false && (
						<div className="text-xs text-red-500 py-1">
							Year is required
						</div>
					)}
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
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={street}
							onChange={(e) =>
								setForm(["address", "street"], e.target.value)
							}
						/>
					</div>
					{error?.address?.street == false && (
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
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={city}
							onChange={(e) =>
								setForm(["address", "city"], e.target.value)
							}
						/>
					</div>
					{error?.address?.city == false && (
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
						<StatesSelect />

						{/* <input
							type="text"
							name="state"
							id="state"
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={state}
							onChange={(e) =>
								setForm(["address", "state"], e.target.value)
							}
						/> */}
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
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border h-[38px] pl-2"
							value={zip}
							onChange={(e) =>
								setForm(["address", "zip"], e.target.value)
							}
						/>
					</div>
					{error?.address?.zip == false && (
						<div className="text-xs text-red-500 py-1">
							Zip is required
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

export default function NewPersonalCreditReport() {
	return (
		<div className="flex flex-col w-full h-full max-w-2xl mx-auto overflow-y-scroll scrollbar-none">
			<Heading />
			<Form />
		</div>
	);
}
