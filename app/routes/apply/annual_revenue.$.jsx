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
import { unformat, formatMoney } from "accounting-js";

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

	let step = pipe(filter({ id: "annual_revenue" }), head, get("step"))(navigation);
	let { revenue } = params;
	let payload = { revenue: JSON.parse(revenue), step };

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

const Revenue = () => {
	const { set_props, revenue } = useStore();

	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-col w-full items-center my-5">
				<div className="flex flex-col text-3xl font-semibold text-[#56CF9E]">{formatMoney(revenue)}</div>
			</div>
			<div className="flex flex-col w-full">
				<input
					min="10000"
					max="10000000"
					type="range"
					value={revenue}
					onChange={(e) => set_props({ revenue: e.target.value })}
					className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
				/>
			</div>
			<div className="flex flex-row justify-between my-4 text-gray-600">
				<div>{formatMoney(10000)}</div>
				<div>{formatMoney(10000000)}</div>
			</div>
		</div>
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
						to={back({ entity_id, group_id })}
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
