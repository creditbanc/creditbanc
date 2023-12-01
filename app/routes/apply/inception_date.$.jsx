import { classNames, form_params, get, get_entity_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { pipe, map, head } from "ramda";
import { Fragment, useState } from "react";
import { Listbox, Transition, RadioGroup } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import useStore from "./store";
import { useLocation, useSubmit } from "@remix-run/react";
import { Link } from "react-router-dom";
import { redirect } from "@remix-run/node";
import { from, lastValueFrom, map as rxmap } from "rxjs";
import { update_doc } from "~/utils/firebase";
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

	let step = pipe(filter({ id: "inception_date" }), head, get("step"))(navigation);
	let { business_start_date } = params;
	let payload = { business_start_date: JSON.parse(business_start_date), step };

	let response = from(update_doc(["application", entity_id], payload)).pipe(rxmap(() => ({ entity_id, group_id })));

	await lastValueFrom(response);

	let next = pipe(filter({ id: "inception_date" }), head, get("next"))(navigation);
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

const TimeInBusiness = () => {
	const { set_path, business_start_date } = useStore();

	return (
		<div className="flex flex-row w-full gap-x-5 justify-center my-5">
			<div className="flex flex-col w-1/3">
				<label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 text-right">
					Month
				</label>
				<div className="mt-2">
					<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
						<input
							value={business_start_date?.month}
							type="text"
							id="month"
							className="block flex-1 border-0 bg-transparent py-1.5 pr-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-right"
							placeholder="01"
							onChange={(e) => set_path(["business_start_date", "month"], e.target.value)}
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-col w-1/3">
				<label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 text-right">
					Day
				</label>
				<div className="mt-2">
					<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
						<input
							value={business_start_date?.day}
							type="text"
							id="day"
							className="block flex-1 border-0 bg-transparent py-1.5 pr-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-right"
							placeholder="20"
							onChange={(e) => set_path(["business_start_date", "day"], e.target.value)}
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-col w-1/3">
				<label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 text-right">
					Year
				</label>
				<div className="mt-2">
					<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
						<input
							value={business_start_date?.year}
							type="text"
							id="year"
							className="block flex-1 border-0 bg-transparent py-1.5 pr-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 text-right"
							placeholder="1984"
							onChange={(e) => set_path(["business_start_date", "year"], e.target.value)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	const submit = useSubmit();
	let { business_start_date } = useStore((state) => state);

	let back = pipe(filter({ id: "inception_date" }), head, get("back"))(navigation);

	const onSubmit = () => {
		console.log("onSubmit");
		let payload = { business_start_date: JSON.stringify(business_start_date) };

		// console.log("payload");
		// console.log(payload);

		submit(payload, {
			action: `/apply/inception_date/resource/e/${entity_id}/g/${group_id}`,
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
						headline={<div>When was the business started?</div>}
						// subheadline={
						// 	<div className="flex flex-row gap-x-2">
						// 		<div>This helps us find the best loan for your needs.</div>
						// 		<div className="font-semibold">Learn more ›</div>
						// 	</div>
						// }
					/>
				</div>
				<div className="flex flex-col w-full">
					<TimeInBusiness />
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
						// to={`/apply/industry/resource/e/${entity_id}/g/${group_id}`}
						className="flex flex-col bg-[#56CF9E] py-3 px-4 rounded-full text-white w-1/2 items-center cursor-pointer"
					>
						Continue to pre-qualify
					</div>
				</div>
			</div>
		</div>
	);
}
