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
import { allPass, pipe, not, head } from "ramda";
import { report_tests } from "~/data/report_tests";
import { get_lendflow_report } from "~/utils/lendflow.server";
import { update_business_report } from "~/utils/business_credit_report.server";
import { get_collection, get_doc, set_doc } from "~/utils/firebase";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	// let file_id = get_file_id(url.pathname);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(url.pathname);

	let { plan_id } = await get_doc(["entity", entity_id]);

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

	let report_response = await get_collection({
		path: ["credit_reports"],
		queries: business_credit_report_queries,
	});

	let report = pipe(head)(report_response);

	let is_owner = report.entity_id == entity_id;

	// if (pipe(allPass(report_tests[plan_id]["experian"]), not)(report)) {
	// 	let lendflow_report = await get_lendflow_report(report.application_id);

	// 	// console.log("lendflow_report");
	// 	// console.log(lendflow_report);

	// 	// report = await set_doc(["credit_reports", report.id], {
	// 	// 	...report,
	// 	// 	...lendflow_report,
	// 	// });
	// }

	let score = Lendflow.experian.score(report);
	let risk_class = Lendflow.experian.risk_class(report);
	let business = Lendflow.business(report);
	let trade_summary = Lendflow.experian.trade_summary(report);
	let report_payload = { score, risk_class, business, trade_summary };
	return { ...report_payload, plan_id };
};

const ScoreCard = () => {
	let { score, risk_class, business, trade_summary } = useLoaderData();

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
