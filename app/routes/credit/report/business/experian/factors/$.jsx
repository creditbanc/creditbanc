import { useLoaderData, Link } from "@remix-run/react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { get_file_id, mapIndexed } from "~/utils/helpers";
import { prisma } from "~/utils/prisma.server";
import { Lendflow } from "~/data/lendflow";
import { pipe, allPass, not } from "ramda";
import { get_user_id } from "~/utils/auth.server";
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

	let factors = Lendflow.experian.factors(report);
	let report_payload = { factors };
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
					Why are Score Factors Important?
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-6 p-6">
				<div className="flex flex-col w-full">
					Score factors or "Reason Codes" are as many as 5 statements
					that are on your credit report explaining why your credit
					score wasn't higher. Score factors are populated by the
					scoring model being used to determine your credit score. The
					numbers preceding each reason code or score factor are
					numeric identifiers; sometimes they appear with the text and
					sometimes they don't. Score factors are listed in the order
					of impact on your credit score with the factor that has the
					greatest impact listed first.
				</div>
				<div className="flex flex-col w-full">
					Even if you have excellent credit scores your credit report
					will still list 4 to 5 score factors. This is because
					lenders are required by law to provide a consumer with a
					disclosure notice if their credit report data is used in the
					review of a loan application and the application is either
					denied or the application is approved but with less than the
					best terms offer. This required disclosure includes your
					credit score and the score factors explaining why your score
					isn't higher.
				</div>
				<div className="flex flex-col w-full">
					Reason codes or score factors are very helpful as a roadmap
					to score improvement. They paint a very clear picture of the
					top reason why your score isn't higher, so you can take
					steps to improve over time.
				</div>
			</div>
		</div>
	);
};

const ScoreFactors = () => {
	let { factors, plan_id, report_plan_id } = useLoaderData();

	let plan = pipe(get(report_plan_id, "business", "experian"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Here are the factors influencing your score
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
			<div className="border-t border-gray-200 p-6">
				<div className="flex flex-col w-full space-y-6">
					{pipe(
						mapIndexed((factor, idx) => (
							<div
								className="flex flex-row items-center space-x-2"
								key={idx}
							>
								<div className="w-[20px]">
									<ChevronDoubleRightIcon />
								</div>
								<div
									className={`${!plan.factors && "blur-sm"}`}
								>
									{factor.definition}
								</div>
							</div>
						))
					)(factors)}
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	return (
		<div className="flex flex-col w-full space-y-5">
			<div>
				<ScoreFactors />
			</div>
			<div>
				<ExplanationCard />
			</div>
		</div>
	);
}
