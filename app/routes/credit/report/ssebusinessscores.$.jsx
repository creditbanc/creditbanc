import { get_group_id, inspect } from "~/utils/helpers";
import { get, mod } from "shades";
import { head, pick, pipe } from "ramda";
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
import { ArrayExternal } from "~/api/external/Array";
import { ArrayInternal } from "~/api/internal/Array";
import { update_doc } from "~/utils/firebase";

const log_route = `credit.report.ssebusinessscores`;
const start_action = "ssebusinessscores.action";

const actionsubject = new ReplaySubject(1);

const loader_response = actionsubject.pipe(
	rxfilter((message) => message.id == start_action),
	concatMap(({ args: { request } }) => {
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

		let db_report = group_id.pipe(concatMap(get_credit_report), rxmap(head));

		let report_id = db_report.pipe(rxmap(pipe(get("id"))));

		let application_id = db_report.pipe(
			concatMap(ifEmpty(throwError(() => undefined))),
			rxmap(pipe(get("application_id"))),
			catchError((error) => {
				console.log(`${log_route}.error.1`);
				console.log(error);
				return rxof(undefined);
				if (error == undefined) {
					return rxof(undefined);
				} else {
					return throwError(() => error);
				}
			})
		);

		let report = application_id.pipe(
			rxfilter((value) => value !== undefined),
			tap((value) => {
				console.log(`${log_route}.tap.1`);
				console.log(value);
			}),
			concatMap(LendflowExternal.get_lendflow_report),
			rxmap(pipe(get("data", "data"))),
			// concatMap((report) => {
			// 	return application_id.pipe(
			// 		concatMap((application_id) => {
			// 			console.log("ssebusinesssocres.application_id");
			// 			console.log(application_id);
			// 			return from(update_doc(["credit_reports", application_id], { data: report }));
			// 		}),
			// 		rxmap((value) => report)
			// 	);
			// }),

			rxmap((report) => new LendflowInternal(report))
		);

		let empty_business_report = application_id.pipe(
			rxfilter((value) => value === undefined),
			tap((value) => {
				console.log(`${log_route}.tap.2`);
				console.log(value);
			}),
			rxmap(() => ({
				dnb_score: () => 0,
				experian_score: () => 0,
				is_empty: () => true,
			}))
		);

		let $business_report = merge(report, empty_business_report);
		let dnb_business_score = $business_report.pipe(rxmap((report) => report.dnb_score()));
		let experian_business_score = $business_report.pipe(rxmap((report) => report.experian_score()));

		let business_report_is_empty = $business_report.pipe(
			rxmap((report) => report.is_empty()),
			catchError((error) => rxof(false))
		);

		return forkJoin({
			dnb_business_score,
			experian_business_score,
			business_report_is_empty,
		}).pipe(
			tap((value) => {
				console.log(`${log_route}.tap`);
				console.log(value);
			})
		);
	})
);

export const action = async ({ request }) => {
	console.log(`${log_route}.action`);
	actionsubject.next({ id: start_action, args: { request } });
	let response = await lastValueFrom(loader_response.pipe(take(1)));
	return json({ ...response });
};
