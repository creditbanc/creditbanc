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

const log_route = `credit.report.ssepersonalscores`;
const start_action = "ssepersonalscores.action";

const subject = new ReplaySubject(1);

const loader_response = subject.pipe(
	rxfilter((message) => message.id == start_action),
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

		let group_id = rxof(get_group_id(url.pathname));

		const update_display_token = ({ clientKey, reportKey, report_id, displayToken }) => {
			console.log(`${log_route}.update_display_token`);

			return rxof({ clientKey, reportKey, report_id, displayToken }).pipe(
				concatMap(() =>
					from(get_doc(["credit_reports", report_id])).pipe(
						rxmap((report) => report.displayToken),
						concatMap((report_display_token) => {
							if (report_display_token == displayToken) {
								console.log(`${log_route}.update_display_token.array_update`);
								return from(ArrayExternal.refreshDisplayToken(clientKey, reportKey));
							} else {
								console.log(`${log_route}.update_display_token.db_update`);
								return rxof(null).pipe(
									tap(() =>
										subject.next({
											id: start_action,
											args: { request },
										})
									)
								);
							}
						})
					)
				),
				// concatMap(() =>
				// 	ArrayExternal.refreshDisplayToken(clientKey, reportKey)
				// ),
				catchError((error) => {
					console.log(`${log_route}.update_display_token.error`);
					console.log(error);

					return throwError(() => ({
						experian_personal_score: 0,
						equifax_personal_score: 0,
						transunion_personal_score: 0,
						experian_business_score: 0,
						dnb_business_score: 0,
					}));
				}),
				rxfilter((value) => value.displayToken),
				concatMap(({ displayToken }) =>
					update_doc(["credit_reports", report_id], {
						displayToken,
					})
				)
			);
		};

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
			rxfilter((value) => value !== undefined),
			rxmap(pipe(head, pick(["reportKey", "clientKey", "displayToken", "id"]))),
			concatMap(({ reportKey, displayToken, clientKey, id: report_id }) =>
				from(ArrayExternal.get_credit_report(reportKey, displayToken)).pipe(
					rxfilter((report) => report.CREDIT_RESPONSE),
					catchError((error) => {
						console.log(`${log_route}.personal_report.status.error`);

						let status = pipe(get("response", "status"))(error);
						console.log(status);

						return rxof(status).pipe(
							// rxfilter((status) => status == 401),
							concatMap(() =>
								update_display_token({
									clientKey,
									reportKey,
									report_id,
									displayToken,
								})
							),
							tap(() =>
								subject.next({
									id: start_action,
									args: { request },
								})
							),
							rxfilter((value) => value !== undefined)
						);
					})
				)
			),
			rxmap((array_response) => new ArrayInternal(array_response)),
			rxfilter((value) => value !== undefined)
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

		let experian_personal_score = $personal_report.pipe(rxmap((report) => report.experian_score()));

		let equifax_personal_score = $personal_report.pipe(rxmap((report) => report.equifax_score()));

		let transunion_personal_score = $personal_report.pipe(rxmap((report) => report.transunion_score()));

		return forkJoin({
			experian_personal_score,
			equifax_personal_score,
			transunion_personal_score,
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
	subject.next({ id: start_action, args: { request } });
	let response = await lastValueFrom(loader_response.pipe(take(1)));
	return json({ ...response });
};
