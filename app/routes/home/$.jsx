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
import { use_cache } from "~/components/CacheLink";
import PreFills from "../credit/business/PreFills";
import PersonalReport from "~/api/client/PersonalReport";
import BusinessReport from "~/api/client/BusinessReport";
import { fold } from "~/utils/operators";
import Entity from "~/api/client/Entity";
import { cache } from "~/utils/helpers.server";
import { appKey } from "~/data/array";
import BusinessScores from "../credit/report/business/components/scores";
import { currency } from "~/utils/helpers";

let use_view_store = store();

const log_route = `home.$`;

const on_success = curry((request, response) => {
	console.log(`${log_route}.success`);
	let with_cache = cache(request);
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
	// return null;
	let url = new URL(request.url);
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

	let payload = forkJoin({ personal_response, business_response, entity_response, business_entity_response }).pipe(
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
			};
		})
	);

	let response = await lastValueFrom(payload.pipe(fold(on_success(request), on_error)));
	return response;
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

export default function Home() {
	// return null;
	let loader_data = useLoaderData();
	let set_view = use_view_store((state) => state.set_props);
	let set_path = use_view_store((state) => state.set_state);
	let { user_token, experian_facts = {}, business_scores = {} } = loader_data;

	let { businessHeader = {} } = experian_facts;
	let { businessName } = businessHeader;

	let { pathname } = useLocation();

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
	// 	if (cache_dependencies !== undefined) {
	// 		use_cache_client({ path: `/home`, dependencies: cache_dependencies });
	// 	}
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
	// 		// on_should_update_cache(business_info, fetcher_data, "business_credit_report").subscribe();
	// 		set_path(["business_info"], fetcher_data);
	// 	}
	// }, [business_info_fetcher.data]);

	// useEffect(() => {
	// 	let fetcher_data = business_scores_fetcher.data;
	// 	if (fetcher_data) {
	// 		// console.log("business_scores_fetcher.data");
	// 		// console.log(fetcher_data);
	// 		// console.log(business_scores);
	// 		// on_should_update_cache(business_scores, fetcher_data, "business_credit_report").subscribe();
	// 		set_path(["business_scores"], fetcher_data);
	// 	}
	// }, [business_scores_fetcher.data]);

	// useEffect(() => {
	// 	let fetcher_data = personal_scores_fetcher.data;
	// 	if (fetcher_data) {
	// 		// console.log("personal_scores_fetcher.data");
	// 		// console.log(fetcher_data);
	// 		// console.log(personal_scores);
	// 		// on_should_update_cache(personal_scores, fetcher_data, "personal_credit_report").subscribe();
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

	return (
		<div className="w-full h-full flex flex-col overflow-hidden">
			<div className="flex flex-row h-full w-full p-5 space-x-5">
				<div className="flex flex-col h-full w-full rounded overflow-y-scroll scrollbar-none ">
					<div className="flex flex-col h-full w-full gap-y-5">
						<div className="flex flex-col w-full h-full">
							<div className="flex flex-col h-full gap-x-5 border rounded bg-white items-center w-full gap-y-[60px] overflow-auto scrollbar-none">
								<div className="flex flex-col max-w-4xl text-center mt-[20px]">
									<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
										{businessName}
									</h1>
								</div>
								<div className="flex flex-col w-full gap-y-[100px] items-center">
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
