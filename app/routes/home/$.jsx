import { Link, useLocation } from "@remix-run/react";
import { get_session_entity_id } from "~/utils/auth.server";
import { get_entity_id, get_group_id, store, mapIndexed, currency, capitalize } from "~/utils/helpers";
import { __, curry, pipe } from "ramda";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { useEffect } from "react";
import { forkJoin, from, lastValueFrom } from "rxjs";
import { map as rxmap } from "rxjs";
import PersonalReport from "~/api/client/PersonalReport";
import BusinessReport from "~/api/client/BusinessReport";
import { fold } from "~/utils/operators";
import Entity from "~/api/client/Entity";
import { cache } from "~/utils/helpers.server";
import { appKey } from "~/data/array";
import BusinessScores from "../credit/report/business/components/scores";
import CashflowChart from "~/components/CashflowChart";
import { get_doc } from "~/utils/firebase";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import ApplicationDocumentsUpload from "~/components/ApplicationDocumentsUpload";

const log_route = `home.$`;

const on_success = curry((request, response) => {
	console.log(`${log_route}.success`);
	let with_cache = cache(request);

	// console.log("responsesssss");
	// console.log(response);

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
	let entity_id = await get_session_entity_id(request);
	let business_entity_id = get_entity_id(url.pathname);
	let group_id = get_group_id(url.pathname);

	let entity = new Entity(entity_id);
	let business_entity = new Entity(business_entity_id);
	let personal_report = new PersonalReport(group_id);
	let business_report = new BusinessReport(group_id);

	let entity_response = entity.identity.plan_id.fold;
	let business_entity_response = business_entity.identity.fold;
	let personal_response = personal_report.scores.report_sha.user_token.fold;
	let business_response = business_report.experian_facts.business_info.scores.report_sha.fold;

	let application_entity_id = "dd947710-075d-4e68-8cb2-3726851a6ed1";

	let application = from(get_doc(["application", application_entity_id]));

	let payload = forkJoin({
		personal_response,
		business_response,
		entity_response,
		business_entity_response,
		application,
	}).pipe(
		rxmap(({ personal_response, business_response, entity_response, business_entity_response, application }) => {
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
				application,
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

const ApplicationStatus = () => {
	let { pathname } = useLocation();
	let { application } = use_loader_store();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	let business_address = `${capitalize(application?.business_address?.city)}, ${
		application?.business_address?.state
	} ${application?.business_address?.zip}`;

	return (
		<div className="flex flex-col w-full py-8">
			<h2 className="text-base font-semibold leading-6 text-gray-900">Loan application</h2>
			<div className="mt-6 flex flex-col w-full">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-1/2 sm:pr-4">
						<dt className="inline text-gray-500">Submitted on</dt>
						<dd className="inline text-gray-700">
							<time dateTime="2023-23-01">January 23, 2023</time>
						</dd>
					</div>
					<div className="flex flex-col w-1/2 mt-2 sm:mt-0 sm:pl-4">
						<dt className="inline text-gray-500">Status</dt>
						<dd className="inline text-gray-700">
							<time dateTime="2023-31-01">Under review</time>
						</dd>
					</div>
				</div>
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-1/2 mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
						<dd className="mt-2 text-gray-500">
							<span className="font-medium text-gray-900">{application?.legal_name} address</span>
							<br />
							{application?.business_address?.street}
							<br />
							{business_address}
						</dd>
					</div>
					<div className="flex flex-col w-1/2 mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6">
						<div className="mt-3 flex flex-row w-full border rounded py-2 px-3">
							<div className="flex w-0 flex-1 items-center">
								<PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
								<div className="ml-4 flex min-w-0 flex-1 gap-2">
									<span className="truncate font-medium">{application?.legal_name} application</span>
								</div>
							</div>
							<div className="ml-4 flex-shrink-0">
								<Link
									to={`/apply/preview/resource/e/${entity_id}/g/${group_id}`}
									className="font-medium text-blue-600 hover:text-blue-500"
								>
									View
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

let use_loader_store = store();

export default function Home() {
	let { pathname } = useLocation();

	let server_data = useLoaderData();

	let loader = use_loader_store((state) => state);

	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	let { user_token, experian_facts = {}, business_scores = {} } = loader;

	useEffect(() => loader.set_props(server_data), []);

	useEffect(() => {
		let { origin } = new URL(window.location);
		let fetcher_url = `${origin}/financial/api/cashflow/resource/e/${entity_id}/g/${group_id}?income=${12}`;
		from(axios.get(fetcher_url)).pipe(rxmap(loader.set_props)).subscribe();
	}, []);

	let { businessHeader = {} } = experian_facts;
	let { businessName } = businessHeader;

	return (
		<div className="w-full h-full flex flex-col overflow-hidden">
			<div className="flex flex-row h-full w-full p-5 space-x-5">
				<div className="flex flex-col h-full w-full rounded overflow-y-scroll scrollbar-none">
					<div className="flex flex-col h-full w-full gap-y-5">
						<div className="flex flex-col w-full h-full">
							<div className="flex flex-col h-full gap-x-5 border rounded bg-white items-center w-full gap-y-[60px] overflow-auto scrollbar-none">
								<div className="flex flex-col max-w-4xl text-center mt-[40px]">
									<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
										{businessName}
									</h1>
								</div>
								<div className="flex flex-col w-full items-center px-4">
									<div className="flex flex-col w-[100%] px-2 lg:w-screen-lg lg:min-w-screen-lg lg:max-w-screen-lg mb-10">
										<ApplicationStatus />
									</div>
									<div className="flex flex-col w-[100%] lg:w-screen-lg lg:min-w-screen-lg lg:max-w-screen-lg mb-10 py-3">
										<ApplicationDocumentsUpload
											type={"taxreturns"}
											title={`Upload tax returns`}
											subtitle={`Upload and attach your business tax returns to your loan application`}
										/>
									</div>
									<div className="flex flex-col w-[100%] lg:w-screen-lg lg:min-w-screen-lg lg:max-w-screen-lg mb-10 py-3">
										<ApplicationDocumentsUpload
											type={"bankstatements"}
											title={`Upload past 6 months bank statements`}
											subtitle={`Upload and attach your business bank statemnts to your loan application`}
										/>
									</div>
									<div className="flex flex-col w-full gap-y-[60px] items-center">
										<div className="flex flex-col w-[100%] lg:w-screen-lg lg:min-w-screen-lg lg:max-w-screen-lg">
											<BankAccount loader={loader} />
											<div className="flex flex-col w-full max-h-[600px] bg-white rounded">
												<CashflowChart loader={loader} />
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
		</div>
	);
}
