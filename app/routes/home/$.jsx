import { ChevronRightIcon, ListBulletIcon } from "@heroicons/react/20/solid";
import { Link, useLocation } from "@remix-run/react";
import { get_user_id } from "~/utils/auth.server";
import { get_entity_id, get_group_id } from "~/utils/helpers";
import { pipe } from "ramda";
import { get } from "shades";
import { prisma } from "~/utils/prisma.server";
import { useLoaderData } from "@remix-run/react";
import { plans } from "~/data/plans";
import { redirect } from "@remix-run/node";
import UpgradeBanner from "~/components/UpgradeMembership";
var cookie = require("cookie");
import CashflowChart from "~/components/CashflowChart";
import axios from "axios";
import { useCashflowStore } from "~/stores/useCashflowStore";
import { useEffect } from "react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { Disclosure } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let entity_id = await get_user_id(request);
	let group_id = get_group_id(url.pathname);
	let cookies = request.headers.get("Cookie");
	var cookies_json = cookie.parse(cookies);

	let { allow_empty } = cookies_json;

	let { plan_id } = await prisma.entity.findUnique({
		where: { id: entity_id },
		select: {
			plan_id: true,
		},
	});

	let credit_scores_api_response = await axios({
		method: "get",
		url: `${url.origin}/credit/report/api/scores/resource/e/${entity_id}/g/${group_id}`,
	});

	let { data: scores } = credit_scores_api_response;

	let cashflow_api_response = await axios({
		method: "get",
		url: `${url.origin}/financial/api/cashflow/resource/e/${entity_id}/g/${group_id}`,
	});

	let { data: financials } = cashflow_api_response;

	let payload = {
		...scores,
		entity_id,
		plan_id,
		financials,
	};

	return payload;
};

