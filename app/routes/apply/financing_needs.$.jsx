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

	let step = pipe(filter({ id: "financing_needs" }), head, get("step"))(navigation);
	let { timeline } = params;
	let payload = { timeline: JSON.parse(timeline), step };

	let response = from(set_doc(["application", entity_id], payload, true)).pipe(
		rxmap(() => ({ entity_id, group_id }))
	);

	await lastValueFrom(response);

	await update_onboarding({ entity_id, group_id, step });

	let next = pipe(filter({ id: "financing_needs" }), head, get("next"))(navigation);
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
									active ? "border-[#56CF9E] ring-2 ring--[#56CF9E]" : "border-gray-300",
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
											checked ? "border-[#56CF9E]" : "border-transparent",
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
				<ApplicationProgress />
			</div>
			<div className="flex flex-col justify-center h-4/5">
				<div className="flex flex-col my-4">
					<SectionHeading
						headline={<div>Thanks! Now, let's talk timeline. How soon do you need funding?</div>}
						subheadline={
							<div className="flex flex-row gap-x-2 justify-center">
								<div>This helps us find the best loan for your needs.</div>
							</div>
						}
					/>
				</div>
				<div className="flex flex-col w-full">
					<TimelineOptions />
				</div>
				<div className="flex flex-row w-full items-center gap-y-4 my-5 w=[450px] gap-x-3">
					<Link
						to={back({ entity_id, group_id })}
						className="flex flex-col py-3 px-4 rounded-full text-[#56CF9E] w-1/2 items-center cursor-pointer border-2 border-[#56CF9E]"
					>
						Back
					</Link>
					<div
						onClick={onSubmit}
						// to={`/apply/inception_date/resource/e/${entity_id}/g/${group_id}`}
						className="flex flex-col bg-[#56CF9E] py-3 px-4 rounded-full text-white w-[450px] items-center cursor-pointer"
					>
						Continue to pre-qualify
					</div>
				</div>
			</div>
		</div>
	);
}
