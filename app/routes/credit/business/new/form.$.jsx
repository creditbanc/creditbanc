import { useLocation, useSubmit } from "@remix-run/react";
import { Form as NewBusinessReportForm } from "~/components/credit/business/form";
import { use_form_store } from "~/components/credit/business/form";
import {
	from_validations,
	get_entity_id,
	get_group_id,
	validate_form,
	inspect,
	formData,
	json_response,
} from "~/utils/helpers";
import { lendflow_validator } from "../../helpers";
import { keys, pipe } from "ramda";
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
import { json } from "@remix-run/node";

let route_logger = `credit.business.new`;
let action_start = "credit.business.new.action.start";
let action_response = "action.response";

const subject = new Subject();

const action_subject = subject.pipe(
	rxfilter((event) => event.id === action_start),
	concatMap(({ args: { payload, request, entity_id } }) => {
		console.log(`${route_logger}.action_subject`);

		let form = rxof(payload);

		let business_match_request = (form) => {
			return LendflowExternal.new_application_request_creator({
				...form,
				requested_products: ["experian_business_match"],
			});
		};

		let save_application_request = async (application_id) => {
			// let entity_id = await get_session_entity_id(request);
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
			tap(() => console.log(`${route_logger}.business_match_request.value`)),
			tap(inspect),
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
	console.log("jdksflajflaksjdlakj");
	let url = new URL(request.url);
	// console.log(keys(request));
	let form = await formData(request);
	let { response_type = undefined, payload } = form;

	let entity_id = get_entity_id(url.pathname);

	console.log(payload);
	// console.log("entity_id");
	// console.log(get_entity_id(url.pathname));
	// return { test: "hi" };

	const on_success = async (value) => {
		console.log(`${route_logger}.action.success`);
		let { origin } = new URL(request.url);

		// let entity_id = await get_session_entity_id(request);
		let group_id = get_group_id(request.url);
		let redirect_url = `${origin}/credit/business/match/resource/e/${entity_id}/g/${group_id}?application_id=${value.application_id}`;

		subject.next({
			id: action_response,
			next: () => (response_type == "json" ? redirect_url : Response.redirect(redirect_url)),
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
	subject.next({ id: action_start, args: { payload, request, entity_id } });
	let response = await lastValueFrom(subject.pipe(rxfilter(on_complete), take(1)));
	return response.next();
};
