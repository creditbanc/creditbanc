import { ChevronRightIcon, ListBulletIcon } from "@heroicons/react/20/solid";
import { Form, Link, useActionData, useFetcher, useLocation, useNavigate, useNavigation } from "@remix-run/react";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import {
	capitalize,
	consolelog,
	consoletap,
	delete_cookie,
	get_entity_id,
	get_group_id,
	get_search_params_obj,
	normalize,
	normalize_id,
	search_params,
	store,
	use_search_params,
	get,
	formatPhoneNumber,
	inspect,
} from "~/utils/helpers";
import { cache } from "~/utils/helpers.server";
import {
	__,
	allPass,
	anyPass,
	curry,
	defaultTo,
	equals,
	flip,
	head,
	identity,
	is,
	isEmpty,
	isNil,
	join,
	keys,
	length,
	map,
	mergeDeepRight,
	not,
	omit,
	pipe,
	set,
	sort,
	times,
	values,
} from "ramda";
import { all, cons, filter } from "shades";
import { useLoaderData } from "@remix-run/react";
import { plans } from "~/data/plans";
import { json, redirect } from "@remix-run/node";
import UpgradeBanner from "~/components/UpgradeMembership";
var cookie = require("cookie");
import axios from "axios";
import { useCashflowStore } from "~/stores/useCashflowStore";
import { useEffect, useState } from "react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { Disclosure } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { get_doc } from "~/utils/firebase";
import { useOnboardingStore, default_onboard_state } from "~/stores/useOnboardingStore";
import { encode } from "js-base64";
import { BusinessEntity, useReportStore } from "../credit/business/new/$";
import Spinner from "~/components/LoadingSpinner";
import murmurhash from "murmurhash";
import { concat, concatMap, delay, from, lastValueFrom, merge, of as rxof, tap, zip } from "rxjs";
import { filter as rxfilter, map as rxmap } from "rxjs";
import { use_cache } from "~/components/CacheLink";
import { difference } from "ramda";
import PreFills from "../credit/business/PreFills";
import { LendflowExternal } from "~/utils/lendflow.server";
import PersonalReport from "~/api/client/PersonalReport";
import BusinessReport from "~/api/client/BusinessReport";

let use_view_store = store();

const useNewBusinessReportFormStore = useReportStore;

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	let business_entity_id = get_entity_id(url.pathname);
	let group_id = get_group_id(url.pathname);
	let entity = await get_doc(["entity", entity_id]);
	let business_entity = await get_doc(["entity", business_entity_id]);
	let onboard_state = await get_doc(["onboard", entity_id]);

	let personal_report = new PersonalReport(group_id);
	let business_report = new BusinessReport(group_id);
	let personal_response = personal_report.scores.fold;
	let business_response = business_report.business_info.scores.fold;

	onboard_state = pipe(omit(["group_id", "entity_id"]), values)(onboard_state);

	let { plan_id } = await get_doc(["entity", entity_id]);

	let business_info_fetch = axios({
		method: "get",
		url: `${url.origin}/credit/report/api/businessinfo/resource/e/${business_entity_id}/g/${group_id}`,
		withCredentials: true,
		headers: {
			cookie: `creditbanc_session=${encode(
				JSON.stringify({
					entity_id: business_entity_id,
				})
			)}`,
		},
	});

	let personal_scores_fetch = axios({
		method: "get",
		url: `${url.origin}/credit/report/api/scores/personal/resource/e/${business_entity_id}/g/${group_id}`,
		withCredentials: true,
		headers: {
			cookie: `creditbanc_session=${encode(
				JSON.stringify({
					entity_id: business_entity_id,
				})
			)}`,
		},
	});

	let business_scores_fetch = axios({
		method: "get",
		url: `${url.origin}/credit/report/api/scores/business/resource/e/${business_entity_id}/g/${group_id}`,
		withCredentials: true,
		headers: {
			cookie: `creditbanc_session=${encode(
				JSON.stringify({
					entity_id: business_entity_id,
				})
			)}`,
		},
	});

	let fetches = zip([business_info_fetch, personal_scores_fetch, business_scores_fetch]);

	let [business_info_response, personal_scores_response, business_scores_response] = await lastValueFrom(fetches);

	let { data: business_info = {} } = business_info_response;

	let { data: personal_scores = {} } = personal_scores_response;
	let { data: business_scores = {} } = business_scores_response;

	let cache_dependencies = [
		{
			name: "business_credit_report",
			value: 1,
		},
		{
			name: "personal_credit_report",
			value: 1,
		},
	];

	let payload = {
		business_info,
		personal_scores,
		business_scores,
		entity_id,
		entity,
		business_entity_id,
		business_entity,
		plan_id,
		onboard: onboard_state,
	};

	let with_cache = cache(request);

	return with_cache({
		...payload,
		cache_dependencies,
	});
};

