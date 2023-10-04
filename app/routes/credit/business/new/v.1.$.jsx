import { useLocation, useSubmit } from "@remix-run/react";
import { Form as NewBusinessReportForm } from "~/components/credit/business/form";
import { use_form_store } from "~/components/credit/business/form";
import { from_validations, get_entity_id, get_group_id, validate_form, inspect, formData } from "~/utils/helpers";
import { lendflow_validator } from "../../helpers";
import { pipe } from "ramda";
import { get } from "shades";
import { get_session_entity_id } from "~/utils/auth.server";
import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";
import { map as rxmap, tap, filter as rxfilter, concatMap, take, delay } from "rxjs/operators";
import { from, of as rxof, Subject, lastValueFrom, catchError } from "rxjs";
import Entity from "~/api/client/Entity";
import { fold } from "~/utils/operators";
import axios from "axios";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

const business_report_img = "/images/business_report_screenshot.png";
import { CloudArrowUpIcon, LockClosedIcon, ServerIcon, CheckCircleIcon } from "@heroicons/react/20/solid";

let route_logger = `credit.business.new`;
let action_start = "credit.business.new.action.start";
let action_response = "action.response";

const subject = new Subject();

const action_subject = subject.pipe(
	rxfilter((event) => event.id === action_start),
	concatMap(({ args: { request } }) => {
		console.log(`${route_logger}.action_subject`);
		// let application_id = "75e6f552-7f56-4025-8c1d-7dc449d708fa";
		let form = from(formData(request)).pipe(rxmap((form) => form.payload));

		let business_match_request = (form) => {
			return LendflowExternal.new_application_request_creator({
				...form,
				requested_products: ["experian_business_match"],
			});
		};

		let save_application_request = async (application_id) => {
			let entity_id = await get_session_entity_id(request);
			let entity = new Entity(entity_id);
			let entity_response = entity.group_id.entity_id.plan_id.fold;
			let payload = form.pipe(
				concatMap((form) =>
					entity_response.pipe(
						rxmap((response) => ({
							type: "business_credit_report",
							id: application_id,
							application_id,
							form,
							...response,
						}))
					)
				)
			);
			let response = await lastValueFrom(payload);
			return response;
		};

		let response = form.pipe(
			rxmap(business_match_request),
			concatMap((request) => from(axios(request))),
			rxmap(pipe(get("data", "data", "application_id"))),
			concatMap((app_id) => from(save_application_request(app_id))),
			concatMap((data) => from(LendflowInternal.save_application(data))),
			rxmap(pipe(get("application_id"))),
			rxmap((application_id) => ({ application_id })),
			delay(10000),
			tap(() => console.log(`${route_logger}.action_subject.value`)),
			tap(inspect)
		);

		return response;
	})
);

export const action = async ({ request }) => {
	console.log(route_logger);

	const on_success = async (value) => {
		console.log(`${route_logger}.action.success`);
		let { origin } = new URL(request.url);

		let entity_id = await get_session_entity_id(request);
		let group_id = get_group_id(request.url);
		let redirect_url = `${origin}/credit/business/match/resource/e/${entity_id}/g/${group_id}?application_id=${value.application_id}`;

		subject.next({
			id: action_response,
			next: () => Response.redirect(redirect_url),
		});
	};

	const on_error = (error) => {
		console.log(`${route_logger}.action.error`);
		console.log(error);

		subject.next({
			id: action_response,
			next: () => json_response(error),
		});
	};

	const on_complete = (value) => value.id === action_response;
	action_subject.pipe(fold(on_success, on_error)).subscribe();
	subject.next({ id: action_start, args: { request } });
	let response = await lastValueFrom(subject.pipe(rxfilter(on_complete), take(1)));
	return response.next();
};

const features = [
	{
		name: "Push to deploy.",
		description:
			"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
		icon: CheckCircleIcon,
	},
	{
		name: "SSL certificates.",
		description: "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
		icon: CheckCircleIcon,
	},
	{
		name: "Database backups.",
		description: "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.",
		icon: CheckCircleIcon,
	},
];

const Features = () => {
	return (
		<div className="overflow-hidden bg-white">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
					<div className="lg:pr-8 lg:pt-4">
						<div className="lg:max-w-lg">
							<h2 className="text-base font-semibold leading-7 text-green-400">Credit report</h2>
							<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Business</p>
							<p className="mt-6 text-lg leading-8 text-gray-600">
								Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis
								suscipit eaque, iste dolor cupiditate blanditiis ratione.
							</p>
							<dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
								{features.map((feature) => (
									<div key={feature.name} className="relative pl-9">
										<dt className="inline font-semibold text-gray-900">
											<feature.icon
												className="absolute left-1 top-1 h-5 w-5 text-green-400"
												aria-hidden="true"
											/>
											{feature.name}
										</dt>{" "}
										<dd className="inline">{feature.description}</dd>
									</div>
								))}
							</dl>
							<div className="flex flex-col w-full px-3 py-2 bg-green-400 rounded text-white items-center my-5 cursor-pointer">
								Get started
							</div>
						</div>
					</div>
					<div className="flex flex-col w-full h-full justify-center">
						<img
							src={business_report_img}
							alt="Product screenshot"
							className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
							width={2432}
							height={1442}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

const WelcomeModal = () => {
	const [open, setOpen] = useState(true);

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={setOpen}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white py-4 text-left shadow-xl transition-all">
								<Features />
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default function View() {
	let { pathname } = useLocation();
	let form = use_form_store((state) => state.form);
	let set_state = use_form_store((state) => state.set_state);
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	const submit = useSubmit();

	const onSubmit = () => {
		let { business_start_date, ...rest } = form;
		let business_start_date_string = `${business_start_date.year}-${business_start_date.month}-${business_start_date.day}`;

		let payload = {
			business_start_date: business_start_date_string,
			...rest,
		};

		from_validations(validate_form(lendflow_validator, payload))
			.pipe(
				catchError((errors) => {
					set_state(["errors"], errors);
					return rxof({ errors });
				}),
				rxfilter(({ errors }) => !errors)
			)
			.subscribe(() => {
				let post_url = `/credit/business/new/v/1/resource/e/${entity_id}/g/${group_id}`;
				submit({ payload: JSON.stringify(payload) }, { method: "post", action: post_url });
			});
	};

	return (
		<div className="flex flex-col w-full h-full overflow-y-scroll scrollbar-none items-center justify-center">
			{/* <WelcomeModal /> */}
			<div className="flex flex-col w-[900px]">
				<div className="flex flex-col border rounded">
					<div className="flex flex-col w-full border-b py-3 px-5">
						<div className="font-bold tracking-tight text-gray-900">Business credit report</div>
					</div>
					<NewBusinessReportForm on_submit={onSubmit} />
				</div>
			</div>
		</div>
	);
}
