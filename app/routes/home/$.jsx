import {
	ChevronRightIcon,
	PlayIcon,
	EllipsisVerticalIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Link } from "@remix-run/react";
import { get_user_id } from "~/utils/auth.server";
import { get_docs as get_group_docs } from "~/utils/group.server";
import { get_group_id } from "~/utils/helpers";
import { head, isEmpty, pipe } from "ramda";
import { filter, get } from "shades";
import { prisma } from "~/utils/prisma.server";
import { Lendflow } from "~/data/lendflow";
import { Array, credit_report_data } from "~/data/array";
import { useLoaderData } from "@remix-run/react";
import { plans } from "~/data/plans";
import { redirect } from "@remix-run/node";
import UpgradeBanner from "~/components/UpgradeBanner";
var cookie = require("cookie");

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let entity_id = await get_user_id(request);
	let group_id = get_group_id(url.pathname);
	let cookies = request.headers.get("Cookie");
	// console.log("cookie");
	// console.log(cookie);

	var cookies_json = cookie.parse(cookies);
	// console.log("cookies_json");
	// console.log(cookies_json);

	let { allow_empty } = cookies_json;

	// console.log("allow_empty");
	// console.log(allow_empty);

	let { plan_id } = await prisma.entity.findUnique({
		where: { id: entity_id },
		select: {
			plan_id: true,
		},
	});

	let group_docs = await get_group_docs({
		resource_id: group_id,
		entity_id,
	});

	// console.log("group_docs");
	// console.log(group_docs);

	if (isEmpty(group_docs) && !allow_empty)
		return redirect(
			`/credit/business/new/resource/e/${entity_id}/g/${group_id}`
		);

	let business_credit_report_response = pipe(
		filter({ model: "business_credit_report" }),
		head
	)(group_docs);

	let personal_credit_report_response = pipe(
		filter({ model: "personal_credit_report" }),
		head
	)(group_docs);

	let business_credit_report_payload = {};

	if (business_credit_report_response) {
		let business_credit_report =
			await prisma.business_credit_report.findUnique({
				where: {
					id: business_credit_report_response.id,
				},
			});

		let experian_business_score = Lendflow.experian.score(
			business_credit_report
		);

		let dnb_business_score = Lendflow.dnb.score(business_credit_report);

		let experian_business_report = {
			score: experian_business_score,
			id: business_credit_report.id,
			href: `/credit/report/business/experian/overview/resource/e/${entity_id}/g/${group_id}/f/${business_credit_report.id}`,
		};

		let dnb_business_report = {
			score: dnb_business_score,
			id: business_credit_report.id,
			href: `/credit/report/business/dnb/overview/resource/e/${entity_id}/g/${group_id}/f/${business_credit_report.id}`,
		};

		business_credit_report_payload = {
			experian_business_report,
			dnb_business_report,
		};
	}

	if (!business_credit_report_response) {
		let experian_business_report = {
			score: 0,
			id: 0,
			href: `/credit/business/new`,
		};

		let dnb_business_report = {
			score: 0,
			id: 0,
			href: `/credit/business/new`,
		};

		business_credit_report_payload = {
			experian_business_report,
			dnb_business_report,
		};
	}

	let personal_credit_report_payload = {};

	if (personal_credit_report_response) {
		let personal_credit_report =
			await prisma.personal_credit_report.findUnique({
				where: {
					id: personal_credit_report_response.id,
				},
			});

		let experian_personal_score = Array.experian.score(credit_report_data);

		let equifax_personal_score = Array.equifax.score(credit_report_data);

		let transunion_personal_score =
			Array.transunion.score(credit_report_data);

		let experian_personal_report = {
			score: experian_personal_score,
			id: personal_credit_report.id,
			href: `/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}/f/${personal_credit_report.id}`,
		};

		let equifax_personal_report = {
			score: equifax_personal_score,
			id: personal_credit_report.id,
			href: `/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}/f/${personal_credit_report.id}`,
		};

		let transunion_personal_report = {
			score: transunion_personal_score,
			id: personal_credit_report.id,
			href: `/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}/f/${personal_credit_report.id}`,
		};

		personal_credit_report_payload = {
			experian_personal_report,
			equifax_personal_report,
			transunion_personal_report,
		};
	}

	if (!personal_credit_report_response) {
		let experian_personal_report = {
			score: 0,
			id: 0,
			href: `/credit/personal/new`,
		};

		let equifax_personal_report = {
			score: 0,
			id: 0,
			href: `/credit/personal/new`,
		};

		let transunion_personal_report = {
			score: 0,
			id: 0,
			href: `/credit/personal/new`,
		};

		personal_credit_report_payload = {
			experian_personal_report,
			equifax_personal_report,
			transunion_personal_report,
		};
	}

	// console.log("plan_id");
	// console.log(plan_id);

	return {
		...personal_credit_report_payload,
		...business_credit_report_payload,
		entity_id,
		plan_id,
	};
};

