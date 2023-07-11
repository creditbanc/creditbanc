import { TrophyIcon } from "@heroicons/react/24/outline";
import { pipe, map, filter, includes, flatten } from "ramda";
import { get_file_id, inspect, mapIndexed } from "~/utils/helpers";
import {
	TradeLine as Tradeline,
	CreditReport,
	Liabilities,
	credit_report_data,
} from "~/data/array";
import { get_doc as get_credit_report } from "~/utils/personal_credit_report.server";
import { get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { useLoaderData } from "@remix-run/react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
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
	let factors = credit_report.factors();
	let inquiries = credit_report.inquiries();

	// console.log("inquiries");
	// inspect(inquiries);

	let is_owner = report.entity_id == entity_id;

	let { plan_id } = await prisma.entity.findUnique({
		where: { id: is_owner ? entity_id : report.entity_id },
		select: {
			plan_id: true,
		},
	});

	return { factors, plan_id, report_plan_id: report?.plan_id };
};

const InfoCard = () => {
	return (
		<div className="flex flex-col h-fit bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<TrophyIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						What Exactly are Score Factors?
					</h3>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Score factors, also called “Reason Codes,” are
						statements on your credit report explaining why your
						credit score wasn’t higher. They include things like
						late payments, high credit card balances, or too many
						credit inquiries - and are listed in order of impact,
						starting with the factor that has the most significant
						impact first.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Even with excellent credit, you’ll still see 4-5 score
						factors. This is because whenever your credit report
						data is reviewed for a loan application (those hard
						inquiries we mentioned earlier), lenders are legally
						required to provide consumers (you) with a disclosure
						notice. You’ll receive this notice regardless of whether
						they denied your application - or it was approved, but
						with less than the best terms offered.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Don’t sleep on this! If you want to improve your credit
						score, pay attention to your Score Factors! They explain
						why your score isn’t higher - and will help you take the
						steps necessary to improve it over time.
					</p>
				</div>
			</div>
		</div>
	);
};

const ScoreFactors = () => {
	let { factors, report_plan_id } = useLoaderData();

	// let plan = pipe(get(report_plan_id, "business", "experian"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Here are the factors influencing your score
				</h3>

				{/* {report_plan_id == "essential" && (
					<Link
						to={"/plans"}
						className="font-semibold text-blue-600 underline"
					>
						Upgrade
					</Link>
				)} */}
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
								<div>{factor["@_Text"]}</div>
							</div>
						))
					)(factors)}
				</div>
			</div>
		</div>
	);
};

export default function Factors() {
	let { coordinates } = useReportPageLayoutStore();

	return (
		<div
			className={`flex flex-col w-full h-full scrollbar-none py-5 ${
				coordinates.top < 145 ? "overflow-scroll" : "overflow-hidden"
			}`}
		>
			<InfoCard />

			<div className="my-5">
				<ScoreFactors />
			</div>
		</div>
	);
}
