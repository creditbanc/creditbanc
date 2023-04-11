import { ChartPieIcon } from "@heroicons/react/24/outline";
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
	// inspect(trade_lines);

	return trade_lines;
};

const SummaryCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<ChartPieIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-xl font-medium leading-6 text-gray-900">
						How Important is Your Account Mix?
					</h3>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col text-lg py-2 text-gray-700 font-semibold">
					<p>10% of your credit score is based on your Account Mix</p>
				</div>

				<FactorBar index={3} />

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Account mix or credit diversity accounts for 10% of your
						overall credit score. Creditors like to see that you've
						had experience with different types of credit accounts.
						This category is simply measuring whether or not that's
						the case. To do well in this category you need to have a
						several different types of accounts, such as a credit
						card, department store card, and an installment loan
						(car loan, student loan, etc.).
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
			<Accounts trade_lines={trade_lines} />
		</div>
	);
}
