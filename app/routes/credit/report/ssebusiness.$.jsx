import { get_group_id, inspect, get_request_cookies } from "~/utils/helpers";
import { get, mod } from "shades";
import { fromPairs, head, map, pipe, split, trim } from "ramda";
import { Lendflow } from "~/data/lendflow";
import { get_collection, get_doc, set_doc } from "~/utils/firebase";
import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";
import { map as rxmap, filter as rxfilter, concatMap, tap, take, catchError } from "rxjs/operators";
import { from, lastValueFrom, forkJoin, Subject, of as rxof, iif, throwError, merge, ReplaySubject } from "rxjs";
import { fold, ifEmpty, ifFalse } from "~/utils/operators";
import { is_authorized_f } from "~/api/auth";
import { get_session_entity_id } from "~/utils/auth.server";
import { json } from "@remix-run/node";
import { eventStream } from "remix-utils";

const log_route = `credit.report.ssebusiness`;
const start_action = "ssebusiness.action";

const subject = new ReplaySubject(1);

const loader_response = subject.pipe(
	rxfilter((message) => message.id == start_action),
	concatMap(({ args: { request } }) => {
		console.log(`${log_route}.action_response.headers`);
		let cookies = get_request_cookies(request);
		console.log(cookies);

		let url = new URL(request.url);

		let business_credit_report_queries = (group_id) => [
			{
				param: "group_id",
				predicate: "==",
				value: group_id,
			},
			{
				param: "type",
				predicate: "==",
				value: "business_credit_report",
			},
		];

		let get_credit_report = (group_id) =>
			from(
				get_collection({
					path: ["credit_reports"],
					queries: business_credit_report_queries(group_id),
				})
			);

		let group_id = rxof(get_group_id(url.pathname));
		let entity_id = from(get_session_entity_id(request));
		let entity = entity_id.pipe(concatMap((entity_id) => from(get_doc(["entity", entity_id]))));

		let plan_id = entity.pipe(rxmap(get("plan_id")));

		let entity_group_id = forkJoin({
			entity_id,
			group_id,
		});

		let is_authorized = entity_group_id.pipe(
			concatMap(({ entity_id, group_id }) => is_authorized_f(entity_id, group_id, "credit", "read")),
			concatMap(ifFalse(throwError(() => undefined)))
		);

		let db_report = group_id.pipe(concatMap(get_credit_report), rxmap(head));

		let report_id = db_report.pipe(rxmap(pipe(get("id"))));

		let application_id = db_report.pipe(
			concatMap(ifEmpty(throwError(() => undefined))),
			rxmap(pipe(get("application_id"))),
			catchError((error) => {
				if (error == undefined) {
					return rxof(undefined);
				} else {
					return throwError(() => error);
				}
			})
		);

		let report = application_id.pipe(
			rxfilter((value) => value !== undefined),
			concatMap(LendflowExternal.get_lendflow_report),
			rxmap(pipe(get("data", "data"))),
			rxmap((report) => new LendflowInternal(report))
		);

		let empty_report = application_id.pipe(
			rxfilter((value) => value === undefined),
			rxmap(() => ({
				business_info: () => ({}),
			}))
		);

		let $report = merge(report, empty_report);

		let business_info = $report.pipe(rxmap((report) => report.business_info()));

		// return rxof({});
		// return business_info;

		return from(business_info).pipe(
			// rxmap((value) =>
			// 	pipe(mod("business_info", "name")((name) => "test"))(value)
			// ),
			tap((value) => {
				console.log("credit.report.business.api.company.tap");
				console.log(value);
			})
		);
	})
);

export const action = async ({ request }) => {
	console.log(`${log_route}.action`);
	subject.next({ id: start_action, args: { request } });
	let response = await lastValueFrom(loader_response.pipe(take(1)));
	return json({ ...response });
};
