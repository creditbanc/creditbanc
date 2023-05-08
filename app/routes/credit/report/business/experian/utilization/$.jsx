import {
	HandThumbDownIcon,
	HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { useLoaderData } from "@remix-run/react";
import { mrm_credit_report, Lendflow } from "~/data/lendflow";
import { currency, mapIndexed } from "~/utils/helpers";
import { pipe, map } from "ramda";
import { get_file_id } from "~/utils/helpers";
import { prisma } from "~/utils/prisma.server";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let file_id = get_file_id(url.pathname);

	let report = await prisma.business_credit_report.findUnique({
		where: {
			id: file_id,
		},
	});

	let trade_payment_totals = Lendflow.experian.trade_payment_totals(report);

	let trade_lines = Lendflow.experian.trade_lines(report);

	return { trade_payment_totals, trade_lines };
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
	let { trade_payment_totals } = useLoaderData();
	let { trade_lines } = trade_payment_totals;

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Credit Utilization
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-1/2">a</div>
					<div className="flex flex-col w-1/2 space-y-5">
						<div className="flex flex-col space-y-1">
							<div>Total Balance (High)</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							<div className="font-semibold">
								{currency.format(
									trade_lines.totalHighCreditAmount.amount
								)}
							</div>
						</div>

						<div className="flex flex-col space-y-1">
							<div>Total Balance (Current)</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							<div className="font-semibold">
								{currency.format(
									trade_lines.totalAccountBalance.amount
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const AccountCard = ({ trade_line }) => {
	let is_current =
		trade_line.dbt30 === 0 &&
		trade_line.dbt60 === 0 &&
		trade_line.dbt90 == 0;

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					{trade_line.businessCategory}
				</h3>
			</div>
			<div className="border-t border-gray-200 p-5 pt-1">
				{is_current && (
					<div className="flex flex-row space-x-3 px-2 py-2 bg-green-100 rounded my-3">
						<div className="flex flex-col h-full justify-center w-[20px] mt-[2px]">
							<HandThumbUpIcon />
						</div>

						<div>This account is current</div>
					</div>
				)}

				{!is_current && (
					<div className="flex flex-row space-x-3 px-2 py-2 bg-red-100 rounded my-3">
						<div className="flex flex-col h-full justify-center w-[20px] mt-[2px]">
							<HandThumbDownIcon />
						</div>

						<div>This account is not current</div>
					</div>
				)}

				<div className="flex flex-col w-full [&>*:nth-child(odd)]:bg-gray-50 border rounded">
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Date Reported</div>
						<div>{trade_line.dateReported}</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Date of Last Activity
						</div>
						<div>{trade_line.dateLastActivity}</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Term</div>
						<div>{trade_line.terms}</div>
					</div>
				</div>
				<div className="flex flex-col w-full my-4">
					<div className="flex flex-col w-full space-y-2 mb-5">
						<div className="font-semibold">Payment History</div>
						<div className="flex flex-col h-[1px] bg-gray-200"></div>
						<div className="pt-3">
							This is the history of how many of your payments
							within this account were made within the terms and
							how many were not.
						</div>
					</div>
					<div className="flex flex-row w-full">
						<div className="flex flex-col items-center w-1/4 space-y-1">
							<div>High credit</div>
							<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
							<div className="font-semibold">
								{currency.format(
									trade_line.recentHighCredit.amount
								)}
							</div>
						</div>
						<div className="flex flex-col items-center w-1/4 space-y-1">
							<div>Account balance</div>
							<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
							<div className="font-semibold">
								{currency.format(
									trade_line.accountBalance.amount
								)}
							</div>
						</div>
						<div className="flex flex-col w-1/2 items-end space-y-1">
							<div className="flex flex-col items-center w-1/2">
								<div>High credit</div>
								<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
								<div className="font-semibold">
									{trade_line.currentPercentage}%
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	let { trade_lines } = useLoaderData();

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
						<AccountCard trade_line={trade_line} key={idx} />
					))
				)(trade_lines)}
			</div>
		</div>
	);
}
