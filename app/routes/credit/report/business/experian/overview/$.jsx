import {
	HandThumbUpIcon,
	ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { useLoaderData } from "@remix-run/react";
import { Lendflow } from "~/data/lendflow";
import { get_file_id, get_group_id, inspect } from "~/utils/helpers";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { plans } from "~/data/plans";
import { get, has } from "shades";
import { allPass, pipe, not, head, identity } from "ramda";
import { report_tests } from "~/data/report_tests";
import { get_lendflow_report } from "~/utils/lendflow.server";
import { update_business_report } from "~/utils/business_credit_report.server";
import { get_collection, get_doc, set_doc } from "~/utils/firebase";
import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";
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
import { fold, ifEmpty, ifFalse } from "~/utils/operators";
import { is_authorized_f } from "~/api/auth";

const subject = new Subject();

// const credit_report = subject.pipe(
// 	rxfilter((message) => message.id == "get_credit_report"),
// 	concatMap(({args: {request}}) => {

// 	})
// )

const credit_report = subject.pipe(
	rxfilter((message) => message.id == "get_credit_report"),
	concatMap(({ args: { request } }) => {
		let url = new URL(request.url);

		let business_credit_report_queries = (group_id) => [
			{
				param: "group_id",
				predicate: "==",
				value: group_id,
			},
			{
				param: "type",
				predicate: "==",
				value: "business_credit_report",
			},
		];

		let get_credit_report = (group_id) =>
			from(
				get_collection({
					path: ["credit_reports"],
					queries: business_credit_report_queries(group_id),
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

		let redirect_new_report = entity_group_id.pipe(
			concatMap(({ entity_id, group_id }) =>
				throwError(() =>
					Response.redirect(
						`${url.origin}/credit/business/new/resource/e/${entity_id}/g/${group_id}`
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

		let application_id = group_id.pipe(
			concatMap(get_credit_report),
			concatMap(ifEmpty(redirect_new_report)),
			rxmap(pipe(head, get("application_id")))
		);

		let $report = application_id.pipe(
			concatMap(LendflowExternal.get_lendflow_report),
			rxmap(pipe(get("data", "data"))),
			rxmap((report) => new LendflowInternal(report))
		);

		let experian_score = $report.pipe(
			rxmap((report) => report.experian_score())
		);

		let experian_risk_class = $report.pipe(
			rxmap((report) => report.experian_risk_class())
		);

		let business_info = $report.pipe(
			rxmap((report) => report.business_info())
		);

		let experian_trade_summary = $report.pipe(
			rxmap((report) => report.experian_trade_summary())
		);

		return is_authorized.pipe(
			concatMap(() =>
				forkJoin({
					experian_score,
					experian_risk_class,
					business_info,
					experian_trade_summary,
				})
			),
			tap((value) => {
				console.log("credit.report.business.experian.overview.tap");
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

		subject.next({
			id: "credit_report_response",
			next: () => ({ ...response, plan_id }),
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
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Intelliscore Plus
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-1/2">
						<div className="flex flex-col items-center justify-center h-full space-y-2">
							<div className="flex flex-col text-5xl">
								{score}
							</div>
							<div className="flex flex-col">
								{risk_class?.definition}
							</div>
						</div>
					</div>
					<div className="flex flex-col w-1/2 text-sm">
						<div className="flex flex-col mb-2 font-semibold">
							Experian Business Record shown for:
						</div>
						<div className="flex flex-col">
							<div>{business?.name}</div>
							<div>{business?.address?.street}</div>
							<div className="flex flex-row space-x-1">
								<div className="flex flex-col mr-1">
									{business?.address?.city},
								</div>
								<div>{business?.address?.state}</div>
								<div>{business?.address?.zip}</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full space-y-3">
					<div className="font-semibold">
						What Exactly is an Intelliscore?
					</div>
					<div>
						Your business's Intelliscore is like a crystal ball into
						your credit health. It takes into account your payment
						history, utilization, and even your trended data. And
						the higher the score, the better; lenders don't like to
						play risky business when it comes to their money.
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
