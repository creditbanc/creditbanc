import { useLoaderData } from "@remix-run/react";
import { currency, get_group_id, mapIndexed, get } from "~/utils/helpers";
import { pipe } from "ramda";
import { plans } from "~/data/plans";
import AccountCard from "~/components/AccountCard";
import DoughnutChart from "~/components/DoughnutChart";
import { lastValueFrom } from "rxjs";
import { fold } from "~/utils/operators";
import BusinessReport from "~/api/client/BusinessReport";

const log_route = `credit.report.business.experian.status`;

const on_success = (response) => {
	console.log(`${log_route}.success`);
	return response;
};

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let group_id = get_group_id(url.pathname);
	let report = new BusinessReport(group_id);
	let response = report.experian_trade_payment_totals.experian_trade_lines.fold;
	return await lastValueFrom(response.pipe(fold(on_success, on_error)));
};

const PaymentStatus = () => {
	let { experian_trade_payment_totals: trade_payment_totals, plan_id, report_plan_id = "builder" } = useLoaderData();
	let { trade_lines: trade_lines_payment_totals } = trade_payment_totals;

	// let plan = pipe(get(plan_id, "business", "experian"))(plans);
	let plan = pipe(get("builder", "business", "experian"))(plans);

	let trade_count = trade_lines_payment_totals?.tradelineCount || 0;
	let delinquent_count = trade_lines_payment_totals?.dbt30 || 0;
	let delinquent_ratio = (delinquent_count / trade_count) * 100;
	delinquent_ratio = isNaN(delinquent_ratio) ? 0 : delinquent_ratio;
	let doughnut_dataset = delinquent_ratio > 100 ? [100, 0] : [delinquent_ratio, 100 - delinquent_ratio];

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Payment Status</h3>

				{/* {report_plan_id == "essential" && (
					<Link to={"/plans"} className="font-semibold text-blue-600 underline">
						Upgrade
					</Link>
				)} */}
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
							{plan.trade_lines_payment_totals && <div className="font-semibold">{trade_count}</div>}

							{!plan.trade_lines_payment_totals && <div className="font-semibold">Upgrade</div>}
						</div>

						<div className="flex flex-col space-y-1">
							<div>Delinquent Accounts</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							{plan.trade_lines_payment_totals && <div className="font-semibold">{delinquent_count}</div>}

							{!plan.trade_lines_payment_totals && <div className="font-semibold">Upgrade</div>}
						</div>

						<div className="flex flex-col space-y-1">
							<div>Balance of all accounts</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							{plan.trade_lines_payment_totals && (
								<div className="font-semibold">
									{currency.format(trade_lines_payment_totals?.totalAccountBalance?.amount || 0)}
								</div>
							)}

							{!plan.trade_lines_payment_totals && <div className="font-semibold">Upgrade</div>}
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
					Paying on time isn't just good manners, it's good for your credit report - especially for your
					business credit. While there's a 30-day window before a late payment appears on your personal credit
					report, your business credit is less forgiving. In fact, late payments can show up on your business
					credit report the very next day. And we all know how lenders feel about late payments.
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	let loader_data = useLoaderData();
	let { experian_trade_lines: trade_lines = [], plan_id, report_plan_id = "builder" } = loader_data;

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
						<AccountCard trade_line={trade_line} key={idx} plan_id={report_plan_id} />
					))
				)(trade_lines)}
			</div>
		</div>
	);
}
