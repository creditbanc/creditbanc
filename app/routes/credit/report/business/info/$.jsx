import { useLoaderData } from "@remix-run/react";
import { mrm_credit_report, Lendflow } from "~/data/lendflow";
import { currency } from "~/utils/helpers";
import { head } from "ramda";

export const loader = () => {
	let years_on_file = Lendflow.experian.years_on_file(mrm_credit_report);
	let employee_size = Lendflow.experian.employee_size(mrm_credit_report);
	let sic_code = head(Lendflow.experian.sic_codes(mrm_credit_report));
	let naics_code = head(Lendflow.experian.naics_codes(mrm_credit_report));
	let sales_revenue = Lendflow.experian.sales_revenue(mrm_credit_report);
	let business = Lendflow.business(mrm_credit_report);

	return {
		years_on_file,
		employee_size,
		sic_code,
		naics_code,
		sales_revenue,
		business,
	};
};

const ExplanationCard = () => {
	let {
		years_on_file,
		employee_size,
		sic_code,
		naics_code,
		sales_revenue,
		business,
	} = useLoaderData();

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Company Information
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-col w-full space-y-2">
					<div className="flex flex-col font-semibold">
						{years_on_file} Years in business
					</div>
					<div className="flex flex-col">
						The longer you have been in business the better when it
						comes to business credit. Lenders, suppliers, and
						customers in this category want to know whether or not
						you'll still be in business down the road. A longer
						history is indicative of continued success and business
						longevity.
					</div>
				</div>
				<div className="flex flex-col w-full space-y-2">
					<div className="flex flex-col font-semibold">
						{employee_size} Employees
					</div>
					<div className="flex flex-col">
						Banks, suppliers, and customers may look to your number
						of employees as an indication of your business's
						financial stability and ability to continue operations.
						Make sure this number is accurate.
					</div>
				</div>
				<div className="flex flex-col w-full space-y-2">
					<div className="flex flex-col font-semibold">
						SIC Code: {sic_code.code} - {sic_code.definition}
					</div>
					<div className="flex flex-col">
						An SIC code is a 4-digit numerical code assigned to
						businesses by the U.S. government in order to identify
						the main activity of the business. Make sure that this
						code accurately describes your business activity.
					</div>
				</div>
				<div className="flex flex-col w-full space-y-2">
					<div className="flex flex-col font-semibold">
						NAICS & Description: {naics_code.code} -{" "}
						{naics_code.definition}
					</div>
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
					<div className="flex flex-col font-semibold">
						Reveneue: {currency.format(sales_revenue)}
					</div>
				</div>
				<div className="flex flex-col w-full space-y-0">
					<div className="flex flex-col font-semibold">
						Your company info:
					</div>
					<div className="flex flex-col">
						<div>{business.name}</div>
						<div>{business.phone}</div>
						<div>{business.address.street}</div>
						<div className="flex flex-row space-x-1">
							<div className="flex flex-col mr-1">
								{business.address.city},
							</div>
							<div>{business.address.state}</div>
							<div>{business.address.zip}</div>
						</div>
					</div>
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
