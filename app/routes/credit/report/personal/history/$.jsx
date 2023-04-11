import { BookOpenIcon } from "@heroicons/react/24/outline";
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

	return trade_lines;
};

const PersonalInfoCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<BookOpenIcon />
				</div>
				<div className="flex flex-col">
					<p className="text-xl font-medium leading-6 text-gray-900">
						How Important is Your Payment History?
					</p>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col text-lg py-2 text-gray-700 font-semibold">
					<p>35% of your credit score is based on Payment History</p>
				</div>

				<FactorBar />

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Your payment history is one of the two most important
						factors in determining your credit score, accounting for
						35% of your overall credit score. To make sure you earn
						all the credit score points possible, make sure to pay
						all your accounts on time and avoid collections, public
						records or other derogatory information.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Because this is the most important credit score category
						you also have the most to lose. If any serious negative
						information is reported on your credit report you can
						expect your score to drop significantly. Most negative
						information can remain on your credit report for up to
						seven years so once you have negative information, it is
						a long road before you'll have good credit again.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						The good news is that the older the negative
						information, the less it hurts your score. Payment
						history is typically reported on your credit report for
						the last 24 months. This means late payments that
						occurred prior to the 24 month history may not show up
						on your credit report with any specificity.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						On your Credit Banc report, any late payments are shown
						under the Payment History box on the left of each
						individual credit account.
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
			<PersonalInfoCard />
			<Accounts trade_lines={trade_lines} />
		</div>
	);
}
