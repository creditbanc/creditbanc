import { useLoaderData, Link } from "@remix-run/react";
import { Lendflow } from "~/data/lendflow";
import { allPass, pipe, not, head, identity } from "ramda";
import { get_file_id, get_group_id } from "~/utils/helpers";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { plans } from "~/data/plans";
import { get } from "shades";
import { report_tests } from "~/data/report_tests";
import { get_lendflow_report } from "~/utils/lendflow.server";
import { update_business_report } from "~/utils/business_credit_report.server";
import { get_collection, get_doc } from "~/utils/firebase";
import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";
import {
	map as rxmap,
	concatMap,
	tap,
	filter as rxfilter,
	take,
} from "rxjs/operators";
import {
	from,
	lastValueFrom,
	forkJoin,
	of as rxof,
	Subject,
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
		);

		let $report = application_id.pipe(
			concatMap(LendflowExternal.get_lendflow_report),
			rxmap(pipe(get("data", "data"))),
			rxmap((report) => new LendflowInternal(report))
		);

		let experian_derogatories = $report.pipe(
			rxmap((report) => report.experian_derogatories())
		);

		return is_authorized.pipe(
			concatMap(() =>
				forkJoin({
					experian_derogatories,
				})
			),
			tap((value) => {
				console.log("credit.report.business.experian.derogatories.tap");
				console.log(value);
			})
		);
	})
);

export const loader = async ({ request }) => {
	const on_success = async (response) => {
		console.log("credit.report.business.experian.derogatories.success");
		let entity_id = await get_session_entity_id(request);
		let { plan_id } = await get_doc(["entity", entity_id]);

		subject.next({
			id: "credit_report_response",
			next: () => ({ ...response, plan_id }),
		});
	};

	const on_error = (error) => {
		console.log("credit.report.business.experian.derogatories.error");
		console.log(error);

		subject.next({
			id: "credit_report_response",
			next: () => error ?? null,
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
	// let file_id = get_file_id(url.pathname);
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

	// // if (pipe(allPass(report_tests[plan_id]["experian"]), not)(report)) {
	// // 	console.log("didnotpass");
	// // 	let lendflow_report = await get_lendflow_report(report.application_id);
	// // 	report = await set_doc(["credit_reports", report.id], {
	// // 		...report,
	// // 		...lendflow_report,
	// // 	});
	// // }

	// let derogatories = Lendflow.experian.derogatories(report);
	// let report_payload = { derogatories };
	// let report_plan_id = report?.plan_id || "essential";

	// return { ...report_payload, plan_id, report_plan_id };
};

const Derogatories = () => {
	let {
		experian_derogatories: derogatories,
		plan_id,
		report_plan_id = "builder",
	} = useLoaderData();

	let plan = pipe(get(report_plan_id, "business", "experian"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Derogatories
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
						<div className="flex flex-col w-3/4 font-semibold">
							Derogatories
						</div>
						<div className={`${!plan.derogatories && "blur-sm"}`}>
							{derogatories?.legalFilingsSummary?.legalCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4 font-semibold">
							Total legal filings
						</div>
						<div className={`${!plan.derogatories && "blur-sm"}`}>
							{derogatories?.legalFilingsSummary
								?.derogatoryLegalCount || 0}
						</div>
					</div>
				</div>
				<div className="flex flex-row w-full text-sm">
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Collections</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div className={`${!plan.derogatories && "blur-sm"}`}>
							{derogatories?.legalFilingsCollectionsSummary
								?.collectionCount || 0}
						</div>
					</div>
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Liens</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div className={`${!plan.derogatories && "blur-sm"}`}>
							{derogatories?.legalFilingsCollectionsSummary
								?.lienCount || 0}
						</div>
					</div>
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Judgments</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div className={`${!plan.derogatories && "blur-sm"}`}>
							{derogatories?.legalFilingsCollectionsSummary
								?.judgmentCount || 0}
						</div>
					</div>
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Legal</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div className={`${!plan.derogatories && "blur-sm"}`}>
							{derogatories?.legalFilingsCollectionsSummary
								?.derogatoryLegalCount || 0}
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
					Explain Credit Utilization and Why I Should Care
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-col w-full">
					One way your business's street cred (or should we say
					creditworthiness?) is determined is by how much credit
					you're using, a.k.a: Credit Utilization. It looks at the
					ratio of current account balances to recent high credit
					balances. Because many business accounts don't have balance
					limits, this ratio can reveal if you're feeling the
					financial heat. The closer a business gets to its highest
					historical debt amount, the more difficult it might be for
					said business to make on-time payments.
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
				<Derogatories />
			</div>
		</div>
	);
}
