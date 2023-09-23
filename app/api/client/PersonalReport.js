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

	get fold() {
		return this.response;
	}
}
