import { get, normalize_id } from "~/utils/helpers";
import { always, curry, equals, head, ifElse, pickAll, pipe } from "ramda";
import { get_collection, get_doc, server_timestamp, set_doc, update_doc } from "~/utils/firebase";
import { map as rxmap, filter as rxfilter, concatMap, catchError, tap, take } from "rxjs/operators";
import { from, of as rxof, forkJoin, ReplaySubject, throwError } from "rxjs";
import { ArrayExternal } from "~/api/external/Array";
import { ArrayInternal } from "~/api/internal/Array";
import { appKey } from "~/data/array";
import moment from "moment";

const log_route = `api.client.PersonalReport`;

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

		let application = from(get_credit_report(group_id)).pipe(
			rxmap(head),
			concatMap(ifElse(equals(undefined), always(throwError(() => undefined)), (report) => rxof(report)))
		);

		let report = application.pipe(
			rxmap(pipe(get("data"))),
			rxmap((report) => new ArrayInternal(report))
		);

		this.response = rxof({});
		this.application = application;
		this.report = report;
	}

	get identity() {
		this.response = this.application.pipe(concatMap(merge_with_current(this.response)));

		return this;
	}

	get scores() {
		this.response = this.report.pipe(
			rxmap((report) => ({
				scores: {
					experian_personal_score: report.experian_score(),
					equifax_personal_score: report.equifax_score(),
					transunion_personal_score: report.transunion_score(),
				},
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

	get user_token() {
		this.response = this.application.pipe(
			rxmap(pipe(pickAll(["clientKey", "id", "userToken", "user_token_updated_at"]))),
			concatMap(({ clientKey, id, userToken, user_token_updated_at }) => {
				let start = user_token_updated_at?.seconds
					? moment(new Date(user_token_updated_at.seconds * 1000))
					: moment().subtract(1, "days");
				var minutes_passed = moment().diff(start, "minutes");
				if (minutes_passed > 30 || userToken == undefined) {
					console.log("PersonalReport.tap.user_token_update_needed");
					return from(ArrayExternal.regenerateUserToken(appKey, clientKey)).pipe(
						concatMap(({ userToken }) =>
							from(
								update_doc(["credit_reports", id], {
									userToken,
									user_token_updated_at: server_timestamp(),
								})
							).pipe(rxmap(() => ({ user_token: userToken })))
						)
					);
				} else {
					console.log("PersonalReport.tap.no_user_token_update_needed");
					return rxof({ user_token: userToken });
				}
			}),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get _array_report() {
		let subject = new ReplaySubject(1);
		let start_action = "get_report";

		const update_display_token = ({ clientKey, reportKey, report_id, displayToken }) => {
			console.log(`${log_route}.update_display_token`);

			return rxof({ clientKey, reportKey, report_id, displayToken }).pipe(
				concatMap(() =>
					from(get_doc(["credit_reports", report_id])).pipe(
						rxmap((report) => report.displayToken),
						tap(() => console.log(`PersonalReport.tap.3`)),
						tap(console.log),
						concatMap((report_display_token) => {
							return from(ArrayExternal.refreshDisplayToken(clientKey, reportKey));
							if (report_display_token == displayToken) {
								console.log(`${log_route}.update_display_token.array_update`);
								return from(ArrayExternal.refreshDisplayToken(clientKey, reportKey));
							} else {
								console.log(`${log_route}.update_display_token.db_update`);
								return rxof(undefined).pipe(tap(() => subject.next({ id: start_action })));
							}
						}),
						tap(() => console.log(`PersonalReport.tap.4`)),
						tap(console.log)
					)
				),
				catchError((error) => {
					console.log(`${log_route}.update_display_token.error`);
					console.log(error);

					return throwError(() => ({
						experian_personal_score: 0,
						equifax_personal_score: 0,
						transunion_personal_score: 0,
					}));
				}),
				rxfilter((value) => value?.displayToken),
				concatMap(({ displayToken }) => update_doc(["credit_reports", report_id], { displayToken }))
			);
		};

		const update_display_token_error = curry((clientKey, reportKey, report_id, displayToken, error) => {
			console.log(`${log_route}.personal_report.status.error`);
			// console.log(error);
			let status = pipe(get("response", "status"))(error);
			console.log(status);

			return rxof(status).pipe(
				// rxfilter((status) => status == 401),
				tap(() => console.log(`PersonalReport.tap.2`)),
				tap(console.log),
				concatMap(() => update_display_token({ clientKey, reportKey, report_id, displayToken })),
				tap(() => console.log(`PersonalReport.tap.3`)),
				tap(console.log),
				tap(() => subject.next({ id: start_action })),
				rxfilter((value) => value !== undefined)
			);
		});

		let report = subject.pipe(
			rxfilter((event) => event.id == start_action),
			concatMap(() => this.application),
			rxmap(pipe(pickAll(["reportKey", "clientKey", "displayToken", "id"]))),
			tap(() => console.log(`PersonalReport.tap.1`)),
			tap(console.log),
			concatMap(({ reportKey, displayToken, clientKey, id: report_id }) =>
				from(ArrayExternal.get_credit_report(reportKey, displayToken)).pipe(
					rxfilter((report) => report.CREDIT_RESPONSE),
					catchError(update_display_token_error(clientKey, reportKey, report_id, displayToken)),
					concatMap((report) => {
						return from(update_doc(["credit_reports", report_id], { data: report })).pipe(
							rxmap((value) => report)
						);
					})
					// concatMap(update_db_report_if_needed(db_personal_credit_report, report_id))
				)
			)
		);

		subject.next({ id: start_action });
		// return this;
		return report.pipe(take(1));
	}

	get _report() {
		return this.application.pipe(rxmap(pipe(get("data"))));
	}

	get report_sha() {
		this.response = from(this._report).pipe(
			rxmap((report) => ({ report_sha: normalize_id(report) })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get shas() {
		this.response = forkJoin({ report: this._report, array_report: this._array_report }).pipe(
			rxmap(({ report, array_report }) => ({
				prev_sha: report == undefined ? normalize_id(array_report) : normalize_id(report),
				curr_sha: normalize_id(array_report),
			})),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get fold() {
		return this.response.pipe(
			catchError((error) => {
				console.log("PersonalReport.error");
				console.log(error);
				if (error == undefined) {
					return rxof({
						personal_report_is_empty: true,
						scores: {
							experian_personal_score: 0,
							equifax_personal_score: 0,
							transunion_personal_score: 0,
						},
					});
				} else {
					return throwError(() => error);
				}
			}),
			tap(() => console.log(`PersonalReport.fold`)),
			tap(console.log)
		);
	}
}
