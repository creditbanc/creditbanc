import {
	HandThumbDownIcon,
	HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { useLoaderData, Link } from "@remix-run/react";
import { mrm_credit_report, Lendflow } from "~/data/lendflow";
import { currency, get_group_id, mapIndexed } from "~/utils/helpers";
import { pipe, map, head } from "ramda";
import { get_file_id } from "~/utils/helpers";
import { get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { plans } from "~/data/plans";
import { get } from "shades";
import AccountCard from "~/components/AccountCard";
import { get_collection } from "~/utils/firebase";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let file_id = get_file_id(url.pathname);
	let entity_id = await get_user_id(request);

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

	let { plan_id } = await prisma.entity.findUnique({
		where: { id: is_owner ? entity_id : report.entity_id },
		select: {
			plan_id: true,
		},
	});

	let credit_utilization = Lendflow.dnb.credit_utilization(report);
	let report_plan_id = report?.plan_id || "essential";

	return { credit_utilization, plan_id, report_plan_id };
};

const CreditUtilization = () => {
	let { credit_utilization: data, report_plan_id } = useLoaderData();

	let plan = pipe(get(report_plan_id, "business", "dnb"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6  flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Credit Utilization
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
							Average High Credit Amount
						</div>
						<div
							className={`${
								!plan.credit_utilization && "blur-sm"
							}`}
						>
							{data?.averageHighCreditAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Maximum High Credit Amount
						</div>
						<div
							className={`${
								!plan.credit_utilization && "blur-sm"
							}`}
						>
							{data?.maximumHighCreditAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							High Credit Experiences Count
						</div>
						<div
							className={`${
								!plan.credit_utilization && "blur-sm"
							}`}
						>
							{data?.highCreditExperiencesCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Satisfactory Experiences Count
						</div>
						<div
							className={`${
								!plan.credit_utilization && "blur-sm"
							}`}
						>
							{data?.satisfactoryExperiencesCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Satisfactory Experiences Amount
						</div>
						<div
							className={`${
								!plan.credit_utilization && "blur-sm"
							}`}
						>
							{data?.satisfactoryExperiencesAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Satisfactory Experiences Percentage
						</div>
						<div
							className={`${
								!plan.credit_utilization && "blur-sm"
							}`}
						>
							{data?.satisfactoryExperiencesPercentage || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							Slow Experiences Highest Credit Amount
						</div>
						<div
							className={`${
								!plan.credit_utilization && "blur-sm"
							}`}
						>
							{data?.slowExperiencesHighestCreditAmount || 0}
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
					Explain Credit Utilization and Why I Should Care
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-6 p-6">
				<div className="flex flex-col w-full">
					One way your business's street cred (or should we say
					creditworthiness?) is determined is by how much credit
					you're using, a.k.a: Credit Utilization. It looks at the
					ratio of current account balances to recent high credit
					balances. Because many business accounts don't have balance
					limits, this ratio can reveal if you're feeling the
					financial heat. The closer a business gets to its highest
					historical debt amount, the more difficult it might be for
					said business to make on-time payments.
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
				<CreditUtilization />
			</div>
		</div>
	);
}
