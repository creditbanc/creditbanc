import { get_group_id, inspect, get } from "~/utils/helpers";
import { always, apply, curry, equals, head, identity, ifElse, pipe, tryCatch } from "ramda";
import { Lendflow } from "~/data/lendflow";
import { get_collection, get_doc, set_doc } from "~/utils/firebase";
import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";
import { map as rxmap, filter as rxfilter, concatMap, tap, take, catchError } from "rxjs/operators";
import {
	from,
	lastValueFrom,
	forkJoin,
	Subject,
	of as rxof,
	iif,
	throwError,
	merge,
	ReplaySubject,
	Observable,
} from "rxjs";
import { fold, ifEmpty, ifFalse } from "~/utils/operators";
import { is_authorized_f } from "~/api/auth";
import { get_session_entity_id } from "~/utils/auth.server";
import { emitter } from "~/utils/emitter.server";

const merge_with_current = curry((current, data) => {
	return current.pipe(
		rxmap((response) => {
			return { ...response, ...data };
		})
	);
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

		let application = from(get_credit_report(group_id)).pipe(rxmap(head));

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
			rxmap((report) => ({ ...report.business_info() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_score() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_score: report.experian_score() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_risk_class() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_risk_class: report.experian_risk_class() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_trade_summary() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_trade_summary: report.experian_trade_summary() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_trade_payment_totals() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_trade_payment_totals: report.experian_trade_payment_totals() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_trade_lines() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_trade_lines: report.experian_trade_lines() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_derogatories() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_derogatories: report.experian_derogatories() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_sic_codes() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_sic_codes: report.experian_sic_codes() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_years_on_file() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_years_on_file: report.experian_years_on_file() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_employee_size() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_employee_size: report.experian_employee_size() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_naics_codes() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_naics_codes: report.experian_naics_codes() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_sales_revenue() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_sales_revenue: report.experian_sales_revenue() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get experian_factors() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_factors: report.experian_factors() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get dnb_score() {
		this.response = this.report.pipe(
			rxmap((report) => ({ dnb_score: report.dnb_score() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get dnb_delinquency_score() {
		this.response = this.report.pipe(
			rxmap((report) => ({ dnb_delinquency_score: report.dnb_delinquency_score() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get dnb_payment_status() {
		this.response = this.report.pipe(
			rxmap((report) => ({ dnb_payment_status: report.dnb_payment_status() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get dnb_credit_utilization() {
		this.response = this.report.pipe(
			rxmap((report) => ({ dnb_credit_utilization: report.dnb_credit_utilization() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get scores() {
		this.response = this.report.pipe(
			rxmap((report) => ({
				dnb_business_score: report.dnb_score(),
				experian_business_score: report.experian_score(),
			})),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get application_id() {
		this.response = this.application.pipe(
			rxmap(pipe(get("application_id"))),
			rxmap((application_id) => ({ application_id })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get fold() {
		return this.response;
	}
}
