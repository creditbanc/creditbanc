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
import { ArrayExternal } from "~/api/external/Array";
import { ArrayInternal } from "~/api/internal/Array";

const merge_with_current = curry((current, data) => {
	return current.pipe(
		rxmap((response) => {
			return { ...response, ...data };
		})
	);
});

export default class PersonalReport {
	constructor(group_id) {
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

		let get_credit_report = (group_id) =>
			from(
				get_collection({
					path: ["credit_reports"],
					queries: personal_credit_report_queries(group_id),
					limit: [1],
				})
			);

		let application = from(get_credit_report(group_id)).pipe(rxmap(head));

		let report = application.pipe(
			rxmap(pipe(get("data"))),
			rxmap((report) => new ArrayInternal(report))
		);

		this.response = rxof({});
		this.application = application;
		this.report = report;
	}

	get scores() {
		this.response = this.report.pipe(
			rxmap((report) => ({
				experian_personal_score: report.experian_score(),
				equifax_personal_score: report.equifax_score(),
				transunion_personal_score: report.transunion_score(),
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

	get experian_score() {
		this.response = this.report.pipe(
			rxmap((report) => ({ experian_score: report.experian_score() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get equifax_score() {
		this.response = this.report.pipe(
			rxmap((report) => ({ equifax_score: report.equifax_score() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get transunion_score() {
		this.response = this.report.pipe(
			rxmap((report) => ({ transunion_score: report.transunion_score() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get first_name() {
		this.response = this.report.pipe(
			rxmap((report) => ({ first_name: report.first_name() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get last_name() {
		this.response = this.report.pipe(
			rxmap((report) => ({ last_name: report.last_name() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get street() {
		this.response = this.report.pipe(
			rxmap((report) => ({ street: report.street() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get city() {
		this.response = this.report.pipe(
			rxmap((report) => ({ city: report.city() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get state() {
		this.response = this.report.pipe(
			rxmap((report) => ({ state: report.state() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get zip() {
		this.response = this.report.pipe(
			rxmap((report) => ({ zip: report.zip() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get dob() {
		this.response = this.report.pipe(
			rxmap((report) => ({ dob: report.dob() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get trade_lines() {
		this.response = this.report.pipe(
			rxmap((report) => ({ trade_lines: report.trade_lines() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get factors() {
		this.response = this.report.pipe(
			rxmap((report) => ({ factors: report.factors() })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get fold() {
		return this.response;
	}
}
