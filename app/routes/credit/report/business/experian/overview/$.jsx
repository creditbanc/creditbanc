import {
	HandThumbUpIcon,
	ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { useLoaderData } from "@remix-run/react";
import { Lendflow } from "~/data/lendflow";
import { get_file_id, get_group_id, inspect } from "~/utils/helpers";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { plans } from "~/data/plans";
import { get, has } from "shades";
import { allPass, pipe, not, head, identity } from "ramda";
import { report_tests } from "~/data/report_tests";
import { get_lendflow_report } from "~/utils/lendflow.server";
import { update_business_report } from "~/utils/business_credit_report.server";
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
		// experian_trade_lines,
		// experian_sic_codes,
		// experian_years_on_file,
		// experian_employee_size,
		// experian_naics_codes,
		// experian_sales_revenue,
		// experian_factors,
		// experian_derogatories,
		// experian_payment_trends,
		// dnb_score,
		dnb_company_info,
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
};

const ScoreCard = () => {
	let {
		experian_score: score,
		experian_risk_class: risk_class,
		business_info: business,
		experian_trade_summary: trade_summary,
	} = useLoaderData();

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Intelliscore Plus
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-1/2">
						<div className="flex flex-col items-center justify-center h-full space-y-2">
							<div className="flex flex-col text-5xl">
								{score}
							</div>
							<div className="flex flex-col">
								{risk_class?.definition}
							</div>
						</div>
					</div>
					<div className="flex flex-col w-1/2 text-sm">
						<div className="flex flex-col mb-2 font-semibold">
							Experian Business Record shown for:
						</div>
						<div className="flex flex-col">
							<div>{business?.name}</div>
							<div>{business?.address?.street}</div>
							<div className="flex flex-row space-x-1">
								<div className="flex flex-col mr-1">
									{business?.address?.city},
								</div>
								<div>{business?.address?.state}</div>
								<div>{business?.address?.zip}</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full space-y-3">
					<div className="font-semibold">
						What Exactly is an Intelliscore?
					</div>
					<div>
						Your business's Intelliscore is like a crystal ball into
						your credit health. It takes into account your payment
						history, utilization, and even your trended data. And
						the higher the score, the better; lenders don't like to
						play risky business when it comes to their money.
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	return (
		<div className="flex flex-col w-full space-y-5">
			<div>
				<ScoreCard />
			</div>
		</div>
	);
}
