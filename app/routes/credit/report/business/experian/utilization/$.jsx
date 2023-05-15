import { useLoaderData } from "@remix-run/react";
import { Lendflow } from "~/data/lendflow";
import { currency, mapIndexed } from "~/utils/helpers";
import { allPass, pipe, not } from "ramda";
import { get_file_id, get_account_utilization } from "~/utils/helpers";
import { prisma } from "~/utils/prisma.server";
import { get_user_id } from "~/utils/auth.server";
import { plans } from "~/data/plans";
import { get } from "shades";
import AccountUtilizationCard from "~/components/AccountUtilizationCard";
import { report_tests } from "~/data/report_tests";
import { get_lendflow_report } from "~/utils/lendflow.server";
import { update_business_report } from "~/utils/business_credit_report.server";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let file_id = get_file_id(url.pathname);
	let entity_id = await get_user_id(request);

	let report = await prisma.business_credit_report.findUnique({
		where: {
			id: file_id,
		},
	});

	let is_owner = report.entity_id == entity_id;

	let { plan_id } = await prisma.entity.findUnique({
		where: { id: is_owner ? entity_id : report.entity_id },
		select: {
			plan_id: true,
		},
	});

	if (pipe(allPass(report_tests[plan_id]["experian"]), not)(report)) {
		console.log("didnotpass");
		let lendflow_report = await get_lendflow_report(report.application_id);
		report = await update_business_report(report.id, lendflow_report);
	}

	let trade_payment_totals = Lendflow.experian.trade_payment_totals(report);
	let trade_lines = Lendflow.experian.trade_lines(report);
	let report_payload = { trade_payment_totals, trade_lines };
	// console.log("report_payload");
	// console.log(report_payload);
	return { ...report_payload, plan_id };
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
					Payment status on commercial accounts is treated much
					differently than personal accounts. On the personal side, a
					consumer has 30 days after a payment is due to pay before a
					late payment can be reported on their credit. It's not the
					same with business credit. A creditor can report a late or
					slow payment the day after it's due. So if your business is
					only 1 day late making a payment, it can be reported as late
					or slow on your business credit. The more promptly you make
					your payments, the better your business credit score can be.
				</div>
			</div>
		</div>
	);
};

const CreditUtilization = () => {
	let { trade_payment_totals, plan_id } = useLoaderData();
	let { trade_lines } = trade_payment_totals;

	let plan = pipe(get(plan_id, "business", "experian"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Credit Utilization
				</h3>

				{!plan.trade_lines && (
					<div className="font-semibold">Upgrade</div>
				)}
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-1/2 h-full">
						<div className="flex flex-col items-center">
							{get_account_utilization(
								trade_lines?.totalAccountBalance?.amount,
								trade_lines?.totalHighCreditAmount?.amount
							)}
							%
						</div>
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
	let { trade_lines, plan_id } = useLoaderData();

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
							plan_id={plan_id}
						/>
					))
				)(trade_lines)}
			</div>
		</div>
	);
}
