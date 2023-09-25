import { ClockIcon } from "@heroicons/react/24/outline";
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

const log_route = `credit.report.personal.age`;

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
					<ClockIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-xl font-medium leading-6 text-gray-900">
						Your Credit Age is more than just a number.
					</h3>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col text-lg py-2 text-gray-700 font-semibold">
					<p>15% of your credit score is based on your Credit Age</p>
				</div>

				<FactorBar index={2} />

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Your credit age refers to the length of time you have had accounts open, such as credit cards,
						loans, or mortgages. Two important factors are considered: 1) your average credit age and 2)
						your credit birthday/the date you opened your first credit account.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						In your case, your credit birthday is _____, and the average age of your accounts is ________.
						And just like you (aging like fine wine), these factors will improve over time as your existing
						accounts grow older.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						This is why you should be careful about opening new accounts and closing old accounts; both will
						affect your credit age. A new account will lower the average age of all your accounts. Likewise,
						pulling the plug on an old credit account will make your credit history look younger than it
						really is.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Remember, when it comes to credit age, the older, the better! A long track record of timely
						payments and responsible borrowing is what lenders love to see, and can score you better
						interest rates and higher credit limits. And if you’re worried about old negative accounts
						cramping your style - don’t worry: They’ll be automatically removed from your credit report when
						their statute of limitations has expired.
					</p>
				</div>
			</div>
		</div>
	);
};

export default function Age() {
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
		<div className={`flex flex-col w-full h-full py-5`}>
			<InfoCard />
			<Accounts trade_lines={trade_lines} experian={experian} transunion={transunion} equifax={equifax} />
		</div>
	);
}
