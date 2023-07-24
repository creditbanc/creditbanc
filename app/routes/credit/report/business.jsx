import { useEffect, useState } from "react";
import {
	Link,
	Outlet,
	useLoaderData,
	useLocation,
	useSubmit,
} from "@remix-run/react";
import { useLayoutStore } from "~/stores/useLayoutStore";
import { useElmSize } from "~/hooks/useElmSize";
import {
	get_route_endpoint,
	get_file_id,
	inspect,
	get_group_id,
	get_entity_id,
} from "~/utils/helpers";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { redirect } from "@remix-run/node";
import { VerticalNav } from "~/components/BusinessCreditNav";
import { prisma } from "~/utils/prisma.server";
import { plans_index } from "~/data/plans_index";
import { plan_product_requests } from "~/data/plan_product_requests";
import { head, pipe } from "ramda";
import { get } from "shades";
import { Lendflow } from "~/data/lendflow";
import {
	update_lendflow_report,
	get_lendflow_report,
} from "~/utils/lendflow.server";
import deepEqual from "deep-equal";
import UpgradeBanner from "~/components/UpgradeMembership";
import UpgradeCard from "~/components/UpgradeCard";
import { DocumentDuplicateIcon, LinkIcon } from "@heroicons/react/24/outline";
import { get_collection, get_doc, set_doc } from "~/utils/firebase";
import axios from "axios";
import { is_authorized_f } from "~/api/auth";

export const action = async ({ request }) => {
	var form = await request.formData();
	const application_id = form.get("application_id");
	const plan_id = form.get("plan_id");
	const report_id = form.get("report_id");
	const entity_id = form.get("entity_id");
	const report_plan_id = form.get("report_plan_id");
	const redirect_to = form.get("redirect_to");

	let experian_requested_products = pipe(get(plan_id))(
		plan_product_requests.experian
	);

	let dnb_requested_products = pipe(get(plan_id))(plan_product_requests.dnb);

	let requested_products = [
		...experian_requested_products,
		...dnb_requested_products,
	];

	await update_lendflow_report(application_id, requested_products);

	console.log("start");
	await new Promise((resolve) => setTimeout(resolve, 10000));
	console.log("end");

	let credit_report = await get_lendflow_report(application_id);

	let report = await prisma.business_credit_report.update({
		where: {
			id: report_id,
		},
		data: {
			...credit_report,
			plan_id,
		},
	});

	return redirect(redirect_to);
};

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let { origin } = url;
	// let file_id = get_file_id(url.pathname);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(url.pathname);

	let is_authorized = await is_authorized_f(
		entity_id,
		group_id,
		"credit",
		"read"
	);

	// console.log("is_authorized______");
	// console.log(is_authorized);

	if (!is_authorized) {
		return redirect(`/home/resource/e/${entity_id}/g/${group_id}`);
	}

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

	// console.log("report");
	// console.log(report);

	if (!report) {
		return redirect(
			`/credit/business/new/resource/e/${entity_id}/g/${group_id}?cookie=monster`
		);
	}

	let lendflow_report = await get_lendflow_report(report.application_id);
	// let is_latest_report = deepEqual(report.data, lendflow_report.data);

	let payload = {
		...report,
		...lendflow_report,
	};

	await set_doc(["credit_reports", report.doc_id], payload);

	let { plan_id } = await get_doc(["entity", entity_id]);

	let credit_scores_api_response = await axios({
		method: "get",
		url: `${origin}/credit/report/api/scores/resource/e/${entity_id}/g/${group_id}`,
	});

	let { data: scores = {} } = credit_scores_api_response;

	let business_info_response = await axios({
		method: "get",
		url: `${origin}/credit/report/business/api/company/resource/e/${entity_id}/g/${group_id}`,
	});

	let { data: business = {} } = business_info_response;

	return {
		entity_id,
		plan_id,
		// report_id: file_id,
		application_id: report?.application_id,
		report_plan_id: report?.plan_id,
		business,
		scores,
	};
};

