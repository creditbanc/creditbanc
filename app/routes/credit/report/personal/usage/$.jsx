import { BeakerIcon } from "@heroicons/react/24/outline";
import { FactorBar } from "~/components/FactorBar";
import { Accounts } from "~/components/TradeLines";
import { useLoaderData } from "@remix-run/react";
import { pipe, map, filter, includes, flatten } from "ramda";
import { get_file_id, inspect } from "~/utils/helpers";
import {
	TradeLine as Tradeline,
	credit_report_data,
	CreditReport,
	Liabilities,
} from "~/data/array";
import { get_doc as get_credit_report } from "~/utils/personal_credit_report.server";
import { all, get } from "shades";
import { plans } from "~/data/plans";
import { get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let pathname = url.pathname;
	let report_id = get_file_id(pathname);
	let entity_id = await get_user_id(request);

	let report = await get_credit_report({
		resource_id: report_id,
	});

	let credit_report = CreditReport(credit_report_data);
	let liabilities = Liabilities(credit_report.liabilities());

	let trade_lines = pipe(
		map((value) => Tradeline(flatten([value]))),
		map((tl) => tl.values())
		// filter((tl) => pipe(get(all, "value"), includes("Closed"))(tl.status))
	)(liabilities.trade_lines());

	let is_owner = report.entity_id == entity_id;

	let { plan_id } = await prisma.entity.findUnique({
		where: { id: is_owner ? entity_id : report.entity_id },
		select: {
			plan_id: true,
		},
	});

	return { trade_lines, plan_id };
};

const InfoCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<BeakerIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-xl font-medium leading-6 text-gray-900">
						What is Debt Usage, and why should I care?
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
						Debt usage, also known as credit utilization, refers to
						the percentage of your available credit that you're
						currently using and is the second most important factor
						in determining your credit score. You want to keep that
						limit-to-balance ratio at or below 10% to earn maximum
						points in this category.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						For example, if you have a credit card with a $10,000
						limit, aim to keep your balance below $1,000. Anything
						more is a red flag to lenders that you're relying too
						heavily on credit and may be at risk of overextending
						yourself financially. (And you know a lender’s least
						favorite vocabulary word is “risk.”)
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						When calculating debt usage, the Credit Fairies (or
						whatever they are) analyze ALL your open accounts - even
						ones you aren’t actively using. That’s why keeping those
						accounts open is in your best interest.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Let’s say you have three credit cards. Each card has a
						$10,000 limit and carries a balance of $5,000. Total
						credit limit = $30,000. Total debt = $15,000. Total
						usage = 50%. Now, let’s say you pay off two of those
						cards (yay!). You’ll still have the $30,000 credit
						limit, but by decreasing your debt to $5,000, your ratio
						will fall from 50% to 17%. However, if you decide to
						close those two accounts, you’re really just shooting
						yourself in the foot. Your available credit will plummet
						from $30,000 to $10,000, your debt will still be $5,000,
						and you’re right back to having a 50% of your credit
						limit… and doing additional damage to your credit score.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Pro tip: Keep your balances low and request regular
						credit limit increases every 6-9 months.
					</p>
				</div>
			</div>
		</div>
	);
};

export default function Usage() {
	let { trade_lines, plan_id } = useLoaderData();

	let experian = pipe(get(plan_id, "personal", "experian", "authorized"))(
		plans
	);

	let transunion = pipe(get(plan_id, "personal", "transunion", "authorized"))(
		plans
	);

	let equifax = pipe(get(plan_id, "personal", "equifax", "authorized"))(
		plans
	);

	return (
		<div className="flex flex-col w-full">
			<InfoCard />
			<Accounts
				trade_lines={trade_lines}
				type={"usage"}
				experian={experian}
				transunion={transunion}
				equifax={equifax}
			/>
		</div>
	);
}
