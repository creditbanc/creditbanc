import { useEffect, useState } from "react";
import {
	Outlet,
	useLoaderData,
	useLocation,
	useSubmit,
} from "@remix-run/react";
import { useLayoutStore } from "~/stores/useLayoutStore";
import { useElmSize } from "~/hooks/useElmSize";
import { get_route_endpoint, get_file_id, inspect } from "~/utils/helpers";
import { get_user_id } from "~/utils/auth.server";
import { redirect } from "@remix-run/node";
import { VerticalNav } from "~/components/BusinessCreditNav";
import { prisma } from "~/utils/prisma.server";
import { plans_index } from "~/data/plans_index";
import { plan_product_requests } from "~/data/plan_product_requests";
import { pipe } from "ramda";
import { get } from "shades";
import { Lendflow } from "~/data/lendflow";
import {
	update_lendflow_report,
	get_lendflow_report,
} from "~/utils/lendflow.server";
import deepEqual from "deep-equal";
import UpgradeBanner from "~/components/UpgradeBanner";
import UpgradeCard from "~/components/UpgradeCard";

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
	let file_id = get_file_id(url.pathname);
	let entity_id = await get_user_id(request);

	let report = await prisma.business_credit_report.findUnique({
		where: {
			id: file_id,
		},
	});

	let lendflow_report = await get_lendflow_report(report.application_id);
	let is_latest_report = deepEqual(report.data, lendflow_report.data);

	if (!is_latest_report) {
		report = await prisma.business_credit_report.update({
			where: {
				id: report.id,
			},
			data: {
				...lendflow_report,
			},
		});
		return redirect(url);
	}

	let { plan_id } = await prisma.entity.findUnique({
		where: { id: entity_id },
		select: {
			plan_id: true,
		},
	});

	return {
		entity_id,
		plan_id,
		report_id: file_id,
		application_id: report?.application_id,
		report_plan_id: report?.plan_id,
	};
};

export default function BusinessReport() {
	let location = useLocation();
	const [target, setTarget] = useState();
	const elmSize = useElmSize(target);
	let setContentWidth = useLayoutStore((state) => state.set_content_width);
	let content_width = useLayoutStore((state) => state.content_width);
	let [isMobile, setIsMobile] = useState(true);
	let { plan_id, report_plan_id } = useLoaderData();

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
			<div className="flex flex-col w-full">
				<div
					className="flex flex-col w-full p-[10px] max-w-5xl mx-auto"
					ref={setTarget}
				>
					<div
						className={`py-3 mb-10 flex ${
							isMobile ? "flex-col" : "flex-row"
						}`}
					>
						{!isMobile && (
							<div className="sm:flex flex-col w-1/5 mr-2 border rounded-lg h-fit">
								<VerticalNav
									selected={get_route_endpoint(
										location.pathname
									)}
									report_plan_id={report_plan_id}
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
