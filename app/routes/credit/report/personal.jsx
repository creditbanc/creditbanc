import { useEffect, useState, useRef } from "react";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { useLayoutStore } from "~/stores/useLayoutStore";
import { useElmSize } from "~/hooks/useElmSize";
import {
	get_group_id,
	get_route_endpoint,
	get_file_id,
	inspect,
} from "~/utils/helpers";
import { get_docs as get_group_docs } from "~/utils/group.server";
import { head, pipe } from "ramda";
import { filter } from "shades";
import {
	PersonalCreditTabsVertical,
	CreditTabsSelect,
} from "~/components/PersonalCreditTabs";
import CreditScoreHero from "~/components/CreditScoreHero";
import { get_user_id } from "~/utils/auth.server";
import { validate_action, is_resource_owner_p } from "~/utils/resource.server";
import { redirect } from "@remix-run/node";
import { Array } from "~/data/array";
import { prisma } from "~/utils/prisma.server";
import UpgradeMembership from "~/components/UpgradeMembership";
import UpdatePersonalReport from "~/components/UpdatePersonalReport";
import { plans_index } from "~/data/plans_index";
import { useReportPageLayoutStore } from "~/stores/useReportPageLayoutStore";
import { DocumentDuplicateIcon, LinkIcon } from "@heroicons/react/24/outline";
import { get_collection, get_doc } from "~/utils/firebase";
import axios from "axios";

const get_scores = (report) => {
	let { plan_id } = report;

	if (plan_id == "essential") {
		let { data } = report;

		let payload = {
			experian: data.score,
			equifax: 0,
			transunion: 0,
		};

		return payload;
	}

	if (plan_id !== "essential") {
		let { data } = report;
		let experian_score = Array.experian.score(data);
		let equifax_score = Array.equifax.score(data);
		let transunion_score = Array.transunion.score(data);

		let payload = {
			experian: experian_score,
			equifax: equifax_score,
			transunion: transunion_score,
		};

		return payload;
	}
};

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let { origin } = url;
	let user_id = await get_user_id(request);
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

	let report_response = await get_collection({
		path: ["credit_reports"],
		queries: personal_credit_report_queries,
	});

	let report = pipe(head)(report_response);

	let { plan_id } = await prisma.entity.findUnique({
		where: { id: user_id },
		select: {
			plan_id: true,
		},
	});

	let scores = get_scores(report);

	let business_info_response = await axios({
		method: "get",
		url: `${origin}/credit/report/business/api/company/resource/e/${user_id}/g/${group_id}`,
	});

	let { data: business = {} } = business_info_response;

	return {
		report,
		scores,
		plan_id,
		report_plan_id: report.plan_id,
		business,
	};
};

export default function CreditReport() {
	var { report, scores, plan_id, report_plan_id, business } =
		useLoaderData() ?? {};
	const [target, setTarget] = useState();
	const elmSize = useElmSize(target);
	let setContentWidth = useLayoutStore((state) => state.set_content_width);
	let location = useLocation();
	let content_width = useLayoutStore((state) => state.content_width);
	let [isMobile, setIsMobile] = useState(true);
	const pageRef = useRef(null);
	let { set_coordinates } = useReportPageLayoutStore();

	let { experian, equifax, transunion } = scores;

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

	const onPageScroll = () => {
		console.log("scrolling");
		const coordinates = pageRef.current?.getBoundingClientRect();
		set_coordinates(["coordinates"], coordinates);
	};

	return (
		<div className="flex flex-col flex-1 overflow-y-scroll p-5 overflow-hidden h-full">
			{plan_id == "essential" && (
				<div className="flex flex-col w-full items-center">
					<div className="flex flex-col w-full max-w-5xl">
						<UpgradeMembership />
					</div>
				</div>
			)}

			{plans_index[report_plan_id] < plans_index[plan_id] && (
				<div className="flex flex-col w-full items-center">
					<div className="flex flex-col w-full max-w-5xl">
						<UpdatePersonalReport />
					</div>
				</div>
			)}

			<div className="flex flex-col w-full overflow-y-scroll overflow-hidden h-full">
				<div
					className="flex flex-col w-full mx-auto overflow-hidden h-full"
					ref={setTarget}
				>
					<div
						className="flex flex-col w-full h-full overflow-hidden"
						onScroll={onPageScroll}
					>
						<div
							className={`flex h-full overflow-hidden ${
								isMobile ? "flex-col" : "flex-row gap-x-5"
							}`}
						>
							{isMobile && (
								<div className="flex flex-col my-4">
									<CreditTabsSelect
										selected={get_route_endpoint(
											location.pathname
										)}
									/>
								</div>
							)}

							<div
								className="flex flex-col h-full flex-1 overflow-y-scroll scrollbar-none rounded-lg"
								ref={pageRef}
							>
								<div className="flex flex-col w-full  px-5 pt-5  rounded-lg">
									<div className="w-full text-center space-y-5 mt-5">
										<h1 className="text-5xl font-bold tracking-tight">
											{report.first_name}'s personal
											credit report
										</h1>
										<p className="text-lg leading-6 ">
											View all three personal credit
											bureaus
										</p>
									</div>

									<div className="flex flex-col w-full">
										<CreditScoreHero
											report={report}
											scores={scores}
										/>
									</div>
								</div>

								<Outlet />
							</div>

							{!isMobile && (
								<div className="sm:flex flex-col w-[30%] mr-2 h-full bg-white border rounded">
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
														Experian
													</div>
													<div className="text-lg">
														{experian}
													</div>
												</div>
												<div className="flex flex-col w-1/2 text-sm space-y-1">
													<div className="text-gray-400">
														Equifax
													</div>
													<div className="text-lg">
														{equifax}
													</div>
												</div>
												<div className="flex flex-col w-1/2 text-sm space-y-1">
													<div className="text-gray-400">
														Transunion
													</div>
													<div className="text-lg">
														{transunion}
													</div>
												</div>
											</div>
										</div>
										<div className="border-t"></div>
										<div className="flex flex-col px-5 pt-5 text-sm space-y-3">
											<div className=" text-gray-400">
												Quick Links
											</div>
											<PersonalCreditTabsVertical
												selected={get_route_endpoint(
													location.pathname
												)}
											/>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
