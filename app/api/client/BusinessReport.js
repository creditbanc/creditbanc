import { get, inspect, normalize_id } from "~/utils/helpers";
import { always, curry, equals, head, ifElse, pipe } from "ramda";
import { get_collection } from "~/utils/firebase";
import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";
import { map as rxmap, filter as rxfilter, concatMap, tap, catchError } from "rxjs/operators";
import { from, forkJoin, of as rxof, throwError } from "rxjs";

const log_route = `api.client.BusinessReport`;

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
	return default_value;
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
			tap(() => console.log(`BusinessReport.fold.top`)),
			tap(inspect),
			concatMap(ifElse(equals(undefined), always(throwError(() => undefined)), (report) => rxof(report)))
		);

		let report = application.pipe(
			rxmap(pipe(get("data"))),
			rxmap((report) => new LendflowInternal(report))
		);

		this.response = rxof({});
		this.application = application;
		this.report = report;
	}

	get business_info() {
		this.response = this.report.pipe(
			rxmap((report) => ({ business_info: report.business_info() })),
			catchError(catch_with_default({ business_info: {} }, "business_info")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_score() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_score: report.experian_score() })),
			catchError(catch_with_default({ experian_score: "" }, "experian_score")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_risk_class() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_risk_class: report.experian_risk_class() })),
			catchError(catch_with_default({ experian_risk_class: {} }, "experian_risk_class")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_trade_summary() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_trade_summary: report.experian_trade_summary() })),
			catchError(catch_with_default({ experian_trade_summary: {} }, "experian_trade_summary")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_trade_payment_totals() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_trade_payment_totals: report.experian_trade_payment_totals() })),
			catchError(catch_with_default({ experian_trade_payment_totals: {} }, "experian_trade_payment_totals")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_trade_lines() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_trade_lines: report.experian_trade_lines() })),
			catchError(catch_with_default({ experian_trade_lines: [] }, "experian_trade_lines")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_derogatories() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_derogatories: report.experian_derogatories() })),
			catchError(catch_with_default({ experian_derogatories: [] }, "experian_derogatories")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_sic_codes() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_sic_codes: report.experian_sic_codes() })),
			catchError(catch_with_default({ experian_sic_codes: [] }, "experian_sic_codes")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_years_on_file() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_years_on_file: report.experian_years_on_file() })),
			catchError(catch_with_default({ experian_years_on_file: [] }, "experian_years_on_file")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_employee_size() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_employee_size: report.experian_employee_size() })),
			catchError(catch_with_default({ experian_employee_size: [] }, "experian_employee_size")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_naics_codes() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_naics_codes: report.experian_naics_codes() })),
			catchError(catch_with_default({ experian_naics_codes: [] }, "experian_naics_codes")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_sales_revenue() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_sales_revenue: report.experian_sales_revenue() })),
			catchError(catch_with_default({ experian_sales_revenue: [] }, "experian_sales_revenue")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_payment_trends() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_payment_trends: report.experian_payment_trends() })),
			catchError(catch_with_default({ experian_payment_trends: [] }, "experian_payment_trends")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_factors() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_factors: report.experian_factors() })),
			catchError(catch_with_default({ experian_factors: [] }, "experian_factors")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_facts() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_facts: report.experian_facts() })),
			catchError(catch_with_default({ experian_facts: [] }, "experian_facts")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get dnb_score() {
		this.response = this.report.pipe(
			rxmap((report) => ({ dnb_score: report.dnb_score() })),
			catchError(catch_with_default({ dnb_score: 0 }, "dnb_score")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get dnb_delinquency_score() {
		this.response = this.report.pipe(
			rxmap((report) => ({ dnb_delinquency_score: report.dnb_delinquency_score() })),
			catchError(catch_with_default({ dnb_delinquency_score: 0 }, "dnb_delinquency_score")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get dnb_payment_status() {
		this.response = this.report.pipe(
			rxmap((report) => ({ dnb_payment_status: report.dnb_payment_status() })),
			catchError(catch_with_default({ dnb_payment_status: [] }, "dnb_payment_status")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get dnb_credit_utilization() {
		this.response = this.report.pipe(
			rxmap((report) => ({ dnb_credit_utilization: report.dnb_credit_utilization() })),
			catchError(catch_with_default({ dnb_credit_utilization: [] }, "dnb_credit_utilization")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get scores() {
		this.response = this.report.pipe(
			rxmap((report) => ({
				scores: {
					dnb_business_score: report.dnb_score(),
					experian_business_score: report.experian_score(),
				},
			})),
			catchError(catch_with_default({ scores: { dnb_business_score: 0, experian_business_score: 0 } }, "scores")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get application_id() {
		this.response = this.application.pipe(
			rxmap(pipe(get("application_id"))),
			rxmap((application_id) => ({ application_id })),
			catchError(catch_with_default({ application_id: "" }, "application_id")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get plan_id() {
		this.response = this.application.pipe(
			rxmap(pipe(get("plan_id"))),
			rxmap((plan_id) => ({ plan_id })),
			catchError(catch_with_default({ plan_id: "" }, "plan_id")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get _lendflow_report() {
		return this.application.pipe(
			rxmap(pipe(get("application_id"))),
			concatMap(LendflowExternal.get_lendflow_report),
			rxmap(pipe(get("data", "data")))
		);
	}

	get _report() {
		return this.application.pipe(rxmap(pipe(get("data"))));
	}

	get reports() {
		this.response = forkJoin({ report: this._report, lendflow_report: this._lendflow_report }).pipe(
			rxmap((reports) => ({ reports })),
			catchError(catch_with_default({ reports: {} }, "reports")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get report_sha() {
		this.response = from(this._report).pipe(
			rxmap((report) => ({ report_sha: normalize_id(report) })),
			catchError(catch_with_default({ report_sha: "" }, "report_sha")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get shas() {
		this.response = forkJoin({ report: this._report, lendflow_report: this._lendflow_report }).pipe(
			rxmap(({ report, lendflow_report }) => ({
				prev_sha: normalize_id(report),
				curr_sha: normalize_id(lendflow_report),
			})),
			catchError(catch_with_default({ prev_sha: "", curr_sha: "" }, "shas")),
			concatMap(merge_with_current(this.response))
		);

		return this;
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
