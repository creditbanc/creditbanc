import { BeakerIcon } from "@heroicons/react/24/outline";
import { FactorBar } from "~/components/FactorBar";
import { Accounts } from "~/components/TradeLines";
import { useLoaderData } from "@remix-run/react";
import { get_group_id } from "~/utils/helpers";
import { lastValueFrom } from "rxjs";
import { fold } from "~/utils/operators";
import PersonalReport from "~/api/client/PersonalReport";
import { use_cache } from "~/components/CacheLink";
import { useEffect } from "react";
import { on_success } from "../success";
import { is_authorized } from "../authorized";
import { redirect } from "@remix-run/node";

const log_route = `credit.report.personal.usage`;

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const loader = async ({ request }) => {
	// if (!(await is_authorized(request))) return redirect("/home");
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
					<BeakerIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-xl font-medium leading-6 text-gray-900">
						What is Debt Usage, and why should I care?
					</h3>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col text-lg py-2 text-gray-700 font-semibold">
					<p>30% of your credit score is based on your Debt Usage</p>
				</div>

				<FactorBar index={1} />

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Debt usage, also known as credit utilization, refers to the percentage of your available credit
						that you're currently using and is the second most important factor in determining your credit
						score. You want to keep that limit-to-balance ratio at or below 10% to earn maximum points in
						this category.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						For example, if you have a credit card with a $10,000 limit, aim to keep your balance below
						$1,000. Anything more is a red flag to lenders that you're relying too heavily on credit and may
						be at risk of overextending yourself financially. (And you know a lender’s least favorite
						vocabulary word is “risk.”)
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						When calculating debt usage, the Credit Fairies (or whatever they are) analyze ALL your open
						accounts - even ones you aren’t actively using. That’s why keeping those accounts open is in
						your best interest.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Let’s say you have three credit cards. Each card has a $10,000 limit and carries a balance of
						$5,000. Total credit limit = $30,000. Total debt = $15,000. Total usage = 50%. Now, let’s say
						you pay off two of those cards (yay!). You’ll still have the $30,000 credit limit, but by
						decreasing your debt to $5,000, your ratio will fall from 50% to 17%. However, if you decide to
						close those two accounts, you’re really just shooting yourself in the foot. Your available
						credit will plummet from $30,000 to $10,000, your debt will still be $5,000, and you’re right
						back to having a 50% of your credit limit… and doing additional damage to your credit score.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>Pro tip: Keep your balances low and request regular credit limit increases every 6-9 months.</p>
				</div>
			</div>
		</div>
	);
};

export default function Usage() {
	let { trade_lines, plan_id, cache_dependencies } = useLoaderData();
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
		<div className={`flex flex-col w-full h-full py-5 `}>
			<InfoCard />
			<Accounts
				trade_lines={trade_lines}
				type={"usage"}
				experian={experian}
				transunion={transunion}
				equifax={equifax}
			/>
		</div>
	);
}
