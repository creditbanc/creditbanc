import { useState, Fragment, useEffect } from "react";
import { Switch, Listbox, Transition } from "@headlessui/react";
import { get_user_id } from "~/utils/auth.server";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { create } from "zustand";
import { head, pipe } from "ramda";
import { filter, mod } from "shades";
import { prisma } from "~/utils/prisma.server";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const useStore = create((set) => ({
	plan: null,
	set_store: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

const plans = [
	{ id: "essential", name: "Banc Essentials" },
	{ id: "builder", name: "Banc Builder" },
	{ id: "pro", name: "Banc Pro" },
];

export const action = async ({ request }) => {
	var form = await request.formData();

	const plan_id = form.get("id");
	const entity_id = form.get("entity_id");

	await prisma.entity.update({
		where: { id: entity_id },
		data: {
			plan_id,
		},
	});

	return null;
};

export const loader = async ({ request }) => {
	let entity_id = await get_user_id(request);

	let { plan_id } = await prisma.entity.findUnique({
		where: { id: entity_id },
		select: {
			plan_id: true,
		},
	});

	return { entity_id, plan_id };
};

function PlansSelect() {
	const plan = useStore((state) => state.plan);
	const set_store = useStore((state) => state.set_store);

	const onSelectPlan = (value) => {
		set_store(["plan"], value);
	};

	useEffect(() => {
		if (!plan) {
			set_store(["plan"], plans[0]);
		}
	}, [plan]);

	return (
		<Listbox value={plan} onChange={onSelectPlan}>
			{({ open }) => (
				<>
					<div className="relative mt-2">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
							<span className="block truncate">{plan?.name}</span>
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
								{plans.map((person) => (
									<Listbox.Option
										key={person.id}
										className={({ active }) =>
											classNames(
												active
													? "bg-indigo-600 text-white"
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
}

export default function Plan() {
	const { entity_id, plan_id } = useLoaderData();
	const plan = useStore((state) => state.plan);
	const set_store = useStore((state) => state.set_store);
	const submit = useSubmit();

	useEffect(() => {
		if (plan_id) {
			set_store(["plan"], pipe(filter({ id: plan_id }), head)(plans));
		}
	}, [plan_id]);

	const onUpdatePlan = async () => {
		submit(
			{ ...plan, entity_id },
			{ method: "post", action: "/settings/plan" }
		);
	};

	return (
		<main className="px-4 sm:px-6 lg:flex-auto lg:px-0">
			<div className="mx-auto max-w-4xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
				<div>
					<h2 className="text-base font-semibold leading-7 text-gray-900">
						Plan
					</h2>
					<p className="mt-1 text-sm leading-6 text-gray-500">
						This is your current Credit Banc Plan
					</p>

					<dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
						<div className="pt-6 sm:flex">
							<dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
								Plan name
							</dt>
							<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
								<div className="text-gray-900 w-[200px]">
									<PlansSelect />
								</div>
								<button
									onClick={onUpdatePlan}
									type="button"
									className="font-semibold text-indigo-600 hover:text-indigo-500"
								>
									Update
								</button>
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</main>
	);
}
