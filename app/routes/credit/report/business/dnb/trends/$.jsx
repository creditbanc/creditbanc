import {
	HandThumbDownIcon,
	HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { useLoaderData, Link } from "@remix-run/react";
import { mrm_credit_report, Lendflow } from "~/data/lendflow";
import { currency, mapIndexed } from "~/utils/helpers";
import { pipe, map } from "ramda";
import { get_file_id } from "~/utils/helpers";
import { get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { plans } from "~/data/plans";
import { get } from "shades";
import AccountCard from "~/components/AccountCard";

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

	let payment_trends = Lendflow.dnb.payment_trends(report);
	let report_plan_id = report?.plan_id || "essential";

	return { payment_trends, plan_id, report_plan_id };
};

const PaymentTrends = () => {
	let { credit_utilization: data, report_plan_id } = useLoaderData();

	let plan = pipe(get(report_plan_id, "business", "dnb"))(plans);

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
			<div className="border-t border-gray-200 p-5 space-y-5">
				<div className="flex flex-col w-full [&>*:nth-child(odd)]:bg-gray-50 border rounded">
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Bad Debt Experiences Count
						</div>
						<div className={`${!plan.trends && "blur-sm"}`}>
							{data?.badDebtExperiencesCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Total Past Due Experiences Count
						</div>
						<div className={`${!plan.trends && "blur-sm"}`}>
							{data?.badDebtExperiencesCount || 0}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
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
					trend may show that your average DBT (Days Beyond Terms) is
					increasing, and your score could take a hit. In contrast,
					paying your bills on time or early may lower your average
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
					7. Your business credit may be negatively impacted the
					higher your DBT is.
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	let { trade_lines, plan_id } = useLoaderData();

	return (
		<div className="flex flex-col w-full space-y-5">
			<div>
				<ExplanationCard />
			</div>
			<div>
				<PaymentTrends />
			</div>
		</div>
	);
}
