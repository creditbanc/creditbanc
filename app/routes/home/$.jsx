import { ChevronRightIcon, ListBulletIcon } from "@heroicons/react/20/solid";
import {
	Form,
	Link,
	useActionData,
	useFetcher,
	useLocation,
} from "@remix-run/react";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import {
	capitalize,
	get_entity_id,
	get_group_id,
	use_search_params,
} from "~/utils/helpers";
import {
	__,
	defaultTo,
	head,
	length,
	map,
	mergeDeepRight,
	omit,
	pipe,
	values,
} from "ramda";
import { all, filter, get } from "shades";
import { useLoaderData } from "@remix-run/react";
import { plans } from "~/data/plans";
import { redirect } from "@remix-run/node";
import UpgradeBanner from "~/components/UpgradeMembership";
var cookie = require("cookie");
import axios from "axios";
import { useCashflowStore } from "~/stores/useCashflowStore";
import { useEffect } from "react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { Disclosure } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { get_doc } from "~/utils/firebase";
import {
	useOnboardingStore,
	default_onboard_state,
} from "~/stores/useOnboardingStore";
import { encode } from "js-base64";
import { create } from "zustand";
import { mod } from "shades";
import { BusinessEntity, useReportStore } from "../credit/business/new/$";

const useNewBusinessReportFormStore = useReportStore;

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	let business_entity_id = get_entity_id(url.pathname);

	let group_id = get_group_id(url.pathname);
	// let cookies = request.headers.get("Cookie");
	// var cookies_json = cookie.parse(cookies);

	// let entity_id = get_entity_id(url.pathname);

	let entity = await get_doc(["entity", entity_id]);
	let business_entity = await get_doc(["entity", business_entity_id]);

	let onboard_state = await get_doc(["onboard", entity_id]);

	onboard_state = pipe(
		omit(["group_id", "entity_id"]),
		values
	)(onboard_state);

	let { plan_id } = await get_doc(["entity", entity_id]);

	let business_info_response = await axios({
		method: "get",
		url: `${url.origin}/credit/report/business/api/company/resource/e/${business_entity_id}/g/${group_id}`,
		withCredentials: true,
		headers: {
			cookie: `creditbanc_session=${encode(
				JSON.stringify({ entity_id: business_entity_id })
			)}`,
		},
	});

	let { data: business = {} } = business_info_response;

	// console.log("business");
	// console.log(business);

	let credit_scores_api_response = await axios({
		method: "get",
		url: `${url.origin}/credit/report/api/scores/resource/e/${business_entity_id}/g/${group_id}`,
		withCredentials: true,
		headers: {
			cookie: `creditbanc_session=${encode(
				JSON.stringify({ entity_id: business_entity_id })
			)}`,
		},
	});

	let { data: scores } = credit_scores_api_response;

	// console.log("scores");
	// console.log(scores);

	let payload = {
		...scores,
		entity_id,
		plan_id,
		business,
		onboard: onboard_state,
		entity,
		business_entity_id,
		business_entity,
	};

	// console.log("payload");
	// console.log(payload);

	return payload;
};

