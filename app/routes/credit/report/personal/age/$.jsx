import { ClockIcon } from "@heroicons/react/24/outline";
import { FactorBar } from "~/components/FactorBar";
import { Accounts } from "~/components/TradeLines";
import { useLoaderData } from "@remix-run/react";
import { pipe, map, filter, includes, flatten, head, pick } from "ramda";
import { get_file_id, get_group_id, inspect } from "~/utils/helpers";
import {
	TradeLine as Tradeline,
	credit_report_data,
	CreditReport,
	Liabilities,
} from "~/data/array";
import { get_doc as get_credit_report } from "~/utils/personal_credit_report.server";
import { all, get } from "shades";
import { plans } from "~/data/plans";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { useReportPageLayoutStore } from "~/stores/useReportPageLayoutStore";
import { get_collection, get_doc } from "~/utils/firebase";
import { ArrayExternal } from "~/api/external/Array";
import { ArrayInternal } from "~/api/internal/Array";
import {
	map as rxmap,
	filter as rxfilter,
	concatMap,
	tap,
	take,
} from "rxjs/operators";
import {
	from,
	lastValueFrom,
	forkJoin,
	Subject,
	of as rxof,
	iif,
	throwError,
} from "rxjs";
import { fold } from "~/utils/operators";
import { is_authorized_f } from "~/api/auth";

const subject = new Subject();

const credit_report = subject.pipe(
	rxfilter((message) => message.id == "get_credit_report"),
	concatMap(({ args: { request } }) => {
		let entity_id = from(get_session_entity_id(request));
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

		let is_authorized = forkJoin({
			entity_id,
			group_id: rxof(group_id),
		}).pipe(
			concatMap(({ entity_id, group_id }) =>
				is_authorized_f(entity_id, group_id, "credit", "read")
			),
			concatMap((is_authorized) =>
				iif(() => is_authorized, rxof(true), throwError("unauthorized"))
			)
		);

		let report = from(
			get_collection({
				path: ["credit_reports"],
				queries: personal_credit_report_queries,
			})
		).pipe(
			rxmap(
				pipe(
					head,
					pick([
						"reportKey",
						"clientKey",
						"userToken",
						"displayToken",
					])
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
			rxmap((report) => report.trade_lines())
		);

		return is_authorized.pipe(
			concatMap(() => report),
			tap((value) => {
				console.log("___tap___");
				console.log(value);
			})
		);
	})
);

export const loader = async ({ request }) => {
	const on_success = async (response) => {
		console.log("___success___");
		let entity_id = await get_session_entity_id(request);
		let { plan_id } = await get_doc(["entity", entity_id]);

		let payload = { trade_lines: response, plan_id };

		subject.next({
			id: "credit_report_response",
			next: () => payload,
		});
	};

	const on_error = (error) => {
		console.log("___error___");
		console.log(error);

		subject.next({
			id: "credit_report_response",
			next: () => error,
		});
	};

	const on_complete = (value) => value.id === "credit_report_response";

	credit_report.pipe(fold(on_success, on_error)).subscribe();

	subject.next({ id: "get_credit_report", args: { request } });

	let response = await lastValueFrom(
		subject.pipe(rxfilter(on_complete), take(1))
	);

	return response.next();

	// let entity_id = await get_session_entity_id(request);
	// let { plan_id } = await get_doc(["entity", entity_id]);

	// let response = await lastValueFrom(creditreport(request));

	// // console.log("response");
	// // console.log(response);

	// return { trade_lines: response, plan_id };

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
	// let liabilities = Liabilities(credit_report.liabilities());

	// let trade_lines = pipe(
	// 	map((value) => Tradeline(flatten([value]))),
	// 	map((tl) => tl.values())
	// 	// filter((tl) => pipe(get(all, "value"), includes("Closed"))(tl.status))
	// )(liabilities.trade_lines());

	// let is_owner = report.entity_id == entity_id;

	// let { plan_id } = await get_doc(["entity", entity_id]);

	// return { trade_lines, plan_id };
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
						Your credit age refers to the length of time you have
						had accounts open, such as credit cards, loans, or
						mortgages. Two important factors are considered: 1) your
						average credit age and 2) your credit birthday/the date
						you opened your first credit account.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						In your case, your credit birthday is _____, and the
						average age of your accounts is ________. And just like
						you (aging like fine wine), these factors will improve
						over time as your existing accounts grow older.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						This is why you should be careful about opening new
						accounts and closing old accounts; both will affect your
						credit age. A new account will lower the average age of
						all your accounts. Likewise, pulling the plug on an old
						credit account will make your credit history look
						younger than it really is.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Remember, when it comes to credit age, the older, the
						better! A long track record of timely payments and
						responsible borrowing is what lenders love to see, and
						can score you better interest rates and higher credit
						limits. And if you’re worried about old negative
						accounts cramping your style - don’t worry: They’ll be
						automatically removed from your credit report when their
						statute of limitations has expired.
					</p>
				</div>
			</div>
		</div>
	);
};

export default function Age() {
	let { trade_lines, plan_id } = useLoaderData();
	let { coordinates } = useReportPageLayoutStore();

	let experian = pipe(get(plan_id, "personal", "experian", "authorized"))(
		plans
	);

	let transunion = pipe(get(plan_id, "personal", "transunion", "authorized"))(
		plans
	);

	let equifax = pipe(get(plan_id, "personal", "equifax", "authorized"))(
		plans
	);

	return (
		<div className={`flex flex-col w-full h-full py-5`}>
			<InfoCard />
			<Accounts
				trade_lines={trade_lines}
				experian={experian}
				transunion={transunion}
				equifax={equifax}
			/>
		</div>
	);
}
