// import { defaultTo, head, pipe } from "ramda";
import { Lendflow } from "~/data/lendflow";
// import { Array } from "~/data/array";
// import { get_collection } from "~/utils/firebase";
import { get_file_id, get_group_id, inspect } from "~/utils/helpers";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { get_collection, get_doc, set_doc, update_doc } from "~/utils/firebase";
import { head, pipe, identity, curry, defaultTo, pick, hasPath } from "ramda";
import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";
import { get } from "shades";
import { map as rxmap, filter as rxfilter, concatMap, tap, take, catchError, withLatestFrom } from "rxjs/operators";
import { from, lastValueFrom, forkJoin, Subject, of as rxof, iif, throwError, merge } from "rxjs";
import { fold, ifEmpty, ifFalse } from "~/utils/operators";
import { is_authorized_f } from "~/api/auth";
import { ArrayExternal } from "~/api/external/Array";
import { ArrayInternal } from "~/api/internal/Array";

const log_route = `credit.report.api.scores`;

const subject = new Subject();

const credit_scores = subject.pipe(
	rxfilter((message) => message.id == "get_credit_scores"),
	concatMap(({ args: { request } }) => {
		let url = new URL(request.url);

		let personal_credit_report_queries = (group_id) => [
			{
				param: "group_id",
				predicate: "==",
				value: group_id,
			},
			{
				param: "type",
				predicate: "==",
				value: "personal_credit_report",
			},
		];

		let get_personal_credit_report = (group_id) =>
			from(
				get_collection({
					path: ["credit_reports"],
					queries: personal_credit_report_queries(group_id),
				})
			);

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

		let get_business_credit_report = (group_id) =>
			from(
				get_collection({
					path: ["credit_reports"],
					queries: business_credit_report_queries(group_id),
				})
			);

		let group_id = rxof(get_group_id(url.pathname));

		let personal_report_response = group_id.pipe(
			concatMap(get_personal_credit_report),
			concatMap(ifEmpty(throwError(() => undefined))),
			catchError((error) => {
				console.log(`${log_route}.empty_personal_report.error`);
				if (error == undefined) {
					return rxof(undefined);
				} else {
					return throwError(() => error);
				}
			})
		);

		let personal_report = personal_report_response.pipe(
			rxmap(pipe(head, get("data"))),
			rxmap((array_response) => new ArrayInternal(array_response))
		);

		let empty_personal_report = personal_report_response.pipe(
			rxfilter((value) => value === undefined),
			rxmap(() => ({
				experian_score: () => 0,
				equifax_score: () => 0,
				transunion_score: () => 0,
				is_empty: () => true,
			}))
		);

		let $personal_report = merge(personal_report, empty_personal_report);

		let application_id = group_id.pipe(
			concatMap(get_business_credit_report),
			concatMap(ifEmpty(throwError(() => undefined))),
			rxmap(pipe(head, get("application_id"))),
			catchError((error) => {
				if (error == undefined) {
					return rxof(undefined);
				} else {
					return throwError(() => error);
				}
			})
		);

		let business_report = application_id.pipe(
			rxfilter((value) => value !== undefined),
			concatMap(LendflowExternal.get_lendflow_report),
			rxmap(pipe(get("data", "data"))),
			rxmap((report) => new LendflowInternal(report))
		);

		let empty_business_report = application_id.pipe(
			rxfilter((value) => value === undefined),
			rxmap(() => ({
				dnb_score: () => 0,
				experian_score: () => 0,
				is_empty: () => true,
			}))
		);

		let $business_report = merge(business_report, empty_business_report);

		let experian_personal_score = $personal_report.pipe(rxmap((report) => report.experian_score()));

		let equifax_personal_score = $personal_report.pipe(rxmap((report) => report.equifax_score()));

		let transunion_personal_score = $personal_report.pipe(rxmap((report) => report.transunion_score()));

		let dnb_business_score = $business_report.pipe(rxmap((report) => report.dnb_score()));

		let experian_business_score = $business_report.pipe(rxmap((report) => report.experian_score()));

		let business_report_is_empty = $business_report.pipe(
			rxmap((report) => report.is_empty()),
			catchError((error) => rxof(false))
		);

		return forkJoin({
			dnb_business_score,
			experian_business_score,
			experian_personal_score,
			equifax_personal_score,
			transunion_personal_score,
			business_report_is_empty,
		}).pipe(
			tap((value) => {
				console.log(`${log_route}.tap`);
				console.log(value);
			})
		);
	})
);

export const loader = async ({ request }) => {
	const on_success = async (response) => {
		console.log(`${log_route}.success`);

		subject.next({
			id: "credit_score_response",
			next: () => response,
		});
	};

	const on_error = (error) => {
		console.log(`${log_route}.error`);
		console.log(error);

		subject.next({
			id: "credit_score_response",
			next: () => error ?? null,
		});
	};

	const on_complete = (value) => value.id === "credit_score_response";

	credit_scores.pipe(fold(on_success, on_error)).subscribe();

	subject.next({ id: "get_credit_scores", args: { request } });

	let response = await lastValueFrom(subject.pipe(rxfilter(on_complete), take(1)));

	return response.next();

	// let url = new URL(request.url);
	// let group_id = get_group_id(url.pathname);

	// let personal_credit_report_queries = [
	// 	{
	// 		param: "group_id",
	// 		predicate: "==",
	// 		value: group_id,
	// 	},
	// 	{
	// 		param: "type",
	// 		predicate: "==",
	// 		value: "personal_credit_report",
	// 	},
	// ];

	// let personal_credit_report_response = await get_collection({
	// 	path: ["credit_reports"],
	// 	queries: personal_credit_report_queries,
	// });

	// let personal_credit_report = pipe(
	// 	head,
	// 	defaultTo({})
	// )(personal_credit_report_response);

	// let { data: personal = undefined } = personal_credit_report;

	// let personal_credit_report_payload = {
	// 	experian_personal_score: personal ? Array.experian.score(personal) : 0,
	// 	equifax_personal_score: personal ? Array.equifax.score(personal) : 0,
	// 	transunion_personal_score: personal
	// 		? Array.transunion.score(personal)
	// 		: 0,
	// };

	// let business_credit_report_queries = [
	// 	{
	// 		param: "group_id",
	// 		predicate: "==",
	// 		value: group_id,
	// 	},
	// 	{
	// 		param: "type",
	// 		predicate: "==",
	// 		value: "business_credit_report",
	// 	},
	// ];

	// let business_credit_report_response = await get_collection({
	// 	path: ["credit_reports"],
	// 	queries: business_credit_report_queries,
	// });

	// let business_credit_report = pipe(
	// 	head,
	// 	defaultTo({})
	// )(business_credit_report_response);

	// let business_credit_report_payload = {
	// 	experian_business_score: business_credit_report
	// 		? Lendflow.experian.score(business_credit_report)
	// 		: 0,
	// 	dnb_business_score: business_credit_report
	// 		? Lendflow.dnb.score(business_credit_report)
	// 		: 0,
	// };

	let payload = {
		experian_personal_score: 0,
		equifax_personal_score: 0,
		transunion_personal_score: 0,
		experian_business_score: 0,
		dnb_business_score: 0,
	};

	return payload;
};
