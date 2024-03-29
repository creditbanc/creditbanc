import { classNames, form_params, get, get_entity_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { pipe, map, head } from "ramda";
import { Fragment, useState } from "react";
import { Listbox, Transition, RadioGroup } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import useStore from "./store";
import { Link, useLocation, useSubmit } from "@remix-run/react";
import { from, lastValueFrom, map as rxmap } from "rxjs";
import { update_doc, set_doc } from "~/utils/firebase";
import { redirect } from "@remix-run/node";
import { navigation } from "./navigation";
import { filter } from "shades";
import ApplicationProgress from "~/components/ApplicationProgress";

const update_onboarding = async ({ entity_id, group_id, step }) => {
	return set_doc(["onboarding", group_id], { step, entity_id, group_id }, true);
};

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

	let step = pipe(filter({ id: "entity" }), head, get("step"))(navigation);
	let { business_entity } = params;
	let payload = { business_entity, step };

	let response = from(update_doc(["application", entity_id], payload)).pipe(rxmap(() => ({ entity_id, group_id })));

	await lastValueFrom(response);

	await update_onboarding({ entity_id, group_id, step });

	let next = pipe(filter({ id: "entity" }), head, get("next"))(navigation);
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

const options = [
	{ id: 1, value: "Independent Contractor" },
	{ id: 2, value: "Sole Proprietorship" },
	{ id: 3, value: "General Partnership" },
	{ id: 4, value: "Limited Partnership (LP)" },
	{ id: 5, value: "Limited Liability Corporation (LLC)" },
	{ id: 6, value: "S Corporation" },
	{ id: 7, value: "C Corporation" },
];

const BusinessEntity = () => {
	const [selected, setSelected] = useState(options[0]);
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
													active ? "bg-[#56CF9E] text-white" : "text-gray-900",
													"relative cursor-default select-none py-2 pl-3 pr-9"
												)
											}
											value={person}
											onClick={() => set_props({ business_entity: person.value })}
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
																active ? "text-white" : "text-[#56CF9E]",
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

export default function Container() {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	const submit = useSubmit();
	let { business_entity } = useStore();

	let back = pipe(filter({ id: "entity" }), head, get("back"))(navigation);

	const onSubmit = () => {
		console.log("onSubmit");
		let payload = { business_entity };

		// console.log("payload");
		// console.log(payload);

		submit(payload, {
			action: `/apply/entity/resource/e/${entity_id}/g/${group_id}`,
			method: "post",
		});
	};

	return (
		<div className="flex flex-col items-center w-full h-full overflow-y-scroll pb-10">
			<div className="flex flex-col w-full">
				{/* <Progress /> */}
				<ApplicationProgress />
			</div>
			<div className="flex flex-col justify-center h-4/5 w-[600px]">
				<div className="flex flex-col my-4">
					<SectionHeading
						headline={<div>What is your business entity type?</div>}
						subheadline={
							<div className="flex flex-col gap-x-2">
								<div>This helps us personalize your experience.</div>
								<div>(After all, different roles have different needs.)</div>
							</div>
						}
					/>
				</div>
				<div className="flex flex-col w-full">
					<BusinessEntity />
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
						// to={`/apply/employees/resource/e/${entity_id}/g/${group_id}`}
						className="flex flex-col bg-[#56CF9E] py-3 px-4 rounded-full text-white w-1/2 items-center cursor-pointer"
					>
						Continue to pre-qualify
					</div>
				</div>
			</div>
		</div>
	);
}
