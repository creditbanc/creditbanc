import { useEffect, useState, useRef } from "react";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
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

const get_scores = (report) => {
	let { plan_id } = report;

	// console.log("plan_id");
	// console.log(plan_id);

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

		console.log("payload");
		console.log(payload);

		return payload;
	}
};

export const loader = async ({ request }) => {
	let url = new URL(request.url);

	let user_id = await get_user_id(request);
	let group_id = get_group_id(url.pathname);
	let file_id = get_file_id(url.pathname);

	let is_resource_owner = await is_resource_owner_p({
		entity_id: user_id,
		group_id,
		file_id,
	});

	let permissions = await validate_action({
		entity_id: user_id,
		group_resource_path_id: group_id,
		resource_path_id: file_id,
		is_owner: is_resource_owner,
		request,
	});

	let { can_view = false } = permissions ?? {};

	if (!can_view) return redirect("/");

	let group_docs = await get_group_docs({
		resource_id: group_id,
		entity_id: user_id,
	});

	let report = pipe(filter({ id: file_id }), head)(group_docs);

	let report_response = await prisma.personal_credit_report.findUnique({
		where: {
			id: report.id,
		},
	});

	let { plan_id } = await prisma.entity.findUnique({
		where: { id: user_id },
		select: {
			plan_id: true,
		},
	});

	let scores = get_scores(report_response);

	return { report, scores, plan_id, report_plan_id: report_response.plan_id };
};

export default function CreditReport() {
	var { report, scores, plan_id, report_plan_id } = useLoaderData() ?? {};
	const [target, setTarget] = useState();
	const elmSize = useElmSize(target);
	let setContentWidth = useLayoutStore((state) => state.set_content_width);
	let location = useLocation();
	let content_width = useLayoutStore((state) => state.content_width);
	let [isMobile, setIsMobile] = useState(true);
	const pageRef = useRef(null);
	let { set_coordinates } = useReportPageLayoutStore();

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
		<div className="flex flex-col flex-1 overflow-y-scroll p-5 overflow-hidden">
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

			<div className="flex flex-col w-full overflow-y-scroll overflow-hidden">
				<div
					className="flex flex-col w-full mx-auto overflow-hidden"
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
								className="flex flex-col h-full flex-1 overflow-y-scroll scrollbar-none"
								ref={pageRef}
							>
								<div className="w-full">
									<p className="my-2 font-semibold text-lg leading-6 text-blue-600">
										View all three personal credit bureaus
									</p>
									<h1 className="text-5xl font-bold tracking-tight">
										{report.first_name}'s personal credit
										report
									</h1>
								</div>

								<div className="flex flex-col w-full">
									<CreditScoreHero
										report={report}
										scores={scores}
									/>
								</div>

								<Outlet />
							</div>

							{!isMobile && (
								<div className="sm:flex flex-col w-[30%] mr-2 h-full bg-white border rounded">
									<PersonalCreditTabsVertical
										selected={get_route_endpoint(
											location.pathname
										)}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
