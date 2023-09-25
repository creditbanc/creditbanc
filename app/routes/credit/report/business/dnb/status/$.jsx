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

const log_route = `credit.report.business.dnb.status`;

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
	let payload = report.business_info.dnb_score.dnb_delinquency_score.report_sha.fold;
	let response = await lastValueFrom(payload.pipe(fold(on_success(request), on_error)));
	return response;
};

const PaymentStatus = () => {
	let { dnb_payment_status: payment_status, report_plan_id = "builder" } = useLoaderData();
	let plan = pipe(get(report_plan_id, "business", "dnb"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Payment Status</h3>

				{report_plan_id == "essential" && (
					<Link to={"/plans"} className="font-semibold text-blue-600 underline">
						Upgrade
					</Link>
				)}
			</div>
			<div className="border-t border-gray-200 p-5 space-y-5">
				<div className="flex flex-col w-full [&>*:nth-child(odd)]:bg-gray-50 border rounded">
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Maximum Owed Amount</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.maximumOwedAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Total Past DueAmount</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.totalPastDueAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Maximum Past Due Amount</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.maximumPastDueAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Slow Experiences Count</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.slowExperiencesCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Negative Payments Count</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.negativePaymentsCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Payment Behavior Result</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.paymentBehaviorResult?.description || ""}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Bad Debt ExperiencesCount</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.badDebtExperiencesCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Maximum High Credit Amount</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.maximumHighCreditAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Bad Debt Experiences Amount</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.badDebtExperiencesAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Negative Experiences Amount</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.negativeExperiencesAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Slow Experiences Percentage</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.slowExperiencesPercentage || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Slow Or Negative Payments Count</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.slowOrNegativePaymentsCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Unfavorable Experiences Count</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.unfavorableExperiencesCount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Bad Debt Experiences Percentage</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.badDebtExperiencesPercentage || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Unfavorable Experiences Amount</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.unfavorableExperiencesAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Negative Experiences Percentage</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.negativeExperiencesPercentage || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Slow And Negative Experiences Amount</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.slowAndNegativeExperiencesAmount || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Slow Or Negative Payments Percentage</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.slowOrNegativePaymentsPercentage || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Unfavorable Experiences Percentage</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.unfavorableExperiencesPercentage || 0}
						</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Slow Experiences Highest Credit Amount</div>
						<div className={`${!plan.payment_status && "blur-sm"}`}>
							{payment_status?.slowExperiencesHighestCreditAmount || 0}
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
				<h3 className="text-lg font-medium leading-6 text-gray-900">How is Payment Status Important?</h3>
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-col w-full">
					Paying on time isn't just good manners, it's good for your credit report - especially for your
					business credit. While there's a 30-day window before a late payment appears on your personal credit
					report, your business credit is less forgiving. In fact, late payments can show up on your business
					credit report the very next day. And we all know how lenders feel about late payments.
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
				<PaymentStatus />
			</div>
		</div>
	);
}
