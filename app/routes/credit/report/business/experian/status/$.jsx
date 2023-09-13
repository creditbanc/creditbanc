import { useLoaderData, Link } from "@remix-run/react";
import { Lendflow } from "~/data/lendflow";
import { currency, get_group_id, mapIndexed } from "~/utils/helpers";
import { allPass, pipe, not, head, identity } from "ramda";
import { get_file_id } from "~/utils/helpers";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { plans } from "~/data/plans";
import { get } from "shades";
import AccountCard from "~/components/AccountCard";
import { report_tests } from "~/data/report_tests";
import { get_lendflow_report } from "~/utils/lendflow.server";
import { update_business_report } from "~/utils/business_credit_report.server";
import DoughnutChart from "~/components/DoughnutChart";
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

	let experian_score = $report.pipe(
		rxmap((report) => report.experian_score())
	);

	let experian_risk_class = $report.pipe(
		rxmap((report) => report.experian_risk_class())
	);

	let business_info = $report.pipe(rxmap((report) => report.business_info()));

	let experian_trade_payment_totals = $report.pipe(
		rxmap((report) => report.experian_trade_payment_totals())
	);

	let experian_trade_summary = $report.pipe(
		rxmap((report) => report.experian_trade_summary())
	);

	let experian_trade_lines = $report.pipe(
		rxmap((report) => report.experian_trade_lines())
	);

	let experian_sic_codes = $report.pipe(
		rxmap((report) => report.experian_sic_codes())
	);

	let experian_years_on_file = $report.pipe(
		rxmap((report) => report.experian_years_on_file())
	);

	let experian_employee_size = $report.pipe(
		rxmap((report) => report.experian_employee_size())
	);

	let experian_naics_codes = $report.pipe(
		rxmap((report) => report.experian_naics_codes())
	);

	let experian_sales_revenue = $report.pipe(
		rxmap((report) => report.experian_sales_revenue())
	);

	let experian_factors = $report.pipe(
		rxmap((report) => report.experian_factors())
	);

	let experian_derogatories = $report.pipe(
		rxmap((report) => report.experian_derogatories())
	);

	let experian_payment_trends = $report.pipe(
		rxmap((report) => report.experian_payment_trends())
	);

	let dnb_score = $report.pipe(rxmap((report) => report.dnb_score()));

	let dnb_delinquency_score = $report.pipe(
		rxmap((report) => report.dnb_delinquency_score())
	);

	let dnb_total_balance_high = $report.pipe(
		rxmap((report) => report.dnb_total_balance_high())
	);

	let dnb_duns_number = $report.pipe(
		rxmap((report) => report.dnb_duns_number())
	);

	let dnb_payment_status = $report.pipe(
		rxmap((report) => report.dnb_payment_status())
	);

	let dnb_credit_utilization = $report.pipe(
		rxmap((report) => report.dnb_credit_utilization())
	);

	let dnb_payment_trends = $report.pipe(
		rxmap((report) => report.dnb_payment_trends())
	);

	let dnb_company_info = $report.pipe(
		rxmap((report) => report.dnb_company_info())
	);

	return forkJoin({
		// experian_score,
		// experian_risk_class,
		// business_info,
		experian_trade_payment_totals,
		experian_trade_lines,
		// experian_trade_summary,
		// experian_sic_codes,
		// experian_years_on_file,
		// experian_employee_size,
		// experian_naics_codes,
		// experian_sales_revenue,
		// experian_factors,
		// experian_derogatories,
		// experian_payment_trends,
		// dnb_score,
		// dnb_company_info,
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

	// return { ...report_payload, plan_id, report_plan_id };
};

const PaymentStatus = () => {
	let {
		experian_trade_payment_totals: trade_payment_totals,
		plan_id,
		report_plan_id = "builder",
	} = useLoaderData();
	let { trade_lines: trade_lines_payment_totals } = trade_payment_totals;

	let plan = pipe(get(plan_id, "business", "experian"))(plans);

	let trade_count = trade_lines_payment_totals?.tradelineCount || 0;
	let delinquent_count = trade_lines_payment_totals?.dbt30 || 0;
	let delinquent_ratio = (delinquent_count / trade_count) * 100;
	delinquent_ratio = isNaN(delinquent_ratio) ? 0 : delinquent_ratio;
	let doughnut_dataset =
		delinquent_ratio > 100
			? [100, 0]
			: [delinquent_ratio, 100 - delinquent_ratio];

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
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-1/2">
						<DoughnutChart dataset={doughnut_dataset}>
							<div className="absolute w-full h-full flex flex-col items-center justify-center text-5xl font-semibold">
								{delinquent_ratio.toFixed(0)}%
							</div>
						</DoughnutChart>
					</div>
					<div className="flex flex-col w-1/2 space-y-5">
						<div className="flex flex-col space-y-1">
							<div>Active Accounts</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							{plan.trade_lines_payment_totals && (
								<div className="font-semibold">
									{trade_count}
								</div>
							)}

							{!plan.trade_lines_payment_totals && (
								<div className="font-semibold">Upgrade</div>
							)}
						</div>

						<div className="flex flex-col space-y-1">
							<div>Delinquent Accounts</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							{plan.trade_lines_payment_totals && (
								<div className="font-semibold">
									{delinquent_count}
								</div>
							)}

							{!plan.trade_lines_payment_totals && (
								<div className="font-semibold">Upgrade</div>
							)}
						</div>

						<div className="flex flex-col space-y-1">
							<div>Balance of all accounts</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							{plan.trade_lines_payment_totals && (
								<div className="font-semibold">
									{currency.format(
										trade_lines_payment_totals
											?.totalAccountBalance?.amount || 0
									)}
								</div>
							)}

							{!plan.trade_lines_payment_totals && (
								<div className="font-semibold">Upgrade</div>
							)}
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
					Why is Payment Status Important? Let us explain.
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
	let {
		experian_trade_lines: trade_lines,
		plan_id,
		report_plan_id = "builder",
	} = useLoaderData();

	return (
		<div className="flex flex-col w-full space-y-5">
			<div>
				<PaymentStatus />
			</div>
			<div>
				<ExplanationCard />
			</div>
			<div className="flex flex-col space-y-4">
				{pipe(
					mapIndexed((trade_line, idx) => (
						<AccountCard
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
