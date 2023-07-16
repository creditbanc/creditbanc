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

	let payment_status = Lendflow.dnb.payment_status(report);
	let report_plan_id = report?.plan_id || "essential";

	return { payment_status, plan_id, report_plan_id };
};

const PaymentStatus = () => {
	let { payment_status, report_plan_id } = useLoaderData();
	let plan = pipe(get(report_plan_id, "business", "dnb"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Payment Status
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
							Maximum Owed Amount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.maximumOwedAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Total Past DueAmount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.totalPastDueAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Maximum Past Due Amount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.maximumPastDueAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Slow Experiences Count
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.slowExperiencesCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Negative Payments Count
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.negativePaymentsCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Payment Behavior Result
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.paymentBehaviorResult
								?.description || ""}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Bad Debt ExperiencesCount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.badDebtExperiencesCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Maximum High Credit Amount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.maximumHighCreditAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Bad Debt Experiences Amount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.badDebtExperiencesAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Negative Experiences Amount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.negativeExperiencesAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Slow Experiences Percentage
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.slowExperiencesPercentage || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Slow Or Negative Payments Count
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.slowOrNegativePaymentsCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Unfavorable Experiences Count
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.unfavorableExperiencesCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Bad Debt Experiences Percentage
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.badDebtExperiencesPercentage || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Unfavorable Experiences Amount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.unfavorableExperiencesAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Negative Experiences Percentage
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.negativeExperiencesPercentage || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Slow And Negative Experiences Amount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.slowAndNegativeExperiencesAmount ||
								0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Slow Or Negative Payments Percentage
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.slowOrNegativePaymentsPercentage ||
								0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Unfavorable Experiences Percentage
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.unfavorableExperiencesPercentage ||
								0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Slow Experiences Highest Credit Amount
						</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.slowExperiencesHighestCreditAmount ||
								0}
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
					How is Payment Status Important?
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-col w-full">
					Paying on time isn't just good manners, it's good for your
					credit report - especially for your business credit. While
					there's a 30-day window before a late payment appears on
					your personal credit report, your business credit is less
					forgiving. In fact, late payments can show up on your
					business credit report the very next day. And we all know
					how lenders feel about late payments.
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	let { plan_id } = useLoaderData();

	return (
		<div className="flex flex-col w-full space-y-5">
			<div>
				<ExplanationCard />
			</div>
			<div>
				<PaymentStatus />
			</div>
		</div>
	);
}
