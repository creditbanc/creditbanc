import { useLoaderData } from "@remix-run/react";
import { Lendflow } from "~/data/lendflow";
import { currency, get_group_id } from "~/utils/helpers";
import { head, pipe, allPass, not } from "ramda";
import { get_file_id } from "~/utils/helpers";
import { prisma } from "~/utils/prisma.server";
import { get_user_id } from "~/utils/auth.server";
import { plans } from "~/data/plans";
import { get } from "shades";
import { report_tests } from "~/data/report_tests";
import { get_lendflow_report } from "~/utils/lendflow.server";
import { update_business_report } from "~/utils/business_credit_report.server";
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

	if (pipe(allPass(report_tests[plan_id]["experian"]), not)(report)) {
		console.log("didnotpass");
		let lendflow_report = await get_lendflow_report(report.application_id);
		report = await set_doc(["credit_reports", report.id], {
			...report,
			...lendflow_report,
		});
	}

	let years_on_file = Lendflow.experian.years_on_file(report);
	let employee_size = Lendflow.experian.employee_size(report);
	let sic_code = head(Lendflow.experian.sic_codes(report));
	let naics_code = head(Lendflow.experian.naics_codes(report));
	let sales_revenue = Lendflow.experian.sales_revenue(report);
	let business = Lendflow.business(report);
	let report_plan_id = report?.plan_id || "essential";

	let report_payload = {
		years_on_file,
		employee_size,
		sic_code,
		naics_code,
		sales_revenue,
		business,
	};
	// console.log("report_payload");
	// console.log(report_payload);
	return { ...report_payload, plan_id, report_plan_id };
};

const ExplanationCard = () => {
	let {
		years_on_file,
		employee_size,
		sic_code,
		naics_code,
		sales_revenue,
		business,
		plan_id,
		report_plan_id,
	} = useLoaderData();

	let plan = pipe(get(report_plan_id, "business", "experian"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Company Information
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-col w-full space-y-2">
					{plan.years_on_file && (
						<div className="flex flex-col font-semibold">
							{years_on_file} Years in business
						</div>
					)}

					{report_plan_id == "essential" && (
						<Link
							to={"/plans"}
							className="font-semibold text-blue-600 underline"
						>
							Upgrade
						</Link>
					)}

					<div className="flex flex-col">
						The longer you've been in business, the better. It not
						only gives you an edge in terms of your credit, but
						lenders, suppliers, and customers tend to feel more
						secure working with a company with a track record of
						success and longevity. It shows your business will be
						sustainable in the long run.
					</div>
				</div>
				<div className="flex flex-col w-full space-y-2">
					{plan.employee_size && (
						<div className="flex flex-col font-semibold">
							{employee_size} Employees
						</div>
					)}

					{!plan.employee_size && (
						<div className="flex flex-col font-semibold">
							Upgrade
						</div>
					)}

					<div className="flex flex-col">
						Another indicator of your business's financial and
						operational stability is the number of people you
						employ. Make sure this number is accurate.
					</div>
				</div>
				<div className="flex flex-col w-full space-y-2">
					{plan.sic_code && (
						<div className="flex flex-col font-semibold">
							SIC Code: {sic_code?.code} - {sic_code?.definition}
						</div>
					)}

					{!plan.sic_code && (
						<div className="flex flex-col font-semibold">
							Upgrade
						</div>
					)}

					<div className="flex flex-col">
						An SIC code is a 4-digit numerical code assigned to
						businesses by the U.S. government in order to identify
						the main activity of the business. Make sure that this
						code accurately describes your business activity.
					</div>
				</div>
				<div className="flex flex-col w-full space-y-2">
					{plan?.naics_code && (
						<div className="flex flex-col font-semibold">
							NAICS & Description: {naics_code?.code} -{" "}
							{naics_code?.definition}
						</div>
					)}

					{!plan?.naics_code && (
						<div className="flex flex-col font-semibold">
							Upgrade
						</div>
					)}

					<div className="flex flex-col">
						NAICS stands for the North American Industry
						Classification System, a standard system used by
						business and government to classify business
						establishments into 20 industries, according to their
						economic activity. The US government developed NAICS to
						collect, analyze, and publish data about the economy.
					</div>
				</div>
				<div className="flex flex-col w-full space-y-2">
					{plan?.sales_revenue && (
						<div className="flex flex-col font-semibold">
							Reveneue: {currency.format(sales_revenue)}
						</div>
					)}

					{!plan?.sales_revenue && (
						<div className="flex flex-col font-semibold">
							Upgrade
						</div>
					)}
				</div>

				<div className="flex flex-col w-full space-y-0">
					{plan?.business && (
						<div>
							<div className="flex flex-col font-semibold">
								Your company info:
							</div>
							<div className="flex flex-col">
								<div>{business?.name}</div>
								<div>{business?.phone}</div>
								<div>{business?.address?.street}</div>
								<div className="flex flex-row space-x-1">
									<div className="flex flex-col mr-1">
										{business?.address?.city},
									</div>
									<div>{business?.address?.state}</div>
									<div>{business?.address?.zip}</div>
								</div>
							</div>
						</div>
					)}

					{!plan.business && (
						<div className="flex flex-col font-semibold">
							Upgrade
						</div>
					)}

					<div className="flex flex-col">
						Lenders, Suppliers, and customers will want to contact
						you. Make sure your contact information is correct and
						professional. A cell phone voicemail is unprofessional
						and may raise a red flag when banks, suppliers and
						customers contact your business.
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	return (
		<div className="flex flex-col w-full space-y-5">
			<div>
				<ExplanationCard />
			</div>
		</div>
	);
}
