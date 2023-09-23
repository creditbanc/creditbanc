import { useLoaderData } from "@remix-run/react";
import { get_group_id, inspect } from "~/utils/helpers";
import { lastValueFrom, tap } from "rxjs";
import { fold } from "~/utils/operators";
import BusinessReport from "~/api/client/BusinessReport";

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
	let response = report.business_info.experian_score.experian_risk_class.experian_trade_summary.fold;

	let result = response.pipe(
		tap(() => console.log(`${log_route}.tap`)),
		tap(inspect)
	);

	return await lastValueFrom(result.pipe(fold(on_success, on_error)));
};

const ScoreCard = () => {
	let {
		experian_score: score,
		experian_risk_class: risk_class,
		business_info: business,
		experian_trade_summary: trade_summary,
	} = useLoaderData();

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
	return (
		<div className="flex flex-col w-full space-y-5">
			<div>
				<ScoreCard />
			</div>
		</div>
	);
}
