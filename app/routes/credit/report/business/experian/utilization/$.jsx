import { useLoaderData, Link } from "@remix-run/react";
import { Lendflow } from "~/data/lendflow";
import { currency, get_group_id, mapIndexed } from "~/utils/helpers";
import { allPass, pipe, not, head, identity } from "ramda";
import { get_file_id, get_account_utilization } from "~/utils/helpers";
import { prisma } from "~/utils/prisma.server";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { plans } from "~/data/plans";
import { get } from "shades";
import AccountUtilizationCard from "~/components/AccountUtilizationCard";
import { report_tests } from "~/data/report_tests";
import { get_lendflow_report } from "~/utils/lendflow.server";
import { update_business_report } from "~/utils/business_credit_report.server";
import DoughnutChart from "~/components/DoughnutChart";
import { get_collection, get_doc, set_doc } from "~/utils/firebase";
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

	let experian_trade_payment_totals = $report.pipe(
		rxmap((report) => report.experian_trade_payment_totals())
	);

	let experian_trade_lines = $report.pipe(
		rxmap((report) => report.experian_trade_lines())
	);

	return forkJoin({
		experian_trade_payment_totals,
		experian_trade_lines,
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

	// let trade_payment_totals = Lendflow.experian.trade_payment_totals(report);
	// let trade_lines = Lendflow.experian.trade_lines(report);
	// let report_payload = { trade_payment_totals, trade_lines };
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
					How is Credit Utilization measured?
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-6 p-6">
				<div className="flex flex-col w-full">
					Credit utilization is the ratio of current account balances
					to recent high credit balances. The ratio of delinquent
					balances to credit limits, and balances carried in relation
					to the rest of businesses in the same industry all affect
					business creditworthiness.
				</div>

				<div className="flex flex-col w-full">
					Since many business credit accounts don't have balance
					limits, this ratio can be used as an indicator of how much
					financial stress a business might be experiencing. The
					assumption is that the closer a business gets to its highest
					historical debt amount, the more difficult it can be for
					that business to make its payments on time.
				</div>
			</div>
		</div>
	);
};

const CreditUtilization = () => {
	let {
		experian_trade_payment_totals: trade_payment_totals,
		plan_id,
		report_plan_id = "builder",
	} = useLoaderData();
	let { trade_lines } = trade_payment_totals;

	let plan = pipe(get(report_plan_id, "business", "experian"))(plans);

	let utilization_ratio = get_account_utilization(
		trade_lines?.totalAccountBalance?.amount,
		trade_lines?.totalHighCreditAmount?.amount
	);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Credit Utilization
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
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-1/2 h-full">
						<DoughnutChart
							dataset={[
								utilization_ratio,
								100 - utilization_ratio,
							]}
						>
							<div className="absolute top-[40%] left-[27%] text-5xl font-semibold">
								{get_account_utilization(
									trade_lines?.totalAccountBalance?.amount,
									trade_lines?.totalHighCreditAmount?.amount
								)}
								%
							</div>
						</DoughnutChart>
					</div>
					<div className="flex flex-col w-1/2 space-y-5">
						<div className="flex flex-col space-y-1">
							<div>Total Balance (High)</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							<div
								className={`font-semibold ${
									!plan.trade_lines && "blur-sm"
								}`}
							>
								{currency.format(
									trade_lines?.totalHighCreditAmount
										?.amount || 0
								)}
							</div>
						</div>

						<div className="flex flex-col space-y-1">
							<div>Total Balance (Current)</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							<div
								className={`font-semibold ${
									!plan.trade_lines && "blur-sm"
								}`}
							>
								{currency.format(
									trade_lines?.totalAccountBalance?.amount ||
										0
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	let {
		experian_trade_lines: trade_lines,
		plan_id,
		report_plan_id = "builder",
	} = useLoaderData();

	return (
		<div className="flex flex-col w-full space-y-5">
			<div>
				<CreditUtilization />
			</div>
			<div>
				<ExplanationCard />
			</div>
			<div className="flex flex-col space-y-4">
				{pipe(
					mapIndexed((trade_line, idx) => (
						<AccountUtilizationCard
							trade_line={trade_line}
							key={idx}
							plan_id={report_plan_id}
						/>
					))
				)(trade_lines)}
			</div>
		</div>
	);
}
