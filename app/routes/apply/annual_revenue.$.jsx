import { classNames, form_params, get, get_entity_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { pipe, map, head } from "ramda";
import { Fragment, useState } from "react";
import { Listbox, Transition, RadioGroup } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import useStore from "./store";
import { Link, useLocation, useSubmit } from "@remix-run/react";
import { from, lastValueFrom, map as rxmap } from "rxjs";
import { update_doc } from "~/utils/firebase";
import { redirect } from "@remix-run/node";
import { navigation } from "./navigation";
import { filter } from "shades";

export const action = async ({ request }) => {
	console.log("request.url");
	console.log(request.url);
	let url = new URL(request.url);
	let { pathname } = url;
	let group_id = get_group_id(pathname);
	let entity_id = get_entity_id(pathname);
	let params = await form_params(request);

	console.log("params");
	console.log(params);
	console.log(group_id);
	console.log(entity_id);

	let { revenue } = params;
	let payload = { revenue: JSON.parse(revenue) };

	let response = from(update_doc(["application", entity_id], payload)).pipe(rxmap(() => ({ entity_id, group_id })));

	await lastValueFrom(response);
	let next = pipe(filter({ id: "annual_revenue" }), head, get("next"))(navigation);
	return redirect(next({ entity_id, group_id }));
};

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

const revenue = [
	{ id: 1, value: "Below $50,000", min: 0, max: 50000 },
	{ id: 2, value: "$50,000 - $99,999", min: 50000, max: 99999 },
	{ id: 3, value: "$100,000 - $149,999", min: 100000, max: 149999 },
	{ id: 4, value: "$150,000 - $249,999", min: 150000, max: 249999 },
	{ id: 5, value: "$250,000 - $449,999", min: 250000, max: 449999 },
	{ id: 6, value: "$500,000 - $999,999", min: 500000, max: 999999 },
	{ id: 7, value: "$1,000,000 - $1,999,999", min: 1000000, max: 1999999 },
	{ id: 8, value: "$2,000,000 and Above", min: 2000000, max: Infinity },
];

const Revenue = () => {
	const [selected, setSelected] = useState(revenue[0]);
	const { set_props } = useStore();

	return (
		<Listbox value={selected} onChange={setSelected}>
			{({ open }) => (
				<>
					{/* <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
						Assigned to
					</Listbox.Label> */}
					<div className="relative mt-2">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-3 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6">
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
													active ? "bg-blue-600 text-white" : "text-gray-900",
													"relative cursor-default select-none py-2 pl-3 pr-9 "
												)
											}
											value={person}
											onClick={() => set_props({ revenue: { min: person.min, max: person.max } })}
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
																active ? "text-white" : "text-blue-600",
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
								)(revenue)}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
};

export default function Container() {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	const submit = useSubmit();
	let { revenue } = useStore();

	let back = pipe(filter({ id: "annual_revenue" }), head, get("back"))(navigation);

	const onSubmit = () => {
		console.log("onSubmit");
		let payload = { revenue: JSON.stringify(revenue) };

		// console.log("payload");
		// console.log(payload);

		submit(payload, {
			action: `/apply/annual_revenue/resource/e/${entity_id}/g/${group_id}`,
			method: "post",
		});
	};

	return (
		<div className="flex flex-col items-center w-full h-full overflow-y-scroll pb-10">
			<div className="flex flex-col w-full">
				<Progress />
			</div>
			<div className="flex flex-col justify-center h-4/5 w-[600px]">
				<div className="flex flex-col my-4">
					<SectionHeading
						headline={<div>What is your estimated gross annual revenue?</div>}
						subheadline={
							<div className="flex flex-row gap-x-2">
								<div>
									Your gross annual revenue is the total amount of money your business makes during a
									12-month period. Do not deduct any expenses or taxes. This helps us narrow down the
									right type of loan for you.
								</div>
								{/* <div className="font-semibold">Learn more ›</div> */}
							</div>
						}
					/>
				</div>
				<div className="flex flex-col w-full">
					<Revenue />
				</div>
				<div className="flex flex-row w-full items-center gap-y-4 my-5 gap-x-3">
					<Link
						to={back}
						className="flex flex-col py-3 px-4 rounded-full text-blue-600 w-1/2 items-center cursor-pointer border-2 border-blue-600"
					>
						Back
					</Link>
					<div
						onClick={onSubmit}
						// to={`/apply/owners/resource/e/${entity_id}/g/${group_id}`}
						className="flex flex-col bg-blue-600 py-3 px-4 rounded-full text-white w-1/2 items-center cursor-pointer"
					>
						Continue to pre-qualify
					</div>
				</div>
			</div>
		</div>
	);
}
