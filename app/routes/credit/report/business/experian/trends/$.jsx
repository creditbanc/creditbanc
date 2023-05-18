import { useLoaderData, Link } from "@remix-run/react";
import { Lendflow } from "~/data/lendflow";
import { pipe, allPass, head, not, defaultTo, tryCatch, always } from "ramda";
import { get_file_id, mapIndexed } from "~/utils/helpers";
import { prisma } from "~/utils/prisma.server";
import { get_user_id } from "~/utils/auth.server";
import { plans } from "~/data/plans";
import { get } from "shades";
import AccountCard from "~/components/AccountCard";
import { report_tests } from "~/data/report_tests";
import { get_lendflow_report } from "~/utils/lendflow.server";
import { update_business_report } from "~/utils/business_credit_report.server";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let file_id = get_file_id(url.pathname);
	let entity_id = await get_user_id(request);

	let report = await prisma.business_credit_report.findUnique({
		where: {
			id: file_id,
		},
	});

	let is_owner = report.entity_id == entity_id;

	let { plan_id } = await prisma.entity.findUnique({
		where: { id: is_owner ? entity_id : report.entity_id },
		select: {
			plan_id: true,
		},
	});

	if (pipe(allPass(report_tests[plan_id]["experian"]), not)(report)) {
		console.log("didnotpass");
		let lendflow_report = await get_lendflow_report(report.application_id);
		report = await update_business_report(report.id, lendflow_report);
	}

	let payment_trends = Lendflow.experian.payment_trends(report);
	let trade_lines = Lendflow.experian.trade_lines(report);
	let report_payload = { payment_trends, trade_lines };
	let report_plan_id = report?.plan_id || "essential";
	// console.log("report_payload");
	// console.log(report_payload);
	return { ...report_payload, plan_id, report_plan_id };
};

const ExplanationCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					What are Payment Trends?
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-6 p-6">
				<div className="flex flex-col w-full">
					If you are paying your bills increasingly late, your payment
					trend can show that your average DBT (Days Beyond Terms) is
					increasing, and your score could take a hit. In contrast,
					paying your bills on time or early can lower your average
					DBT and impact your score. Slow or late payments trends, as
					well as total number of delinquent accounts are the most
					important factors to consider within the payment status
					category.
				</div>

				<div className="flex flex-col w-full">
					In personal credit, a bill is considered late when it is at
					least 30 days overdue. But in business credit, there are a
					wide variety of payment terms such as Net 30, Net 60, etc.
					So, for example, if a business is supposed to pay its bills
					within 60 days and the business pays on day 67, the DBT is
					7. Your business credit can be negatively impacted the
					higher your DBT is.
				</div>
			</div>
		</div>
	);
};

const PaymentTrendsCard = () => {
	let { plan_id, payment_trends, report_plan_id } = useLoaderData();

	let plan = pipe(get(report_plan_id, "business", "experian"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Payment Trends
				</h3>

				{report_plan_id == "essential" && (
					<Link
						to={"/plans"}
						className="font-semibold text-blue-600 underline"
					>
						Upgrade
					</Link>
				)}
			</div>
			<div className="border-t border-gray-200 p-5">
				<div className="flex flex-col w-full [&>*:nth-child(odd)]:bg-gray-50 border rounded">
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Predicted DBT (Days Beyond Terms)
						</div>
						<div className={`${!plan.trends && "blur-sm"}`}>
							{pipe(
								head,
								tryCatch(get("dbt"), always(0))
							)(payment_trends)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	let { trade_lines, plan_id, report_plan_id } = useLoaderData();

	return (
		<div className="flex flex-col w-full space-y-5">
			<div>
				<PaymentTrendsCard />
			</div>
			<div>
				<ExplanationCard />
			</div>
			<div className="flex flex-col space-y-4">
				{pipe(
					mapIndexed((trade_line, idx) => (
						<AccountCard
							trade_line={trade_line}
							key={idx}
							plan_id={report_plan_id}
						/>
					))
				)(trade_lines)}
			</div>
		</div>
	);
}