export default function BusinessReport() {
	let location = useLocation();
	const [target, setTarget] = useState();
	const elmSize = useElmSize(target);
	let setContentWidth = useLayoutStore((state) => state.set_content_width);
	let content_width = useLayoutStore((state) => state.content_width);
	let [isMobile, setIsMobile] = useState(true);
	let {
		plan_id = undefined,
		report_plan_id = undefined,
		business = undefined,
		scores = undefined,
	} = useLoaderData();

	let { experian_business_score = 0, dnb_business_score = 0 } = scores;

	useEffect(() => {
		if (content_width > 640) {
			setIsMobile(false);
		} else {
			setIsMobile(true);
		}
	}, [content_width]);

	useEffect(() => {
		if (elmSize) {
			setContentWidth(elmSize.width);
		}
	}, [elmSize]);

	return (
		<div className="flex flex-col flex-1 overflow-y-scroll overflow-hidden">
			{plan_id == "essential" && (
				<div className="flex flex-col w-full items-center">
					<div className="flex flex-col w-full max-w-5xl">
						<UpgradeBanner />
					</div>
				</div>
			)}

			{plans_index[report_plan_id] < plans_index[plan_id] && (
				<div className="flex flex-col w-full items-center">
					<div className="flex flex-col w-full max-w-5xl">
						<UpgradeCard />
					</div>
				</div>
			)}

			<div className="flex flex-col w-full overflow-hidden h-full">
				<div
					className="flex flex-col w-full mx-auto overflow-hidden h-full"
					ref={setTarget}
				>
					<div
						className={`flex overflow-hidden rounded h-full ${
							isMobile ? "flex-col" : "flex-row gap-x-5"
						}`}
					>
						<div className="flex flex-col flex-1 overflow-y-scroll rounded-lg scrollbar-none">
							<Outlet />
						</div>

						{!isMobile && (
							<div className="sm:flex flex-col w-[30%] h-full bg-white border rounded">
								<div className="p-5">
									<div className="flex flex-row space-x-3 items-center">
										<div>
											<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
												<span className="text-lg font-medium leading-none text-white">
													{business?.name
														.charAt(0)
														.toUpperCase()}
												</span>
											</span>
										</div>
										<div>{business?.name}</div>
									</div>
								</div>
								<div className="flex flex-col py-2">
									<Link
										to={`/financial/transactions`}
										className="px-5 mb-4 flex flex-row items-center space-x-3 text-blue-500 cursor-pointer text-sm"
									>
										<div>
											<DocumentDuplicateIcon className="h-4 w-4 text-blue-500" />
										</div>
										<div>Copy copmany share link</div>
										<div>
											<LinkIcon className="h-4 w-4 text-blue-500" />
										</div>
									</Link>
								</div>
								<div className="flex flex-col w-full overflow-scroll scrollbar-none">
									<div className="border-t"></div>
									<div className="flex flex-col w-full p-5 space-y-3">
										<div className="text-gray-400 text-sm">
											Credit Scores
										</div>
										<div className="flex flex-row">
											<div className="flex flex-col w-1/2 text-sm space-y-1">
												<div className="text-gray-400">
													Dun & Bradstreet
												</div>
												<div className="text-lg">
													{dnb_business_score}
												</div>
											</div>
											<div className="flex flex-col w-1/2 text-sm space-y-1">
												<div className="text-gray-400">
													Experian
												</div>
												<div className="text-lg">
													{experian_business_score}
												</div>
											</div>
										</div>
									</div>
									<div className="border-t"></div>
									<div className="flex flex-col px-5 pt-5 text-sm space-y-3">
										<div className=" text-gray-400">
											Quick Links
										</div>

										<VerticalNav
											selected={get_route_endpoint(
												location.pathname
											)}
											report_plan_id={report_plan_id}
										/>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
