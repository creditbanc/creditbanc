import { useLoaderData, Link } from "@remix-run/react";
import { Lendflow } from "~/data/lendflow";
import {
	pipe,
	allPass,
	head,
	not,
	defaultTo,
	tryCatch,
	always,
	identity,
} from "ramda";
import { get_file_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { prisma } from "~/utils/prisma.server";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { plans } from "~/data/plans";
import { get } from "shades";
import AccountCard from "~/components/AccountCard";
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
		// experian_trade_payment_totals,
		// experian_trade_summary,
		experian_trade_lines,
		// experian_sic_codes,
		// experian_years_on_file,
		// experian_employee_size,
		// experian_naics_codes,
		// experian_sales_revenue,
		// experian_factors,
		// experian_derogatories,
		experian_payment_trends,
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

	// let payment_trends = Lendflow.experian.payment_trends(report);
	// let trade_lines = Lendflow.experian.trade_lines(report);
	// let report_payload = { payment_trends, trade_lines };
	// let report_plan_id = report?.plan_id || "essential";

	// return { ...report_payload, plan_id, report_plan_id };
};

const ExplanationCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Are Payment Trends Good or Bad?
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-6 p-6">
				<div className="flex flex-col w-full">
					If you've been playing the "paying bills late" game, your
					average Days Beyond Terms (DBT) is going to go up...which
					means your credit score is going to go down. (Past behavior
					predicts future behavior, right?) This is the type of trend
					you don't want to be a part of.
				</div>

				<div className="flex flex-col w-full">
					It's also important to remember that personal and business
					credit have different criteria for "late" bills. Any bill at
					least 30 days overdue is considered delinquent on your
					personal credit score. However, business credit has a
					variety of payment terms (we're talking Net 30, Net 60,
					etc.). So, if you're supposed to pay within 60 days but wait
					until day 67, the DBT is 7. A higher DBT = a negative impact
					on your credit score.
				</div>
			</div>
		</div>
	);
};

const PaymentTrendsCard = () => {
	let {
		experian_payment_trends: payment_trends,
		plan_id,
		report_plan_id = "builder",
	} = useLoaderData();

	let plan = pipe(get(report_plan_id, "business", "experian"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Payment Trends
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
			<div className="border-t border-gray-200 p-5">
				<div className="flex flex-col w-full [&>*:nth-child(odd)]:bg-gray-50 border rounded">
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Predicted DBT (Days Beyond Terms)
						</div>
						<div className={`${!plan.trends && "blur-sm"}`}>
							{pipe(
								head,
								tryCatch(get("dbt"), always(0))
							)(payment_trends)}
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
		report_plan_id,
	} = useLoaderData();

	return (
		<div className="flex flex-col w-full space-y-5">
			<div>
				<PaymentTrendsCard />
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
