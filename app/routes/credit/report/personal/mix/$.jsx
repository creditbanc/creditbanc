import { ChartPieIcon } from "@heroicons/react/24/outline";
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
import { useReportPageLayoutStore } from "~/stores/useReportPageLayoutStore";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let pathname = url.pathname;
	let report_id = get_file_id(pathname);
	let entity_id = await get_user_id(request);

	let report = await get_credit_report({
		resource_id: report_id,
	});

	let credit_report = CreditReport(report.data);
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
		<div className="flex flex-col h-fit bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<ChartPieIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-xl font-medium leading-6 text-gray-900">
						How Important is My Account Mix?
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
						Just like you should diversify your investments, you
						should diversify your debt; creditors like to see you’ve
						had experience with different types of credit accounts.
						To ace this category, you should have a mix of revolving
						credit (credit cards, installment loans, store cards,
						etc.) and installment loans (car loans, student loans,
						mortgages, etc.).
					</p>
				</div>
			</div>
		</div>
	);
};

export default function Mix() {
	let { trade_lines, plan_id } = useLoaderData();
	let { coordinates } = useReportPageLayoutStore();

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
		<div
			className={`flex flex-col w-full h-full scrollbar-none py-5 ${
				coordinates.top < 145 ? "overflow-scroll" : "overflow-hidden"
			}`}
		>
			<InfoCard />
			<Accounts
				trade_lines={trade_lines}
				experian={experian}
				transunion={transunion}
				equifax={equifax}
			/>
		</div>
	);
}
