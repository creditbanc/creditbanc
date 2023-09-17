import { useEffect, useState, useRef } from "react";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { useLayoutStore } from "~/stores/useLayoutStore";
import { useElmSize } from "~/hooks/useElmSize";
import {
	get_group_id,
	get_route_endpoint,
	get_file_id,
	inspect,
	get_entity_id,
	capitalize,
} from "~/utils/helpers";
import { get_docs as get_group_docs } from "~/utils/group.server";
// import { head, pipe } from "ramda";
// import { filter } from "shades";
import {
	PersonalCreditTabsVertical,
	CreditTabsSelect,
} from "~/components/PersonalCreditTabs";
import CreditScoreHero from "~/components/CreditScoreHero";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { validate_action, is_resource_owner_p } from "~/utils/resource.server";
import { redirect } from "@remix-run/node";
import { Array, get_credit_report } from "~/data/array";
import { prisma } from "~/utils/prisma.server";
import UpgradeMembership from "~/components/UpgradeMembership";
import UpdatePersonalReport from "~/components/UpdatePersonalReport";
import { plans_index } from "~/data/plans_index";
import { useReportPageLayoutStore } from "~/stores/useReportPageLayoutStore";
import { DocumentDuplicateIcon, LinkIcon } from "@heroicons/react/24/outline";
// import { get_collection, get_doc } from "~/utils/firebase";
import axios from "axios";
// import { is_authorized_f } from "~/api/auth";

