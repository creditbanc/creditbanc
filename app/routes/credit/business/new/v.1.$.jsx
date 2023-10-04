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
		<div className="flex flex-col w-full overflow-y-scroll scrollbar-none items-center">
			<div className="flex flex-col w-[900px]">
				<div className="bg-white my-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
							Business Credit Report
						</h2>
					</div>
				</div>
				<NewBusinessReportForm on_submit={onSubmit} />
			</div>
		</div>
	);
}
