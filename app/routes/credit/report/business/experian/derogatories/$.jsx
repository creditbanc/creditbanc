import { useLoaderData, Link } from "@remix-run/react";
import { pipe } from "ramda";
import { get_group_id } from "~/utils/helpers";
import { plans } from "~/data/plans";
import { get } from "shades";
import { lastValueFrom } from "rxjs";
import { fold } from "~/utils/operators";
import BusinessReport from "~/api/client/BusinessReport";

const log_route = `credit.report.business.experian.derogatories`;

const on_success = (response) => {
	console.log(`${log_route}.success`);
	return response;
};

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let group_id = get_group_id(url.pathname);
	let report = new BusinessReport(group_id);
	let response = report.experian_derogatories.fold;
	return await lastValueFrom(response.pipe(fold(on_success, on_error)));
};

const Derogatories = () => {
	let { experian_derogatories: derogatories, plan_id, report_plan_id = "builder" } = useLoaderData();

	let plan = pipe(get(report_plan_id, "business", "experian"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Derogatories</h3>

				{report_plan_id == "essential" && (
					<Link to={"/plans"} className="font-semibold text-blue-600 underline">
						Upgrade
					</Link>
				)}
			</div>
			<div className="border-t border-gray-200 p-5 space-y-5">
				<div className="flex flex-col w-full [&>*:nth-child(odd)]:bg-gray-50 border rounded">
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4 font-semibold">Derogatories</div>
						<div className={`${!plan.derogatories && "blur-sm"}`}>
							{derogatories?.legalFilingsSummary?.legalCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4 font-semibold">Total legal filings</div>
						<div className={`${!plan.derogatories && "blur-sm"}`}>
							{derogatories?.legalFilingsSummary?.derogatoryLegalCount || 0}
						</div>
					</div>
				</div>
				<div className="flex flex-row w-full text-sm">
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Collections</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div className={`${!plan.derogatories && "blur-sm"}`}>
							{derogatories?.legalFilingsCollectionsSummary?.collectionCount || 0}
						</div>
					</div>
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Liens</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div className={`${!plan.derogatories && "blur-sm"}`}>
							{derogatories?.legalFilingsCollectionsSummary?.lienCount || 0}
						</div>
					</div>
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Judgments</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div className={`${!plan.derogatories && "blur-sm"}`}>
							{derogatories?.legalFilingsCollectionsSummary?.judgmentCount || 0}
						</div>
					</div>
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Legal</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div className={`${!plan.derogatories && "blur-sm"}`}>
							{derogatories?.legalFilingsCollectionsSummary?.derogatoryLegalCount || 0}
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
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-col w-full">
					One way your business's street cred (or should we say creditworthiness?) is determined is by how
					much credit you're using, a.k.a: Credit Utilization. It looks at the ratio of current account
					balances to recent high credit balances. Because many business accounts don't have balance limits,
					this ratio can reveal if you're feeling the financial heat. The closer a business gets to its
					highest historical debt amount, the more difficult it might be for said business to make on-time
					payments.
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
			<div>
				<Derogatories />
			</div>
		</div>
	);
}
