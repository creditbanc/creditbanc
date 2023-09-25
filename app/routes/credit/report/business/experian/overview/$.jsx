import { useFetcher, useLoaderData } from "@remix-run/react";
import { get_group_id, inspect } from "~/utils/helpers";
import { cache } from "~/utils/helpers.server";
import { lastValueFrom, tap } from "rxjs";
import { fold } from "~/utils/operators";
import BusinessReport from "~/api/client/BusinessReport";
import { useEffect } from "react";
import { use_cache } from "~/components/CacheLink";

const log_route = `credit.report.business.experian.overview`;

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

	let payload = report.business_info.experian_score.experian_risk_class.report_sha.application_id.fold;
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

const ScoreCard = () => {
	let { experian_score: score, experian_risk_class: risk_class, business_info: business } = useLoaderData();

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Intelliscore Plus</h3>
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-1/2">
						<div className="flex flex-col items-center justify-center h-full space-y-2">
							<div className="flex flex-col text-5xl">{score}</div>
							<div className="flex flex-col">{risk_class?.definition}</div>
						</div>
					</div>
					<div className="flex flex-col w-1/2 text-sm">
						<div className="flex flex-col mb-2 font-semibold">Experian Business Record shown for:</div>
						<div className="flex flex-col">
							<div>{business?.name}</div>
							<div>{business?.address?.street}</div>
							<div className="flex flex-row space-x-1">
								<div className="flex flex-col mr-1">{business?.address?.city},</div>
								<div>{business?.address?.state}</div>
								<div>{business?.address?.zip}</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full space-y-3">
					<div className="font-semibold">What Exactly is an Intelliscore?</div>
					<div>
						Your business's Intelliscore is like a crystal ball into your credit health. It takes into
						account your payment history, utilization, and even your trended data. And the higher the score,
						the better; lenders don't like to play risky business when it comes to their money.
					</div>
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
			use_cache_client({ path: `/credit/report/business/experian`, dependencies: cache_dependencies });
		}
	}, []);

	return (
		<div className="flex flex-col w-full space-y-5">
			<div>
				<ScoreCard />
			</div>
		</div>
	);
}
