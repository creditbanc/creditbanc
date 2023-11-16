import { classNames, get_entity_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { pipe } from "ramda";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import useStore from "./store";
import { Link, useLocation } from "@remix-run/react";

const steps = [
	{ id: "Financing Needs", name: "Job details", href: "#", status: "complete" },
	{ id: "About your business", name: "Application form", href: "#", status: "current" },
	{ id: "About your owners", name: "Preview", href: "#", status: "upcoming" },
];

const Progress = () => {
	return (
		<nav aria-label="Progress">
			<ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
				{pipe(
					mapIndexed((step, index) => (
						<li key={index} className="md:flex-1">
							{step.status === "complete" ? (
								<a
									href={step.href}
									className="group flex flex-col items-center border-l-4 border-blue-600 py-2 pl-4 hover:border-blue-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
								>
									<span className="text-sm font-medium text-blue-600 group-hover:text-blue-800">
										{step.id}
									</span>
									{/* <span className="text-sm font-medium">{step.name}</span> */}
								</a>
							) : step.status === "current" ? (
								<a
									href={step.href}
									className="flex flex-col items-center border-l-4 border-blue-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
									aria-current="step"
								>
									<span className="text-sm font-medium text-blue-600">{step.id}</span>
									{/* <span className="text-sm font-medium">{step.name}</span> */}
								</a>
							) : (
								<a
									href={step.href}
									className="group flex flex-col items-center border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
								>
									<span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
										{step.id}
									</span>
									{/* <span className="text-sm font-medium">{step.name}</span> */}
								</a>
							)}
						</li>
					))
				)(steps)}
			</ol>
		</nav>
	);
};

const SectionHeading = ({ headline, subheadline }) => {
	return (
		<div className="flex flex-col text-center gap-y-2 my-7">
			<div className="text-gray-800 font-semibold">{headline}</div>
			<div className="text-gray-600">{subheadline}</div>
		</div>
	);
};

const options = [
	{ id: 1, value: "Administrative and Business Services" },
	{ id: 2, value: "Agriculture, Forestry, Fishing and Hunting" },
	{ id: 3, value: "Construction" },
	{ id: 4, value: "Education" },
	{ id: 5, value: "Financial Services" },
	{ id: 6, value: "Healthcare and Social Services" },
	{ id: 7, value: "Holding Companies" },
	{ id: 8, value: "Hospitality and Food Services" },
	{ id: 9, value: "Manufacturing" },
	{ id: 10, value: "Mining, Quarrying, and Oil & Gas Extraction" },
	{ id: 11, value: "Other Services (Repair, Personal Care, and Religious & Social Organizations)" },
	{ id: 12, value: "Professional Services" },
	{ id: 13, value: "Public Administration" },
	{ id: 14, value: "Real Estate" },
	{ id: 15, value: "Recreation, Entertainment, and Arts" },
	{ id: 16, value: "Retail Trade" },
	{ id: 17, value: "Technology, Publishing, and Telecom" },
	{ id: 18, value: "Transportation and Warehousing" },
	{ id: 19, value: "Utilities" },
	{ id: 20, value: "Wholesale Trade" },
];

const TimeInBusiness = () => {
	const [selected, setSelected] = useState(options[3]);

	return (
		<Listbox value={selected} onChange={setSelected}>
			{({ open }) => (
				<>
					<Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
						Assigned to
					</Listbox.Label>
					<div className="relative mt-2">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
							<span className="block truncate">{selected.value}</span>
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
								{pipe(
									mapIndexed((person, index) => (
										<Listbox.Option
											key={index}
											className={({ active }) =>
												classNames(
													active ? "bg-indigo-600 text-white" : "text-gray-900",
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
														{person.value}
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
									))
								)(options)}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
};

const AddressForm = () => {
	return (
		<form>
			<div className="space-y-12">
				<div className="border-b border-gray-900/10 pb-12">
					<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
						{/* <div className="sm:col-span-3">
							<label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
								Country
							</label>
							<div className="mt-2">
								<select
									id="country"
									name="country"
									autoComplete="country-name"
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
								>
									<option>United States</option>
									<option>Canada</option>
									<option>Mexico</option>
								</select>
							</div>
						</div> */}

						<div className="col-span-full">
							<label
								htmlFor="street-address"
								className="block text-sm font-medium leading-6 text-gray-900"
							>
								Street address
							</label>
							<div className="mt-2">
								<input
									type="text"
									name="street-address"
									id="street-address"
									autoComplete="street-address"
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div className="sm:col-span-2 sm:col-start-1">
							<label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
								City
							</label>
							<div className="mt-2">
								<input
									type="text"
									name="city"
									id="city"
									autoComplete="address-level2"
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div className="sm:col-span-2">
							<label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
								State / Province
							</label>
							<div className="mt-2">
								<input
									type="text"
									name="region"
									id="region"
									autoComplete="address-level1"
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div className="sm:col-span-2">
							<label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
								ZIP / Postal code
							</label>
							<div className="mt-2">
								<input
									type="text"
									name="postal-code"
									id="postal-code"
									autoComplete="postal-code"
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
};

export default function Container() {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	return (
		<div className="flex flex-col items-center w-full h-full overflow-y-scroll pb-10">
			<div className="flex flex-col w-full">
				<Progress />
			</div>
			<div className="flex flex-col justify-center h-full">
				<div className="flex flex-col my-4">
					<SectionHeading
						headline={<div>First, how soon do you need funding?</div>}
						subheadline={
							<div className="flex flex-row gap-x-2">
								<div>This helps us find the best loan for your needs.</div>
								<div className="font-semibold">Learn more ›</div>
							</div>
						}
					/>
				</div>
				<div className="flex flex-col w-full">
					<AddressForm />
				</div>
				<div className="flex flex-row w-full items-center gap-y-4 my-5 w=[450px] gap-x-3">
					<Link
						to={`/apply/industry/resource/e/${entity_id}/g/${group_id}`}
						className="flex flex-col py-3 px-4 rounded-full text-blue-600 w-1/2 items-center cursor-pointer border-2 border-blue-600"
					>
						Back
					</Link>
					<Link
						to={`/apply/entity/resource/e/${entity_id}/g/${group_id}`}
						className="flex flex-col bg-blue-600 py-3 px-4 rounded-full text-white w-1/2 items-center cursor-pointer"
					>
						Continue to pre-qualify
					</Link>
				</div>
			</div>
		</div>
	);
}