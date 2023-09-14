import {
	HandThumbUpIcon,
	ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { useLoaderData } from "@remix-run/react";
import { mrm_credit_report, Lendflow } from "~/data/lendflow";
import { get_file_id, get_group_id, inspect } from "~/utils/helpers";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { get_collection, get_doc, set_doc } from "~/utils/firebase";
import { head, pipe, identity } from "ramda";
import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";
import { get } from "shades";
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

		let business_credit_report_queries = [
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

		let application_id = from(
			get_collection({
				path: ["credit_reports"],
				queries: business_credit_report_queries,
			})
		).pipe(
			rxmap(pipe(head, get("application_id"))),
			rxmap(() => "d6d6cb45-0818-4f43-a8cd-29208f0cf7b2")
		);

		let $report = application_id.pipe(
			concatMap(LendflowExternal.get_lendflow_report),
			rxmap(pipe(get("data", "data"))),
			rxmap((report) => new LendflowInternal(report))
		);

		let business_info = $report.pipe(
			rxmap((report) => report.business_info())
		);

		let dnb_score = $report.pipe(rxmap((report) => report.dnb_score()));

		let dnb_delinquency_score = $report.pipe(
			rxmap((report) => report.dnb_delinquency_score())
		);

		return is_authorized.pipe(
			concatMap(() =>
				forkJoin({
					business_info,
					dnb_score,
					dnb_delinquency_score,
				})
			),
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

	// let entity_id = await get_session_entity_id(request);

	// let { plan_id } = await get_doc(["entity", entity_id]);

	// let response = await lastValueFrom(
	// 	from(report(request)).pipe(concatMap(identity))
	// );

	// return { ...response, plan_id };

	// let is_owner = report.entity_id == entity_id;

	// let url = new URL(request.url);
	// let group_id = get_group_id(url.pathname);

	// let business_credit_report_queries = [
	// 	{
	// 		param: "group_id",
	// 		predicate: "==",
	// 		value: group_id,
	// 	},
	// 	{
	// 		param: "type",
	// 		predicate: "==",
	// 		value: "business_credit_report",
	// 	},
	// ];

	// let report_response = await get_collection({
	// 	path: ["credit_reports"],
	// 	queries: business_credit_report_queries,
	// });

	// let report = pipe(head)(report_response);

	// let score = Lendflow.dnb.score(report);

	// let delinquency_score = Lendflow.dnb.delinquency_score(report);
	// // console.log("delinquency_score");
	// // console.log(delinquency_score);
	// let business = Lendflow.business(report);

	// return { score, delinquency_score, business };
};

const ScoreCard = () => {
	let {
		dnb_score: score,
		dnb_delinquency_score: delinquency_score,
		business_info: business,
	} = useLoaderData();

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Dun & Bradstreet PAYDEX
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-row w-full space-x-6">
					<div className="flex flex-col w-1/2">
						<div className="flex flex-col items-center justify-center h-full space-y-2">
							<div className="flex flex-col text-5xl">
								{score}
							</div>
							<div className="flex flex-col text-center">
								{delinquency_score}
							</div>
						</div>
					</div>
					<div className="flex flex-col w-1/2 text-sm ">
						<div className="flex flex-col mb-2 font-semibold">
							Business Record shown for:
						</div>
						<div className="flex flex-col">
							<div>{business.name}</div>
							<div>{business.address.street}</div>
							<div className="flex flex-row space-x-1">
								<div className="flex flex-col mr-1">
									{business.address.city},
								</div>
								<div>{business.address.state}</div>
								<div>{business.address.zip}</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full space-y-3">
					<div className="font-semibold">
						What is the Dun & Bradstreet PAYDEX Score?
					</div>
					<div>
						Your D&B PAYDEX® indicates that your company is likely
						to meet its credit obligations and make its payments
						promptly or within payment terms. A D&B PAYDEX® between
						71-100 is considered Low risk.
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