import { get_collection, get_doc, set_doc, update_doc } from "~/utils/firebase";
import { head, pipe, identity, curry, defaultTo, pick, toLower } from "ramda";
import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";
import { get, filter } from "shades";
import {
	map as rxmap,
	filter as rxfilter,
	concatMap,
	tap,
	take,
	catchError,
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
import { fold, ifFalse, ifEmpty } from "~/utils/operators";
import { is_authorized_f } from "~/api/auth";
import { ArrayExternal } from "~/api/external/Array";
import { ArrayInternal } from "~/api/internal/Array";

const subject = new Subject();

const credit_scores = subject.pipe(
	rxfilter((message) => message.id == "get_credit_scores"),
	concatMap(({ args: { request } }) => {
		let url = new URL(request.url);

		let personal_credit_report_queries = (group_id) => [
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

		let get_personal_credit_report = (group_id) =>
			from(
				get_collection({
					path: ["credit_reports"],
					queries: personal_credit_report_queries(group_id),
				})
			);

		let group_id = rxof(get_group_id(url.pathname));
		let entity_id = from(get_session_entity_id(request));

		let entity_group_id = forkJoin({
			entity_id,
			group_id,
		});

		let redirect_new_report = entity_group_id.pipe(
			concatMap(({ entity_id, group_id }) =>
				throwError(() =>
					Response.redirect(
						`${url.origin}/credit/personal/new/resource/e/${entity_id}/g/${group_id}`
					)
				)
			)
		);

		let redirect_home = entity_group_id.pipe(
			concatMap(({ entity_id, group_id }) =>
				throwError(() =>
					Response.redirect(
						`${url.origin}/home/resource/e/${entity_id}/g/${group_id}`
					)
				)
			)
		);

		const update_display_token = ({ clientKey, reportKey, report_id }) => {
			console.log("credit.report.personal.update_display_token");
			return rxof({ clientKey, reportKey, report_id }).pipe(
				concatMap(() =>
					ArrayExternal.refreshDisplayToken(clientKey, reportKey)
				),
				catchError((error) => {
					console.log("credit.report.update_display_token.error");
					console.log(error);

					return redirect_home;
				}),
				rxfilter((value) => value.displayToken),
				concatMap(({ displayToken }) =>
					update_doc(["credit_reports", report_id], {
						displayToken,
					})
				)
			);
		};

		let personal_report = group_id.pipe(
			concatMap(get_personal_credit_report),
			concatMap(ifEmpty(redirect_new_report)),
			rxmap(
				pipe(
					head,
					pick(["reportKey", "clientKey", "displayToken", "id"])
				)
			),
			concatMap(({ reportKey, displayToken, clientKey, id: report_id }) =>
				from(
					ArrayExternal.get_credit_report(reportKey, displayToken)
				).pipe(
					rxfilter((report) => report.CREDIT_RESPONSE),
					catchError((error) => {
						let status = pipe(get("response", "status"))(error);

						return rxof(status).pipe(
							// rxfilter((status) => status == 401),
							concatMap(() =>
								update_display_token({
									clientKey,
									reportKey,
									report_id,
								})
							),
							tap(() =>
								subject.next({
									id: "get_credit_scores",
									args: { request },
								})
							),
							rxfilter((value) => value !== undefined)
						);
					})
				)
			),
			rxmap((array_response) => new ArrayInternal(array_response))
		);

		experian_personal_score = personal_report.pipe(
			rxmap((report) => report.experian_score())
		);

		equifax_personal_score = personal_report.pipe(
			rxmap((report) => report.equifax_score())
		);

		transunion_personal_score = personal_report.pipe(
			rxmap((report) => report.transunion_score())
		);

		let first_name = personal_report.pipe(
			rxmap((report) => report.first_name())
		);

		let last_name = personal_report.pipe(
			rxmap((report) => report.last_name())
		);

		return forkJoin({
			experian_personal_score,
			equifax_personal_score,
			transunion_personal_score,
			personal_report,
			first_name,
			last_name,
		}).pipe(
			// rxmap(
			// 	({
			// 		experian_personal_score,
			// 		equifax_personal_score,
			// 		transunion_personal_score,
			// 		personal_report,
			// 		first_name,
			// 		last_name,
			// 	}) => ({
			// 		scores: {
			// 			experian: experian_personal_score,
			// 			equifax: equifax_personal_score,
			// 			transunion: transunion_personal_score,
			// 		},
			// 		business: {},
			// 		report_plan_id: "builder",
			// 		plan_id: "builder",
			// 		report: personal_report,
			// 		first_name,
			// 		last_name,
			// 	})
			// ),
			tap((value) => {
				console.log("credit.report.personal.tap");
				console.log(value);
			})
		);
	})
);

export const loader = async ({ request }) => {
	const on_success = async (response) => {
		console.log("credit.report.success");

		subject.next({
			id: "credit_score_response",
			next: () => response,
		});
	};

	const on_error = (error) => {
		console.log("credit.report.error");
		console.log(error);

		subject.next({
			id: "credit_score_response",
			next: () => error,
		});
	};

	const on_complete = (value) => value.id === "credit_score_response";

	credit_scores.pipe(fold(on_success, on_error)).subscribe();

	subject.next({ id: "get_credit_scores", args: { request } });

	let response = await lastValueFrom(
		subject.pipe(rxfilter(on_complete), take(1))
	);

	return response.next();

	// let url = new URL(request.url);
	// let { origin } = url;
	// let entity_id = await get_session_entity_id(request);
	// // let entity_id = get_entity_id(url.pathname);
	// let group_id = get_group_id(url.pathname);

	// let is_authorized = await is_authorized_f(
	// 	entity_id,
	// 	group_id,
	// 	"credit",
	// 	"read"
	// );

	// if (!is_authorized) {
	// 	return redirect(`/home/resource/e/${entity_id}/g/${group_id}`);
	// }

	// let personal_credit_report_queries = [
	// 	{
	// 		param: "group_id",
	// 		predicate: "==",
	// 		value: group_id,
	// 	},
	// 	{
	// 		param: "type",
	// 		predicate: "==",
	// 		value: "personal_credit_report",
	// 	},
	// ];

	// let report_response = await get_collection({
	// 	path: ["credit_reports"],
	// 	queries: personal_credit_report_queries,
	// });

	// let report = pipe(head)(report_response);

	// if (!report) {
	// 	return redirect(
	// 		`/credit/personal/new/resource/e/${entity_id}/g/${group_id}`
	// 	);
	// }

	// let { plan_id } = await get_doc(["entity", entity_id]);

	// let scores = get_scores(report);

	// let business_info_response = await axios({
	// 	method: "get",
	// 	url: `${origin}/credit/report/business/api/company/resource/e/${entity_id}/g/${group_id}`,
	// });

	// let { data: business = {} } = business_info_response;

	// return {
	// 	report,
	// 	scores,
	// 	plan_id,
	// 	report_plan_id: report.plan_id,
	// 	business,
	// };
};

export default function CreditReport() {
	var {
		plan_id,
		report_plan_id,
		first_name,
		last_name,
		experian_personal_score: experian,
		equifax_personal_score: equifax,
		transunion_personal_score: transunion,
	} = useLoaderData() ?? {};
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
		<div className="flex flex-col flex-1 overflow-y-scroll overflow-hidden h-full">
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
											{capitalize(toLower(first_name))}'s
											personal credit report
										</h1>
										<p className="text-lg leading-6 ">
											View all three personal credit
											bureaus
										</p>
									</div>

									<div className="flex flex-col w-full">
										<CreditScoreHero
											experian={experian}
											equifax={equifax}
											transunion={transunion}
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
														{first_name
															?.charAt(0)
															.toUpperCase()}
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