const BusinessCredit = () => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	let { experian_business_score, dnb_business_score, plan_id } =
		useLoaderData();

	return (
		<div className="flex flex-col border rounded px-4 bg-white min-h-[260px]">
			<div className="border-b border-gray-200">
				<h3 className="text-base font-semibold leading-6 text-gray-900 py-3">
					Business Credit
				</h3>
			</div>
			<div className="flex flex-col w-full py-3 border-b border-gray-200">
				<Link
					className="flex flex-row w-full"
					to={`/credit/report/business/experian/overview/resource/e/${entity_id}/g/${group_id}`}
				>
					<div className="flex flex-col w-2/3">
						<div className="font-semibold">Experian ®</div>
						<div className="text-gray-400 text-sm">
							Intelliscore
						</div>
					</div>

					<div className="flex flex-col w-1/3 text-2xl font-bold justify-center">
						<div className="flex flex-row w-full justify-end items-center cursor-pointer">
							<div className="flex flex-col">
								{experian_business_score}
							</div>
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
					to={`/credit/report/business/dnb/overview/resource/e/${entity_id}/g/${group_id}`}
				>
					<div className="flex flex-col w-2/3">
						<div className="font-semibold">Dun & Bradstreet ®</div>
						<div className="text-gray-400 text-sm">
							PAYDEX Score
						</div>
					</div>

					<div className="flex flex-col w-1/3 text-2xl font-bold justify-center">
						<div className="flex flex-row w-full justify-end items-center cursor-pointer">
							<div className="flex flex-col">
								{dnb_business_score}
							</div>
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
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	let {
		experian_personal_score,
		equifax_personal_score,
		transunion_personal_score,
		plan_id,
	} = useLoaderData();

	return (
		<div className="flex flex-col rounded px-4 border bg-white min-h-[260px]">
			<div className="border-b border-gray-200">
				<h3 className="text-base font-semibold leading-6 text-gray-900 py-3">
					Personal Credit
				</h3>
			</div>

			<div className="flex flex-col w-full py-3 border-b border-gray-200">
				<Link
					className="flex flex-row w-full"
					to={`/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}`}
				>
					<div className="flex flex-col w-2/3">
						<div className="font-semibold">Experian Personal ®</div>
						<div className="text-gray-400 text-sm">
							VantageScore® 3.0
						</div>
					</div>

					<div className="flex flex-col w-1/3 text-2xl font-bold justify-center">
						<div className="flex flex-row w-full justify-end items-center cursor-pointer">
							<div className="flex flex-col">
								{experian_personal_score}
							</div>
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
						<div className="text-gray-400 text-sm">
							VantageScore® 3.0
						</div>
					</div>

					<div className="flex flex-col w-1/3 text-2xl font-bold justify-center">
						<div className="flex flex-row w-full justify-end items-center cursor-pointer">
							<div className="flex flex-col">
								{transunion_personal_score}
							</div>
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
						<div className="text-gray-400 text-sm">
							VantageScore® 3.0
						</div>
					</div>

					<div className="flex flex-col w-1/3 text-2xl font-bold justify-center">
						<div className="flex flex-row w-full justify-end items-center cursor-pointer">
							<div className="flex flex-col">
								{equifax_personal_score}
							</div>
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
	let { business, business_entity: entity } = useLoaderData();

	let EntityPersonalDetails = () => {
		return (
			<div>
				<div className="font-semibold">
					{capitalize(entity.first_name)}{" "}
					{capitalize(entity.last_name)}
				</div>
				<div className="text-sm">{entity.email}</div>
			</div>
		);
	};

	let BusinessDetails = () => {
		return (
			<div>
				<div className="font-semibold">{business.name}</div>
			</div>
		);
	};

	let EntityAccountDetails = () => {
		return business?.name ? <BusinessDetails /> : <EntityPersonalDetails />;
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
		category: { title: "Marketing", href: "#" },
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
		category: { title: "Marketing", href: "#" },
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
		category: { title: "Marketing", href: "#" },
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
				<article
					key={index}
					className="flex flex-col items-start justify-between"
				>
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
							<time
								dateTime={post.datetime}
								className="text-gray-500"
							>
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
							<p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
								{post.description}
							</p>
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
							<img
								src={post.author.imageUrl}
								className="h-10 w-10 rounded-full bg-gray-100"
							/>
							<div className="text-sm leading-6">
								<p className="font-semibold text-gray-900">
									<a href={post.author.href}>
										<span className="absolute inset-0" />
										{post.author.name}
									</a>
								</p>
								<p className="text-gray-600">
									{post.author.role}
								</p>
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
										category: "credit",
										// completed: false,
									}),
									map((step) => (
										<div
											className="flex flex-row w-full border p-2 rounded"
											key={step.id}
										>
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
													<div>
														{step.completed_text}
													</div>
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
										category: "social",
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
		</div>
	);
};

const NewBusinessReportForm = () => {
	let form = useNewBusinessReportFormStore((state) => state.form);
	let setForm = useNewBusinessReportFormStore((state) => state.setForm);
	const fetcher = useFetcher();
	const error = fetcher.data;

	const onSubmitNewBusinessReport = () => {
		console.log("onSubmitNewBusinessReport");

		let { business_start_date, ...rest } = form;
		let business_start_date_string = `${business_start_date.year}-${business_start_date.month}-${business_start_date.day}`;

		let payload = {
			business_start_date: business_start_date_string,
			...rest,
		};

		fetcher.submit(
			{ payload: JSON.stringify(payload) },
			{
				method: "post",
				action: "/credit/business/new",
			}
		);
	};

	return (
		<div className="flex flex-col w-full border rounded bg-white p-5">
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
								onChange={(e) =>
									setForm(
										["basic_info", "first_name"],
										e.target.value
									)
								}
							/>
							{error?.basic_info?.first_name == false && (
								<div className="text-xs text-red-500 py-1">
									First name is required
								</div>
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
								onChange={(e) =>
									setForm(
										["basic_info", "last_name"],
										e.target.value
									)
								}
							/>
							{error?.basic_info?.last_name == false && (
								<div className="text-xs text-red-500 py-1">
									Last name is required
								</div>
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
								onChange={(e) =>
									setForm(
										["basic_info", "email_address"],
										e.target.value
									)
								}
							/>
							{error?.basic_info?.email_address == false && (
								<div className="text-xs text-red-500 py-1">
									Email is required
								</div>
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
								onChange={(e) =>
									setForm(
										["basic_info", "telephone"],
										e.target.value
									)
								}
							/>
							{error?.basic_info?.telephone == false && (
								<div className="text-xs text-red-500 py-1">
									Telephone is required
								</div>
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
								onChange={(e) =>
									setForm(
										["business_legal_name"],
										e.target.value
									)
								}
							/>
							{error?.business_legal_name == false && (
								<div className="text-xs text-red-500 py-1">
									Business name is required
								</div>
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
								onChange={(e) =>
									setForm(
										["basic_info", "doing_business_as"],
										e.target.value
									)
								}
							/>
						</div>
					</div>
					<div className="flex flex-row">
						<div className="flex flex-col w-[100%]">
							<BusinessEntity />
							{error?.business_entity == false && (
								<div className="text-xs text-red-500 py-1">
									Business type is required
								</div>
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
								onChange={(e) =>
									setForm(
										["employee_identification_number"],
										e.target.value
									)
								}
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
								onChange={(e) =>
									setForm(
										["business_start_date", "month"],
										e.target.value
									)
								}
							/>
							{error?.business_start_date?.month == false && (
								<div className="text-xs text-red-500 py-1">
									Month is required
								</div>
							)}
						</div>
						<div className="flex flex-col w-1/3">
							<input
								className="border rounded pl-2 py-1 shadow-sm"
								type="text"
								name=""
								placeholder="DD"
								value={form.business_start_date.day}
								onChange={(e) =>
									setForm(
										["business_start_date", "day"],
										e.target.value
									)
								}
							/>
							{error?.business_start_date?.day == false && (
								<div className="text-xs text-red-500 py-1">
									Day is required
								</div>
							)}
						</div>
						<div className="flex flex-col w-1/3">
							<input
								className="border rounded pl-2 py-1 shadow-sm"
								type="text"
								name=""
								placeholder="YYYY"
								value={form.business_start_date.year}
								onChange={(e) =>
									setForm(
										["business_start_date", "year"],
										e.target.value
									)
								}
							/>
							{error?.business_start_date?.year == false && (
								<div className="text-xs text-red-500 py-1">
									Year is required
								</div>
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
								onChange={(e) =>
									setForm(
										["business_address", "address_line"],
										e.target.value
									)
								}
							/>
							{error?.business_address?.address_line == false && (
								<div className="text-xs text-red-500 py-1">
									Street address is required
								</div>
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
								onChange={(e) =>
									setForm(
										["business_address", "city"],
										e.target.value
									)
								}
							/>
							{error?.business_address?.city == false && (
								<div className="text-xs text-red-500 py-1">
									City is required
								</div>
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
								onChange={(e) =>
									setForm(
										["business_address", "state"],
										e.target.value
									)
								}
							/>
							{error?.business_address?.state == false && (
								<div className="text-xs text-red-500 py-1">
									State / Province is required
								</div>
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
								onChange={(e) =>
									setForm(
										["business_address", "zip"],
										e.target.value
									)
								}
							/>
							{error?.business_address?.zip == false && (
								<div className="text-xs text-red-500 py-1">
									Zip / Postal code is required
								</div>
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
	);
};

export default function Home() {
	const {
		plan_id = "essential",
		onboard: onboard_db,
		business_report_is_empty,
	} = useLoaderData();
	let onboard = useOnboardingStore((state) => state.onboard);
	let set_onboard = useOnboardingStore((state) => state.set_state);

	let onboard_num_of_steps = pipe(length)(onboard);
	let onboard_steps_completed = pipe(
		get(all, "completed"),
		filter((value) => value == true),
		length
	)(onboard);

	useEffect(() => {
		onboard = pipe(
			map((step) =>
				mergeDeepRight(
					step,
					pipe(
						filter({ id: step.id }),
						head,
						defaultTo({})
					)(onboard_db)
				)
			)
		)(onboard);

		set_onboard(["onboard"], onboard);
	}, [onboard_db]);

	let onboard_percent_completed =
		(onboard_steps_completed / onboard_num_of_steps) * 100;

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

						<div className="flex flex-col w-full">
							{business_report_is_empty && (
								<NewBusinessReportForm />
							)}
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
									<h3 className="mt-2 text-base font-semibold leading-6 text-gray-900">
										Courses
									</h3>
								</div>
							</div>

							<div className="flex flex-col w-full py-5 scrollbar-none">
								<Courses />
							</div>
						</div>
					</div>
				</div>
				<div className="hidden lg:flex flex-col lg:w-[30%] rounded border">
					<div className="flex flex-col w-full h-full rounded bg-white">
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
										Follow the steps below to complete your
										CreditBanc profile
									</p>
								</div>

								<div className="my-2 flex flex-col w-full">
									<div className="flex flex-row w-full justify-between my-2 text-sm text-gray-400">
										<div>{onboard_percent_completed}%</div>
										<div>
											{onboard_steps_completed}/
											{onboard_num_of_steps} steps
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
					</div>
				</div>
			</div>
		</div>
	);
}
