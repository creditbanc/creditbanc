import { useLoaderData, Link } from "@remix-run/react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { get_group_id, mapIndexed } from "~/utils/helpers";
import { pipe } from "ramda";
import { plans } from "~/data/plans";
import { get } from "shades";
import { lastValueFrom } from "rxjs";
import { fold } from "~/utils/operators";
import BusinessReport from "~/api/client/BusinessReport";
import { useEffect } from "react";
import { use_cache } from "~/components/CacheLink";
import { on_success } from "../../success";
import { is_authorized } from "../../authorized";
import { redirect } from "@remix-run/node";

const log_route = `credit.report.business.experian.factors`;

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
	let payload = report.experian_factors.report_sha.fold;
	let response = await lastValueFrom(payload.pipe(fold(on_success(request), on_error)));
	return response;
};

const ExplanationCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Why You Should Pay Attention To Your Score Factors
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-6 p-6">
				<div className="flex flex-col w-full">
					Score Factors or "Reason Codes" on your credit report are like clues from a Sherlock Holmes mystery,
					shedding light on why your score didn't reach the stratospheric heights you hoped for. Up to five
					factors are listed in order of their impact, with the most significant one first.
				</div>
				<div className="flex flex-col w-full">
					And you'll see those scores even if you have Rockstar credit. Lenders are required by law to
					disclose score factors each time your credit report is used for a loan application that is denied or
					approved with less than favorable terms.
				</div>
				<div className="flex flex-col w-full">
					Reason codes or score factors serve as a valuable guide for improving your score. They provide a
					clear picture of why your score isn't higher and shows what steps you can take to improve it over
					time.
				</div>
			</div>
		</div>
	);
};

const ScoreFactors = () => {
	let { experian_factors: factors, plan_id, report_plan_id = "builder" } = useLoaderData();

	let plan = pipe(get(report_plan_id, "business", "experian"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Here are the factors influencing your score
				</h3>

				{report_plan_id == "essential" && (
					<Link to={"/plans"} className="font-semibold text-blue-600 underline">
						Upgrade
					</Link>
				)}
			</div>
			<div className="border-t border-gray-200 p-6">
				<div className="flex flex-col w-full space-y-6">
					{pipe(
						mapIndexed((factor, idx) => (
							<div className="flex flex-row items-center space-x-2" key={idx}>
								<div className="w-[20px]">
									<ChevronDoubleRightIcon />
								</div>
								<div className={`${!plan.factors && "blur-sm"}`}>{factor.definition}</div>
							</div>
						))
					)(factors)}
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
			<div>
				<ScoreFactors />
			</div>
		</div>
	);
}
