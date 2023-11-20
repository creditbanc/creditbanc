import { classNames, form_params, get, get_entity_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { pipe, map, head } from "ramda";
import useStore from "./store";
import { from, lastValueFrom, map as rxmap } from "rxjs";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { Link, useLocation, useSubmit } from "@remix-run/react";
import { set_doc, update_doc } from "~/utils/firebase";
import { redirect } from "@remix-run/node";
import { filter } from "shades";
import { navigation } from "./navigation";

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

	let { timeline } = params;
	let payload = { timeline: JSON.parse(timeline) };

	let response = from(update_doc(["application", entity_id], payload)).pipe(rxmap(() => ({ entity_id, group_id })));

	await lastValueFrom(response);

	let next = pipe(filter({ id: "financing_needs" }), head, get("next"))(navigation);
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

const timelines = [
	{
		name: "I have a strict timeline: 2 weeks or less",
		amount: 14,
		type: "days",
	},
	{
		name: "I’m flexible: about a month works for me",
		amount: 30,
		type: "days",
	},
	{
		name: "I don’t have a specific time in mind",
		amount: Infinity,
		type: "days",
	},
];

const TimelineOptions = () => {
	const [selected, setSelected] = useState(timelines[0]);
	const { set_props } = useStore();

	return (
		<RadioGroup value={selected} onChange={setSelected}>
			<RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
			<div className="space-y-4">
				{pipe(
					mapIndexed((timeline, index) => (
						<RadioGroup.Option
							key={index}
							value={timeline}
							className={({ active }) =>
								classNames(
									active ? "border-blue-600 ring-2 ring-blue-600" : "border-gray-300",
									"relative block cursor-pointer rounded-full border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between"
								)
							}
							onClick={() => set_props({ timeline: { amount: timeline.amount, type: timeline.type } })}
						>
							{({ active, checked }) => (
								<>
									<div className="flex items-center w-full">
										<div className="flex flex-col text-sm items-center w-full">
											<RadioGroup.Label
												as="span"
												className="flex flex-col items-center text-align center w-full font-medium text-gray-900"
											>
												{timeline.name}
											</RadioGroup.Label>
										</div>
									</div>

									<div
										className={classNames(
											active ? "border" : "border-2",
											checked ? "border-blue-600" : "border-transparent",
											"pointer-events-none absolute -inset-px rounded-full"
										)}
										aria-hidden="true"
									/>
								</>
							)}
						</RadioGroup.Option>
					))
				)(timelines)}
			</div>
		</RadioGroup>
	);
};

export default function Container() {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	const submit = useSubmit();
	let { timeline } = useStore((state) => state);

	let back = pipe(filter({ id: "financing_needs" }), head, get("back"))(navigation);

	const onSubmit = () => {
		console.log("onSubmit");
		let payload = { timeline: JSON.stringify(timeline) };

		// console.log("payload");
		// console.log(payload);

		submit(payload, {
			action: `/apply/financing_needs/resource/e/${entity_id}/g/${group_id}`,
			method: "post",
		});
	};

	return (
		<div className="flex flex-col items-center w-full h-full overflow-y-scroll pb-10">
			<div className="flex flex-col w-full">
				<Progress />
			</div>
			<div className="flex flex-col justify-center h-4/5">
				<div className="flex flex-col my-4">
					<SectionHeading
						headline={<div>First, how soon do you need funding?</div>}
						subheadline={
							<div className="flex flex-row gap-x-2 justify-center">
								<div>This helps us find the best loan for your needs.</div>
								<div className="font-semibold">Learn more ›</div>
							</div>
						}
					/>
				</div>
				<div className="flex flex-col w-full">
					<TimelineOptions />
				</div>
				<div className="flex flex-row w-full items-center gap-y-4 my-5 w=[450px] gap-x-3">
					<Link
						to={`/apply/lp/resource/e/${entity_id}/g/${group_id}`}
						className="flex flex-col py-3 px-4 rounded-full text-blue-600 w-1/2 items-center cursor-pointer border-2 border-blue-600"
					>
						Back
					</Link>
					<div
						onClick={onSubmit}
						// to={`/apply/inception_date/resource/e/${entity_id}/g/${group_id}`}
						className="flex flex-col bg-blue-600 py-3 px-4 rounded-full text-white w-[450px] items-center cursor-pointer"
					>
						Continue to pre-qualify
					</div>
				</div>
			</div>
		</div>
	);
}
