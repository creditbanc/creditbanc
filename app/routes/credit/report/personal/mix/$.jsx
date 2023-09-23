import { ChartPieIcon } from "@heroicons/react/24/outline";
import { FactorBar } from "~/components/FactorBar";
import { Accounts } from "~/components/TradeLines";
import { useLoaderData } from "@remix-run/react";
import { get_group_id } from "~/utils/helpers";
import { lastValueFrom } from "rxjs";
import { fold } from "~/utils/operators";
import PersonalReport from "~/api/client/PersonalReport";

const log_route = `credit.report.personal.mix`;

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
	let report = new PersonalReport(group_id);
	let response = report.trade_lines.fold;
	return await lastValueFrom(response.pipe(fold(on_success, on_error)));
};

const InfoCard = () => {
	return (
		<div className="flex flex-col h-fit bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<ChartPieIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-xl font-medium leading-6 text-gray-900">How Important is My Account Mix?</h3>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col text-lg py-2 text-gray-700 font-semibold">
					<p>10% of your credit score is based on your Account Mix</p>
				</div>

				<FactorBar index={3} />

				<div className="flex flex-col py-2 text-gray-700">
					<p>
						Just like you should diversify your investments, you should diversify your debt; creditors like
						to see you’ve had experience with different types of credit accounts. To ace this category, you
						should have a mix of revolving credit (credit cards, installment loans, store cards, etc.) and
						installment loans (car loans, student loans, mortgages, etc.).
					</p>
				</div>
			</div>
		</div>
	);
};

export default function Mix() {
	let { trade_lines, plan_id } = useLoaderData();

	// let experian = pipe(get(plan_id, "personal", "experian", "authorized"))(plans);
	// let equifax = pipe(get(plan_id, "personal", "equifax", "authorized"))(plans);
	// let transunion = pipe(get(plan_id, "personal", "transunion", "authorized"))(plans);

	let experian = true;
	let equifax = true;
	let transunion = true;

	return (
		<div className={`flex flex-col w-full h-full py-5 `}>
			<InfoCard />
			<Accounts trade_lines={trade_lines} experian={experian} transunion={transunion} equifax={equifax} />
		</div>
	);
}
