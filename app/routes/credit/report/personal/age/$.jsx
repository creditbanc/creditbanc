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

const InfoCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<ClockIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-xl font-medium leading-6 text-gray-900">
						Your Credit Age is more than just a number.
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
						Your credit age refers to the length of time you have
						had accounts open, such as credit cards, loans, or
						mortgages. Two important factors are considered: 1) your
						average credit age and 2) your credit birthday/the date
						you opened your first credit account.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						In your case, your credit birthday is _____, and the
						average age of your accounts is ________. And just like
						you (aging like fine wine), these factors will improve
						over time as your existing accounts grow older.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						This is why you should be careful about opening new
						accounts and closing old accounts; both will affect your
						credit age. A new account will lower the average age of
						all your accounts. Likewise, pulling the plug on an old
						credit account will make your credit history look
						younger than it really is.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Remember, when it comes to credit age, the older, the
						better! A long track record of timely payments and
						responsible borrowing is what lenders love to see, and
						can score you better interest rates and higher credit
						limits. And if you’re worried about old negative
						accounts cramping your style - don’t worry: They’ll be
						automatically removed from your credit report when their
						statute of limitations has expired.
					</p>
				</div>
			</div>
		</div>
	);
};

export default function Age() {
	let trade_lines = useLoaderData();

	return (
		<div className="flex flex-col w-full">
			<InfoCard />
			<Accounts trade_lines={trade_lines} />
		</div>
	);
}
