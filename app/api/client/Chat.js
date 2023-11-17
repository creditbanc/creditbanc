import { get, inspect, normalize_id } from "~/utils/helpers";
import { always, curry, equals, head, ifElse, pipe } from "ramda";
import { get_collection } from "~/utils/firebase";
import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";
import { map as rxmap, filter as rxfilter, concatMap, tap, catchError } from "rxjs/operators";
import { from, forkJoin, of as rxof, throwError } from "rxjs";

const log_route = `api.client.Chat`;

const merge_with_current = curry((current, data) => {
	return current.pipe(
		rxmap((response) => {
			return { ...response, ...data };
		})
	);
});

const catch_with_default = curry((default_value, fn_name, error) => {
	console.log(`${log_route}.error.${fn_name}`);
	console.log(error);
	console.log(default_value);
	return rxof(default_value);
});

export default class BusinessReport {
	constructor(group_id) {
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

		let application = from(get_credit_report(group_id)).pipe(
			rxmap(head),
			// tap(() => console.log(`BusinessReport.fold.top`)),
			// tap(inspect),
			concatMap(ifElse(equals(undefined), always(throwError(() => undefined)), (report) => rxof(report)))
		);

		let report = application.pipe(
			rxmap(pipe(get("data"))),
			rxmap((report) => new LendflowInternal(report))
		);

		this.response = application.pipe(
			concatMap((application) => (application.length < 1 ? rxof({ business_report_is_empty: true }) : rxof({})))
		);

		this.application = application;
		this.report = report;
	}

	get fold() {
		return this.response.pipe(
			catchError((error) => {
				console.log("BusinessReport.error");
				console.log(error);
				if (error == undefined) {
					return rxof({
						business_report_is_empty: true,
						scores: {
							dnb_business_score: 0,
							experian_business_score: 0,
						},
					});
				} else {
					return throwError(() => error);
				}
			}),
			rxmap((response) => ({
				...response,
				business_report_is_empty: response.business_report_is_empty ? response.business_report_is_empty : false,
			})),
			tap(() => console.log(`BusinessReport.fold`)),
			tap(inspect)
		);
	}
}
