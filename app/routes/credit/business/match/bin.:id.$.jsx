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
	form_params,
	get_entity_id,
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

let route_logger = `credit.business.match.id`;
let action_start = "credit.business.match.id.action.start";
let action_response = "action.response";
let loader_start = "credit.business.match.id.loader.start";
let loader_response = "loader.response";

const subject = new Subject();

const action_subject = subject.pipe(
	rxfilter((event) => event.id === action_start),
	concatMap(({ args: { request, params } }) => {
		console.log(`${route_logger}.action_subject`);
		let url = new URL(request.url);
		let group_id = rxof(get_group_id(url.pathname));
		let entity_id = from(get_session_entity_id(request));
		let { id: bin_id } = params;
		console.log(bin_id);
		// console.log(entity_id);
		// console.log(group_id);

		let application = group_id.pipe(
			concatMap((group_id) => {
				return get_collection({
					path: ["credit_reports"],
					queries: [
						{ param: "group_id", predicate: "==", value: group_id },
						{ param: "type", predicate: "==", value: "business_credit_report" },
					],
					limit: [1],
				});
			}),
			rxmap(pipe(head))
		);

		return application.pipe(
			concatMap((application) =>
				from(LendflowExternal.update_application_bin(application.id, bin_id)).pipe(
					concatMap((bin_update_response) => {
						return from(LendflowExternal.update_lendflow_report(application.id));
					}),
					concatMap((application_response) =>
						from(LendflowExternal.get_lendflow_report(application.id)).pipe(rxmap(get("data", "data")))
					),
					concatMap((report) =>
						LendflowInternal.update_application({ application_id: application.id, ...report })
					),
					rxmap(() => ({ status: "success" }))
				)
			),
			tap(() => console.log(`${route_logger}.application_bin_update_response`)),
			tap(inspect)
		);
	})
);

// export const action = async ({ request, params }) => {
// 	console.log(route_logger);

// 	const on_success = async (value) => {
// 		console.log(`${route_logger}.action.success`);
// 		let { origin } = new URL(request.url);
// 		let entity_id = await get_session_entity_id(request);
// 		let group_id = get_group_id(request.url);

// 		let redirect_url = `${origin}/credit/report/business/experian/status/resource/e/${entity_id}/g/${group_id}`;

// 		subject.next({
// 			id: action_response,
// 			next: () => value,
// 		});

// 		// subject.next({
// 		// 	id: action_response,
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
// 	subject.next({ id: action_start, args: { request, params } });
// 	let response = await lastValueFrom(subject.pipe(rxfilter(on_complete), take(1)));

// 	return response.next();
// };
