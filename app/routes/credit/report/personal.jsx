import { useEffect, useState, useRef } from "react";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { useLayoutStore } from "~/stores/useLayoutStore";
import { useElmSize } from "~/hooks/useElmSize";
import { get_group_id, get_route_endpoint, capitalize } from "~/utils/helpers";
import { PersonalCreditTabsVertical, CreditTabsSelect } from "~/components/PersonalCreditTabs";
import CreditScoreHero from "~/components/CreditScoreHero";
import { useReportPageLayoutStore } from "~/stores/useReportPageLayoutStore";
import { pipe, toLower, tryCatch, always } from "ramda";
import { lastValueFrom } from "rxjs";
import { fold } from "~/utils/operators";
import PersonalReport from "~/api/client/PersonalReport";
import { use_cache } from "~/components/CacheLink";
import { on_success } from "./personal/success";
import { is_authorized } from "./personal/authorized";
import { redirect } from "@remix-run/node";

const log_route = `credit.report.personal`;

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const loader = async ({ request }) => {
	if (!(await is_authorized(request))) return redirect("/home");
	let url = new URL(request.url);
	let group_id = get_group_id(url.pathname);
	let report = new PersonalReport(group_id);
	let payload = report.scores.first_name.last_name.report_sha.shas.fold;
	let response = await lastValueFrom(payload.pipe(fold(on_success(request), on_error)));
	return response;
};

export default function CreditReport() {
	var { plan_id, report_plan_id, first_name, last_name, scores = {}, cache_dependencies } = useLoaderData();
	let use_cache_client = use_cache((state) => state.set_dependencies);
	const [target, setTarget] = useState();
	const elmSize = useElmSize(target);
	let setContentWidth = useLayoutStore((state) => state.set_content_width);
	let location = useLocation();
	let content_width = useLayoutStore((state) => state.content_width);
	let [isMobile, setIsMobile] = useState(true);
	const pageRef = useRef(null);
	let { set_coordinates } = useReportPageLayoutStore();

	let {
		experian_personal_score: experian = 0,
		equifax_personal_score: equifax = 0,
		transunion_personal_score: transunion = 0,
	} = scores;

	first_name = tryCatch(pipe(toLower, capitalize), always(""))(first_name);
	last_name = tryCatch(pipe(toLower, capitalize), always(""))(last_name);

	useEffect(() => {
		if (cache_dependencies !== undefined) {
			use_cache_client({ path: `/credit/report/personal`, dependencies: cache_dependencies });
		}
	}, []);

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
		<div className="flex flex-col flex-1 overflow-y-scroll overflow-hidden h-full">
			{/* {plan_id == "essential" && (
				<div className="flex flex-col w-full items-center">
					<div className="flex flex-col w-full max-w-5xl">
						<UpgradeMembership />
					</div>
				</div>
			)} */}

			{/* {plans_index[report_plan_id] < plans_index[plan_id] && (
				<div className="flex flex-col w-full items-center">
					<div className="flex flex-col w-full max-w-5xl">
						<UpdatePersonalReport />
					</div>
				</div>
			)} */}
			<div className="flex flex-col w-full overflow-y-scroll overflow-hidden h-full">
				<div className="flex flex-col w-full mx-auto overflow-hidden h-full" ref={setTarget}>
					<div className="flex flex-col w-full h-full overflow-hidden" onScroll={onPageScroll}>
						<div className={`flex h-full overflow-hidden ${isMobile ? "flex-col" : "flex-row gap-x-5"}`}>
							{isMobile && (
								<div className="flex flex-col my-4">
									<CreditTabsSelect selected={get_route_endpoint(location.pathname)} />
								</div>
							)}

							<div
								className="flex flex-col h-full flex-1 overflow-y-scroll scrollbar-none rounded-lg bg-white border"
								ref={pageRef}
							>
								<div className="flex flex-col w-full  px-5 pt-5  rounded-lg">
									<div className="w-full text-center space-y-5 mt-5">
										<div className="flex flex-row text-5xl font-bold tracking-tight space-x-1 justify-center mb-5">
											<div>{first_name}</div>
											<div>'s personal credit report</div>
										</div>
										{/* <p className="text-lg leading-6 ">View all three personal credit bureaus</p> */}
									</div>

									{/* <div className="flex flex-col w-full">
										<CreditScoreHero
											experian={experian}
											equifax={equifax}
											transunion={transunion}
										/>
									</div> */}
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
														{first_name?.charAt(0).toUpperCase()}
													</span>
												</span>
											</div>
											<div>
												{first_name} {last_name}
											</div>
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
													<div className="text-gray-400">Experian</div>
													<div className="text-lg">{experian}</div>
												</div>
												<div className="flex flex-col w-1/2 text-sm space-y-1">
													<div className="text-gray-400">Equifax</div>
													<div className="text-lg">{equifax}</div>
												</div>
												<div className="flex flex-col w-1/2 text-sm space-y-1">
													<div className="text-gray-400">Transunion</div>
													<div className="text-lg">{transunion}</div>
												</div>
											</div>
										</div>
										<div className="border-t"></div>
										<div className="flex flex-col px-5 pt-5 text-sm space-y-3">
											<div className=" text-gray-400">Quick Links</div>
											<PersonalCreditTabsVertical
												selected={get_route_endpoint(location.pathname)}
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
