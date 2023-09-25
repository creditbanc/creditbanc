import { useLoaderData, Link } from "@remix-run/react";
import { Lendflow } from "~/data/lendflow";
import { pipe, allPass, head, not, defaultTo, tryCatch, always, identity } from "ramda";
import { get_file_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { prisma } from "~/utils/prisma.server";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { plans } from "~/data/plans";
import { get } from "shades";
import AccountCard from "~/components/AccountCard";
import { report_tests } from "~/data/report_tests";
import { get_lendflow_report } from "~/utils/lendflow.server";
import { update_business_report } from "~/utils/business_credit_report.server";
import { get_collection, get_doc } from "~/utils/firebase";
import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";
import { map as rxmap, concatMap, tap, filter as rxfilter, take } from "rxjs/operators";
import { from, lastValueFrom, forkJoin, of as rxof, Subject, iif, throwError } from "rxjs";
import { fold, ifFalse } from "~/utils/operators";
import { is_authorized_f } from "~/api/auth";
import BusinessReport from "~/api/client/BusinessReport";
import { cache } from "~/utils/helpers.server";
import { use_cache } from "~/components/CacheLink";
import { useEffect } from "react";

const log_route = `credit.report.business.experian.trends`;

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

	let payload = report.experian_payment_trends.report_sha.experian_trade_lines.fold;
	let response = await lastValueFrom(payload.pipe(fold(on_success, on_error)));

	let with_cache = cache(request);
	return with_cache({
		...response,
		cache_dependencies: [
			{
				name: "business_credit_report",
				value: response.report_sha,
			},
		],
	});
};

const ExplanationCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Are Payment Trends Good or Bad?</h3>
			</div>
			<div className="border-t border-gray-200 space-y-6 p-6">
				<div className="flex flex-col w-full">
					If you've been playing the "paying bills late" game, your average Days Beyond Terms (DBT) is going
					to go up...which means your credit score is going to go down. (Past behavior predicts future
					behavior, right?) This is the type of trend you don't want to be a part of.
				</div>

				<div className="flex flex-col w-full">
					It's also important to remember that personal and business credit have different criteria for "late"
					bills. Any bill at least 30 days overdue is considered delinquent on your personal credit score.
					However, business credit has a variety of payment terms (we're talking Net 30, Net 60, etc.). So, if
					you're supposed to pay within 60 days but wait until day 67, the DBT is 7. A higher DBT = a negative
					impact on your credit score.
				</div>
			</div>
		</div>
	);
};

const PaymentTrendsCard = () => {
	let { experian_payment_trends: payment_trends, plan_id, report_plan_id = "builder" } = useLoaderData();

	let plan = pipe(get(report_plan_id, "business", "experian"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Payment Trends</h3>

				{report_plan_id == "essential" && (
					<Link to={"/plans"} className="font-semibold text-blue-600 underline">
						Upgrade
					</Link>
				)}
			</div>
			<div className="border-t border-gray-200 p-5">
				<div className="flex flex-col w-full [&>*:nth-child(odd)]:bg-gray-50 border rounded">
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">Predicted DBT (Days Beyond Terms)</div>
						<div className={`${!plan.trends && "blur-sm"}`}>
							{pipe(head, tryCatch(get("dbt"), always(0)))(payment_trends)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	let {
		experian_trade_lines: trade_lines,
		plan_id,
		report_plan_id = "builder",
		cache_dependencies,
	} = useLoaderData();
	let use_cache_client = use_cache((state) => state.set_dependencies);

	useEffect(() => {
		if (cache_dependencies !== undefined) {
			use_cache_client({ path: `/credit/report/business/experian`, dependencies: cache_dependencies });
		}
	}, []);

	return (
		<div className="flex flex-col w-full space-y-5">
			<div>
				<PaymentTrendsCard />
			</div>
			<div>
				<ExplanationCard />
			</div>
			<div className="flex flex-col space-y-4">
				{pipe(
					mapIndexed((trade_line, idx) => (
						<AccountCard trade_line={trade_line} key={idx} plan_id={report_plan_id} />
					))
				)(trade_lines)}
			</div>
		</div>
	);
}
