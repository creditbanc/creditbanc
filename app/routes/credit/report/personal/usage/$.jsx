import { BeakerIcon } from "@heroicons/react/24/outline";
import { FactorBar } from "~/components/FactorBar";
import { Accounts } from "~/components/TradeLines";
import { useLoaderData } from "@remix-run/react";
import { pipe, map, filter, includes } from "ramda";
import { get_file_id, inspect } from "~/utils/helpers";
import { TradeLine as Tradeline } from "~/data/array";
import { get_doc as get_credit_report } from "~/utils/personal_credit_report.server";
import { all, get } from "shades";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let pathname = url.pathname;
	let report_id = get_file_id(pathname);

	let credit_report = await get_credit_report({
		resource_id: report_id,
	});

	let trade_lines = pipe(
		map(Tradeline),
		map((tl) => tl.values()),
		filter((tl) => pipe(get(all, "value"), includes("Closed"))(tl.status))
	)(credit_report.trade_lines);

	// console.log("trade_lines");
	// inspect(credit_report);

	return trade_lines;
};

const SummaryCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<BeakerIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-xl font-medium leading-6 text-gray-900">
						How Important is Your Debt Usage?
					</h3>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col text-lg py-2 text-gray-700 font-semibold">
					<p>30% of your credit score is based on your Debt Usage</p>
				</div>

				<FactorBar index={1} />

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Debt usage, or your revolving balance-to-limit ratio is
						the second most important factor in determining your
						credit score, accounting for 30% of your overall credit
						score. The higher your balance-to-limit ratio is, the
						lower your credit score will be. By keeping your
						limit-to-balance ratio at or below 10 percent, you will
						earn all the available points in this category.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						It is a common myth that you only need to keep your
						limit-to-balance ratio at 50% but that is incorrect. 50%
						is better than 90% but not as good as 40%. Your
						limit-to-balance ratio is calculated using both an
						individual account analysis as well as an aggregate
						account analysis. Additionally, accounts that are not
						being used or are old but still in good standing are
						included in this analysis. As such, it is not in a
						consumer's best interest to close such accounts or
						request that the accounts be removed from their credit
						report.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Let’s say you have two cards. One has a balance of
						$5,000 and a limit of $10,000, and the other has a
						balance of $2,000 and a limit of $8,000. That means you
						have total credit debt of $7,000 and a total credit
						limit of $18,000, which works out to a ratio of 38
						percent. Now let’s say you manage to cut your balances
						in half, so you now have just $3,500 in debt and the
						same credit limit of $18,000; your ratio will fall to 19
						percent.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Closing these accounts will cause your limit-to-balance
						ratio to increase because available credit that was once
						used in the analysis is no longer available. So even
						though your actual debt may not increase, your
						limit-to-balance ratio will causing your score to drop.
						To maintain a low limit-to-balance ratio: keep card
						balances low, request regular credit limit increases
						(every 6-9 months) or open new credit card accounts.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Of course, the safest way to keep your limit-to-balance
						ratio low is to keep balances on your current accounts
						low. Opening new accounts and/or requesting credit limit
						increases will result in additional inquiries that may
						have a negative impact on your score.
					</p>
				</div>
			</div>
		</div>
	);
};

export default function Personal() {
	let trade_lines = useLoaderData();

	return (
		<div className="flex flex-col w-full">
			<SummaryCard />
			<Accounts trade_lines={trade_lines} type={"usage"} />
		</div>
	);
}
