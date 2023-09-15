import { BookOpenIcon } from "@heroicons/react/24/outline";
import { FactorBar } from "~/components/FactorBar";
import { Accounts } from "~/components/TradeLines";
import { useLoaderData } from "@remix-run/react";
import {
	pipe,
	map,
	filter,
	includes,
	flatten,
	head,
	identity,
	pick,
} from "ramda";
import { get_file_id, get_group_id, inspect } from "~/utils/helpers";
import {
	TradeLine as Tradeline,
	CreditReport,
	Liabilities,
	credit_report_data,
	get_credit_report,
} from "~/data/array";

import { all, get } from "shades";
import { plans } from "~/data/plans";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { useReportPageLayoutStore } from "~/stores/useReportPageLayoutStore";
import { get_collection, get_doc, set_doc, update_doc } from "~/utils/firebase";
import { ArrayExternal } from "~/api/external/Array";
import { ArrayInternal } from "~/api/internal/Array";
import {
	map as rxmap,
	filter as rxfilter,
	concatMap,
	tap,
	take,
	catchError,
} from "rxjs/operators";
import {
	from,
	lastValueFrom,
	forkJoin,
	Subject,
	of as rxof,
	iif,
	throwError,
} from "rxjs";
import { fold, ifFalse } from "~/utils/operators";
import { is_authorized_f } from "~/api/auth";

const subject = new Subject();

const credit_report = subject.pipe(
	rxfilter((message) => message.id == "get_credit_report"),
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

		let get_credit_report = (group_id) =>
			from(
				get_collection({
					path: ["credit_reports"],
					queries: personal_credit_report_queries(group_id),
				})
			);

		let group_id = rxof(get_group_id(url.pathname));
		let entity_id = from(get_session_entity_id(request));

		let entity_group_id = forkJoin({
			entity_id,
			group_id,
		});

		let redirect_home = entity_group_id.pipe(
			concatMap(({ entity_id, group_id }) =>
				throwError(() =>
					Response.redirect(
						`${url.origin}/home/resource/e/${entity_id}/g/${group_id}`
					)
				)
			)
		);

		let is_authorized = entity_group_id.pipe(
			concatMap(({ entity_id, group_id }) =>
				is_authorized_f(entity_id, group_id, "credit", "read")
			),
			concatMap(ifFalse(redirect_home))
		);

		const update_display_token = ({ clientKey, reportKey, report_id }) => {
			console.log("___update_display_token___");
			return rxof({ clientKey, reportKey, report_id }).pipe(
				concatMap(() =>
					ArrayExternal.refreshDisplayToken(clientKey, reportKey)
				),
				tap((value) => console.log(value)),
				rxfilter((value) => value.displayToken),
				concatMap(({ displayToken }) =>
					update_doc(["credit_reports", report_id], {
						displayToken,
					})
				)
			);
		};

		let report = group_id.pipe(
			concatMap(get_credit_report),
			rxmap(
				pipe(
					head,
					pick(["reportKey", "clientKey", "displayToken", "id"])
				)
			),
			concatMap(({ reportKey, displayToken, clientKey, id: report_id }) =>
				from(
					ArrayExternal.get_credit_report(reportKey, displayToken)
				).pipe(
					rxfilter((report) => report.CREDIT_RESPONSE),
					catchError((error) => {
						let status = pipe(get("response", "status"))(error);

						return rxof(status).pipe(
							// rxfilter((status) => status == 401),
							concatMap(() =>
								update_display_token({
									clientKey,
									reportKey,
									report_id,
								})
							),
							tap(() =>
								subject.next({
									id: "get_credit_report",
									args: { request },
								})
							),
							rxfilter((value) => value !== undefined)
						);
					})
				)
			),
			rxmap((array_response) => new ArrayInternal(array_response)),
			rxmap((report) => report.trade_lines())
		);

		return is_authorized.pipe(
			concatMap(() => report),
			tap((value) => {
				console.log("___tap___");
				console.log(value);
			})
		);
	})
);

