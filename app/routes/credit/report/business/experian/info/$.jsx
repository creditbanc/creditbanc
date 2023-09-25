import { Link, useLoaderData } from "@remix-run/react";
import { Lendflow } from "~/data/lendflow";
import { currency, get_group_id } from "~/utils/helpers";
import { head, pipe, allPass, not, identity } from "ramda";
import { plans } from "~/data/plans";
import { get } from "shades";
import { lastValueFrom } from "rxjs";
import { fold } from "~/utils/operators";
import BusinessReport from "~/api/client/BusinessReport";
import { use_cache } from "~/components/CacheLink";
import { useEffect } from "react";
import { on_success } from "../../success";

const log_route = `credit.report.business.experian.info`;

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let group_id = get_group_id(url.pathname);
	let report = new BusinessReport(group_id);
	let payload =
		report.business_info.experian_sic_codes.experian_years_on_file.experian_employee_size.experian_naics_codes
			.experian_sales_revenue.report_sha.fold;

	let response = await lastValueFrom(payload.pipe(fold(on_success(request), on_error)));
	return response;
};

const ExplanationCard = () => {
	let {
		experian_years_on_file: years_on_file,
		experian_employee_size: employee_size,
		experian_sic_code: sic_code,
		experian_naics_code: naics_code,
		experian_sales_revenue: sales_revenue,
		business_info: business,
		plan_id,
		report_plan_id = "builder",
	} = useLoaderData();

	let plan = pipe(get(report_plan_id, "business", "experian"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Company Information</h3>
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-col w-full space-y-2">
					{plan.years_on_file && (
						<div className="flex flex-col font-semibold">{years_on_file} Years in business</div>
					)}

					{report_plan_id == "essential" && (
						<Link to={"/plans"} className="font-semibold text-blue-600 underline">
							Upgrade
						</Link>
					)}

					<div className="flex flex-col">
						The longer you've been in business, the better. It not only gives you an edge in terms of your
						credit, but lenders, suppliers, and customers tend to feel more secure working with a company
						with a track record of success and longevity. It shows your business will be sustainable in the
						long run.
					</div>
				</div>
				<div className="flex flex-col w-full space-y-2">
					{plan.employee_size && <div className="flex flex-col font-semibold">{employee_size} Employees</div>}

					{!plan.employee_size && <div className="flex flex-col font-semibold">Upgrade</div>}

					<div className="flex flex-col">
						Another indicator of your business's financial and operational stability is the number of people
						you employ. Make sure this number is accurate.
					</div>
				</div>
				<div className="flex flex-col w-full space-y-2">
					{plan.sic_code && (
						<div className="flex flex-col font-semibold">
							SIC Code: {sic_code?.code} - {sic_code?.definition}
						</div>
					)}

					{!plan.sic_code && <div className="flex flex-col font-semibold">Upgrade</div>}

					<div className="flex flex-col">
						An SIC code is a 4-digit numerical code assigned to businesses by the U.S. government in order
						to identify the main activity of the business. Make sure that this code accurately describes
						your business activity.
					</div>
				</div>
				<div className="flex flex-col w-full space-y-2">
					{plan?.naics_code && (
						<div className="flex flex-col font-semibold">
							NAICS & Description: {naics_code?.code} - {naics_code?.definition}
						</div>
					)}

					{!plan?.naics_code && <div className="flex flex-col font-semibold">Upgrade</div>}

					<div className="flex flex-col">
						NAICS stands for the North American Industry Classification System, a standard system used by
						business and government to classify business establishments into 20 industries, according to
						their economic activity. The US government developed NAICS to collect, analyze, and publish data
						about the economy.
					</div>
				</div>
				<div className="flex flex-col w-full space-y-2">
					{plan?.sales_revenue && (
						<div className="flex flex-col font-semibold">Reveneue: {currency.format(sales_revenue)}</div>
					)}

					{!plan?.sales_revenue && <div className="flex flex-col font-semibold">Upgrade</div>}
				</div>

				<div className="flex flex-col w-full space-y-0">
					{plan?.business && (
						<div>
							<div className="flex flex-col font-semibold">Your company info:</div>
							<div className="flex flex-col">
								<div>{business?.name}</div>
								<div>{business?.phone}</div>
								<div>{business?.address?.street}</div>
								<div className="flex flex-row space-x-1">
									<div className="flex flex-col mr-1">{business?.address?.city},</div>
									<div>{business?.address?.state}</div>
									<div>{business?.address?.zip}</div>
								</div>
							</div>
						</div>
					)}

					{!plan.business && <div className="flex flex-col font-semibold">Upgrade</div>}

					<div className="flex flex-col">
						Lenders, Suppliers, and customers will want to contact you. Make sure your contact information
						is correct and professional. A cell phone voicemail is unprofessional and may raise a red flag
						when banks, suppliers and customers contact your business.
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	let loader_data = useLoaderData();
	let { cache_dependencies } = loader_data;
	let use_cache_client = use_cache((state) => state.set_dependencies);

	useEffect(() => {
		if (cache_dependencies !== undefined) {
			use_cache_client({ path: `/credit/report/business/experian`, dependencies: cache_dependencies });
		}
	}, []);

	return (
		<div className="flex flex-col w-full space-y-5">
			<div>
				<ExplanationCard />
			</div>
		</div>
	);
}
