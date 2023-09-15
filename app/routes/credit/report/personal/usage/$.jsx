import { BeakerIcon } from "@heroicons/react/24/outline";
import { FactorBar } from "~/components/FactorBar";
import { Accounts } from "~/components/TradeLines";
import { useLoaderData } from "@remix-run/react";
import {
	pipe,
	map,
	filter,
	includes,
	flatten,
	splitWhenever,
	head,
	pick,
} from "ramda";
import { get_file_id, get_group_id, inspect } from "~/utils/helpers";
import {
	TradeLine as Tradeline,
	credit_report_data,
	CreditReport,
	Liabilities,
} from "~/data/array";
import { get_doc as get_credit_report } from "~/utils/personal_credit_report.server";
import { all, get, mod } from "shades";
import { plans } from "~/data/plans";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { useReportPageLayoutStore } from "~/stores/useReportPageLayoutStore";
import { get_collection, get_doc, update_doc } from "~/utils/firebase";
import { ArrayExternal } from "~/api/external/Array";
import { ArrayInternal } from "~/api/internal/Array";
import {
	map as rxmap,
	filter as rxfilter,
	concatMap,
	tap,
	take,
	catchError,
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
import { fold, ifFalse } from "~/utils/operators";
import { is_authorized_f } from "~/api/auth";

const subject = new Subject();

const credit_report = subject.pipe(
	rxfilter((message) => message.id == "get_credit_report"),
	concatMap(({ args: { request } }) => {
		let url = new URL(request.url);

		let personal_credit_report_queries = (group_id) => [
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

		let get_credit_report = (group_id) =>
			from(
				get_collection({
					path: ["credit_reports"],
					queries: personal_credit_report_queries(group_id),
				})
			);

		let group_id = rxof(get_group_id(url.pathname));
		let entity_id = from(get_session_entity_id(request));

		let entity_group_id = forkJoin({
			entity_id,
			group_id,
		});

		let redirect_home = entity_group_id.pipe(
			concatMap(({ entity_id, group_id }) =>
				throwError(() =>
					Response.redirect(
						`${url.origin}/home/resource/e/${entity_id}/g/${group_id}`
					)
				)
			)
		);

		let is_authorized = entity_group_id.pipe(
			concatMap(({ entity_id, group_id }) =>
				is_authorized_f(entity_id, group_id, "credit", "read")
			),
			concatMap(ifFalse(redirect_home))
		);

		const update_display_token = ({ clientKey, reportKey, report_id }) => {
			console.log("___update_display_token___");
			return rxof({ clientKey, reportKey, report_id }).pipe(
				concatMap(() =>
					ArrayExternal.refreshDisplayToken(clientKey, reportKey)
				),
				catchError((error) => {
					console.log("___refreshDisplayTokenError___");
					console.log(error);

					return redirect_home;
				}),
				rxfilter((value) => value.displayToken),
				concatMap(({ displayToken }) =>
					update_doc(["credit_reports", report_id], {
						displayToken,
					})
				)
			);
		};

		let report = group_id.pipe(
			concatMap(get_credit_report),
			rxmap(
				pipe(
					head,
					pick(["reportKey", "clientKey", "displayToken", "id"])
				)
			),
			concatMap(({ reportKey, displayToken, clientKey, id: report_id }) =>
				from(
					ArrayExternal.get_credit_report(reportKey, displayToken)
				).pipe(
					rxfilter((report) => report.CREDIT_RESPONSE),
					catchError((error) => {
						let status = pipe(get("response", "status"))(error);

						return rxof(status).pipe(
							// rxfilter((status) => status == 401),
							concatMap(() =>
								update_display_token({
									clientKey,
									reportKey,
									report_id,
								})
							),
							tap(() =>
								subject.next({
									id: "get_credit_report",
									args: { request },
								})
							),
							rxfilter((value) => value !== undefined)
						);
					})
				)
			),
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
	// let report_id = get_file_id(pathname);
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
	// 	map((line) => line.values())
	// )(liabilities.trade_lines());

	// let is_owner = report.entity_id == entity_id;

	// let { plan_id } = await get_doc(["entity", entity_id]);

	// return { trade_lines, plan_id, report };
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
						Debt usage, also known as credit utilization, refers to
						the percentage of your available credit that you're
						currently using and is the second most important factor
						in determining your credit score. You want to keep that
						limit-to-balance ratio at or below 10% to earn maximum
						points in this category.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						For example, if you have a credit card with a $10,000
						limit, aim to keep your balance below $1,000. Anything
						more is a red flag to lenders that you're relying too
						heavily on credit and may be at risk of overextending
						yourself financially. (And you know a lender’s least
						favorite vocabulary word is “risk.”)
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						When calculating debt usage, the Credit Fairies (or
						whatever they are) analyze ALL your open accounts - even
						ones you aren’t actively using. That’s why keeping those
						accounts open is in your best interest.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Let’s say you have three credit cards. Each card has a
						$10,000 limit and carries a balance of $5,000. Total
						credit limit = $30,000. Total debt = $15,000. Total
						usage = 50%. Now, let’s say you pay off two of those
						cards (yay!). You’ll still have the $30,000 credit
						limit, but by decreasing your debt to $5,000, your ratio
						will fall from 50% to 17%. However, if you decide to
						close those two accounts, you’re really just shooting
						yourself in the foot. Your available credit will plummet
						from $30,000 to $10,000, your debt will still be $5,000,
						and you’re right back to having a 50% of your credit
						limit… and doing additional damage to your credit score.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 ">
					<p>
						Pro tip: Keep your balances low and request regular
						credit limit increases every 6-9 months.
					</p>
				</div>
			</div>
		</div>
	);
};

export default function Usage() {
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
