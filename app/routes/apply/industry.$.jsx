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
import { filter } from "shades";
import { navigation } from "./navigation";
import ApplicationProgress from "~/components/ApplicationProgress";

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

	let step = pipe(filter({ id: "industry" }), head, get("step"))(navigation);
	let { industry } = params;
	let payload = { industry, step };

	let response = from(update_doc(["application", entity_id], payload)).pipe(rxmap(() => ({ entity_id, group_id })));

	await lastValueFrom(response);
	let next = pipe(filter({ id: "industry" }), head, get("next"))(navigation);
	return redirect(next({ entity_id, group_id }));
};

const SectionHeading = ({ headline, subheadline }) => {
	return (
		<div className="flex flex-col text-center gap-y-2 my-7">
			<div className="text-gray-800 font-semibold">{headline}</div>
			<div className="text-gray-600">{subheadline}</div>
		</div>
	);
};

const industry = [
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

const Industry = () => {
	const [selected, setSelected] = useState(industry[0]);
	const { set_props } = useStore();

	return (
		<Listbox value={selected} onChange={setSelected}>
			{({ open }) => (
				<>
					<div className="relative mt-2">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-3 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
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
											onClick={() => set_props({ industry: person.value })}
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
								)(industry)}
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
	let { industry } = useStore((state) => state);

	let back = pipe(filter({ id: "industry" }), head, get("back"))(navigation);

	const onSubmit = () => {
		console.log("onSubmit");
		let payload = { industry };

		// console.log("payload");
		// console.log(payload);

		submit(payload, {
			action: `/apply/industry/resource/e/${entity_id}/g/${group_id}`,
			method: "post",
		});
	};

	return (
		<div className="flex flex-col items-center w-full h-full overflow-y-scroll pb-10">
			<div className="flex flex-col w-full">
				<ApplicationProgress />
			</div>
			<div className="flex flex-col justify-center h-4/5 w-[600px]">
				<div className="flex flex-col my-4">
					<SectionHeading
						headline={<div>What is your business industry?</div>}
						subheadline={
							<div className="flex flex-row gap-x-2">
								<div>
									If you don’t see an option that fits your company, please select the closest option.
									You can select the exact industry further down in the application.
								</div>
							</div>
						}
					/>
				</div>
				<div className="flex flex-col w-full">
					<Industry />
				</div>
				<div className="flex flex-row w-full items-center gap-y-4 my-5 gap-x-3">
					<Link
						to={back({ entity_id, group_id })}
						className="flex flex-col py-3 px-4 rounded-full text-[#56CF9E] w-1/2 items-center cursor-pointer border-2 border-[#56CF9E]"
					>
						Back
					</Link>
					<div
						onClick={onSubmit}
						// to={`/apply/address/resource/e/${entity_id}/g/${group_id}`}
						className="flex flex-col bg-[#56CF9E] py-3 px-4 rounded-full text-white w-1/2 items-center cursor-pointer"
					>
						Continue to pre-qualify
					</div>
				</div>
			</div>
		</div>
	);
}
