import { TrophyIcon } from "@heroicons/react/24/outline";
import { pipe } from "ramda";
import { get_group_id, mapIndexed } from "~/utils/helpers";
import { useLoaderData } from "@remix-run/react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { lastValueFrom } from "rxjs";
import { fold } from "~/utils/operators";
import PersonalReport from "~/api/client/PersonalReport";
import { use_cache } from "~/components/CacheLink";
import { useEffect } from "react";
import { on_success } from "~/routes/credit/report/personal/success";
import { is_authorized } from "../authorized";
import { redirect } from "@remix-run/node";

const log_route = `credit.report.personal.mix`;

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const loader = async ({ request }) => {
	if (!(await is_authorized(request))) return redirect("/home");
	let url = new URL(request.url);
	let group_id = get_group_id(url.pathname);
	let report = new PersonalReport(group_id);
	let payload = report.factors.report_sha.fold;
	let response = await lastValueFrom(payload.pipe(fold(on_success(request), on_error)));
	return response;
};

const InfoCard = () => {
	return (
		<div className="flex flex-col h-fit bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<TrophyIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-lg font-medium leading-6 text-gray-900">What Exactly are Score Factors?</h3>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Score factors, also called “Reason Codes,” are statements on your credit report explaining why
						your credit score wasn’t higher. They include things like late payments, high credit card
						balances, or too many credit inquiries - and are listed in order of impact, starting with the
						factor that has the most significant impact first.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Even with excellent credit, you’ll still see 4-5 score factors. This is because whenever your
						credit report data is reviewed for a loan application (those hard inquiries we mentioned
						earlier), lenders are legally required to provide consumers (you) with a disclosure notice.
						You’ll receive this notice regardless of whether they denied your application - or it was
						approved, but with less than the best terms offered.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Don’t sleep on this! If you want to improve your credit score, pay attention to your Score
						Factors! They explain why your score isn’t higher - and will help you take the steps necessary
						to improve it over time.
					</p>
				</div>
			</div>
		</div>
	);
};

const ScoreFactors = () => {
	let { factors, report_plan_id, cache_dependencies } = useLoaderData();
	let use_cache_client = use_cache((state) => state.set_dependencies);

	// let plan = pipe(get(report_plan_id, "business", "experian"))(plans);

	useEffect(() => {
		if (cache_dependencies !== undefined) {
			use_cache_client({ path: `/credit/report/personal`, dependencies: cache_dependencies });
		}
	}, []);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Here are the factors influencing your score
				</h3>

				{/* {report_plan_id == "essential" && (
					<Link
						to={"/plans"}
						className="font-semibold text-blue-600 underline"
					>
						Upgrade
					</Link>
				)} */}
			</div>
			<div className="border-t border-gray-200 p-6">
				<div className="flex flex-col w-full space-y-6">
					{pipe(
						mapIndexed((factor, idx) => (
							<div className="flex flex-row items-center space-x-2" key={idx}>
								<div className="w-[20px]">
									<ChevronDoubleRightIcon />
								</div>
								<div>{factor["@_Text"]}</div>
							</div>
						))
					)(factors)}
				</div>
			</div>
		</div>
	);
};

export default function Factors() {
	return (
		<div className={`flex flex-col w-full h-full py-5 `}>
			<InfoCard />

			<div className="my-5">
				<ScoreFactors />
			</div>
		</div>
	);
}
