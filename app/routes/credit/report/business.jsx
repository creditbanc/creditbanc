import { Outlet, useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import { get_route_endpoint, get_group_id, get_entity_id, fetcher_payload_maker } from "~/utils/helpers";
import { get_session_entity_id } from "~/utils/auth.server";
import { redirect } from "@remix-run/node";
import { VerticalNav } from "~/components/BusinessCreditNav";
import { prisma } from "~/utils/prisma.server";
import { plan_product_requests } from "~/data/plan_product_requests";
import { get } from "shades";
import { update_lendflow_report, get_lendflow_report } from "~/utils/lendflow.server";
import UpgradeBanner from "~/components/UpgradeMembership";
import UpgradeCard from "~/components/UpgradeCard";
import { fold } from "~/utils/operators";
import { forkJoin, lastValueFrom, of as rxof, map as rxmap, tap, filter as rxfilter } from "rxjs";
import Report from "~/api/client/BusinessReport";
import Entity from "~/api/client/Entity";
import { useEffect } from "react";
import { use_cache } from "~/components/CacheLink";
import { on_success } from "./business/success";

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
	let url = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(url.pathname);

	let entity = new Entity(entity_id);
	let business_report = new Report(group_id);

	let entity_response = entity.plan_id.fold;
	let business_response = business_report.business_info.application_id.plan_id.scores.report_sha.fold;

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

	useEffect(() => {
		if (cache_dependencies !== undefined) {
			use_cache_client({ path: `/credit/report/business`, dependencies: cache_dependencies });
		}
	}, []);

	useEffect(() => {
		business_report_shas_fetcher.submit(...fetcher_payload_maker(business_report_shas_url));
	}, []);

	useEffect(() => {
		if (business_report_shas_fetcher.data) {
			console.log("business_report_shas_fetcher.data");
			console.log(business_report_shas_fetcher.data);
			on_should_update_cache(business_report_shas_fetcher.data, "business_credit_report").subscribe();
		}
	}, [business_report_shas_fetcher.data]);

	return (
		<div className="flex flex-col flex-1 overflow-y-scroll overflow-hidden">
			{/* {plan_id == "essential" && (
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
			)} */}

			<div className="flex flex-col w-full overflow-hidden h-full">
				<div className="flex flex-col w-full mx-auto overflow-hidden h-full">
					<div className={`@container flex overflow-hidden rounded h-full flex-row gap-x-5`}>
						<div className="flex flex-col flex-1 overflow-y-scroll rounded-lg scrollbar-none">
							<Outlet />
						</div>

						<div className="hidden @3xl:flex flex-col w-[30%] h-full bg-white border rounded">
							<div className="p-5">
								<div className="flex flex-row space-x-3 items-center">
									<div>
										<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
											<span className="text-lg font-medium leading-none text-white">
												{business?.name?.charAt(0)?.toUpperCase()}
											</span>
										</span>
									</div>
									<div>{business?.name}</div>
								</div>
							</div>
							{/* <div className="flex flex-col py-2">
									<Link
										to={`/financial/transactions`}
										className="px-5 mb-4 flex flex-row items-center space-x-3 text-blue-500 cursor-pointer text-sm"
									>
										<div>
											<DocumentDuplicateIcon className="h-4 w-4 text-blue-500" />
										</div>
										<div>Copy report share link</div>
										<div>
											<LinkIcon className="h-4 w-4 text-blue-500" />
										</div>
									</Link>
								</div> */}
							<div className="flex flex-col w-full overflow-scroll scrollbar-none">
								<div className="border-t"></div>
								<div className="flex flex-col w-full p-5 space-y-3">
									<div className="text-gray-400 text-sm">Credit Scores</div>
									<div className="flex flex-row">
										<div className="flex flex-col w-1/2 text-sm space-y-1">
											<div className="text-gray-400">Dun & Bradstreet</div>
											<div className="text-lg">{dnb_business_score}</div>
										</div>
										<div className="flex flex-col w-1/2 text-sm space-y-1">
											<div className="text-gray-400">Intelliscore</div>
											<div className="text-lg">{experian_business_score}</div>
										</div>
									</div>
								</div>
								<div className="border-t"></div>
								<div className="flex flex-col px-5 pt-5 text-sm space-y-3">
									<div className=" text-gray-400">Quick Links</div>

									<VerticalNav
										selected={get_route_endpoint(pathname)}
										report_plan_id={report_plan_id}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
