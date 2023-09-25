import { useLoaderData, Link } from "@remix-run/react";
import { get_group_id } from "~/utils/helpers";
import { pipe } from "ramda";
import { plans } from "~/data/plans";
import { get } from "shades";
import { lastValueFrom } from "rxjs";
import { fold } from "~/utils/operators";
import BusinessReport from "~/api/client/BusinessReport";
import { use_cache } from "~/components/CacheLink";
import { useEffect } from "react";
import { on_success } from "../../success";
import { is_authorized } from "../../authorized";
import { redirect } from "@remix-run/node";

const log_route = `credit.report.business.dnb.utilization`;

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const loader = async ({ request }) => {
	if (!(await is_authorized(request))) return redirect("/home");

	let url = new URL(request.url);
	let group_id = get_group_id(url.pathname);
	let report = new BusinessReport(group_id);
	let payload = report.dnb_credit_utilization.report_sha.fold;
	let response = await lastValueFrom(payload.pipe(fold(on_success(request), on_error)));
	return response;
};

const CreditUtilization = () => {
	let { dnb_credit_utilization: data, report_plan_id = "builder" } = useLoaderData();

	let plan = pipe(get(report_plan_id, "business", "dnb"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6  flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Credit Utilization</h3>

				{report_plan_id == "essential" && (
					<Link to={"/plans"} className="font-semibold text-blue-600 underline">
						Upgrade
					</Link>
				)}
			</div>
			<div className="border-t border-gray-200 p-5 space-y-5">
				<div className="flex flex-col w-full [&>*:nth-child(odd)]:bg-gray-50 border rounded">
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Average High Credit Amount</div>
						<div className={`${!plan.credit_utilization && "blur-sm"}`}>
							{data?.averageHighCreditAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Maximum High Credit Amount</div>
						<div className={`${!plan.credit_utilization && "blur-sm"}`}>
							{data?.maximumHighCreditAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">High Credit Experiences Count</div>
						<div className={`${!plan.credit_utilization && "blur-sm"}`}>
							{data?.highCreditExperiencesCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Satisfactory Experiences Count</div>
						<div className={`${!plan.credit_utilization && "blur-sm"}`}>
							{data?.satisfactoryExperiencesCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Satisfactory Experiences Amount</div>
						<div className={`${!plan.credit_utilization && "blur-sm"}`}>
							{data?.satisfactoryExperiencesAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Satisfactory Experiences Percentage</div>
						<div className={`${!plan.credit_utilization && "blur-sm"}`}>
							{data?.satisfactoryExperiencesPercentage || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Slow Experiences Highest Credit Amount</div>
						<div className={`${!plan.credit_utilization && "blur-sm"}`}>
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
	let { cache_dependencies } = useLoaderData();
	let use_cache_client = use_cache((state) => state.set_dependencies);

	useEffect(() => {
		if (cache_dependencies !== undefined) {
			use_cache_client({ path: `/credit/report/business/dnb`, dependencies: cache_dependencies });
		}
	}, []);

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
