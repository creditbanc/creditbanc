import {
	HandThumbDownIcon,
	HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { useLoaderData, Link } from "@remix-run/react";
import { mrm_credit_report, Lendflow } from "~/data/lendflow";
import { currency, get_group_id, mapIndexed } from "~/utils/helpers";
import { pipe, map, head } from "ramda";
import { get_file_id } from "~/utils/helpers";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { plans } from "~/data/plans";
import { get } from "shades";
import AccountCard from "~/components/AccountCard";
import { get_collection, get_doc } from "~/utils/firebase";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let entity_id = await get_session_entity_id(request);

	let group_id = get_group_id(url.pathname);

	let business_credit_report_queries = [
		{
			param: "group_id",
			predicate: "==",
			value: group_id,
		},
		{
			param: "type",
			predicate: "==",
			value: "business_credit_report",
		},
	];

	let report_response = await get_collection({
		path: ["credit_reports"],
		queries: business_credit_report_queries,
	});

	let report = pipe(head)(report_response);

	let is_owner = report.entity_id == entity_id;

	let { plan_id } = await get_doc(["entity", entity_id]);

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
					If you've been playing the "paying bills late" game, your
					average Days Beyond Terms (DBT) is going to go up...which
					means your credit score is going to go down. (Past behavior
					predicts future behavior, right?) This is the type of trend
					you don't want to be a part of.
				</div>

				<div className="flex flex-col w-full">
					It's also important to remember that personal and business
					credit have different criteria for "late" bills. Any bill at
					least 30 days overdue is considered delinquent on your
					personal credit score. However, business credit has a
					variety of payment terms (we're talking Net 30, Net 60,
					etc.). So, if you're supposed to pay within 60 days but wait
					until day 67, the DBT is 7. A higher DBT = a negative impact
					on your credit score.
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
