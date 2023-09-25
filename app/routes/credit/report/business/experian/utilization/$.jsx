import { useLoaderData, Link } from "@remix-run/react";
import { currency, get_group_id, mapIndexed } from "~/utils/helpers";
import { pipe } from "ramda";
import { get_account_utilization } from "~/utils/helpers";
import { plans } from "~/data/plans";
import { get } from "shades";
import AccountUtilizationCard from "~/components/AccountUtilizationCard";
import DoughnutChart from "~/components/DoughnutChart";
import { lastValueFrom } from "rxjs";
import { fold } from "~/utils/operators";
import BusinessReport from "~/api/client/BusinessReport";
import { use_cache } from "~/components/CacheLink";
import { useEffect } from "react";
import { on_success } from "../../success";

const log_route = `credit.report.business.experian.utilization`;

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let group_id = get_group_id(url.pathname);
	let report = new BusinessReport(group_id);
	let payload = report.experian_trade_payment_totals.report_sha.experian_trade_lines.fold;
	let response = await lastValueFrom(payload.pipe(fold(on_success(request), on_error)));
	return response;
};

const ExplanationCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">How is Credit Utilization measured?</h3>
			</div>
			<div className="border-t border-gray-200 space-y-6 p-6">
				<div className="flex flex-col w-full">
					Credit utilization is the ratio of current account balances to recent high credit balances. The
					ratio of delinquent balances to credit limits, and balances carried in relation to the rest of
					businesses in the same industry all affect business creditworthiness.
				</div>

				<div className="flex flex-col w-full">
					Since many business credit accounts don't have balance limits, this ratio can be used as an
					indicator of how much financial stress a business might be experiencing. The assumption is that the
					closer a business gets to its highest historical debt amount, the more difficult it can be for that
					business to make its payments on time.
				</div>
			</div>
		</div>
	);
};

const CreditUtilization = () => {
	let { experian_trade_payment_totals: trade_payment_totals, plan_id, report_plan_id = "builder" } = useLoaderData();
	let { trade_lines } = trade_payment_totals;

	let plan = pipe(get(report_plan_id, "business", "experian"))(plans);

	let utilization_ratio = get_account_utilization(
		trade_lines?.totalAccountBalance?.amount,
		trade_lines?.totalHighCreditAmount?.amount
	);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Credit Utilization</h3>

				{report_plan_id == "essential" && (
					<Link to={"/plans"} className="font-semibold text-blue-600 underline">
						Upgrade
					</Link>
				)}
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-1/2 h-full">
						<DoughnutChart dataset={[utilization_ratio, 100 - utilization_ratio]}>
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
							<div className={`font-semibold ${!plan.trade_lines && "blur-sm"}`}>
								{currency.format(trade_lines?.totalHighCreditAmount?.amount || 0)}
							</div>
						</div>

						<div className="flex flex-col space-y-1">
							<div>Total Balance (Current)</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							<div className={`font-semibold ${!plan.trade_lines && "blur-sm"}`}>
								{currency.format(trade_lines?.totalAccountBalance?.amount || 0)}
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
		cache_dependencies,
	} = useLoaderData();
	let use_cache_client = use_cache((state) => state.set_dependencies);

	useEffect(() => {
		if (cache_dependencies !== undefined) {
			use_cache_client({ path: `/credit/report/business/experian`, dependencies: cache_dependencies });
		}
	}, []);

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
						<AccountUtilizationCard trade_line={trade_line} key={idx} plan_id={report_plan_id} />
					))
				)(trade_lines)}
			</div>
		</div>
	);
}
