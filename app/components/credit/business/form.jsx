import { get_search_params_obj } from "~/utils/helpers";
import { pipe } from "ramda";
import PreFills from "~/routes/credit/business/PreFills";
import { useState, Fragment } from "react";
import { create } from "zustand";
import { useLocation } from "@remix-run/react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { mod } from "shades";
import { classNames } from "~/utils/helpers";

export const use_form_store = create((set) => ({
	errors: {},
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
		requested_products: [],
	},
	set_state: (path, value) => set((state) => pipe(mod(...path)(() => value))(state)),
	set_form: (path, value) => set((state) => pipe(mod("form", ...path)(() => value))(state)),
}));

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
	const set_form = use_form_store((state) => state.set_form);

	const onSelect = (event) => {
		let selected = pipe(filter({ id: event.id }), head)(business_entities);
		setSelected(selected);
		set_form(["business_entity"], event.id);
	};

	return (
		<Listbox value={selected} onChange={onSelect}>
			{({ open }) => (
				<>
					<div className="relative mt-1">
						<Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
							<span className="block truncate">{selected.name}</span>
							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
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
												active ? "text-white bg-indigo-600" : "text-gray-900",
												"relative cursor-default select-none py-2 pl-3 pr-9"
											)
										}
										value={person}
									>
										{({ selected, active }) => (
											<>
												<span
													className={classNames(
														selected ? "font-semibold" : "font-normal",
														"block truncate"
													)}
												>
													{person.name}
												</span>

												{selected ? (
													<span
														className={classNames(
															active ? "text-white" : "text-indigo-600",
															"absolute inset-y-0 right-0 flex items-center pr-4"
														)}
													>
														<CheckIcon className="h-5 w-5" aria-hidden="true" />
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

export const Form = ({ on_submit }) => {
	const location = useLocation();
	let search_obj = get_search_params_obj(location.search);
	let form = use_form_store((state) => state.form);
	let errors = use_form_store((state) => state.errors);
	let set_form = use_form_store((state) => state.set_form);
	let set_form_state = use_form_store((state) => state.set_state);

	return (
		<div className="flex flex-col w-full bg-white p-5">
			{search_obj.cookie == "monster" && <PreFills set={set_form_state} />}

			<div className="flex flex-col w-full">
				<div className="flex flex-col w-full my-2">
					<div className="mb-2 text-sm">Personal information</div>
					<div className="flex flex-col gap-y-2">
						<div className="flex flex-row gap-x-2">
							<div className="flex flex-col w-[50%]">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name="given-name"
									placeholder="First name"
									autoComplete="given-name"
									value={form.basic_info.first_name}
									onChange={(e) => set_form(["basic_info", "first_name"], e.target.value)}
								/>
								{errors?.basic_info?.first_name == false && (
									<div className="text-xs text-red-500 py-1">First name is required</div>
								)}
							</div>
							<div className="flex flex-col w-[50%]">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="Last name"
									autoComplete="family-name"
									value={form.basic_info.last_name}
									onChange={(e) => set_form(["basic_info", "last_name"], e.target.value)}
								/>
								{errors?.basic_info?.last_name == false && (
									<div className="text-xs text-red-500 py-1">Last name is required</div>
								)}
							</div>
						</div>
						<div className="flex flex-row">
							<div className="flex flex-col w-[100%]">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="Email"
									autoComplete="email"
									value={form.basic_info.email_address}
									onChange={(e) => set_form(["basic_info", "email_address"], e.target.value)}
								/>
								{errors?.basic_info?.email_address == false && (
									<div className="text-xs text-red-500 py-1">Email is required</div>
								)}
							</div>
						</div>
						<div className="flex flex-row">
							<div className="flex flex-col w-[100%]">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="Telephone"
									autoComplete="tel"
									value={form.basic_info.telephone}
									onChange={(e) => set_form(["basic_info", "telephone"], e.target.value)}
								/>
								{errors?.basic_info?.telephone == false && (
									<div className="text-xs text-red-500 py-1">Telephone is required</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full my-2">
					<div className="mb-2 text-sm">Business information</div>
					<div className="flex flex-col gap-y-2">
						<div className="flex flex-row">
							<div className="flex flex-col w-[100%]">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="Business legal name"
									autoComplete="organization"
									value={form.business_legal_name}
									onChange={(e) => set_form(["business_legal_name"], e.target.value)}
								/>
								{errors?.business_legal_name == false && (
									<div className="text-xs text-red-500 py-1">Business name is required</div>
								)}
							</div>
						</div>
						<div className="flex flex-row">
							<div className="flex flex-col w-[100%]">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="Doing business as (DBA)"
									value={form.basic_info.doing_business_as}
									onChange={(e) => set_form(["basic_info", "doing_business_as"], e.target.value)}
								/>
							</div>
						</div>
						<div className="flex flex-row">
							<div className="flex flex-col w-[100%]">
								<BusinessEntity />
								{errors?.business_entity == false && (
									<div className="text-xs text-red-500 py-1">Business type is required</div>
								)}
							</div>
						</div>
						<div className="flex flex-row">
							<div className="flex flex-col w-[100%]">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="Employer identification number (EIN)"
									value={form.employee_identification_number}
									onChange={(e) => set_form(["employee_identification_number"], e.target.value)}
								/>
								{errors?.employee_identification_number == false && (
									<div className="text-xs text-red-500 py-1">
										Employee identification number is required
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full my-2">
					<div className="mb-2 text-sm">Business start date</div>
					<div className="flex flex-col gap-y-2">
						<div className="flex flex-row gap-x-2">
							<div className="flex flex-col w-1/3">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="MM"
									value={form.business_start_date.month}
									onChange={(e) => set_form(["business_start_date", "month"], e.target.value)}
								/>
								{errors?.business_start_date?.month == false && (
									<div className="text-xs text-red-500 py-1">Month is required</div>
								)}
							</div>
							<div className="flex flex-col w-1/3">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="DD"
									value={form.business_start_date.day}
									onChange={(e) => set_form(["business_start_date", "day"], e.target.value)}
								/>
								{errors?.business_start_date?.day == false && (
									<div className="text-xs text-red-500 py-1">Day is required</div>
								)}
							</div>
							<div className="flex flex-col w-1/3">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="YYYY"
									value={form.business_start_date.year}
									onChange={(e) => set_form(["business_start_date", "year"], e.target.value)}
								/>
								{errors?.business_start_date?.year == false && (
									<div className="text-xs text-red-500 py-1">Year is required</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full my-2">
					<div className="mb-2 text-sm">Business address information</div>
					<div className="flex flex-col gap-y-2">
						<div className="flex flex-row">
							<div className="flex flex-col w-[100%]">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="Street address"
									autoComplete="street-address"
									value={form.business_address.address_line}
									onChange={(e) => set_form(["business_address", "address_line"], e.target.value)}
								/>
								{errors?.business_address?.address_line == false && (
									<div className="text-xs text-red-500 py-1">Street address is required</div>
								)}
							</div>
						</div>
						<div className="flex flex-col lg:flex-row gap-x-2 gap-y-2">
							<div className="flex flex-col w-full lg:w-1/3">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="City"
									autoComplete="address-level2"
									value={form.business_address.city}
									onChange={(e) => set_form(["business_address", "city"], e.target.value)}
								/>
								{errors?.business_address?.city == false && (
									<div className="text-xs text-red-500 py-1">City is required</div>
								)}
							</div>
							<div className="flex flex-col w-full lg:w-1/3">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="State / Province"
									value={form.business_address.state}
									autoComplete="address-level1"
									onChange={(e) => set_form(["business_address", "state"], e.target.value)}
								/>
								{errors?.business_address?.state == false && (
									<div className="text-xs text-red-500 py-1">State / Province is required</div>
								)}
							</div>
							<div className="flex flex-col w-full lg:w-1/3">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="Zip / Postal code"
									autoComplete="postal-code"
									value={form.business_address.zip}
									onChange={(e) => set_form(["business_address", "zip"], e.target.value)}
								/>
								{errors?.business_address?.zip == false && (
									<div className="text-xs text-red-500 py-1">Zip / Postal code is required</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full mt-2">
					<div
						className="flex flex-col w-full items-center justify-center py-2 rounded cursor-pointer bg-green-300 text-white"
						onClick={on_submit}
					>
						Submit
					</div>
				</div>
			</div>
		</div>
	);
};
