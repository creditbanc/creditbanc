import { Link, useLocation } from "@remix-run/react";
import { get_session_entity_id } from "~/utils/auth.server";
import { get_entity_id, get_group_id, store, mapIndexed, currency, capitalize, classNames } from "~/utils/helpers";
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
import { AtSymbolIcon, PaperClipIcon, PhoneIcon } from "@heroicons/react/24/outline";
import ApplicationDocumentsUpload from "~/components/ApplicationDocumentsUpload";
import { Fragment, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import {
	FaceFrownIcon,
	FaceSmileIcon,
	FireIcon,
	HandThumbUpIcon,
	HeartIcon,
	XMarkIcon,
} from "@heroicons/react/20/solid";
import { Listbox, Transition } from "@headlessui/react";
import { CalendarDaysIcon, CreditCardIcon, UserCircleIcon } from "@heroicons/react/20/solid";

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
			<div className="flex flex-row justify-between items-center px-5 text-base font-semibold leading-6 text-gray-900">
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
		<div className="flex flex-col w-full">
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

const activity = [
	{ id: 1, type: "created", person: { name: "Chelsea Hagon" }, date: "7d ago", dateTime: "2023-01-23T10:32" },
	{ id: 2, type: "edited", person: { name: "Chelsea Hagon" }, date: "6d ago", dateTime: "2023-01-23T11:03" },
	{ id: 3, type: "sent", person: { name: "Chelsea Hagon" }, date: "6d ago", dateTime: "2023-01-23T11:24" },
	{
		id: 4,
		type: "commented",
		person: {
			name: "Chelsea Hagon",
			imageUrl:
				"https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
		comment: "Called client, they reassured me the invoice would be paid by the 25th.",
		date: "3d ago",
		dateTime: "2023-01-23T15:56",
	},
	{ id: 5, type: "viewed", person: { name: "Alex Curren" }, date: "2d ago", dateTime: "2023-01-24T09:12" },
	{ id: 6, type: "paid", person: { name: "Alex Curren" }, date: "1d ago", dateTime: "2023-01-24T09:20" },
];

const moods = [
	{ name: "Excited", value: "excited", icon: FireIcon, iconColor: "text-white", bgColor: "bg-red-500" },
	{ name: "Loved", value: "loved", icon: HeartIcon, iconColor: "text-white", bgColor: "bg-pink-400" },
	{ name: "Happy", value: "happy", icon: FaceSmileIcon, iconColor: "text-white", bgColor: "bg-green-400" },
	{ name: "Sad", value: "sad", icon: FaceFrownIcon, iconColor: "text-white", bgColor: "bg-yellow-400" },
	{ name: "Thumbsy", value: "thumbsy", icon: HandThumbUpIcon, iconColor: "text-white", bgColor: "bg-blue-500" },
	{ name: "I feel nothing", value: null, icon: XMarkIcon, iconColor: "text-gray-400", bgColor: "bg-transparent" },
];

const AccountFeed = () => {
	return (
		<ul role="list" className="space-y-6">
			{activity.map((activityItem, activityItemIdx) => (
				<li key={activityItem.id} className="relative flex gap-x-4">
					<div
						className={classNames(
							activityItemIdx === activity.length - 1 ? "h-6" : "-bottom-6",
							"absolute left-0 top-0 flex w-6 justify-center"
						)}
					>
						<div className="w-px bg-gray-200" />
					</div>
					{activityItem.type === "commented" ? (
						<>
							<img
								src={activityItem.person.imageUrl}
								alt=""
								className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
							/>
							<div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
								<div className="flex justify-between gap-x-4">
									<div className="py-0.5 text-xs leading-5 text-gray-500">
										<span className="font-medium text-gray-900">{activityItem.person.name}</span>{" "}
										commented
									</div>
									<time
										dateTime={activityItem.dateTime}
										className="flex-none py-0.5 text-xs leading-5 text-gray-500"
									>
										{activityItem.date}
									</time>
								</div>
								<p className="text-sm leading-6 text-gray-500">{activityItem.comment}</p>
							</div>
						</>
					) : (
						<>
							<div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
								{activityItem.type === "paid" ? (
									<CheckCircleIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
								) : (
									<div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
								)}
							</div>
							<p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
								<span className="font-medium text-gray-900">{activityItem.person.name}</span>{" "}
								{activityItem.type} the invoice.
							</p>
							<time
								dateTime={activityItem.dateTime}
								className="flex-none py-0.5 text-xs leading-5 text-gray-500"
							>
								{activityItem.date}
							</time>
						</>
					)}
				</li>
			))}
		</ul>
	);
};

const Advisor = () => {
	return (
		<div className="lg:col-start-3 lg:row-end-1">
			<div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
				<dl className="flex flex-wrap">
					{/* <div className="flex flex-col w-full items-center justify-center h-full py-4">
						<img
							className="inline-block h-14 w-14 rounded-full"
							src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
							alt=""
						/>
					</div> */}

					<div className="flex flex-row w-full py-4 items-center px-6">
						<div>
							<img
								className="inline-block h-9 w-9 rounded-full"
								src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
								alt=""
							/>
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Tom Cook</p>
							<p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">Loan Officer</p>
						</div>
					</div>
					{/* <div className="flex-auto pl-6 pt-6">
						<dt className="text-sm font-semibold leading-6 text-gray-900">Amount</dt>
						<dd className="mt-1 text-base font-semibold leading-6 text-gray-900">$10,560.00</dd>
					</div>
					<div className="flex-none self-end px-6 pt-4">
						<dt className="sr-only">Status</dt>
						<dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
							Paid
						</dd>
					</div> */}
					<div className="flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 py-2">
						<div className="flex flex-row w-full gap-x-2">
							<div className="flex flex-row gap-x-1 text-sm items-center">
								<dt className="flex-none mr-3">
									<UserCircleIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
								</dt>
								<div>Name:</div>
							</div>

							<dd className="text-sm leading-6 text-gray-900">Alex Curren</dd>
						</div>
					</div>

					<div className="flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 py-2">
						<div className="flex flex-row w-full gap-x-2">
							<div className="flex flex-row gap-x-1 text-sm items-center">
								<dt className="flex-none mr-3">
									<AtSymbolIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
								</dt>
								<div>Email:</div>
							</div>

							<dd className="text-sm leading-6 text-gray-900">alex@creditbanc.io</dd>
						</div>
					</div>

					<div className="flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 py-2">
						<div className="flex flex-row w-full gap-x-2">
							<div className="flex flex-row gap-x-1 text-sm items-center">
								<dt className="flex-none mr-3">
									<PhoneIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
								</dt>
								<div>Phone:</div>
							</div>

							<dd className="text-sm leading-6 text-gray-900">352-999-9999</dd>
						</div>
					</div>

					<div className="flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 py-2">
						<div className="flex flex-row w-full gap-x-2 cursor-pointer">
							<div className="flex flex-row gap-x-1 text-sm items-center">
								<dt className="flex-none mr-3">
									<CalendarDaysIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
								</dt>
								<div>Schedule an appointment</div>
							</div>
						</div>
					</div>
				</dl>
				{/* <div className="border-t border-gray-900/5 px-6 py-6">
					<a href="#" className="text-sm font-semibold leading-6 text-gray-900">
						Download receipt <span aria-hidden="true">&rarr;</span>
					</a>
				</div> */}
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
		<div className="w-full h-full flex flex-col overflow-hidden bg-white">
			<div className="flex flex-col h-full w-full bg-white items-center gap-y-[60px] overflow-y-scroll scrollbar-none">
				<div className="flex flex-col max-w-4xl text-center mt-[40px]">
					<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">{businessName}</h1>
				</div>
				<div className="flex flex-row w-full h-full max-w-screen-2xl gap-x-5">
					<div className="flex flex-col flex-1 px-4 items-start gap-y-[60px]">
						<div className="flex flex-col w-[100%] lg:w-screen-lg lg:min-w-screen-lg lg:max-w-screen-lg">
							<div className="flex flex-row justify-between items-center border-b border-gray-200 pb-5 mb-6">
								<h3 className="text-base font-semibold leading-6 text-gray-900">Business Scores</h3>
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

						<div className="flex flex-col w-[100%] lg:w-screen-lg lg:min-w-screen-lg lg:max-w-screen-lg">
							<div className="flex flex-row justify-between items-center border-b border-gray-200 pb-5 mb-6">
								<h3 className="text-base font-semibold leading-6 text-gray-900">Personal Scores</h3>
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

						<div className="flex flex-col w-[100%] lg:w-screen-lg lg:min-w-screen-lg lg:max-w-screen-lg">
							<ApplicationStatus />
						</div>

						<div className="flex flex-col w-[100%] lg:w-screen-lg lg:min-w-screen-lg lg:max-w-screen-lg">
							<ApplicationDocumentsUpload
								type={"taxreturns"}
								title={`Upload tax returns`}
								subtitle={`Upload and attach your business tax returns to your loan application`}
							/>
						</div>

						<div className="flex flex-col w-[100%] lg:w-screen-lg lg:min-w-screen-lg lg:max-w-screen-lg">
							<ApplicationDocumentsUpload
								type={"bankstatements"}
								title={`Upload past 6 months bank statements`}
								subtitle={`Upload and attach your business bank statemnts to your loan application`}
							/>
						</div>

						<div className="flex flex-col w-[100%] lg:w-screen-lg lg:min-w-screen-lg lg:max-w-screen-lg">
							<BankAccount loader={loader} />
							<div className="flex flex-col w-full max-h-[600px] bg-white rounded">
								<CashflowChart loader={loader} />
							</div>
						</div>
					</div>
					<div className="flex flex-col w-[400px] gap-y-[30px]">
						<div className="flex flex-col">
							<Advisor />
						</div>
						<div className="flex flex-col border rounded p-5">
							<AccountFeed />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
