import axios from "axios";
import { head, pipe } from "ramda";
import { get } from "shades";
import { get_group_id, formData, json_response, validate_form, from_validations } from "~/utils/helpers";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";
import { get_collection } from "~/utils/firebase";
import { map as rxmap, tap, filter as rxfilter, concatMap, take, delay } from "rxjs/operators";
import { from, of as rxof, Subject, zip, lastValueFrom, throwError, forkJoin } from "rxjs";
import Entity from "~/api/internal/entity";
import { fold } from "~/utils/operators";

let route_logger = `credit.business.match`;
let action_start = "credit.business.match.start";
let action_response = "action_response";

const subject = new Subject();

const action_subject = subject.pipe(
	rxfilter((event) => event.id === action_start),
	concatMap(({ args: { request } }) => {
		let $formData = from(formData(request)).pipe(rxmap((form) => form.payload));

		return rxof({ test: "hi" });

		// let $entity_id = from(get_session_entity_id(request)).pipe(rxmap((entity_id) => (entity_id ? entity_id : "")));

		// let $plan_id = $entity_id.pipe(
		// 	rxmap((entity_id) => new Entity(entity_id)),
		// 	concatMap((entity) => entity.plan_id())
		// );

		// let $group_id = rxof(get_group_id(request.url)).pipe(
		// 	concatMap((value) => {
		// 		if (value == undefined) {
		// 			return from($entity_id).pipe(
		// 				concatMap((entity_id) =>
		// 					from(
		// 						get_collection({
		// 							path: ["role_configs"],
		// 							queries: [
		// 								{
		// 									param: "entity_id",
		// 									predicate: "==",
		// 									value: entity_id,
		// 								},
		// 							],
		// 						})
		// 					)
		// 				),
		// 				rxmap(pipe(head, get("group_id")))
		// 			);
		// 		} else {
		// 			return rxof(value);
		// 		}
		// 	})
		// );

		// return from($formData).pipe(
		// 	concatMap((form) => from_validations(validate_form(lendflow_validator, form))),
		// 	concatMap(() => zip($plan_id, $formData)),
		// 	rxmap(([plan_id, form]) =>
		// 		LendflowExternal.new_application_request_creator({
		// 			...form,
		// 			requested_products: LendflowExternal.plan_request_products(plan_id),
		// 		})
		// 	),
		// 	concatMap((request) => from(axios(request))),
		// 	rxmap(pipe(get("data", "data", "application_id"))),
		// 	concatMap((application_id) => zip($group_id, $entity_id, $plan_id, rxof(application_id))),
		// 	concatMap(([group_id, entity_id, plan_id, application_id]) =>
		// 		LendflowInternal.save_application({
		// 			group_id,
		// 			entity_id,
		// 			plan_id,
		// 			application_id,
		// 			type: "business_credit_report",
		// 			id: application_id,
		// 		})
		// 	),
		// 	delay(10000)
		// );
	})
);

export const action = async ({ request }) => {
	console.log(route_logger);

	const on_success = async () => {
		console.log(`${route_logger}.action.success`);
		let { origin } = new URL(request.url);

		let entity_id = await get_session_entity_id(request);
		let group_id = get_group_id(request.url);

		let redirect_url = `${origin}/credit/report/business/experian/overview/resource/e/${entity_id}/g/${group_id}`;

		subject.next({
			id: "new_application_response",
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
