import { useEffect, useState } from "react";
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
import { PersonalCreditTabsVertical } from "~/components/PersonalCreditTabs";
import CreditScoreHero from "~/components/CreditScoreHero";
import { get_user_id } from "~/utils/auth.server";
import { validate_action, is_resource_owner_p } from "~/utils/resource.server";
import { redirect } from "@remix-run/node";
import { CreditTabsSelect } from "~/components/PersonalCreditTabs";
import { Array } from "~/data/array";
import { prisma } from "~/utils/prisma.server";

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

	let scores = get_scores(report_response);

	return { report, scores };
};

export default function CreditReport() {
	var { report, scores } = useLoaderData() ?? {};
	const [target, setTarget] = useState();
	const elmSize = useElmSize(target);
	let setContentWidth = useLayoutStore((state) => state.set_content_width);
	let location = useLocation();
	let content_width = useLayoutStore((state) => state.content_width);
	let [isMobile, setIsMobile] = useState(true);

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
		<div className="flex flex-col flex-1 overflow-scroll">
			<div className="flex flex-col w-full pt-5">
				<div
					className="flex flex-col w-full p-[10px] max-w-5xl mx-auto"
					ref={setTarget}
				>
					<CreditScoreHero report={report} scores={scores} />

					<div
						className={`py-3 mb-10 flex ${
							isMobile ? "flex-col" : "flex-row"
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
						{!isMobile && (
							<div className="sm:flex flex-col w-1/5 mr-2 border rounded-lg h-fit">
								<PersonalCreditTabsVertical
									selected={get_route_endpoint(
										location.pathname
									)}
								/>
							</div>
						)}
						<div className="flex flex-col flex-1">
							<Outlet />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
