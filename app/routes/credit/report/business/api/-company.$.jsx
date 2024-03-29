import { get_group_id, inspect, get } from "~/utils/helpers";
import { always, apply, curry, equals, head, identity, ifElse, pipe, tryCatch } from "ramda";
import { Lendflow } from "~/data/lendflow";
import { get_collection, get_doc, set_doc } from "~/utils/firebase";
import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";
import { map as rxmap, filter as rxfilter, concatMap, tap, take, catchError } from "rxjs/operators";
import { from, lastValueFrom, forkJoin, Subject, of as rxof, iif, throwError, merge, ReplaySubject } from "rxjs";
import { fold, ifEmpty, ifFalse } from "~/utils/operators";
import { is_authorized_f } from "~/api/auth";
import { get_session_entity_id } from "~/utils/auth.server";
import { emitter } from "~/utils/emitter.server";
import BusinessReport from "~/api/client/BusinessReport";

const subject = new ReplaySubject(1);

const credit_report = subject.pipe(
	rxfilter((message) => message.id == "get_credit_report"),
	concatMap(({ args: { request } }) => {
		let url = new URL(request.url);
		let group_id = get_group_id(url.pathname);
		let business_report = new BusinessReport(group_id);
		return business_report.business_info.fold;

		// let business_credit_report_queries = (group_id) => [
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

		// let get_credit_report = (group_id) =>
		// 	from(
		// 		get_collection({
		// 			path: ["credit_reports"],
		// 			queries: business_credit_report_queries(group_id),
		// 		})
		// 	);

		// let group_id = rxof(_group_id);
		// let entity_id = from(get_session_entity_id(request));
		// let entity = entity_id.pipe(concatMap((entity_id) => from(get_doc(["entity", entity_id]))));
		// let plan_id = entity.pipe(rxmap(get("plan_id")));

		// let entity_group_id = forkJoin({
		// 	entity_id,
		// 	group_id,
		// });

		// let is_authorized = entity_group_id.pipe(
		// 	concatMap(({ entity_id, group_id }) => is_authorized_f(entity_id, group_id, "credit", "read")),
		// 	concatMap(ifFalse(throwError(() => undefined)))
		// );

		// let db_report = group_id.pipe(concatMap(get_credit_report), rxmap(head));

		// let report_id = db_report.pipe(rxmap(pipe(get("id"))));

		// let application_id = db_report.pipe(
		// 	rxmap(pipe(get("application_id"))),
		// 	tap(() => console.log("credit.report.business.api.company.application_id")),
		// 	tap(console.log),
		// 	concatMap(ifElse(equals(undefined), always(rxof(undefined)), throwError))
		// );

		// let report = db_report.pipe(
		// 	rxfilter((value) => value !== undefined),
		// 	rxmap(pipe(get("data"))),
		// 	rxmap((report) => new LendflowInternal(report))
		// );

		// // let report = application_id.pipe(
		// // 	rxfilter((value) => value !== undefined),
		// // 	concatMap(LendflowExternal.get_lendflow_report),
		// // 	rxmap(pipe(get("data", "data"))),
		// // 	rxmap((report) => new LendflowInternal(report))
		// // );

		// let empty_report = application_id.pipe(
		// 	rxfilter((value) => value === undefined),
		// 	rxmap(() => ({ business_info: () => ({}) }))
		// );

		// let $report = merge(report, empty_report);

		// let business_info = $report.pipe(rxmap((report) => report.business_info()));

		// return business_info.pipe(
		// 	tap(() => console.log("credit.report.business.api.company.value")),
		// 	tap(console.log)
		// );
	})
);

export const loader = async ({ request }) => {
	// return null;
	const on_success = async (response) => {
		console.log("credit.report.business.api.company.tap.success");

		subject.next({
			id: "credit_report_response",
			next: () => response,
		});
	};

	const on_error = (error) => {
		console.log("credit.report.business.api.company.error");
		console.log(error);

		subject.next({
			id: "credit_report_response",
			next: () => error ?? null,
		});
	};

	const on_complete = (value) => value.id === "credit_report_response";

	credit_report.pipe(fold(on_success, on_error)).subscribe();

	subject.next({
		id: "get_credit_report",
		args: {
			request,
		},
	});

	let response = await lastValueFrom(subject.pipe(rxfilter(on_complete), take(1)));

	// console.log("responseseeee");
	// console.log(response.next());

	return response.next();
};

// export const loader = async ({ request }) => {
// 	let url = new URL(request.url);
// 	let group_id = get_group_id(url.pathname);

// 	let business_credit_report_queries = [
// 		{
// 			param: "group_id",
// 			predicate: "==",
// 			value: group_id,
// 		},
// 		{
// 			param: "type",
// 			predicate: "==",
// 			value: "business_credit_report",
// 		},
// 	];

// 	let report_response = await get_collection({
// 		path: ["credit_reports"],
// 		queries: business_credit_report_queries,
// 	});

// 	let report = pipe(head)(report_response);

// 	let business = Lendflow.business(report);

// 	return {};
// };
