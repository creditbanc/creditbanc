import { ChevronRightIcon, ListBulletIcon } from "@heroicons/react/20/solid";
import { Link, useFetcher, useLocation, useNavigate } from "@remix-run/react";
import { get_session_entity_id } from "~/utils/auth.server";
import {
	capitalize,
	get_entity_id,
	get_group_id,
	get_search_params_obj,
	normalize_id,
	store,
	get,
	formatPhoneNumber,
	inspect,
	fetcher_payload_maker,
	mapIndexed,
	currency,
} from "~/utils/helpers";
import { __, anyPass, curry, isEmpty, isNil, length, map, not, omit, pipe, values } from "ramda";
import { all, filter } from "shades";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { Disclosure } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { get_doc } from "~/utils/firebase";
import { useOnboardingStore } from "~/stores/useOnboardingStore";
import { concatMap, delay, forkJoin, from, lastValueFrom, of as rxof, tap, zip } from "rxjs";
import { filter as rxfilter, map as rxmap } from "rxjs";
import PersonalReport from "~/api/client/PersonalReport";
import BusinessReport from "~/api/client/BusinessReport";
import { fold } from "~/utils/operators";
import Entity from "~/api/client/Entity";
import { cache } from "~/utils/helpers.server";
import { appKey } from "~/data/array";
import BusinessScores from "../credit/report/business/components/scores";
import CashflowChart from "~/components/CashflowChart";

const log_route = `home.$`;

const on_success = curry((request, response) => {
	console.log(`${log_route}.success`);
	let with_cache = cache(request);

	console.log("responsesssss");
	console.log(response);

	return with_cache({
		...response,
		cache_dependencies: [
			{
				name: "business_credit_report",
				value: response.business_report_sha,
			},
			{
				name: "personal_credit_report",
				value: response.personal_report_sha,
			},
		],
	});
});

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let { origin } = url;
	let entity_id = await get_session_entity_id(request);
	let business_entity_id = get_entity_id(url.pathname);
	let group_id = get_group_id(url.pathname);
	let onboard_state = await get_doc(["onboard", entity_id]);
	let onboard = pipe(omit(["group_id", "entity_id"]), values)(onboard_state);

	let entity = new Entity(entity_id);
	let business_entity = new Entity(business_entity_id);
	let personal_report = new PersonalReport(group_id);
	let business_report = new BusinessReport(group_id);

	let entity_response = entity.identity.plan_id.fold;
	let business_entity_response = business_entity.identity.fold;
	let personal_response = personal_report.scores.report_sha.user_token.fold;
	let business_response = business_report.experian_facts.business_info.scores.report_sha.fold;

	// let cashflow_api_response = await axios({
	// 	method: "get",
	// 	url: `${origin}/financial/api/cashflow/resource/e/${entity_id}/g/${group_id}?income=${12}`,
	// });

	// let { data: financials = {} } = cashflow_api_response;

	// console.log("responsesssss1");
	// console.log(financials);

	let payload = forkJoin({
		personal_response,
		business_response,
		entity_response,
		business_entity_response,
	}).pipe(
		rxmap(({ personal_response, business_response, entity_response, business_entity_response }) => {
			return {
				business_info: business_response.business_info,
				business_scores: business_response.scores,
				business_report_sha: business_response.report_sha,
				personal_scores: personal_response.scores,
				personal_report_sha: personal_response.report_sha,
				entity_id,
				entity: entity_response.identity,
				plan_id: entity_response.plan_id,
				business_entity_id,
				business_entity: business_entity_response.identity,
				onboard,
				business_report_is_empty: business_response.business_report_is_empty,
				user_token: personal_response.user_token,
				experian_facts: business_response.experian_facts,
				financials: {},
			};
		})
	);

	let response = await lastValueFrom(payload.pipe(fold(on_success(request), on_error)));

	// console.log("responsesssss1");
	// console.log(response);

	return response;
};