function Heading() {
	return (
		<div className="border-b border-gray-200 pb-3">
			<div className="sm:flex sm:items-baseline sm:justify-between">
				<div className="sm:w-0 sm:flex-1">
					<h1
						id="message-heading"
						className="text-base font-semibold leading-6 text-gray-900"
					>
						Credit Banc University
					</h1>
					<p className="mt-1 truncate text-sm text-gray-500">
						Learn how to build your credit and get funding
					</p>
				</div>

				<div className="mt-4 flex items-center justify-between sm:ml-6 sm:mt-0 sm:flex-shrink-0 sm:justify-start">
					<span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
						18 Videos
					</span>
				</div>
			</div>
		</div>
	);
}

const VideoCard = () => {
	return (
		<div className="border my-4 rounded flex flex-row">
			<div className="flex flex-col w-[150px] border-r h-auto">
				<div className="flex flex-col w-full h-full items-center justify-center">
					<div className="w-[30px] text-[#55CF9E]">
						<PlayIcon />
					</div>
				</div>
			</div>
			<div className="flex flex-col p-4 w-full h-full leading-6">
				<div className="flex flex-col font-semibold">Video Title</div>
				<div className="flex flex-col mt-1">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Etiam cursus enim sed rutrum dignissim. Proin vel tincidunt
					libero, sed pharetra neque. Proin molestie tincidunt neque
					sed hendrerit. Phasellus nec vulputate erat. Aliquam vitae
					nunc consectetur, varius ex sed, finibus ante.
				</div>
			</div>
		</div>
	);
};

const BusinessCredit = () => {
	let { experian_business_report, dnb_business_report, plan_id } =
		useLoaderData();
	let { score: experian_score } = experian_business_report;
	let { score: dnb_score } = dnb_business_report;

	let can_view_experian_business_score = pipe(
		get(plan_id, "business", "experian", "score")
	)(plans);

	let can_view_dnb_business_score = pipe(
		get(plan_id, "business", "dnb", "score")
	)(plans);

	return (
		<div className="flex flex-col border mx-2 shadow-sm rounded px-4">
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
							to={experian_business_report.href}
							className="flex flex-col w-1/3 text-2xl font-bold justify-center"
						>
							<div className="flex flex-row w-full justify-end items-center cursor-pointer">
								<div className="flex flex-col">
									{experian_score}
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
							to={dnb_business_report.href}
							className="flex flex-col w-1/3 text-2xl font-bold justify-center"
						>
							<div className="flex flex-row w-full justify-end items-center cursor-pointer">
								<div className="flex flex-col">{dnb_score}</div>
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
	let {
		experian_personal_report,
		equifax_personal_report,
		transunion_personal_report,
		plan_id,
	} = useLoaderData();

	let { score: experian_score } = experian_personal_report;
	let { score: equifax_score } = equifax_personal_report;
	let { score: transunion_score } = transunion_personal_report;

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
		<div className="flex flex-col border mx-2 shadow-sm rounded px-4">
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
							to={experian_personal_report.href}
							className="flex flex-col w-1/3 text-2xl font-bold justify-center"
						>
							<div className="flex flex-row w-full justify-end items-center cursor-pointer">
								<div className="flex flex-col">
									{experian_score}
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
							to={transunion_personal_report.href}
							className="flex flex-col w-1/3 text-2xl font-bold justify-center"
						>
							<div className="flex flex-row w-full justify-end items-center cursor-pointer">
								<div className="flex flex-col">
									{transunion_score}
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
							to={equifax_personal_report.href}
							className="flex flex-col w-1/3 text-2xl font-bold justify-center"
						>
							<div className="flex flex-row w-full justify-end items-center cursor-pointer">
								<div className="flex flex-col">
									{equifax_score}
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
		<div className="flex flex-col max-w-7xl w-full px-3 mt-3 mb-4">
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

export default function Home() {
	const { plan_id } = useLoaderData();

	return (
		<div className="w-full h-full flex flex-col items-center mb-3 p-5">
			<HeadingTwo />
			<div className="flex flex-col h-full max-w-7xl">
				{plan_id == "essential" && <UpgradeBanner />}

				<div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0">
					<div className="flex flex-col w-full">
						<BusinessCredit />
					</div>
					<div className="flex flex-col w-full">
						<PersonalCredit />
					</div>
				</div>

				<div className="flex flex-col  h-full px-2 mt-8">
					<Heading />
					<div className="my-1">
						<VideoCard />
						<VideoCard />
						<VideoCard />
					</div>
				</div>
			</div>
		</div>
	);
}
