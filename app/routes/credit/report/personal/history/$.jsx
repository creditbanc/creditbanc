import { BookOpenIcon } from "@heroicons/react/24/outline";
import { FactorBar } from "~/components/FactorBar";
import { Accounts } from "~/components/TradeLines";
import { useLoaderData } from "@remix-run/react";
import { get_group_id } from "~/utils/helpers";
import { lastValueFrom } from "rxjs";
import { fold } from "~/utils/operators";
import PersonalReport from "~/api/client/PersonalReport";
import { use_cache } from "~/components/CacheLink";
import { useEffect } from "react";
import { on_success } from "~/routes/credit/report/personal/success";

const log_route = `credit.report.personal.history`;

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let group_id = get_group_id(url.pathname);
	let report = new PersonalReport(group_id);
	let payload = report.trade_lines.report_sha.fold;
	let response = await lastValueFrom(payload.pipe(fold(on_success(request), on_error)));
	return response;
};

const InfoCard = () => {
	return (
		<div className="flex flex-col h-fit bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<BookOpenIcon />
				</div>
				<div className="flex flex-col">
					<p className="text-xl font-medium leading-6 text-gray-900">Payment History: What’s the big deal?</p>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col text-lg py-2 text-gray-700 font-semibold">
					<p>35% of your credit score is based on Payment History</p>
				</div>

				<FactorBar />

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>It’s kind of a big deal, actually. We’re talking 35% of your overall credit score.</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Payment history (your track record for paying bills and debts on time) is one of the two most
						important factors in determining your credit score. It's like a financial report card that
						lenders and creditors use to assess your creditworthiness. If you’re consistently making on-time
						payments, good job! Gold stars all around.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						But if your report comes back with a history of late payments, missed payments, or accounts sent
						to collections, you’ll see your credit score drop faster than a skydiver without a parachute.
						This is going to make it harder to get approved for lines of credit and may also result in
						higher interest rates.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						(And not to add salt to the wound, but most negative information on your payment history can
						stay on your credit report for up to seven years.)
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						The good news is that the older the negative information, the less it hurts your score. (Time
						heals all wounds, right?) Generally speaking, late payments that occurred 2+ years ago may not
						even show up on your credit report with any specificity.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Regardless, it’s crucial to prioritize your payment history and always strive to pay bills on
						time. Set up automatic payments, create reminders, and budget wisely to ensure you're on top of
						your payment game.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700">
					<p>
						Your Credit Banc report shows any late payments under the Payment History box on the left of
						each credit account.
					</p>
				</div>
			</div>
		</div>
	);
};

export default function History() {
	let { trade_lines = [], plan_id = "essential", cache_dependencies } = useLoaderData();
	let use_cache_client = use_cache((state) => state.set_dependencies);

	// let experian = pipe(get(plan_id, "personal", "experian", "authorized"))(plans);
	// let equifax = pipe(get(plan_id, "personal", "equifax", "authorized"))(plans);
	// let transunion = pipe(get(plan_id, "personal", "transunion", "authorized"))(plans);

	let experian = true;
	let equifax = true;
	let transunion = true;

	useEffect(() => {
		if (cache_dependencies !== undefined) {
			use_cache_client({ path: `/credit/report/personal`, dependencies: cache_dependencies });
		}
	}, []);

	return (
		<div className={`flex flex-col w-full h-full py-5`}>
			<InfoCard />
			<Accounts trade_lines={trade_lines} experian={experian} transunion={transunion} equifax={equifax} />
		</div>
	);
}
