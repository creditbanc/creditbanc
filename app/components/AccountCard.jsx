import {
	HandThumbDownIcon,
	HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { currency } from "~/utils/helpers";
import { pipe } from "ramda";
import { plans } from "~/data/plans";
import { get } from "shades";

export default function AccountCard({ trade_line, plan_id = "essential" }) {
	let is_current =
		trade_line.dbt30 === 0 &&
		trade_line.dbt60 === 0 &&
		trade_line.dbt90 == 0;

	let plan = pipe(get(plan_id, "business", "experian"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3
					className={`text-lg font-medium leading-6 text-gray-900 ${
						!plan.trade_lines && "blur-md"
					}`}
				>
					{trade_line.businessCategory}
				</h3>
				{!plan.trade_lines && (
					<div className="font-semibold">Upgrade</div>
				)}
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
						<div className={`${!plan.trade_lines && "blur-md"}`}>
							{trade_line.dateReported}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Date of Last Activity
						</div>
						<div className={`${!plan.trade_lines && "blur-md"}`}>
							{trade_line.dateLastActivity}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Term</div>
						<div className={`${!plan.trade_lines && "blur-md"}`}>
							{trade_line.terms}
						</div>
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
							<div
								className={`font-semibold ${
									!plan.trade_lines && "blur-md"
								}`}
							>
								{currency.format(
									trade_line.recentHighCredit.amount
								)}
							</div>
						</div>
						<div className="flex flex-col items-center w-1/4 space-y-1">
							<div>Account balance</div>
							<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
							<div
								className={`font-semibold ${
									!plan.trade_lines && "blur-md"
								}`}
							>
								{currency.format(
									trade_line.accountBalance.amount
								)}
							</div>
						</div>
						<div className="flex flex-col w-1/2 items-end space-y-1">
							<div className="flex flex-col items-center w-1/2">
								<div>High credit</div>
								<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
								<div
									className={`font-semibold ${
										!plan.trade_lines && "blur-md"
									}`}
								>
									{trade_line.currentPercentage}%
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