const BusinessCredit = () => {
	let { business_scores = {}, plan_id = "essential" } = use_view_store((state) => state);
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let { experian_business_score, dnb_business_score } = business_scores;

	// console.log("business_scores");
	// console.log(business_scores);

	return (
		<div className="flex flex-col border rounded px-4 bg-white min-h-[260px]">
			<div className="border-b border-gray-200">
				<h3 className="text-base font-semibold leading-6 text-gray-900 py-3">Business Credit</h3>
			</div>
			<div className="flex flex-col w-full py-3 border-b border-gray-200">
				<Link
					className="flex flex-row w-full"
					to={`/credit/report/business/experian/status/resource/e/${entity_id}/g/${group_id}`}
				>
					<div className="flex flex-col w-2/3">
						<div className="font-semibold">Experian ®</div>
						<div className="text-gray-400 text-sm">Intelliscore</div>
					</div>

					<div className="flex flex-col w-1/3 text-2xl font-bold justify-center">
						<div className="flex flex-row w-full justify-end items-center cursor-pointer">
							<div className="flex flex-col">{experian_business_score}</div>
							<div className="flex flex-col w-[30px] ">
								<ChevronRightIcon />
							</div>
						</div>
					</div>
				</Link>
			</div>

			<div className="flex flex-col w-full py-3 ">
				<Link
					className="flex flex-row w-full"
					to={`/credit/report/business/experian/status/resource/e/${entity_id}/g/${group_id}`}
				>
					<div className="flex flex-col w-2/3">
						<div className="font-semibold">Dun & Bradstreet ®</div>
						<div className="text-gray-400 text-sm">PAYDEX Score</div>
					</div>

					<div className="flex flex-col w-1/3 text-2xl font-bold justify-center">
						<div className="flex flex-row w-full justify-end items-center cursor-pointer">
							<div className="flex flex-col">{dnb_business_score}</div>
							<div className="flex flex-col w-[30px] ">
								<ChevronRightIcon />
							</div>
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
};

const PersonalCredit = () => {
	let { personal_scores = {}, plan_id = "essential" } = use_view_store((state) => state);
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let { experian_personal_score, equifax_personal_score, transunion_personal_score } = personal_scores;

	return (
		<div className="flex flex-col rounded px-4 border bg-white min-h-[260px]">
			<div className="border-b border-gray-200">
				<h3 className="text-base font-semibold leading-6 text-gray-900 py-3">Personal Credit</h3>
			</div>

			<div className="flex flex-col w-full py-3 border-b border-gray-200">
				<Link
					className="flex flex-row w-full"
					to={`/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}`}
				>
					<div className="flex flex-col w-2/3">
						<div className="font-semibold">Experian Personal ®</div>
						<div className="text-gray-400 text-sm">VantageScore® 3.0</div>
					</div>

					<div className="flex flex-col w-1/3 text-2xl font-bold justify-center">
						<div className="flex flex-row w-full justify-end items-center cursor-pointer">
							<div className="flex flex-col">{experian_personal_score}</div>
							<div className="flex flex-col w-[30px] ">
								<ChevronRightIcon />
							</div>
						</div>
					</div>
				</Link>
			</div>

			<div className="flex flex-col w-full py-3 border-b border-gray-200">
				<Link
					className="flex flex-row w-full"
					to={`/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}`}
				>
					<div className="flex flex-col w-2/3">
						<div className="font-semibold">TransUnion ®</div>
						<div className="text-gray-400 text-sm">VantageScore® 3.0</div>
					</div>

					<div className="flex flex-col w-1/3 text-2xl font-bold justify-center">
						<div className="flex flex-row w-full justify-end items-center cursor-pointer">
							<div className="flex flex-col">{transunion_personal_score}</div>
							<div className="flex flex-col w-[30px] ">
								<ChevronRightIcon />
							</div>
						</div>
					</div>
				</Link>
			</div>

			<div className="flex flex-col w-full py-3">
				<Link
					className="flex flex-row w-full"
					to={`/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}`}
				>
					<div className="flex flex-col w-2/3">
						<div className="font-semibold">Equifax ®</div>
						<div className="text-gray-400 text-sm">VantageScore® 3.0</div>
					</div>

					<div className="flex flex-col w-1/3 text-2xl font-bold justify-center">
						<div className="flex flex-row w-full justify-end items-center cursor-pointer">
							<div className="flex flex-col">{equifax_personal_score}</div>
							<div className="flex flex-col w-[30px] ">
								<ChevronRightIcon />
							</div>
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
};

const HeadingTwo = () => {
	let { business_info = {}, business_entity: entity } = use_view_store((state) => state);

	let EntityPersonalDetails = () => {
		return (
			<div>
				<div className="font-semibold flex flex-row space-x-1">
					{capitalize(entity?.first_name)}
					{capitalize(entity?.last_name)}
				</div>
				<div className="text-sm">{entity?.email}</div>
			</div>
		);
	};

	let BusinessDetails = () => {
		return (
			<div>
				<div className="font-semibold">{business_info?.name}</div>
			</div>
		);
	};

	let EntityAccountDetails = () => {
		return business_info?.name ? <BusinessDetails /> : <EntityPersonalDetails />;
	};

	return (
		<div className="flex flex-col max-w-7xl w-full px-3 py-2">
			<div className="flex  flex-row items-center justify-between gap-x-8 lg:mx-0 w-full">
				<div className="flex items-center gap-x-6">
					<img
						src="https://tailwindui.com/img/logos/48x48/tuple.svg"
						alt=""
						className="h-16 w-16 flex-none rounded-full ring-1 ring-gray-900/10"
					/>
					<h1>
						<div className="mt-1 text-base leading-6 text-gray-900">
							<EntityAccountDetails />
						</div>
					</h1>
				</div>
			</div>
		</div>
	);
};

const posts = [
	{
		id: 1,
		title: "Boost your conversion rate",
		href: "#",
		description:
			"Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
		imageUrl:
			"https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80",
		date: "Mar 16, 2020",
		datetime: "2020-03-16",
		category: {
			title: "Marketing",
			href: "#",
		},
		author: {
			name: "Michael Foster",
			role: "Co-Founder / CTO",
			href: "#",
			imageUrl:
				"https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
	},
	{
		id: 1,
		title: "Boost your conversion rate",
		href: "#",
		description:
			"Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
		imageUrl:
			"https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80",
		date: "Mar 16, 2020",
		datetime: "2020-03-16",
		category: {
			title: "Marketing",
			href: "#",
		},
		author: {
			name: "Michael Foster",
			role: "Co-Founder / CTO",
			href: "#",
			imageUrl:
				"https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
	},
	{
		id: 1,
		title: "Boost your conversion rate",
		href: "#",
		description:
			"Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
		imageUrl:
			"https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80",
		date: "Mar 16, 2020",
		datetime: "2020-03-16",
		category: {
			title: "Marketing",
			href: "#",
		},
		author: {
			name: "Michael Foster",
			role: "Co-Founder / CTO",
			href: "#",
			imageUrl:
				"https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
	},
];

const Courses = () => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	return (
		<div className="mx-auto  grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
			{posts.map((post, index) => (
				<article key={index} className="flex flex-col items-start justify-between">
					<div className="relative w-full">
						<img
							src={post.imageUrl}
							className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
						/>
						<div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
					</div>

					<div className="flex flex-col w-full my-3">
						<Link
							to={`/university/course/curriculum/1/resource/e/${entity_id}/g/${group_id}`}
							className="flex flex-row w-full py-2 border border-gray-600 text-gray-600 rounded-lg justify-center items-center cursor-pointer gap-x-3"
						>
							<div>
								<ListBulletIcon className="h-5 w-5 text-white" />
							</div>
							<div className="flex flex-col">Course Details</div>
						</Link>
					</div>
					<div className="max-w-xl">
						<div className="mt-2 flex items-center gap-x-4 text-xs">
							<time dateTime={post.datetime} className="text-gray-500">
								{post.date}
							</time>
							<a
								href={post.category.href}
								className="relative z-5 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
							>
								{post.category.title}
							</a>
						</div>
						<div className="group relative">
							<h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
								<a href={post.href}>
									<span className="absolute inset-0" />
									{post.title}
								</a>
							</h3>
							<p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post.description}</p>
						</div>

						<div className="my-2 flex flex-col w-full">
							<div className="flex flex-row w-full justify-between my-2 text-sm text-gray-400">
								<div>45%</div>
								<div>4/20 lessons</div>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
								<div className="bg-blue-600 h-2.5 rounded-full w-[45%]"></div>
							</div>
						</div>

						<div className="relative mt-6 flex items-center gap-x-4">
							<img src={post.author.imageUrl} className="h-10 w-10 rounded-full bg-gray-100" />
							<div className="text-sm leading-6">
								<p className="font-semibold text-gray-900">
									<a href={post.author.href}>
										<span className="absolute inset-0" />
										{post.author.name}
									</a>
								</p>
								<p className="text-gray-600">{post.author.role}</p>
							</div>
						</div>
					</div>
				</article>
			))}
		</div>
	);
};

const Notifications = () => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let onboard = useOnboardingStore((state) => state.onboard);

	return (
		<div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2 space-y-2">
			<Disclosure defaultOpen={true}>
				{({ open }) => (
					<>
						<Disclosure.Button className="flex w-full justify-between rounded-lg  px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring  focus-visible:ring-opacity-75">
							<span>CREDIT</span>
							<ChevronUpIcon className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-gray-500`} />
						</Disclosure.Button>

						<Disclosure.Panel className="px-4  pb-2 text-gray-500 space-y-3 text-sm">
							<div className="flex flex-col gap-y-3">
								{pipe(
									filter({
										category: "credit",
										// completed: false,
									}),
									map((step) => (
										<div className="flex flex-row w-full border p-2 rounded" key={step.id}>
											{!step.completed && (
												<Link
													className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer"
													to={step.completed_href({
														entity_id,
														group_id,
													})}
												>
													<div>
														<XCircleIcon className="h-5 w-5 text-red-500" />
													</div>
													<div>{step.text}</div>
												</Link>
											)}

											{step.completed && (
												<Link
													className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer"
													to={step.completed_href({
														entity_id,
														group_id,
													})}
												>
													<div>
														<CheckCircleIcon className="h-5 w-5 text-green-500" />
													</div>
													<div>{step.completed_text}</div>
												</Link>
											)}

											<div></div>
										</div>
									))
								)(onboard)}
							</div>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
			{/* <Disclosure defaultOpen={true}>
				{({ open }) => (
					<>
						<Disclosure.Button className="flex w-full justify-between rounded-lg  px-4 py-2 text-left text-sm font-medium   focus:outline-none focus-visible:ring  focus-visible:ring-opacity-75">
							<span>CASHFLOW</span>
							<ChevronUpIcon
								className={`${
									open ? "rotate-180 transform" : ""
								} h-5 w-5 text-gray-500`}
							/>
						</Disclosure.Button>
						<Disclosure.Panel className="px-4  pb-2 text-gray-500 space-y-3 text-sm">
							<div className="flex flex-col gap-y-3">
								{pipe(
									filter({
										category: "financial",
										// completed: false,
									}),
									map((step) => (
										<div
											className="flex flex-row w-full border p-2 rounded"
											key={step.id}
										>
											<Link
												className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer"
												to={step.href({
													entity_id,
													group_id,
												})}
											>
												<div>
													{step.completed && (
														<CheckCircleIcon className="h-5 w-5 text-green-500" />
													)}

													{!step.completed && (
														<XCircleIcon className="h-5 w-5 text-red-500" />
													)}
												</div>
												<div>{step.text}</div>
											</Link>
											<div></div>
										</div>
									))
								)(onboard)}
							</div>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
			<Disclosure defaultOpen={true}>
				{({ open }) => (
					<>
						<Disclosure.Button className="flex w-full justify-between rounded-lg  px-4 py-2 text-left text-sm font-medium   focus:outline-none focus-visible:ring  focus-visible:ring-opacity-75">
							<span>VAULT</span>
							<ChevronUpIcon
								className={`${
									open ? "rotate-180 transform" : ""
								} h-5 w-5 text-gray-500`}
							/>
						</Disclosure.Button>
						<Disclosure.Panel className="px-4  pb-2 text-gray-500 space-y-3 text-sm">
							<div className="flex flex-col gap-y-3">
								{pipe(
									filter({
										category: "vault",
										// completed: false,
									}),
									map((step) => (
										<div
											className="flex flex-row w-full border p-2 rounded"
											key={step.id}
										>
											<Link
												className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer"
												to={step.href({
													entity_id,
													group_id,
												})}
											>
												<div>
													{step.completed && (
														<CheckCircleIcon className="h-5 w-5 text-green-500" />
													)}

													{!step.completed && (
														<XCircleIcon className="h-5 w-5 text-red-500" />
													)}
												</div>
												<div>{step.text}</div>
											</Link>
											<div></div>
										</div>
									))
								)(onboard)}
							</div>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure> */}
			<Disclosure defaultOpen={true}>
				{({ open }) => (
					<>
						<Disclosure.Button className="flex w-full justify-between rounded-lg  px-4 py-2 text-left text-sm font-medium   focus:outline-none focus-visible:ring  focus-visible:ring-opacity-75">
							<span>SOCIAL</span>
							<ChevronUpIcon className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-gray-500`} />
						</Disclosure.Button>
						<Disclosure.Panel className="px-4  pb-2 text-gray-500 space-y-3 text-sm">
							<div className="flex flex-col gap-y-3">
								{pipe(
									filter({
										category: "social",
										// completed: false,
									}),
									map((step) => (
										<div className="flex flex-row w-full border p-2 rounded" key={step.id}>
											<Link
												className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer"
												to={step.href({
													entity_id,
													group_id,
												})}
											>
												<div>
													{step.completed && (
														<CheckCircleIcon className="h-5 w-5 text-green-500" />
													)}

													{!step.completed && (
														<XCircleIcon className="h-5 w-5 text-red-500" />
													)}
												</div>
												<div>{step.text}</div>
											</Link>
											<div></div>
										</div>
									))
								)(onboard)}
							</div>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
		</div>
	);
};

const NewBusinessReportForm = () => {
	let location = useLocation();
	let { new_application_is_submiting = false } = use_view_store((state) => state);
	let set_props = use_view_store((state) => state.set_props);
	let set_state = use_view_store((state) => state.set_state);
	let search_obj = get_search_params_obj(location.search);
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let form = useNewBusinessReportFormStore((state) => state.form);
	let setForm = useNewBusinessReportFormStore((state) => state.setForm);

	const fetcher = useFetcher();
	const error = fetcher.data;

	console.log("fetcher");
	console.log(fetcher.data);

	const get_application = async (application_id) => {
		// let application_id = "79ffec5e-7095-414f-b301-0052278661b4";

		return axios({
			method: "get",
			url: `/credit/business/match/resource/e/${entity_id}/g/${group_id}?application_id=${application_id}`,
		});
	};

	useEffect(() => {
		// let application_id = "ef83ecd6-96f5-4156-9082-51e18d364b31";
		let application_id = fetcher?.data?.application_id;
		if (application_id) {
			let application = rxof(application_id).pipe(
				tap((application_id) => set_props({ application_id })),
				delay(5000),
				concatMap(get_application),
				rxmap(pipe(get("data"))),
				rxfilter((value) => isEmpty(value?.business_match) == false),
				tap(() => console.log("get_application.tap")),
				tap(console.log),
				rxmap(({ application_id, business_match }) => {
					console.log("business_match");
					console.log(business_match);
					console.log(application_id);
					set_props({ application_id, business_match, new_application_is_submiting: false });
				})
			);

			application.subscribe();
		}
	}, [fetcher?.data?.application_id]);

	// useEffect(() => {
	// 	if (fetcher?.state == "submitting") {
	// 		set_props({ new_application_is_submiting: true });
	// 	}
	// }, [fetcher?.state]);

	const onSubmit = () => {
		let { business_start_date, ...rest } = form;
		let business_start_date_string = `${business_start_date.year}-${business_start_date.month}-${business_start_date.day}`;

		let payload = {
			business_start_date: business_start_date_string,
			...rest,
		};
	};

	const onSubmitNewBusinessReport = () => {
		console.log("onSubmitNewBusinessReport");

		let { business_start_date, ...rest } = form;
		let business_start_date_string = `${business_start_date.year}-${business_start_date.month}-${business_start_date.day}`;

		let payload = {
			business_start_date: business_start_date_string,
			...rest,
		};

		set_state(["new_application_is_submiting"], true);

		fetcher.submit(
			{ payload: JSON.stringify(payload) },
			{
				method: "post",
				action: `/credit/business/match/resource/e/${entity_id}/g/${group_id}`,
				// action: `/credit/business/new/resource/e/${entity_id}/g/${group_id}`,
			}
		);
	};

	if (new_application_is_submiting == true) {
		return <div></div>;
	}

	return (
		<div className="flex flex-col w-full border rounded bg-white p-5">
			{search_obj.cookie == "monster" && <PreFills />}

			<div className="flex flex-col w-full">
				<div className="flex flex-col w-full my-2">
					<div className="mb-2 text-sm">Personal information</div>
					<div className="flex flex-col gap-y-2">
						<div className="flex flex-row gap-x-2">
							<div className="flex flex-col w-[50%]">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name="given-name"
									placeholder="First name"
									autoComplete="given-name"
									value={form.basic_info.first_name}
									onChange={(e) => setForm(["basic_info", "first_name"], e.target.value)}
								/>
								{error?.basic_info?.first_name == false && (
									<div className="text-xs text-red-500 py-1">First name is required</div>
								)}
							</div>
							<div className="flex flex-col w-[50%]">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="Last name"
									autoComplete="family-name"
									value={form.basic_info.last_name}
									onChange={(e) => setForm(["basic_info", "last_name"], e.target.value)}
								/>
								{error?.basic_info?.last_name == false && (
									<div className="text-xs text-red-500 py-1">Last name is required</div>
								)}
							</div>
						</div>
						<div className="flex flex-row">
							<div className="flex flex-col w-[100%]">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="Email"
									autoComplete="email"
									value={form.basic_info.email_address}
									onChange={(e) => setForm(["basic_info", "email_address"], e.target.value)}
								/>
								{error?.basic_info?.email_address == false && (
									<div className="text-xs text-red-500 py-1">Email is required</div>
								)}
							</div>
						</div>
						<div className="flex flex-row">
							<div className="flex flex-col w-[100%]">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="Telephone"
									autoComplete="tel"
									value={form.basic_info.telephone}
									onChange={(e) => setForm(["basic_info", "telephone"], e.target.value)}
								/>
								{error?.basic_info?.telephone == false && (
									<div className="text-xs text-red-500 py-1">Telephone is required</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full my-2">
					<div className="mb-2 text-sm">Business information</div>
					<div className="flex flex-col gap-y-2">
						<div className="flex flex-row">
							<div className="flex flex-col w-[100%]">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="Business legal name"
									autoComplete="organization"
									value={form.business_legal_name}
									onChange={(e) => setForm(["business_legal_name"], e.target.value)}
								/>
								{error?.business_legal_name == false && (
									<div className="text-xs text-red-500 py-1">Business name is required</div>
								)}
							</div>
						</div>
						<div className="flex flex-row">
							<div className="flex flex-col w-[100%]">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="Doing business as (DBA)"
									value={form.basic_info.doing_business_as}
									onChange={(e) => setForm(["basic_info", "doing_business_as"], e.target.value)}
								/>
							</div>
						</div>
						<div className="flex flex-row">
							<div className="flex flex-col w-[100%]">
								<BusinessEntity />
								{error?.business_entity == false && (
									<div className="text-xs text-red-500 py-1">Business type is required</div>
								)}
							</div>
						</div>
						<div className="flex flex-row">
							<div className="flex flex-col w-[100%]">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="Employer identification number (EIN)"
									value={form.employee_identification_number}
									onChange={(e) => setForm(["employee_identification_number"], e.target.value)}
								/>
								{error?.employee_identification_number == false && (
									<div className="text-xs text-red-500 py-1">
										Employee identification number is required
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full my-2">
					<div className="mb-2 text-sm">Business start date</div>
					<div className="flex flex-col gap-y-2">
						<div className="flex flex-row gap-x-2">
							<div className="flex flex-col w-1/3">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="MM"
									value={form.business_start_date.month}
									onChange={(e) => setForm(["business_start_date", "month"], e.target.value)}
								/>
								{error?.business_start_date?.month == false && (
									<div className="text-xs text-red-500 py-1">Month is required</div>
								)}
							</div>
							<div className="flex flex-col w-1/3">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="DD"
									value={form.business_start_date.day}
									onChange={(e) => setForm(["business_start_date", "day"], e.target.value)}
								/>
								{error?.business_start_date?.day == false && (
									<div className="text-xs text-red-500 py-1">Day is required</div>
								)}
							</div>
							<div className="flex flex-col w-1/3">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="YYYY"
									value={form.business_start_date.year}
									onChange={(e) => setForm(["business_start_date", "year"], e.target.value)}
								/>
								{error?.business_start_date?.year == false && (
									<div className="text-xs text-red-500 py-1">Year is required</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full my-2">
					<div className="mb-2 text-sm">Business address information</div>
					<div className="flex flex-col gap-y-2">
						<div className="flex flex-row">
							<div className="flex flex-col w-[100%]">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="Street address"
									autoComplete="street-address"
									value={form.business_address.address_line}
									onChange={(e) => setForm(["business_address", "address_line"], e.target.value)}
								/>
								{error?.business_address?.address_line == false && (
									<div className="text-xs text-red-500 py-1">Street address is required</div>
								)}
							</div>
						</div>
						<div className="flex flex-row gap-x-2">
							<div className="flex flex-col w-1/3">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="City"
									autoComplete="address-level2"
									value={form.business_address.city}
									onChange={(e) => setForm(["business_address", "city"], e.target.value)}
								/>
								{error?.business_address?.city == false && (
									<div className="text-xs text-red-500 py-1">City is required</div>
								)}
							</div>
							<div className="flex flex-col w-1/3">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="State / Province"
									value={form.business_address.state}
									autoComplete="address-level1"
									onChange={(e) => setForm(["business_address", "state"], e.target.value)}
								/>
								{error?.business_address?.state == false && (
									<div className="text-xs text-red-500 py-1">State / Province is required</div>
								)}
							</div>
							<div className="flex flex-col w-1/3">
								<input
									className="border rounded pl-2 py-1 shadow-sm"
									type="text"
									name=""
									placeholder="Zip / Postal code"
									autoComplete="postal-code"
									value={form.business_address.zip}
									onChange={(e) => setForm(["business_address", "zip"], e.target.value)}
								/>
								{error?.business_address?.zip == false && (
									<div className="text-xs text-red-500 py-1">Zip / Postal code is required</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full my-2">
					<div
						className="flex flex-col w-full items-center justify-center py-2 rounded cursor-pointer bg-green-300 text-white"
						onClick={onSubmitNewBusinessReport}
					>
						Submit
					</div>
				</div>
			</div>
		</div>
	);
};

const BusinessMatchSelect = () => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let { business_match = [], application_id = undefined } = use_view_store((state) => state);
	let navigate = useNavigate();

	const update_business_bin = (bin) => {
		return from(
			axios({
				method: "post",
				url: `/credit/business/match/bin/${bin}/resource/e/${entity_id}/g/${group_id}`,
			})
		);
	};

	const onSelectBusiness = (business) => {
		console.log("onSelectBusiness");
		// console.log(business);
		let redirect_url = `/credit/report/business/experian/status/resource/e/${entity_id}/g/${group_id}`;
		let bin_response = from(update_business_bin(business.bin)).pipe(
			rxfilter((value) => value?.data?.status == "success"),
			tap(() => console.log("update_business_bin.tap")),
			tap(console.log),
			tap(() => navigate(redirect_url))
		);

		bin_response.subscribe();
	};

	return (
		<div className="flex flex-col my-2 p-3 bg-white border rounded text-sm">
			<div className="flex flex-col font-semibold mb-2">Select your business</div>
			<div className="flex flex-col space-y-3">
				{pipe(
					map((business) => (
						<div
							className="flex flex-col rounded bg-white px-3 text-sm cursor-pointer hover:border-green-300 border-2 hover:border-2"
							key={business.bin}
							onClick={() => onSelectBusiness(business)}
						>
							<div className="flex flex-row border-b py-2 font-semibold justify-between items-end mb-2">
								<div>{business?.businessName}</div>
								<div className="flex flex-col px-3 py-1 bg-gray-100 hover:bg-green-300 text-gray-700 hover:text-white rounded cursor-pointer">
									Select
								</div>
							</div>
							<div className="flex flex-col space-y-1 my-1 pb-1">
								<div className="flex flex-col">{business?.address?.street}</div>
								<div className="flex flex-row space-x-1">
									<div>{business?.address?.city},</div>
									<div> {business?.address?.state} </div>
									<div> {business?.address?.zip} </div>
								</div>
								<div className="flex flex-col">{formatPhoneNumber(business?.phone)}</div>
							</div>
						</div>
					))
				)(business_match)}
			</div>
		</div>
	);
};

export default function Home() {
	// return null;
	let loader_data = useLoaderData();
	let set_view = use_view_store((state) => state.set_props);
	let set_path = use_view_store((state) => state.set_state);

	let { pathname } = useLocation();
	let {
		cache_dependencies,
		business_scores,
		personal_scores,
		business_info = {},
		onboard: onboard_db,
		plan_id = "essential",
		business_match = undefined,
		application_id = undefined,
		new_application_is_submiting = false,
	} = use_view_store((state) => state);

	let { business_report_is_empty = true } = business_info;

	let use_cache_client = use_cache((state) => state.set_dependencies);
	let update_cache_key = use_cache((state) => state.set_state);
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let [subscription, setSubscription] = useState(0);

	let business_info_fetcher = useFetcher();
	let personal_scores_fetcher = useFetcher();
	let business_scores_fetcher = useFetcher();
	let business_info_url = `/credit/report/ssebusiness/resource/e/${entity_id}/g/${group_id}`;
	let personal_scores_url = `/credit/report/ssepersonalscores/resource/e/${entity_id}/g/${group_id}`;
	let business_scores_url = `/credit/report/ssebusinessscores/resource/e/${entity_id}/g/${group_id}`;

	// const { plan_id = "essential", onboard: onboard_db, business_report_is_empty } = useLoaderData();
	let onboard = useOnboardingStore((state) => state.onboard);
	// let set_onboard = useOnboardingStore((state) => state.set_state);

	let onboard_num_of_steps = pipe(length)(onboard);
	let onboard_steps_completed = pipe(
		get(all, "completed"),
		filter((value) => value == true),
		length
	)(onboard);

	// console.log("fetcher.subscription");
	// console.log(business_info);
	// console.log("business_scores");
	// console.log(business_scores);
	// console.log(personal_socres_fetcher.data);
	// console.log(business_scores_fetcher.data);
	// console.log(business_info_fetcher.data);

	let fetcher_payload_maker = (url) => {
		return [{}, { method: "post", action: url }];
	};

	const run_fetchers = async () => {
		business_info_fetcher.submit(...fetcher_payload_maker(business_info_url));
		personal_scores_fetcher.submit(...fetcher_payload_maker(personal_scores_url));
		business_scores_fetcher.submit(...fetcher_payload_maker(business_scores_url));
	};

	const on_should_update_cache = (previous_value, current_value, update_key) => {
		let prev_data = rxof(normalize_id(previous_value));
		let curr_data = rxof(normalize_id(current_value));

		let update_cache = () => update_cache_key(["keys", update_key], `${Math.random()}`);

		return zip([prev_data, curr_data]).pipe(
			tap(console.log("on_should_update")),
			tap(console.log),
			rxfilter(([prev_data, curr_data]) => prev_data !== curr_data),
			tap(update_cache)
		);
	};

	useEffect(() => {
		// console.log("loader_data");
		// console.log(loader_data);
		set_view(loader_data);
	}, []);

	// useEffect(() => {
	// 	use_cache_client({ path: `/home`, dependencies: cache_dependencies });
	// }, []);

	// useEffect(() => {
	// 	run_fetchers();
	// }, []);

	// useEffect(() => {
	// 	let fetcher_data = business_info_fetcher.data;
	// 	if (fetcher_data) {
	// 		// console.log("business_info_fetcher.data");
	// 		// console.log(fetcher_data);
	// 		// console.log(business_info);
	// 		on_should_update_cache(business_info, fetcher_data, "business_credit_report").subscribe();
	// 		set_path(["business_info"], fetcher_data);
	// 	}
	// }, [business_info_fetcher.data]);

	// useEffect(() => {
	// 	let fetcher_data = business_scores_fetcher.data;
	// 	if (fetcher_data) {
	// 		// console.log("business_scores_fetcher.data");
	// 		// console.log(fetcher_data);
	// 		// console.log(business_scores);
	// 		on_should_update_cache(business_scores, fetcher_data, "business_credit_report").subscribe();
	// 		set_path(["business_scores"], fetcher_data);
	// 	}
	// }, [business_scores_fetcher.data]);

	// useEffect(() => {
	// 	let fetcher_data = personal_scores_fetcher.data;
	// 	if (fetcher_data) {
	// 		console.log("personal_scores_fetcher.data");
	// 		console.log(fetcher_data);
	// 		console.log(personal_scores);
	// 		on_should_update_cache(personal_scores, fetcher_data, "personal_credit_report").subscribe();
	// 		set_path(["personal_scores"], fetcher_data);
	// 	}
	// }, [personal_scores_fetcher.data]);

	// useEffect(() => {
	// 	onboard = pipe(
	// 		map((step) =>
	// 			mergeDeepRight(
	// 				step,
	// 				pipe(
	// 					filter({
	// 						id: step.id,
	// 					}),
	// 					head,
	// 					defaultTo({})
	// 				)(onboard_db)
	// 			)
	// 		)
	// 	)(onboard);

	// 	set_onboard(["onboard"], onboard);
	// }, [onboard_db]);

	// return (
	// 	<div>
	// 		<HeadingTwo />
	// 		<div onClick={() => console.log("clicked")}>
	// 			<div className="flex flex-col items-center justify-center h-[30px] w-[100px] bg-green-500 py-1 rounded mx-2 cursor-pointer text-white text-xs"></div>
	// 		</div>
	// 	</div>
	// );

	let onboard_percent_completed = (onboard_steps_completed / onboard_num_of_steps) * 100;

	const no_business_match = pipe(anyPass([isNil, isEmpty]), not)(business_match);
	const is_loading = new_application_is_submiting;

	return (
		<div className="w-full h-full flex flex-col overflow-hidden">
			<div className="flex flex-row h-full w-full p-5 space-x-5">
				<div className="flex flex-col h-full w-full lg:w-[70%] rounded overflow-y-scroll scrollbar-none ">
					<div className="flex flex-col h-full max-w-7xl gap-y-5">
						{plan_id == "essential" && (
							<div className="mb-5">
								<UpgradeBanner />
							</div>
						)}
						<HeadingTwo />

						{is_loading && (
							<div className="flex flex-col w-full">
								<Spinner />
							</div>
						)}

						<div className="flex flex-col w-full">
							{!application_id && <NewBusinessReportForm />}
							{no_business_match && <BusinessMatchSelect />}
							{!business_report_is_empty && (
								<div className="flex flex-col lg:flex-row gap-x-5 gap-y-3 lg:space-y-0">
									<div className="flex flex-col w-full">
										<BusinessCredit />
									</div>
									<div className="flex flex-col w-full">
										<PersonalCredit />
									</div>
								</div>
							)}
						</div>
						<div className="flex flex-col w-full h-fit bg-white px-5 pt-5 border rounded">
							<div className="border-b border-gray-200 pb-3 flex flex-col sticky top-0 bg-white z-10">
								<div>
									<h3 className="mt-2 text-base font-semibold leading-6 text-gray-900">Courses</h3>
								</div>
							</div>

							<div className="flex flex-col w-full py-5 scrollbar-none">
								<Courses />
							</div>
						</div>
					</div>
				</div>
				<div className="hidden lg:flex flex-col lg:w-[30%] rounded border bg-white">
					{/* <div className="flex flex-col w-full h-full rounded bg-white">
							<div className="flex flex-row py-4 px-5 justify-between w-full items-center">
								<div>Notifications</div>
							</div>
							<div className="flex flex-col w-full border-t"></div>
							<div className="flex flex-col overflow-scroll scrollbar-none">
								<div className="border-b border-gray-200 bg-white px-4 py-3 sm:px-6 sticky top-0 z-10">
									<h3 className="text-base font-semibold leading-6 text-gray-900 my-2">
										Complete Your Profile
									</h3>

									<div className="flex flex-col w-full space-y-5">
										<p className="mt-1 text-sm text-gray-500">
											Follow the steps below to complete your CreditBanc profile
										</p>
									</div>

									<div className="my-2 flex flex-col w-full">
										<div className="flex flex-row w-full justify-between my-2 text-sm text-gray-400">
											<div>{onboard_percent_completed}%</div>
											<div>
												{onboard_steps_completed}/{onboard_num_of_steps} steps
											</div>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
											<div
												className={`flex flex-col bg-blue-600 h-2.5 rounded-full`}
												style={{
													width: `${onboard_percent_completed}%`,
												}}
											></div>
										</div>
									</div>
								</div>

								<div className="flex flex-col w-full my-3">
									<Notifications />
								</div>
							</div>
						</div> */}
				</div>
			</div>
		</div>
	);
}