const BankAccount = ({ loader = {} }) => {
	let { bank_accounts: { accounts = [] } = {} } = loader.data || {};

	return (
		<div className="flex flex-col w-full bg-white rounded">
			<div className="flex flex-row justify-between items-center px-5 pt-5 text-base font-semibold leading-6 text-gray-900">
				<div>Bank Account</div>
				{/* <BankAccountActions /> */}
			</div>
			<div className="flex flex-col w-full border-t mt-3">
				{pipe(
					mapIndexed((account, index) => (
						<div className="flex flex-col px-5 py-3 gap-y-1" key={index}>
							<div className="flex flex-row justify-between">
								<div className="flex flex-row gap-x-2">
									<div className="flex flex-col font-semibold">{account?.name}</div>
									<div>({account?.mask})</div>
								</div>
								<div className="flex flex-col font-semibold">
									{currency.format(account?.balance || 0)}
								</div>
							</div>
							<div className="flex flex-row justify-between text-sm">
								<div className="flex flex-row gap-x-2">
									<div className="flex flex-row gap-x-2">
										<div className="flex flex-col font-semibold">name: </div>
										<div>{account?.official_name}</div>
									</div>
								</div>
								<div className="flex flex-col">current balance</div>
							</div>
						</div>
					))
				)(accounts)}
			</div>
		</div>
	);
};

export default function Home() {
	// return null;
	let { pathname } = useLocation();
	let fetcher = useFetcher();
	let loader_data = useLoaderData();

	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	let { user_token, experian_facts = {}, business_scores = {}, financials = {} } = loader_data;

	useEffect(() => {
		fetcher.load(`/financial/api/cashflow/resource/e/${entity_id}/g/${group_id}?income=${12}`);
	}, []);

	let { businessHeader = {} } = experian_facts;
	let { businessName } = businessHeader;

	return (
		<div className="w-full h-full flex flex-col overflow-hidden">
			<div className="flex flex-row h-full w-full p-5 space-x-5">
				<div className="flex flex-col h-full w-full rounded overflow-y-scroll scrollbar-none ">
					<div className="flex flex-col h-full w-full gap-y-5">
						<div className="flex flex-col w-full h-full">
							<div className="flex flex-col h-full gap-x-5 border rounded bg-white items-center w-full gap-y-[60px] overflow-auto scrollbar-none">
								<div className="flex flex-col max-w-4xl text-center mt-[40px]">
									<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
										{businessName}
									</h1>
								</div>
								<div className="flex flex-col w-full gap-y-[100px] items-center">
									<div className="flex flex-col w-[100%] px-5 lg:w-screen-lg lg:min-w-screen-lg lg:max-w-screen-lg">
										<BankAccount loader={fetcher} />
										<div className="flex flex-col w-full max-h-[600px] bg-white rounded">
											<CashflowChart loader={fetcher} />
										</div>
									</div>

									<div className="flex flex-col w-[100%] px-5 lg:w-screen-lg lg:min-w-screen-lg lg:max-w-screen-lg">
										<div className="flex flex-row justify-between items-center border-b border-gray-200 pb-5 mb-6">
											<h3 className="text-base font-semibold leading-6 text-gray-900">
												Business Scores
											</h3>
											<div className="mt-3 sm:ml-4 sm:mt-0 text-sm">
												<Link
													to={`/credit/report/business/experian/status/resource/e/${entity_id}/g/${group_id}`}
													className="inline-flex items-center rounded-full bg-blue-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
												>
													View Full Report
												</Link>
											</div>
										</div>
										<div>
											<BusinessScores
												experian_business_score={business_scores?.experian_business_score}
												dnb_business_score={business_scores?.dnb_business_score}
											/>
										</div>
									</div>
									<div className="flex flex-col w-[100%] px-5 lg:w-screen-lg lg:min-w-screen-lg lg:max-w-screen-lg">
										<div className="flex flex-row justify-between items-center border-b border-gray-200 pb-5 mb-6">
											<h3 className="text-base font-semibold leading-6 text-gray-900">
												Personal Scores
											</h3>
											<div className="mt-3 sm:ml-4 sm:mt-0 text-sm">
												<Link
													to={`/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}`}
													className="inline-flex items-center rounded-full bg-blue-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
												>
													View Full Report
												</Link>
											</div>
										</div>
										<div className="flex flex-col w-full">
											<div className="hidden lg:flex lg:flex-col lg:w-full">
												<array-credit-score
													appKey={appKey}
													userToken={user_token}
													bureau="all"
													scoreTracker="true"
												></array-credit-score>
											</div>
											<div className="lg:hidden flex flex-col w-full">
												<iframe
													src={`http://localhost:3000/1b?bureau=tui&user_token=${user_token}`}
													className="flex flex-col w-full h-[530px]"
												></iframe>
												<iframe
													src={`http://localhost:3000/1b?bureau=efx&user_token=${user_token}`}
													className="flex flex-col w-full h-[530px]"
												></iframe>
												<iframe
													src={`http://localhost:3000/1b?bureau=exp&user_token=${user_token}`}
													className="flex flex-col w-full h-[530px]"
												></iframe>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
