import { useLoaderData, Link } from "@remix-run/react";
import { Lendflow } from "~/data/lendflow";
import { allPass, pipe, not } from "ramda";
import { get_file_id } from "~/utils/helpers";
import { get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { plans } from "~/data/plans";
import { get } from "shades";
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

	let derogatories = Lendflow.experian.derogatories(report);
	let report_payload = { derogatories };
	let report_plan_id = report?.plan_id || "essential";

	return { ...report_payload, plan_id, report_plan_id };
};

const Derogatories = () => {
	let { plan_id, derogatories, report_plan_id } = useLoaderData();

	let plan = pipe(get(report_plan_id, "business", "experian"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Derogatories
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
						<div className="flex flex-col w-3/4 font-semibold">
							Derogatories
						</div>
						<div className={`${!plan.derogatories && "blur-sm"}`}>
							{derogatories?.legalFilingsSummary?.legalCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4 font-semibold">
							Total legal filings
						</div>
						<div className={`${!plan.derogatories && "blur-sm"}`}>
							{derogatories?.legalFilingsSummary
								?.derogatoryLegalCount || 0}
						</div>
					</div>
				</div>
				<div className="flex flex-row w-full text-sm">
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Collections</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div className={`${!plan.derogatories && "blur-sm"}`}>
							{derogatories?.legalFilingsCollectionsSummary
								?.collectionCount || 0}
						</div>
					</div>
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Liens</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div className={`${!plan.derogatories && "blur-sm"}`}>
							{derogatories?.legalFilingsCollectionsSummary
								?.lienCount || 0}
						</div>
					</div>
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Judgments</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div className={`${!plan.derogatories && "blur-sm"}`}>
							{derogatories?.legalFilingsCollectionsSummary
								?.judgmentCount || 0}
						</div>
					</div>
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Legal</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div className={`${!plan.derogatories && "blur-sm"}`}>
							{derogatories?.legalFilingsCollectionsSummary
								?.derogatoryLegalCount || 0}
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
					Payment status on commercial accounts is treated much
					differently than personal accounts. On the personal side, a
					consumer has 30 days after a payment is due to pay before a
					late payment can be reported on their credit. It's not the
					same with business credit. A creditor can report a late or
					slow payment the day after it's due. So if your business is
					only 1 day late making a payment, it can be reported as late
					or slow on your business credit. The more promptly you make
					your payments, the better your business credit score can be.
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	return (
		<div className="flex flex-col w-full space-y-5">
			<div>
				<Derogatories />
			</div>
			<div>
				<ExplanationCard />
			</div>
		</div>
	);
}
