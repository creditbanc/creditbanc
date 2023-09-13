import { useLoaderData, Link } from "@remix-run/react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { get_file_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { prisma } from "~/utils/prisma.server";
import { Lendflow } from "~/data/lendflow";
import { pipe, allPass, not, head, identity } from "ramda";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { plans } from "~/data/plans";
import { get } from "shades";
import { report_tests } from "~/data/report_tests";
import { get_lendflow_report } from "~/utils/lendflow.server";
import { update_business_report } from "~/utils/business_credit_report.server";
import { get_collection, get_doc } from "~/utils/firebase";
import { map as rxmap, concatMap, tap } from "rxjs/operators";
import { from, lastValueFrom, forkJoin } from "rxjs";
import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";

const report = async (request) => {
	let url = new URL(request.url);
	let group_id = get_group_id(url.pathname);

	let business_credit_report_queries = [
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

	let application_id = from(
		get_collection({
			path: ["credit_reports"],
			queries: business_credit_report_queries,
		})
	).pipe(
		rxmap(pipe(head, get("application_id"))),
		rxmap(() => "d6d6cb45-0818-4f43-a8cd-29208f0cf7b2")
	);

	let $report = application_id.pipe(
		concatMap(LendflowExternal.get_lendflow_report),
		rxmap(pipe(get("data", "data"))),
		rxmap((report) => new LendflowInternal(report))
	);

	let experian_factors = $report.pipe(
		rxmap((report) => report.experian_factors())
	);

	return forkJoin({
		experian_factors,
	}).pipe(
		tap((value) => {
			console.log("___tap___");
			console.log(value);
		})
	);
};

export const loader = async ({ request }) => {
	let entity_id = await get_session_entity_id(request);

	let { plan_id } = await get_doc(["entity", entity_id]);

	let response = await lastValueFrom(
		from(report(request)).pipe(concatMap(identity))
	);

	return { ...response, plan_id };

	let is_owner = report.entity_id == entity_id;

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

	// let factors = Lendflow.experian.factors(report);
	// let report_payload = { factors };
	// let report_plan_id = report?.plan_id || "essential";
	// // console.log("report_payload");
	// // console.log(report_payload);
	// return { ...report_payload, plan_id, report_plan_id };
};

const ExplanationCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Why You Should Pay Attention To Your Score Factors
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-6 p-6">
				<div className="flex flex-col w-full">
					Score Factors or "Reason Codes" on your credit report are
					like clues from a Sherlock Holmes mystery, shedding light on
					why your score didn't reach the stratospheric heights you
					hoped for. Up to five factors are listed in order of their
					impact, with the most significant one first.
				</div>
				<div className="flex flex-col w-full">
					And you'll see those scores even if you have Rockstar
					credit. Lenders are required by law to disclose score
					factors each time your credit report is used for a loan
					application that is denied or approved with less than
					favorable terms.
				</div>
				<div className="flex flex-col w-full">
					Reason codes or score factors serve as a valuable guide for
					improving your score. They provide a clear picture of why
					your score isn't higher and shows what steps you can take to
					improve it over time.
				</div>
			</div>
		</div>
	);
};

const ScoreFactors = () => {
	let {
		experian_factors: factors,
		plan_id,
		report_plan_id = "builder",
	} = useLoaderData();

	let plan = pipe(get(report_plan_id, "business", "experian"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Here are the factors influencing your score
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
			<div className="border-t border-gray-200 p-6">
				<div className="flex flex-col w-full space-y-6">
					{pipe(
						mapIndexed((factor, idx) => (
							<div
								className="flex flex-row items-center space-x-2"
								key={idx}
							>
								<div className="w-[20px]">
									<ChevronDoubleRightIcon />
								</div>
								<div
									className={`${!plan.factors && "blur-sm"}`}
								>
									{factor.definition}
								</div>
							</div>
						))
					)(factors)}
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
				<ScoreFactors />
			</div>
		</div>
	);
}