const BusinessCredit = () => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	let { experian_business_score, dnb_business_score, plan_id } =
		useLoaderData();

	let can_view_experian_business_score = pipe(
		get(plan_id, "business", "experian", "score")
	)(plans);

	let can_view_dnb_business_score = pipe(
		get(plan_id, "business", "dnb", "score")
	)(plans);

	return (
		<div className="flex flex-col border rounded px-4 bg-white min-h-[260px]">
			<div className="border-b border-gray-200">
				<h3 className="text-base font-semibold leading-6 text-gray-900 py-3">
					Business Credit
				</h3>
			</div>
			<div className="flex flex-col w-full py-3 border-b border-gray-200">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-2/3">
						<div className="font-semibold">Experian ®</div>
						<div className="text-gray-400 text-sm">
							Intelliscore
						</div>
					</div>

					{can_view_experian_business_score && (
						<Link
							to={`/credit/report/business/experian/overview/resource/e/${entity_id}/g/${group_id}`}
							className="flex flex-col w-1/3 text-2xl font-bold justify-center"
						>
							<div className="flex flex-row w-full justify-end items-center cursor-pointer">
								<div className="flex flex-col">
									{experian_business_score}
								</div>
								<div className="flex flex-col w-[30px] ">
									<ChevronRightIcon />
								</div>
							</div>
						</Link>
					)}

					{!can_view_experian_business_score && (
						<Link
							to="/plans"
							className="flex flex-col w-1/3 font-semibold text-blue-700 text-sm cursor-pointer items-end mr-2 justify-center"
						>
							Upgrade Account
						</Link>
					)}
				</div>
			</div>

			<div className="flex flex-col w-full py-3 ">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-2/3">
						<div className="font-semibold">Dun & Bradstreet ®</div>
						<div className="text-gray-400 text-sm">
							PAYDEX Score
						</div>
					</div>

					{can_view_dnb_business_score && (
						<Link
							to={`/credit/report/business/dnb/overview/resource/e/${entity_id}/g/${group_id}`}
							className="flex flex-col w-1/3 text-2xl font-bold justify-center"
						>
							<div className="flex flex-row w-full justify-end items-center cursor-pointer">
								<div className="flex flex-col">
									{dnb_business_score}
								</div>
								<div className="flex flex-col w-[30px] ">
									<ChevronRightIcon />
								</div>
							</div>
						</Link>
					)}

					{!can_view_dnb_business_score && (
						<Link
							to="/plans"
							className="flex flex-col w-1/3 font-semibold text-blue-700 text-sm cursor-pointer items-end mr-2 justify-center"
						>
							Upgrade Account
						</Link>
					)}
				</div>
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

	let can_view_experian_personal_score = pipe(
		get(plan_id, "personal", "experian", "authorized")
	)(plans);

	let can_view_equifax_personal_score = pipe(
		get(plan_id, "personal", "equifax", "authorized")
	)(plans);

	let can_view_transunion_personal_score = pipe(
		get(plan_id, "personal", "transunion", "authorized")
	)(plans);

	return (
		<div className="flex flex-col rounded px-4 border bg-white min-h-[260px]">
			<div className="border-b border-gray-200">
				<h3 className="text-base font-semibold leading-6 text-gray-900 py-3">
					Personal Credit
				</h3>
			</div>

			<div className="flex flex-col w-full py-3 border-b border-gray-200">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-2/3">
						<div className="font-semibold">Experian Personal ®</div>
						<div className="text-gray-400 text-sm">
							VantageScore® 3.0
						</div>
					</div>

					{can_view_experian_personal_score && (
						<Link
							to={`/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}`}
							className="flex flex-col w-1/3 text-2xl font-bold justify-center"
						>
							<div className="flex flex-row w-full justify-end items-center cursor-pointer">
								<div className="flex flex-col">
									{experian_personal_score}
								</div>
								<div className="flex flex-col w-[30px] ">
									<ChevronRightIcon />
								</div>
							</div>
						</Link>
					)}

					{!can_view_experian_personal_score && (
						<Link
							to="/plans"
							className="flex flex-col w-1/3 font-semibold text-blue-700 text-sm cursor-pointer"
						>
							Upgrade Account
						</Link>
					)}
				</div>
			</div>

			<div className="flex flex-col w-full py-3 border-b border-gray-200">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-2/3">
						<div className="font-semibold">TransUnion ®</div>
						<div className="text-gray-400 text-sm">
							VantageScore® 3.0
						</div>
					</div>

					{can_view_transunion_personal_score && (
						<Link
							to={`/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}`}
							className="flex flex-col w-1/3 text-2xl font-bold justify-center"
						>
							<div className="flex flex-row w-full justify-end items-center cursor-pointer">
								<div className="flex flex-col">
									{transunion_personal_score}
								</div>
								<div className="flex flex-col w-[30px] ">
									<ChevronRightIcon />
								</div>
							</div>
						</Link>
					)}

					{!can_view_transunion_personal_score && (
						<Link
							to="/plans"
							className="flex flex-col w-1/3 font-semibold text-blue-700 text-sm cursor-pointer items-end mr-2 justify-center"
						>
							Upgrade Account
						</Link>
					)}
				</div>
			</div>

			<div className="flex flex-col w-full py-3">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-2/3">
						<div className="font-semibold">Equifax ®</div>
						<div className="text-gray-400 text-sm">
							VantageScore® 3.0
						</div>
					</div>

					{can_view_equifax_personal_score && (
						<Link
							to={`/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}`}
							className="flex flex-col w-1/3 text-2xl font-bold justify-center"
						>
							<div className="flex flex-row w-full justify-end items-center cursor-pointer">
								<div className="flex flex-col">
									{equifax_personal_score}
								</div>
								<div className="flex flex-col w-[30px] ">
									<ChevronRightIcon />
								</div>
							</div>
						</Link>
					)}

					{!can_view_equifax_personal_score && (
						<Link
							to="/plans"
							className="flex flex-col w-1/3 font-semibold text-blue-700 text-sm cursor-pointer items-end mr-2 justify-center"
						>
							Upgrade Account
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

const HeadingTwo = () => {
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
						<div className="mt-1 text-base font-semibold leading-6 text-gray-900">
							Tuple, Inc
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

const Accounts = () => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	return (
		<div className="mx-auto  grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
			{posts.map((post) => (
				<article
					key={post.id}
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
							<div className="flex flex-row w-full border p-2 rounded">
								<Link
									className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer"
									to={`/credit/personal/new/resource/e/${entity_id}/g/${group_id}`}
								>
									<div>
										<XCircleIcon className="h-5 w-5 text-red-500" />
									</div>
									<div>Run a personal credit report</div>
								</Link>
								<div></div>
							</div>
							<div className="flex flex-row w-full border p-2 rounded">
								<Link
									className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer"
									to={`/credit/business/new/resource/e/${entity_id}/g/${group_id}?cookie=monster`}
								>
									<div>
										<CheckCircleIcon className="h-5 w-5 text-green-500" />
									</div>
									<div>Run a business credit report</div>
								</Link>
								<div></div>
							</div>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
			<Disclosure defaultOpen={true}>
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
							<div className="flex flex-row w-full border p-2 rounded">
								<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
									<div>
										<XCircleIcon className="h-5 w-5 text-red-500" />
									</div>
									<div>Connect bank account</div>
								</div>
								<div></div>
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
							<div className="flex flex-row w-full border p-2 rounded">
								<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
									<div>
										<XCircleIcon className="h-5 w-5 text-red-500" />
									</div>
									<div>Upload tax returns</div>
								</div>
								<div></div>
							</div>
							<div className="flex flex-row w-full border p-2 rounded">
								<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
									<div>
										<CheckCircleIcon className="h-5 w-5 text-green-500" />
									</div>
									<div>Upload drivers license</div>
								</div>
								<div></div>
							</div>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
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
							<div className="flex flex-row w-full border p-2 rounded">
								<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
									<div>
										<CheckCircleIcon className="h-5 w-5 text-green-500" />
									</div>
									<div>Create a role</div>
								</div>
								<div></div>
							</div>
							<div className="flex flex-row w-full border p-2 rounded">
								<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
									<div>
										<XCircleIcon className="h-5 w-5 text-red-500" />
									</div>
									<div>Invite team members</div>
								</div>
								<div></div>
							</div>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
		</div>
	);
};

export default function Home() {
	const { plan_id, financials } = useLoaderData();
	let set_financials = useCashflowStore((state) => state.set_state);

	useEffect(() => {
		set_financials(["financials"], financials);
	}, []);

	return (
		<div className="w-full h-full flex flex-col overflow-hidden">
			<div className="flex flex-row h-full w-full p-5 space-x-5">
				<div className="flex flex-col h-full w-[70%] rounded overflow-y-scroll scrollbar-none ">
					<div className="flex flex-col h-full max-w-7xl gap-y-5">
						{plan_id == "essential" && (
							<div className="mb-5">
								<UpgradeBanner />
							</div>
						)}

						<HeadingTwo />

						<div className="flex flex-col lg:flex-row gap-x-5 gap-y-3 lg:space-y-0">
							<div className="flex flex-col w-full">
								<BusinessCredit />
							</div>
							<div className="flex flex-col w-full">
								<PersonalCredit />
							</div>
						</div>

						<div className="flex flex-col w-full max-h-[600px] bg-white rounded border">
							<CashflowChart />
						</div>

						<div className="flex flex-col w-full h-fit bg-white px-5 pt-5 border rounded">
							<div className="border-b border-gray-200 pb-3 flex flex-col sticky top-0 bg-white z-10">
								<div>
									<h3 className="mt-2 text-base font-semibold leading-6 text-gray-900">
										Courses
									</h3>
								</div>
								{/* <div>
									<HeaderFilters />
								</div> */}
							</div>

							<div className="flex flex-col w-full py-5 scrollbar-none">
								<Accounts />
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-[30%] rounded border">
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
										<div>45%</div>
										<div>4/6 steps</div>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
										<div className="bg-blue-600 h-2.5 rounded-full w-[45%]"></div>
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
