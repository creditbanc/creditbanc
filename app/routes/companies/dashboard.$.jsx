import { FolderIcon } from "@heroicons/react/20/solid";
import {
	EllipsisHorizontalIcon,
	LinkIcon,
	DocumentDuplicateIcon,
	BriefcaseIcon,
	CurrencyDollarIcon,
	FolderOpenIcon,
	UserCircleIcon,
	HomeIcon,
} from "@heroicons/react/24/outline";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { isEmpty, map, max, pipe, prop, reduce, set, uniqBy } from "ramda";
import { get, all, mod } from "shades";
import { get_user_id } from "~/utils/auth.server";
import { classNames, get_entity_id, get_group_id } from "~/utils/helpers";
import {
	get_owner_companies_ids,
	get_shared_companies_ids,
} from "~/api/ui/companies";
import { create } from "zustand";
import axios from "axios";
import { useEffect } from "react";

export const useCompanyStore = create((set) => ({
	company: {},
	set_state: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const loader = async ({ request }) => {
	let { pathname, origin } = new URL(request.url);
	let entity_id = await get_user_id(request);
	let group_id = get_group_id(pathname);
	let owner_companies = await get_owner_companies_ids(entity_id);
	let shared_companies = await get_shared_companies_ids(entity_id);

	let credit_scores_api_response = await axios({
		method: "get",
		url: `${origin}/credit/report/api/scores/resource/e/${entity_id}/g/${group_id}`,
	});

	let { data: scores } = credit_scores_api_response;

	return { owner_companies, shared_companies, entity_id, scores };
};

const Members = () => {
	return (
		<div className="flex -space-x-2 overflow-hidden">
			<img
				className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
				src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt=""
			/>
			<img
				className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
				src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt=""
			/>
			<img
				className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
				src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
				alt=""
			/>
			<img
				className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
				src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt=""
			/>
		</div>
	);
};

const navigation = [
	{
		name: "Dashboard",
		href: ({ entity_id, group_id }) =>
			`/home/resource/e/${entity_id}/g/${group_id}`,
		icon: HomeIcon,
		current: true,
	},
	{
		name: "Business Credit Report",
		href: () => "#",
		icon: BriefcaseIcon,
		current: true,
	},
	{
		name: "Personal Credit Report",
		href: () => "#",
		icon: UserCircleIcon,
		current: false,
	},
	{
		name: "Cashflow",
		href: ({ entity_id, group_id }) =>
			`/financial/cashflow/resource/e/${entity_id}/g/${group_id}`,
		icon: CurrencyDollarIcon,
		current: false,
	},
	{
		name: "Vault",
		href: ({ entity_id, group_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}`,
		icon: FolderOpenIcon,
		current: false,
	},
];

const QuickLinks = () => {
	let { entity_id } = useLoaderData();
	let { group_id } = useCompanyStore((state) => state.company);

	return (
		<nav className="flex flex-1 flex-col" aria-label="Sidebar">
			<ul role="list" className="-mx-2 space-y-1">
				{navigation.map((item) => (
					<li key={item.name}>
						<Link
							to={item.href({ entity_id, group_id })}
							className={classNames(
								"text-gray-700 hover:text-blue-600 hover:bg-gray-50 group flex gap-x-2 rounded-md px-2 py-1 text-xs leading-6 font-semibold cursor-pointer"
							)}
						>
							<item.icon
								className={classNames(
									"text-gray-400 group-hover:text-blue-600 h-5 w-5 shrink-0"
								)}
								aria-hidden="true"
							/>
							{item.name}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
};

const CompayInfo = () => {
	let { scores = {} } = useLoaderData();

	let {
		experian_personal_score,
		equifax_personal_score,
		transunion_personal_score,
		experian_business_score,
		dnb_business_score,
	} = scores;

	let max_personal = pipe(reduce(max, -Infinity))([
		experian_personal_score,
		equifax_personal_score,
		transunion_personal_score,
	]);

	let max_business = pipe(reduce(max, -Infinity))([
		experian_business_score,
		dnb_business_score,
	]);

	return (
		<div className="flex flex-col bg-white border rounded overflow-hidden">
			<div className="p-5">
				<div className="flex flex-row space-x-3 items-center">
					<div>
						<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
							<span className="text-lg font-medium leading-none text-white">
								C
							</span>
						</span>
					</div>
					<div>Credit Banc</div>
				</div>
			</div>

			<div className="flex flex-col w-full overflow-scroll scrollbar-none">
				<div className="flex flex-col py-2">
					<Link
						to={`/financial/transactions`}
						className="px-5 mb-4 flex flex-row items-center space-x-3 text-blue-500 cursor-pointer text-sm"
					>
						<div>
							<DocumentDuplicateIcon className="h-4 w-4 text-blue-500" />
						</div>
						<div>Copy copmany share link</div>
						<div>
							<LinkIcon className="h-4 w-4 text-blue-500" />
						</div>
					</Link>
				</div>
				<div className="border-t"></div>
				<div className="flex flex-col w-full p-5 space-y-3">
					<div className="text-gray-400 text-sm">Credit Scores</div>
					<div className="flex flex-row">
						<div className="flex flex-col w-1/2 text-sm space-y-1">
							<div className="text-gray-400">Personal</div>
							<div className="text-lg">{max_personal}</div>
						</div>
						<div className="flex flex-col w-1/2 text-sm space-y-1">
							<div className="text-gray-400">Business</div>
							<div className="text-lg">{max_business}</div>
						</div>
					</div>
				</div>
				<div className="border-t"></div>
				<div className="flex flex-col p-5 text-sm space-y-3">
					<div className=" text-gray-400">Quick Links</div>
					<div className="flex flex-col ml-3">
						<QuickLinks />
					</div>
				</div>
				<div className="border-t"></div>
				<div className="flex flex-col p-5 text-sm space-y-2">
					<div className="text-gray-400">Members</div>
					<div className="flex flex-col space-y-2">
						<Members />
					</div>
				</div>
				<div className="border-t"></div>
				<div className="flex flex-col p-5 text-sm space-y-2">
					<div className="text-gray-400">Notes</div>
					<div className="flex flex-col w-full">
						<textarea
							rows={4}
							className="border rounded p-3"
						></textarea>
					</div>
				</div>
			</div>
		</div>
	);
};

const Company = ({ group_id }) => {
	let set_company = useCompanyStore((state) => state.set_state);

	const get_company = async (group_id) => {};

	const onSelectCompany = () => {
		set_company(["company"], { group_id });
	};

	return (
		<div
			className="flex flex-col min-w-full md:min-w-[47%] lg:min-w-[31%] xl:min-w-[23%]  h-[200px] bg-gray-50 p-5 justify-between rounded-lg shadow-sm border cursor-pointer"
			onClick={onSelectCompany}
		>
			<div className="flex flex-row justify-between items-center">
				<div>
					<FolderIcon className="w-[40px] h-[40px] text-blue-600" />
				</div>
				<div className="flex flex-col cursor-pointer bg-white p-1 rounded-full border">
					<EllipsisHorizontalIcon className="w-4 h-4 text-gray-400" />
				</div>
			</div>
			<div className="flex flex-col">
				<div className="font-semibold text-gray-600">Credit Banc</div>
			</div>
			<div className="flex flex-col">
				<div className="flex flex-row justify-between items-center">
					<div>
						<Members />
					</div>

					<div>
						<LinkIcon className="w-5 h-5 text-blue-500" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Companies() {
	let { pathname } = useLocation();
	let group_id = get_group_id(pathname);
	let { owner_companies, shared_companies } = useLoaderData();
	let company = useCompanyStore((state) => state.company);
	let set_company = useCompanyStore((state) => state.set_state);

	useEffect(() => {
		set_company(["company"], { group_id });
	}, []);

	return (
		<div className="flex flex-row w-full h-full p-5 overflow-hiddens space-x-3 overflow-hidden">
			<div className="flex flex-col w-[70%] h-full bg-white rounded px-5 overflow-y-scroll border">
				<div className="border-b border-gray-200 pb-3 flex flex-row justify-between sticky top-0 bg-white pt-5 ">
					<div>
						<h3 className="mt-2 text-base font-semibold leading-6 text-gray-900">
							Companies
						</h3>
					</div>
					<div></div>
				</div>

				<div className="flex flex-col w-full py-5  scrollbar-none">
					<div className="flex flex-row w-full items-center flex-wrap gap-y-10 justify-between xl:justify-start xl:gap-x-5">
						{pipe(
							map((group_id) => (
								<Company key={group_id} group_id={group_id} />
							))
						)(owner_companies)}
					</div>
				</div>

				<div className="border-b border-gray-200 pb-3 flex flex-row justify-between sticky top-0 pt-5 bg-white ">
					<div>
						<h3 className="mt-2 text-base font-semibold leading-6 text-gray-900">
							Shared Companies
						</h3>
					</div>
					<div></div>
				</div>

				<div className="flex flex-col w-full py-5 scrollbar-none">
					<div className="flex flex-row w-full items-center flex-wrap gap-y-10 justify-between xl:justify-start xl:gap-x-5">
						{pipe(
							map((group_id) => (
								<Company key={group_id} group_id={group_id} />
							))
						)(shared_companies)}
					</div>
				</div>
			</div>
			<div className="flex flex-col w-[30%]">
				{isEmpty(company) && (
					<div className="flex flex-col w-full h-full rounded border bg-white"></div>
				)}
				{!isEmpty(company) && <CompayInfo />}
			</div>
		</div>
	);
}
