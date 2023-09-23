import { useLoaderData } from "@remix-run/react";
import { get_file_id, get_group_id, inspect } from "~/utils/helpers";
import { from, lastValueFrom, forkJoin, Subject, of as rxof, iif, throwError } from "rxjs";
import { fold, ifEmpty, ifFalse } from "~/utils/operators";
import BusinessReport from "~/api/client/BusinessReport";

const log_route = `credit.report.business.experian.status`;

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
	let response = report.business_info.dnb_score.dnb_delinquency_score.fold;
	return await lastValueFrom(response.pipe(fold(on_success, on_error)));
};

const ScoreCard = () => {
	let { dnb_score: score, dnb_delinquency_score: delinquency_score, business_info: business } = useLoaderData();

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Dun & Bradstreet PAYDEX</h3>
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-row w-full space-x-6">
					<div className="flex flex-col w-1/2">
						<div className="flex flex-col items-center justify-center h-full space-y-2">
							<div className="flex flex-col text-5xl">{score}</div>
							<div className="flex flex-col text-center">{delinquency_score}</div>
						</div>
					</div>
					<div className="flex flex-col w-1/2 text-sm ">
						<div className="flex flex-col mb-2 font-semibold">Business Record shown for:</div>
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
					<div className="font-semibold">What is the Dun & Bradstreet PAYDEX Score?</div>
					<div>
						Your D&B PAYDEX® indicates that your company is likely to meet its credit obligations and make
						its payments promptly or within payment terms. A D&B PAYDEX® between 71-100 is considered Low
						risk.
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
