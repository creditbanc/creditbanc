import {
	HandThumbDownIcon,
	HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { useLoaderData, Link } from "@remix-run/react";
import { mrm_credit_report, Lendflow } from "~/data/lendflow";
import { currency, get_group_id, mapIndexed } from "~/utils/helpers";
import { pipe, map, head, identity } from "ramda";
import { get_file_id } from "~/utils/helpers";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { plans } from "~/data/plans";
import { get } from "shades";
import AccountCard from "~/components/AccountCard";
import { get_collection, get_doc } from "~/utils/firebase";
import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";
import {
	map as rxmap,
	filter as rxfilter,
	concatMap,
	tap,
	take,
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

		let application_id = group_id.pipe(
			concatMap(get_credit_report),
			rxmap(pipe(head, get("application_id")))
			// rxmap(() => "d6d6cb45-0818-4f43-a8cd-29208f0cf7b2")
		);

		let $report = application_id.pipe(
			concatMap(LendflowExternal.get_lendflow_report),
			rxmap(pipe(get("data", "data"))),
			rxmap((report) => new LendflowInternal(report))
		);

		let dnb_payment_status = $report.pipe(
			rxmap((report) => report.dnb_payment_status())
		);

		return is_authorized.pipe(
			concatMap(() =>
				forkJoin({
					dnb_payment_status,
				})
			),
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

		subject.next({
			id: "credit_report_response",
			next: () => ({ ...response, plan_id }),
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

	// let response = await lastValueFrom(
	// 	from(report(request)).pipe(concatMap(identity))
	// );

	// return { ...response, plan_id };

	// let is_owner = report.entity_id == entity_id;

	// let url = new URL(request.url);
	// let entity_id = await get_session_entity_id(request);

	// let group_id = get_group_id(url.pathname);

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

	// let report_response = await get_collection({
	// 	path: ["credit_reports"],
	// 	queries: business_credit_report_queries,
	// });

	// let report = pipe(head)(report_response);

	// let is_owner = report.entity_id == entity_id;

	// let { plan_id } = await get_doc(["entity", entity_id]);

	// let payment_status = Lendflow.dnb.payment_status(report);
	// let report_plan_id = report?.plan_id || "essential";

	// return { payment_status, plan_id, report_plan_id };
};

const PaymentStatus = () => {
	let { dnb_payment_status: payment_status, report_plan_id = "builder" } =
		useLoaderData();
	let plan = pipe(get(report_plan_id, "business", "dnb"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Payment Status
				</h3>

				{report_plan_id == "essential" && (
					<Link
						to={"/plans"}
						className="font-semibold text-blue-600 underline"
					>
						Upgrade
					</Link>
				)}
			</div>
			<div className="border-t border-gray-200 p-5 space-y-5">
				<div className="flex flex-col w-full [&>*:nth-child(odd)]:bg-gray-50 border rounded">
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Maximum Owed Amount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.maximumOwedAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Total Past DueAmount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.totalPastDueAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Maximum Past Due Amount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.maximumPastDueAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Slow Experiences Count
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.slowExperiencesCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Negative Payments Count
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.negativePaymentsCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Payment Behavior Result
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.paymentBehaviorResult
								?.description || ""}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Bad Debt ExperiencesCount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.badDebtExperiencesCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Maximum High Credit Amount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.maximumHighCreditAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Bad Debt Experiences Amount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.badDebtExperiencesAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Negative Experiences Amount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.negativeExperiencesAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Slow Experiences Percentage
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.slowExperiencesPercentage || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Slow Or Negative Payments Count
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.slowOrNegativePaymentsCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Unfavorable Experiences Count
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.unfavorableExperiencesCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Bad Debt Experiences Percentage
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.badDebtExperiencesPercentage || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Unfavorable Experiences Amount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.unfavorableExperiencesAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Negative Experiences Percentage
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.negativeExperiencesPercentage || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Slow And Negative Experiences Amount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.slowAndNegativeExperiencesAmount ||
								0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Slow Or Negative Payments Percentage
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.slowOrNegativePaymentsPercentage ||
								0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Unfavorable Experiences Percentage
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.unfavorableExperiencesPercentage ||
								0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Slow Experiences Highest Credit Amount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.slowExperiencesHighestCreditAmount ||
								0}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const ExplanationCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					How is Payment Status Important?
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-col w-full">
					Paying on time isn't just good manners, it's good for your
					credit report - especially for your business credit. While
					there's a 30-day window before a late payment appears on
					your personal credit report, your business credit is less
					forgiving. In fact, late payments can show up on your
					business credit report the very next day. And we all know
					how lenders feel about late payments.
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	return (
		<div className="flex flex-col w-full space-y-5">
			<div>
				<ExplanationCard />
			</div>
			<div>
				<PaymentStatus />
			</div>
		</div>
	);
}
