import axios from "axios";
import { head, pipe } from "ramda";
import { get } from "shades";
import {
	get_group_id,
	formData,
	json_response,
	validate_form,
	from_validations,
	inspect,
	search_params,
} from "~/utils/helpers";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";
import { get_collection } from "~/utils/firebase";
import { map as rxmap, tap, filter as rxfilter, concatMap, take, delay } from "rxjs/operators";
import { from, of as rxof, Subject, zip, lastValueFrom, throwError, forkJoin } from "rxjs";
import Entity from "~/api/internal/entity";
import { fold } from "~/utils/operators";
import { lendflow_validator } from "../../helpers";
import { json } from "@remix-run/node";

let route_logger = `credit.business.match`;
let action_start = "credit.business.match.action.start";
let action_response = "action.response";
let loader_start = "credit.business.match.loader.start";
let loader_response = "loader.response";

const subject = new Subject();

// const action_subject = subject.pipe(
// 	rxfilter((event) => event.id === action_start),
// 	concatMap(({ args: { request } }) => {
// 		console.log(`${route_logger}.action_subject`);
// 		let $formData = from(formData(request)).pipe(rxmap((form) => form.payload));

// 		// return rxof({ test: "hi" });

// 		let value_or_empty = (value) => (value ? value : "");

// 		let $entity_id = from(get_session_entity_id(request)).pipe(rxmap(value_or_empty));

// 		let $plan_id = $entity_id.pipe(
// 			rxmap((entity_id) => new Entity(entity_id)),
// 			concatMap((entity) => entity.plan_id())
// 		);

// 		let $group_id = rxof(get_group_id(request.url)).pipe(
// 			concatMap((value) => {
// 				if (value == undefined) {
// 					return from($entity_id).pipe(
// 						concatMap((entity_id) =>
// 							from(
// 								get_collection({
// 									path: ["role_configs"],
// 									queries: [
// 										{
// 											param: "entity_id",
// 											predicate: "==",
// 											value: entity_id,
// 										},
// 									],
// 								})
// 							)
// 						),
// 						rxmap(pipe(head, get("group_id")))
// 					);
// 				} else {
// 					return rxof(value);
// 				}
// 			})
// 		);

// 		return from($formData).pipe(
// 			concatMap((form) => from_validations(validate_form(lendflow_validator, form))),
// 			concatMap(() => zip($plan_id, $formData)),
// 			rxmap(([plan_id, form]) =>
// 				LendflowExternal.new_application_request_creator({
// 					...form,
// 					requested_products: ["experian_business_match"],
// 				})
// 			),
// 			concatMap((request) => from(axios(request))),
// 			rxmap(pipe(get("data", "data", "application_id"))),
// 			tap(() => console.log(`${route_logger}.action_subject.value`)),
// 			tap(inspect),
// 			concatMap((application_id) => zip($group_id, $entity_id, $plan_id, rxof(application_id))),
// 			concatMap(([group_id, entity_id, plan_id, application_id]) =>
// 				LendflowInternal.save_application({
// 					group_id,
// 					entity_id,
// 					plan_id,
// 					application_id,
// 					type: "business_credit_report",
// 					id: application_id,
// 				})
// 			),
// 			// delay(10000),
// 			tap(() => console.log(`${route_logger}.action_subject.value`)),
// 			tap(inspect)
// 		);
// 	})
// );

const loader_subject = subject.pipe(
	rxfilter((event) => event.id === loader_start),
	concatMap(({ args: { request } }) => {
		console.log(`${route_logger}.loader_subject`);
		let { application_id } = search_params(request);
		console.log(application_id);

		let application = from(LendflowExternal.get_lendflow_report(application_id)).pipe(
			rxmap(get("data", "data")),
			rxmap((application) => new LendflowInternal(application)),
			rxmap((application) => ({ application_id, business_match: application.business_match() }))
		);

		// return rxof({});

		return application.pipe(
			tap(() => console.log(`${route_logger}.get_lendflow_report`)),
			tap(inspect)
		);

		// let value_or_empty = (value) => (value ? value : "");

		// let $entity_id = from(get_session_entity_id(request)).pipe(rxmap(value_or_empty));

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
		// 			requested_products: ["experian_business_match"],
		// 		})
		// 	),
		// 	concatMap((request) => from(axios(request))),
		// 	rxmap(pipe(get("data", "data", "application_id"))),
		// 	tap(() => console.log(`${route_logger}.action_subject.value`)),
		// 	tap(inspect),
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
		// 	// delay(10000),
		// 	tap(() => console.log(`${route_logger}.action_subject.value`)),
		// 	tap(inspect)
		// );
	})
);

// export const action = async ({ request }) => {
// 	console.log(route_logger);

// 	const on_success = async (value) => {
// 		console.log(`${route_logger}.action.success`);
// 		let { origin } = new URL(request.url);

// 		let entity_id = await get_session_entity_id(request);
// 		let group_id = get_group_id(request.url);

// 		let redirect_url = `${origin}/credit/report/business/experian/overview/resource/e/${entity_id}/g/${group_id}`;

// 		subject.next({
// 			id: action_response,
// 			next: () => value,
// 		});

// 		// subject.next({
// 		// 	id: "new_application_response",
// 		// 	next: () => Response.redirect(redirect_url),
// 		// });
// 	};

// 	const on_error = (error) => {
// 		console.log(`${route_logger}.action.error`);
// 		console.log(error);

// 		subject.next({
// 			id: action_response,
// 			next: () => json_response(error),
// 		});
// 	};

// 	const on_complete = (value) => value.id === action_response;

// 	action_subject.pipe(fold(on_success, on_error)).subscribe();
// 	subject.next({ id: action_start, args: { request } });
// 	let response = await lastValueFrom(subject.pipe(rxfilter(on_complete), take(1)));

// 	return response.next();
// };

export const loader = async ({ request }) => {
	console.log(route_logger);

	const on_success = async (value) => {
		console.log(`${route_logger}.loader.success`);
		let { origin } = new URL(request.url);

		let entity_id = await get_session_entity_id(request);
		let group_id = get_group_id(request.url);

		let redirect_url = `${origin}/credit/report/business/experian/overview/resource/e/${entity_id}/g/${group_id}`;

		subject.next({
			id: loader_response,
			next: () => value,
		});

		// subject.next({
		// 	id: "new_application_response",
		// 	next: () => Response.redirect(redirect_url),
		// });
	};

	const on_error = (error) => {
		console.log(`${route_logger}.loader.error`);
		console.log(error);

		subject.next({
			id: loader_response,
			next: () => json_response(error),
		});
	};

	const on_complete = (value) => value.id === loader_response;

	loader_subject.pipe(fold(on_success, on_error)).subscribe();
	subject.next({ id: loader_start, args: { request } });

	// return { test: "hi" };

	let response = await lastValueFrom(subject.pipe(rxfilter(on_complete), take(1)));

	return response.next();
};
