import { TrophyIcon } from "@heroicons/react/24/outline";
import { pipe, map, filter, includes, flatten, head, pick } from "ramda";
import {
	get_file_id,
	get_group_id,
	inspect,
	mapIndexed,
} from "~/utils/helpers";
import { CreditReport, Liabilities, credit_report_data } from "~/data/array";
import { get_doc as get_credit_report } from "~/utils/personal_credit_report.server";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { useLoaderData } from "@remix-run/react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { useReportPageLayoutStore } from "~/stores/useReportPageLayoutStore";
import { get_collection, get_doc } from "~/utils/firebase";
import { map as rxmap, concatMap, tap } from "rxjs/operators";
import { from, lastValueFrom, forkJoin } from "rxjs";
import { ArrayExternal } from "~/api/external/Array";
import { ArrayInternal } from "~/api/internal/Array";
import { get } from "shades";

const creditreport = (request) => {
	let url = new URL(request.url);
	let group_id = get_group_id(url.pathname);

	let personal_credit_report_queries = [
		{
			param: "group_id",
			predicate: "==",
			value: group_id,
		},
		{
			param: "type",
			predicate: "==",
			value: "personal_credit_report",
		},
	];

	let report = from(
		get_collection({
			path: ["credit_reports"],
			queries: personal_credit_report_queries,
		})
	).pipe(
		rxmap(
			pipe(
				head,
				pick(["reportKey", "clientKey", "userToken", "displayToken"])
			)
		),
		rxmap(() => ({
			reportKey: "a0240c5e-c332-4f36-a5a0-1f518c0acf04",
			displayToken: "0B272113-1EDB-42EB-9B85-8C08DD02EBE3",
			clientKey: "95ae56d4-0786-4625-bc34-be90041fc246",
			userToken: "0340F883-4DCE-4EF2-8908-EA79C5FA5123",
		})),
		concatMap(() =>
			from(
				get_collection({
					path: ["credit_reports"],
					queries: personal_credit_report_queries,
				})
			).pipe(rxmap(pipe(head, get("data"))))
		),
		// concatMap(({ reportKey, displayToken }) =>
		// 	ArrayExternal.get_credit_report(reportKey, displayToken)
		// ),
		// concatMap(({ clientKey, reportKey, userToken }) =>
		// 	ArrayExternal.refreshDisplayToken(clientKey, reportKey, userToken)
		// ),
		rxmap((array_response) => new ArrayInternal(array_response)),
		rxmap((report) => report.factors()),
		tap((value) => {
			console.log("___tap___");
			console.log(value);
		})
	);

	return report;
};

export const loader = async ({ request }) => {
	let entity_id = await get_session_entity_id(request);
	let { plan_id } = await get_doc(["entity", entity_id]);

	let response = await lastValueFrom(creditreport(request));

	// console.log("response");
	// console.log(response);

	return { factors: response, plan_id };

	// let url = new URL(request.url);
	// let pathname = url.pathname;
	// let entity_id = await get_session_entity_id(request);

	// let group_id = get_group_id(pathname);

	// let personal_credit_report_queries = [
	// 	{
	// 		param: "group_id",
	// 		predicate: "==",
	// 		value: group_id,
	// 	},
	// 	{
	// 		param: "type",
	// 		predicate: "==",
	// 		value: "personal_credit_report",
	// 	},
	// ];

	// let report_response = await get_collection({
	// 	path: ["credit_reports"],
	// 	queries: personal_credit_report_queries,
	// });

	// let report = pipe(head)(report_response);

	// // let report = await get_credit_report({
	// // 	resource_id: report_id,
	// // });

	// let credit_report = CreditReport(report.data);
	// let factors = credit_report.factors();
	// let inquiries = credit_report.inquiries();

	// // console.log("inquiries");
	// // inspect(inquiries);

	// let is_owner = report.entity_id == entity_id;

	// let { plan_id } = await get_doc(["entity", entity_id]);

	// return { factors, plan_id, report_plan_id: report?.plan_id };
};

const InfoCard = () => {
	return (
		<div className="flex flex-col h-fit bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<TrophyIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						What Exactly are Score Factors?
					</h3>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Score factors, also called “Reason Codes,” are
						statements on your credit report explaining why your
						credit score wasn’t higher. They include things like
						late payments, high credit card balances, or too many
						credit inquiries - and are listed in order of impact,
						starting with the factor that has the most significant
						impact first.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Even with excellent credit, you’ll still see 4-5 score
						factors. This is because whenever your credit report
						data is reviewed for a loan application (those hard
						inquiries we mentioned earlier), lenders are legally
						required to provide consumers (you) with a disclosure
						notice. You’ll receive this notice regardless of whether
						they denied your application - or it was approved, but
						with less than the best terms offered.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Don’t sleep on this! If you want to improve your credit
						score, pay attention to your Score Factors! They explain
						why your score isn’t higher - and will help you take the
						steps necessary to improve it over time.
					</p>
				</div>
			</div>
		</div>
	);
};

const ScoreFactors = () => {
	let { factors, report_plan_id } = useLoaderData();

	// let plan = pipe(get(report_plan_id, "business", "experian"))(plans);

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
							<div
								className="flex flex-row items-center space-x-2"
								key={idx}
							>
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
