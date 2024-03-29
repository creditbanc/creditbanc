import { classNames, form_params, get, get_entity_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { pipe, map, head } from "ramda";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import useStore from "./store";
import { Link, useLocation, useSubmit } from "@remix-run/react";
import { from, lastValueFrom, map as rxmap } from "rxjs";
import { set_doc, update_doc } from "~/utils/firebase";
import { redirect } from "@remix-run/node";
import { navigation } from "./navigation";
import { filter } from "shades";
import { unformat, formatMoney } from "accounting-js";
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

	let step = pipe(filter({ id: "loans" }), head, get("step"))(navigation);
	let { loans } = params;
	let payload = { loans: JSON.parse(loans), step };

	console.log("payload");
	console.log(payload);

	let response = from(update_doc(["application", entity_id], payload)).pipe(rxmap(() => ({ entity_id, group_id })));

	await lastValueFrom(response);

	await update_onboarding({ entity_id, group_id, step });

	let next = pipe(filter({ id: "loans" }), head, get("next"))(navigation);
	return redirect(next({ entity_id, group_id }));
};

const SectionHeading = ({ headline, subheadline }) => {
	return (
		<div className="flex flex-col text-center gap-y-2">
			<div className="text-gray-800 font-semibold">{headline}</div>
			<div className="text-gray-600">{subheadline}</div>
		</div>
	);
};

const loans = [
	{ id: 1, option: "No", value: false },
	{ id: 2, option: "Yes", value: true },
];

const Loans = () => {
	const [selected, setSelected] = useState(loans[0]);
	const { set_path } = useStore();

	return (
		<Listbox value={selected} onChange={setSelected}>
			{({ open }) => (
				<>
					<div className="relative mt-2">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-3 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6">
							<span className="block truncate">{selected.option}</span>
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
											className={`relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-[#56CF9E] hover:text-white text-gray-900`}
											value={person}
											onClick={() => set_path(["loans", "value"], person.value)}
										>
											{({ selected, active }) => (
												<Listbox.Option>
													<span
														className={classNames(
															selected ? "font-semibold" : "font-normal",
															"block truncate"
														)}
													>
														{person.option}
													</span>

													{selected ? (
														<span
															className={`absolute inset-y-0 right-0 flex items-center pr-4 text-white hover:text-[#56CF9E]`}
														>
															<CheckIcon className="h-5 w-5" aria-hidden="true" />
														</span>
													) : null}
												</Listbox.Option>
											)}
										</Listbox.Option>
									))
								)(loans)}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
};

const number_of_loans = [
	{ id: 0, option: "None", value: 0 },
	{ id: 1, option: "One", value: 1 },
	{ id: 2, option: "Two", value: 2 },
	{ id: 3, option: "Four", value: 3 },
	{ id: 4, option: "Five", value: 4 },
	{ id: 5, option: "More than 5", value: 5 },
];

const NumberOfLoans = () => {
	const [selected, setSelected] = useState(number_of_loans[0]);
	const { set_path } = useStore();

	return (
		<div>
			<div>
				<SectionHeading headline={<div>How many?</div>} />
			</div>
			<Listbox value={selected} onChange={setSelected}>
				{({ open }) => (
					<>
						<div className="relative mt-2">
							<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-3 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#56CF9E] sm:text-sm sm:leading-6">
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
												onClick={() => set_path(["loans", "number_of_loans"], person.value)}
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
									)(number_of_loans)}
								</Listbox.Options>
							</Transition>
						</div>
					</>
				)}
			</Listbox>
		</div>
	);
};

const PaymentAmount = () => {
	const { set_path, loans } = useStore();

	return (
		<div>
			<div>
				<SectionHeading
					headline={<div>What are your total balances?</div>}
					subheadline={<div className="flex flex-row gap-x-2"></div>}
				/>
			</div>

			<div className="col-span-full mt-2">
				<input
					value={formatMoney(loans?.amount, { precision: 0 })}
					type="text"
					className="px-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 text-center"
					onChange={(e) => {
						set_path(["loans", "amount"], unformat(e.target.value));
					}}
				/>
			</div>
		</div>
	);
};

export default function Container() {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	const submit = useSubmit();
	let { loans } = useStore();

	let back = pipe(filter({ id: "loans" }), head, get("back"))(navigation);

	const onSubmit = () => {
		console.log("onSubmit");
		let payload = { loans: JSON.stringify(loans) };

		console.log("payload");
		console.log(payload);

		submit(payload, {
			action: `/apply/loans/resource/e/${entity_id}/g/${group_id}`,
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
						headline={<div>Do you have any loans that require daily or weekly payments at the moment?</div>}
					/>
				</div>
				<div className="flex flex-col w-full">
					<Loans />
					<div className="flex flex-col gap-y-8 my-8">
						{loans.value && (
							<div className="flex flex-col">
								<NumberOfLoans />
							</div>
						)}
						{loans.number_of_loans > 0 && (
							<div className="flex flex-col">
								<PaymentAmount />
							</div>
						)}
					</div>
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
						className="flex flex-col bg-[#56CF9E] py-3 px-4 rounded-full text-white w-1/2 items-center cursor-pointer"
					>
						Continue to pre-qualify
					</div>
				</div>
			</div>
		</div>
	);
}
