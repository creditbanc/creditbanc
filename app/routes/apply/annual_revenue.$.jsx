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

	let step = pipe(filter({ id: "annual_revenue" }), head, get("step"))(navigation);
	let { revenue } = params;
	let payload = { revenue: JSON.parse(revenue), step };

	let response = from(update_doc(["application", entity_id], payload)).pipe(rxmap(() => ({ entity_id, group_id })));

	await lastValueFrom(response);

	await update_onboarding({ entity_id, group_id, step });

	let next = pipe(filter({ id: "annual_revenue" }), head, get("next"))(navigation);
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
				<ApplicationProgress />
			</div>
			<div className="flex flex-col justify-center h-4/5 w-[600px]">
				<div className="flex flex-col my-4">
					<SectionHeading
						headline={<div>Let's talk money; how much are you bringing in a year?</div>}
						subheadline={
							<div className="flex flex-row gap-x-2">
								<div>
									Your gross annual revenue is basically the total amount of money your business makes
									annually without taking out any expenses or taxes. This helps us figure out which
									loan is the right fit for you.
								</div>
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
						className="flex flex-col py-3 px-4 rounded-full text-[#56CF9E] w-1/2 items-center cursor-pointer border-2 border-[#56CF9E]"
					>
						Back
					</Link>
					<div
						onClick={onSubmit}
						// to={`/apply/owners/resource/e/${entity_id}/g/${group_id}`}
						className="flex flex-col bg-[#56CF9E] py-3 px-4 rounded-full text-white w-1/2 items-center cursor-pointer"
					>
						Continue to pre-qualify
					</div>
				</div>
			</div>
		</div>
	);
}