export const loader = async ({ request }) => {
	const on_success = async (response) => {
		console.log("___success___");
		let entity_id = await get_session_entity_id(request);
		let { plan_id } = await get_doc(["entity", entity_id]);

		let payload = { trade_lines: response, plan_id };

		subject.next({
			id: "credit_report_response",
			next: () => payload,
		});
	};

	const on_error = (error) => {
		console.log("___error___");
		console.log(error);

		subject.next({
			id: "credit_report_response",
			next: () => error,
		});
	};

	const on_complete = (value) => value.id === "credit_report_response";

	credit_report.pipe(fold(on_success, on_error)).subscribe();

	subject.next({ id: "get_credit_report", args: { request } });

	let response = await lastValueFrom(
		subject.pipe(rxfilter(on_complete), take(1))
	);

	return response.next();

	// let entity_id = await get_session_entity_id(request);
	// let { plan_id } = await get_doc(["entity", entity_id]);

	// let response = await lastValueFrom(creditreport(request));

	// // console.log("response");
	// // console.log(response);

	// return { trade_lines: response, plan_id };

	// let url = new URL(request.url);
	// let pathname = url.pathname;
	// let entity_id = await get_session_entity_id(request);
	// let group_id = get_group_id(pathname);

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

	// let report_response = await get_collection({
	// 	path: ["credit_reports"],
	// 	queries: personal_credit_report_queries,
	// });

	// let report = pipe(head)(report_response);

	// // console.log("report");
	// // console.log(report);

	// // let data = await get_credit_report(report.reportKey, report.displayToken);

	// let credit_report = CreditReport(report.data);
	// let liabilities = Liabilities(credit_report.liabilities());

	// let is_owner = report.entity_id == entity_id;

	// let { plan_id } = await get_doc(["entity", entity_id]);

	// let trade_lines = pipe(
	// 	map((value) => Tradeline(flatten([value]))),
	// 	map((tl) => tl.values())
	// 	// filter((tl) => pipe(get(all, "value"), includes("Closed"))(tl.status))
	// )(liabilities.trade_lines());

	// console.log("trade_lines");
	// console.log(trade_lines);

	// return { trade_lines, plan_id };
};

const InfoCard = () => {
	return (
		<div className="flex flex-col h-fit bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<BookOpenIcon />
				</div>
				<div className="flex flex-col">
					<p className="text-xl font-medium leading-6 text-gray-900">
						Payment History: What’s the big deal?
					</p>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col text-lg py-2 text-gray-700 font-semibold">
					<p>35% of your credit score is based on Payment History</p>
				</div>

				<FactorBar />

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						It’s kind of a big deal, actually. We’re talking 35% of
						your overall credit score.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Payment history (your track record for paying bills and
						debts on time) is one of the two most important factors
						in determining your credit score. It's like a financial
						report card that lenders and creditors use to assess
						your creditworthiness. If you’re consistently making
						on-time payments, good job! Gold stars all around.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						But if your report comes back with a history of late
						payments, missed payments, or accounts sent to
						collections, you’ll see your credit score drop faster
						than a skydiver without a parachute. This is going to
						make it harder to get approved for lines of credit and
						may also result in higher interest rates.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						(And not to add salt to the wound, but most negative
						information on your payment history can stay on your
						credit report for up to seven years.)
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						The good news is that the older the negative
						information, the less it hurts your score. (Time heals
						all wounds, right?) Generally speaking, late payments
						that occurred 2+ years ago may not even show up on your
						credit report with any specificity.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Regardless, it’s crucial to prioritize your payment
						history and always strive to pay bills on time. Set up
						automatic payments, create reminders, and budget wisely
						to ensure you're on top of your payment game.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700">
					<p>
						Your Credit Banc report shows any late payments under
						the Payment History box on the left of each credit
						account.
					</p>
				</div>
			</div>
		</div>
	);
};

export default function History() {
	let { trade_lines, plan_id } = useLoaderData();
	let { coordinates } = useReportPageLayoutStore();

	let experian = pipe(get(plan_id, "personal", "experian", "authorized"))(
		plans
	);
	let equifax = pipe(get(plan_id, "personal", "equifax", "authorized"))(
		plans
	);
	let transunion = pipe(get(plan_id, "personal", "transunion", "authorized"))(
		plans
	);

	return (
		<div className={`flex flex-col w-full h-full py-5`}>
			<InfoCard />
			<Accounts
				trade_lines={trade_lines}
				experian={experian}
				transunion={transunion}
				equifax={equifax}
			/>
		</div>
	);
}
