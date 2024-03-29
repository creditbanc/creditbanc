import { Outlet, useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import { get_group_id, get_entity_id } from "~/utils/helpers";
import { get_session_entity_id } from "~/utils/auth.server";
import { redirect } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { plan_product_requests } from "~/data/plan_product_requests";
import { get } from "shades";
import { update_lendflow_report, get_lendflow_report, LendflowExternal } from "~/utils/lendflow.server";
import { fold } from "~/utils/operators";
import { forkJoin, lastValueFrom, of as rxof, map as rxmap, tap, filter as rxfilter, concatMap, from } from "rxjs";
import Report from "~/api/client/BusinessReport";
import Entity from "~/api/client/Entity";
import { use_cache } from "~/components/CacheLink";
import { on_success } from "./business/success";
import { is_authorized } from "./business/authorized";
import { pipe } from "ramda";
import { update_doc } from "~/utils/firebase";
import Group from "~/api/client/Group";

const log_route = `credit.report.business`;

export const action = async ({ request }) => {
	var form = await request.formData();
	const application_id = form.get("application_id");
	const plan_id = form.get("plan_id");
	const report_id = form.get("report_id");
	const entity_id = form.get("entity_id");
	const report_plan_id = form.get("report_plan_id");
	const redirect_to = form.get("redirect_to");

	let experian_requested_products = pipe(get(plan_id))(plan_product_requests.experian);

	let dnb_requested_products = pipe(get(plan_id))(plan_product_requests.dnb);

	let requested_products = [...experian_requested_products, ...dnb_requested_products];

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

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const loader = async ({ request }) => {
	// if (!(await is_authorized(request))) return redirect("/home");
	let url = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(url.pathname);

	let group = new Group(group_id);

	let group_response = group.has_reports.fold;
	let group_payload = await lastValueFrom(group_response);

	if (!group_payload.business_report) {
		return redirect(`/credit/business/new/v/1/resource/e/${entity_id}/g/${group_id}`);
	}

	let entity = new Entity(entity_id);
	let business_report = new Report(group_id);

	let entity_response = entity.plan_id.fold;
	let business_response = business_report.business_info.application_id.plan_id.scores.report_sha.fold;

	// DELETE THIS --- DELETE THIS --- DELETE THIS
	// DELETE THIS --- DELETE THIS --- DELETE THIS
	// DELETE THIS --- DELETE THIS --- DELETE THIS
	// DELETE THIS --- DELETE THIS --- DELETE THIS
	let report = business_response
		.pipe(
			concatMap((response) => {
				let { application_id, data = undefined } = response;
				if (data == undefined) {
					return from(LendflowExternal.get_lendflow_report(application_id)).pipe(
						rxmap(pipe(get("data", "data"))),
						concatMap((report) =>
							from(update_doc(["credit_reports", application_id], { data: report })).pipe(
								rxmap(() => report)
								// tap(() => console.log("credit.report.business.LendflowExternal")),
								// tap(inspect)
							)
						)
					);
				} else {
					return rxof(response);
				}
			})
		)
		.subscribe();
	// DELETE THIS --- DELETE THIS --- DELETE THIS
	// DELETE THIS --- DELETE THIS --- DELETE THIS
	// DELETE THIS --- DELETE THIS --- DELETE THIS

	let payload = forkJoin({ business_response, entity_response }).pipe(
		rxmap(({ business_response, entity_response }) => {
			return {
				...business_response,
				entity_id,
				plan_id: entity_response.plan_id,
				report_plan_id: business_response.plan_id,
			};
		})
	);

	let response = await lastValueFrom(payload.pipe(fold(on_success(request), on_error)));
	return response;
};

export default function BusinessReport() {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	let use_cache_client = use_cache((state) => state.set_dependencies);
	let update_cache_key = use_cache((state) => state.set_state);

	let {
		plan_id = undefined,
		report_plan_id = undefined,
		business_info: business = undefined,
		scores = {},
		cache_dependencies = undefined,
	} = useLoaderData();

	let { experian_business_score = 0, dnb_business_score = 0 } = scores;

	let business_report_shas_fetcher = useFetcher();
	let business_report_shas_url = `/credit/report/api/business/shas/resource/e/${entity_id}/g/${group_id}`;

	const on_should_update_cache = ({ prev_sha, curr_sha }, update_key) => {
		let update_cache = () => update_cache_key(["keys", update_key], `${curr_sha}`);

		return rxof({ prev_sha, curr_sha }).pipe(
			tap(console.log("on_should_update")),
			tap(console.log),
			rxfilter(({ prev_sha, curr_sha }) => prev_sha !== curr_sha),
			tap(update_cache)
		);
	};

	return (
		<div className="flex flex-col flex-1 overflow-y-scroll overflow-hidden">
			<div className="flex flex-col w-full overflow-hidden h-full">
				<div className="flex flex-col w-full mx-auto overflow-hidden h-full">
					<div className={`@container flex overflow-hidden rounded h-full flex-row gap-x-5`}>
						<div className="flex flex-col flex-1 overflow-y-scroll rounded-lg scrollbar-none border">
							<Outlet />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
