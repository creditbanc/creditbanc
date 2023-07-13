import { BookOpenIcon } from "@heroicons/react/24/outline";
import { FactorBar } from "~/components/FactorBar";
import { Accounts } from "~/components/TradeLines";
import { useLoaderData } from "@remix-run/react";
import { pipe, map, filter, includes, flatten, head } from "ramda";
import { get_file_id, get_group_id, inspect } from "~/utils/helpers";
import {
	TradeLine as Tradeline,
	CreditReport,
	Liabilities,
	credit_report_data,
} from "~/data/array";
import { get_doc as get_credit_report } from "~/utils/personal_credit_report.server";
import { all, get } from "shades";
import { plans } from "~/data/plans";
import { get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { useReportPageLayoutStore } from "~/stores/useReportPageLayoutStore";

import { get_collection, get_doc, set_doc } from "~/utils/firebase";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let pathname = url.pathname;
	// let report_id = get_file_id(pathname);
	let entity_id = await get_user_id(request);
	let group_id = get_group_id(pathname);

	// let report = await get_credit_report({
	// 	resource_id: report_id,
	// });

	let personal_credit_report_queries = [
		{
			param: "group_id",
			predicate: "==",
			value: group_id,
		},
		{
			param: "type",
			predicate: "==",
			value: "personal_credit_report",
		},
	];

	let report_response = await get_collection({
		path: ["credit_reports"],
		queries: personal_credit_report_queries,
	});

	let report = pipe(head)(report_response);

	// console.log("report");
	// console.log(report);

	// await set_doc(["credit_reports", report_id], { ...report, group_id });
	// console.log("report_saved");

	let credit_report = CreditReport(report.data);
	let liabilities = Liabilities(credit_report.liabilities());

	let is_owner = report.entity_id == entity_id;

	let { plan_id } = await prisma.entity.findUnique({
		where: { id: is_owner ? entity_id : report.entity_id },
		select: {
			plan_id: true,
		},
	});

	let trade_lines = pipe(
		map((value) => Tradeline(flatten([value]))),
		map((tl) => tl.values())
		// filter((tl) => pipe(get(all, "value"), includes("Closed"))(tl.status))
	)(liabilities.trade_lines());

	return { trade_lines, plan_id };
};

const InfoCard = () => {
	return (
		<div className="flex flex-col h-fit bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<BookOpenIcon />
				</div>
				<div className="flex flex-col">
					<p className="text-xl font-medium leading-6 text-gray-900">
						Payment History: What’s the big deal?
					</p>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col text-lg py-2 text-gray-700 font-semibold">
					<p>35% of your credit score is based on Payment History</p>
				</div>

				<FactorBar />

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						It’s kind of a big deal, actually. We’re talking 35% of
						your overall credit score.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Payment history (your track record for paying bills and
						debts on time) is one of the two most important factors
						in determining your credit score. It's like a financial
						report card that lenders and creditors use to assess
						your creditworthiness. If you’re consistently making
						on-time payments, good job! Gold stars all around.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						But if your report comes back with a history of late
						payments, missed payments, or accounts sent to
						collections, you’ll see your credit score drop faster
						than a skydiver without a parachute. This is going to
						make it harder to get approved for lines of credit and
						may also result in higher interest rates.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						(And not to add salt to the wound, but most negative
						information on your payment history can stay on your
						credit report for up to seven years.)
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						The good news is that the older the negative
						information, the less it hurts your score. (Time heals
						all wounds, right?) Generally speaking, late payments
						that occurred 2+ years ago may not even show up on your
						credit report with any specificity.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Regardless, it’s crucial to prioritize your payment
						history and always strive to pay bills on time. Set up
						automatic payments, create reminders, and budget wisely
						to ensure you're on top of your payment game.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700">
					<p>
						Your Credit Banc report shows any late payments under
						the Payment History box on the left of each credit
						account.
					</p>
				</div>
			</div>
		</div>
	);
};

export default function History() {
	let { trade_lines, plan_id } = useLoaderData();
	let { coordinates } = useReportPageLayoutStore();

	let experian = pipe(get(plan_id, "personal", "experian", "authorized"))(
		plans
	);
	let equifax = pipe(get(plan_id, "personal", "equifax", "authorized"))(
		plans
	);
	let transunion = pipe(get(plan_id, "personal", "transunion", "authorized"))(
		plans
	);

	return (
		<div className={`flex flex-col w-full h-full py-5`}>
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
