import { ClockIcon } from "@heroicons/react/24/outline";
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
					<ClockIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-xl font-medium leading-6 text-gray-900">
						How Important is Your Credit Age?
					</h3>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col text-lg py-2 text-gray-700 font-semibold">
					<p>15% of your credit score is based on your Credit Age</p>
				</div>

				<FactorBar index={2} />

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Credit age accounts for 15% of your overall credit
						score. There are two important factors considered in the
						analysis of your credit age: 1) your average credit
						account age and 2) your credit birthday or the date you
						opened your first credit account. In your case, your
						credit birthday is 10/01/1999. Your average age of your
						accounts is 9 years and 1 months. This is determined by
						taking the age of each account on your credit report and
						averaging them together. As time goes by, both of these
						factors will get better because your existing accounts
						will get older. However, you should be careful about
						opening new accounts.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						A new account will lower the average age of all
						accounts. Also, it's a big mistake to close an old
						credit account that you are no longer using - doing so
						can lower your credit score because your average account
						age may drop. Removing old accounts in good standing
						from your credit report makes your credit history look
						younger than it really is. Don't worry; old negative
						accounts will automatically be removed from your credit
						report when their statute of limitations has expired.
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
