import {
	HandThumbDownIcon,
	HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { useLoaderData } from "@remix-run/react";
import { mrm_credit_report, Lendflow } from "~/data/lendflow";
import { currency, mapIndexed } from "~/utils/helpers";
import { pipe, map } from "ramda";
import { get_file_id } from "~/utils/helpers";
import { get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { plans } from "~/data/plans";
import { get } from "shades";
import AccountCard from "~/components/AccountCard";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let file_id = get_file_id(url.pathname);
	let entity_id = await get_user_id(request);

	let { plan_id } = await prisma.entity.findUnique({
		where: { id: entity_id },
		select: {
			plan_id: true,
		},
	});

	let report = await prisma.business_credit_report.findUnique({
		where: {
			id: file_id,
		},
	});

	let trade_payment_totals = Lendflow.experian.trade_payment_totals(report);

	let trade_lines = Lendflow.experian.trade_lines(report);

	return { trade_payment_totals, trade_lines, plan_id };
};

const PaymentStatus = () => {
	let { trade_payment_totals, plan_id } = useLoaderData();
	let { trade_lines: trade_lines_payment_totals } = trade_payment_totals;

	let plan = pipe(get(plan_id, "business", "experian"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Payment Status
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-1/2">a</div>
					<div className="flex flex-col w-1/2 space-y-5">
						<div className="flex flex-col space-y-1">
							<div>Active Accounts</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							{plan.trade_lines_payment_totals && (
								<div className="font-semibold">
									{trade_lines_payment_totals.tradelineCount}
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
									{trade_lines_payment_totals.dbt30}
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
											.totalAccountBalance.amount
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

export default function Container() {
	let { trade_lines, plan_id } = useLoaderData();

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
							plan_id={plan_id}
						/>
					))
				)(trade_lines)}
			</div>
		</div>
	);
}
