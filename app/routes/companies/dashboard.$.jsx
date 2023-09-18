import { FolderIcon } from "@heroicons/react/20/solid";
import {
	LinkIcon,
	BriefcaseIcon,
	UserCircleIcon,
	HomeIcon,
} from "@heroicons/react/24/outline";
import { Link, useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import { isEmpty, head, identity, map, pickAll, pipe } from "ramda";
import { get, mod } from "shades";
import { get_entity, get_session_entity_id } from "~/utils/auth.server";
import { classNames, get_entity_id, get_group_id } from "~/utils/helpers";
import {
	get_owner_companies_ids,
	get_shared_companies_ids,
} from "~/api/ui/companies";
import { create } from "zustand";
import axios from "axios";
import { useEffect } from "react";
const cb_logo_3 = "/images/logos/cb_logo_3.png";
import { encode } from "js-base64";
import { get_collection, get_doc } from "~/utils/firebase";
import {
	map as rxmap,
	filter as rxfilter,
	concatMap,
	tap,
	take,
	reduce as rxreduce,
} from "rxjs/operators";
import { from, lastValueFrom, forkJoin, Subject, of as rxof } from "rxjs";
import { fold } from "~/utils/operators";
import { json } from "@remix-run/node";

const log_route = `dashboard`;

const subject = new Subject();

const $loader = subject.pipe(
	rxfilter((message) => message.id == "load"),
	concatMap(({ args: { request } }) => {
		let url = new URL(request.url);

		let group_id = rxof(get_group_id(url.pathname));
		let entity_id = from(get_session_entity_id(request));
		let entity = from(get_entity(request));

		const get_group_role_config = (group_id) =>
			from(
				get_collection({
					path: ["role_configs"],
					queries: [
						{
							param: "group_id",
							predicate: "==",
							value: group_id,
						},
					],
					limit: [1],
				})
			);

		let entity_group_id = forkJoin({ entity_id, group_id });

		let business = entity_group_id.pipe(
			concatMap(({ entity_id, group_id }) =>
				from(
					axios({
						method: "get",
						url: `${url.origin}/credit/report/business/api/company/resource/e/${entity_id}/g/${group_id}`,
						withCredentials: true,
						headers: {
							cookie: `creditbanc_session=${encode(
								JSON.stringify({ entity_id })
							)}`,
						},
					})
				)
			),
			rxmap(pipe(get("data")))
		);

		let scores = entity_group_id.pipe(
			concatMap(({ entity_id, group_id }) =>
				from(
					axios({
						method: "get",
						url: `${url.origin}/credit/report/api/scores/resource/e/${entity_id}/g/${group_id}`,
						withCredentials: true,
						headers: {
							cookie: `creditbanc_session=${encode(
								JSON.stringify({ entity_id })
							)}`,
						},
					})
				)
			),
			rxmap(pipe(get("data")))
		);

		let owner_companies = from(entity_id).pipe(
			concatMap((entity_id) => from(get_owner_companies_ids(entity_id))),
			concatMap(identity),
			concatMap((group_id) =>
				get_group_role_config(group_id).pipe(
					rxmap(pipe(head, get("entity_id"))),
					concatMap((entity_id) =>
						from(get_doc(["entity", entity_id]))
					),
					rxmap(
						pipe(
							pickAll(["first_name", "last_name", "id", "email"]),
							(entity) => ({
								...entity,
								entity_id: entity.id,
								group_id,
							})
						)
					)
				)
			),
			rxreduce((acc, curr) => [...acc, curr], [])
		);

		let shared_companies = from(entity_id).pipe(
			concatMap((entity_id) => from(get_shared_companies_ids(entity_id))),
			concatMap(identity),
			concatMap((group_id) =>
				get_group_role_config(group_id).pipe(
					rxmap(pipe(head, get("entity_id"))),
					concatMap((entity_id) =>
						from(get_doc(["entity", entity_id]))
					),
					rxmap(
						pipe(
							pickAll(["first_name", "last_name", "id", "email"]),
							(entity) => ({
								...entity,
								entity_id: entity.id,
								group_id,
							})
						)
					)
				)
			),
			rxreduce((acc, curr) => [...acc, curr], [])
		);

		return forkJoin({
			entity_id,
			group_id,
			entity,
			owner_companies,
			shared_companies,
			business,
			scores,
		}).pipe(
			tap((value) => {
				console.log(`${log_route}.tap`);
				console.log(value);
			})
		);
	})
);

export const useCompanyStore = create((set) => ({
	company: {},
	set_state: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const useCompaniesStore = create((set) => ({
	companies: {},
	set_state: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const action = async ({ request }) => {
	let url = new URL(request.url);
	let { origin } = url;
	let form = await request.formData();
	let entity_id = form.get("entity_id");
	let group_id = form.get("group_id");

	let scores = from(
		axios({
			method: "get",
			url: `${origin}/credit/report/api/scores/resource/e/${entity_id}/g/${group_id}`,
			withCredentials: true,
			headers: {
				cookie: `creditbanc_session=${encode(
					JSON.stringify({ entity_id })
				)}`,
			},
		})
	);

	let response = scores.pipe(
		rxfilter((value) => value.data !== undefined),
		rxmap(pipe(get("data")))
	);

	let $scores = await lastValueFrom(response);

	return json($scores);
};

export const loader = async ({ request }) => {
	const on_success = async (response) => {
		console.log(`${log_route}.success`);

		subject.next({
			id: "response",
			next: () => response,
		});
	};

	const on_error = (error) => {
		console.log(`${log_route}.error`);
		console.log(error);

		subject.next({
			id: "response",
			next: () => error,
		});
	};

	const on_complete = (value) => value.id === "response";

	$loader.pipe(fold(on_success, on_error)).subscribe();

	subject.next({ id: "load", args: { request } });

	let response = await lastValueFrom(
		subject.pipe(rxfilter(on_complete), take(1))
	);

	return response.next();
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
		current: false,
	},
	{
		name: "Business Credit Report",
		href: ({ entity_id, group_id }) =>
			`/credit/report/business/experian/overview/resource/e/${entity_id}/g/${group_id}`,
		icon: BriefcaseIcon,
		current: false,
	},
	{
		name: "Personal Credit Report",
		href: ({ entity_id, group_id }) =>
			`/credit/report/personal/personal/resource/e/${entity_id}/g/${entity_id}`,
		icon: UserCircleIcon,
		current: false,
	},
	// {
	// 	name: "Cashflow",
	// 	href: ({ entity_id, group_id }) =>
	// 		`/financial/cashflow/resource/e/${entity_id}/g/${group_id}`,
	// 	icon: CurrencyDollarIcon,
	// 	current: false,
	// },
	// {
	// 	name: "Vault",
	// 	href: ({ entity_id, group_id }) =>
	// 		`/vault/files/resource/e/${entity_id}/g/${group_id}`,
	// 	icon: FolderOpenIcon,
	// 	current: false,
	// },
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
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let company = useCompanyStore((state) => state.company);
	let fetcher = useFetcher();

	useEffect(() => {
		fetcher.submit(
			{ entity_id: company.entity_id, group_id: company.group_id },
			{
				method: "post",
			}
		);
	}, [company.group_id]);

	return (
		<div className="flex flex-col bg-white border rounded overflow-hidden">
			<div className="p-5">
				<div className="flex flex-row space-x-3 mt-1">
					<div>
						<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
							<span className="text-lg font-medium leading-none text-white">
								{company?.first_name?.charAt(0)?.toUpperCase()}
							</span>
						</span>
					</div>
					<div className="flex flex-col">
						<div className="flex flex-row font-semibold gap-x-1">
							<div>{company.first_name}</div>
							<div>{company.last_name}</div>
						</div>
						<div className="text-sm">{company.email}</div>
					</div>
					{/* <div>{business?.name}</div> */}
				</div>
			</div>

			<div className="flex flex-col w-full overflow-scroll scrollbar-none">
				{/* <div className="flex flex-col py-2">
					<Link
						to={`/financial/transactions`}
						className="px-5 mb-4 flex flex-row items-center space-x-3 text-blue-500 cursor-pointer text-sm"
					>
						<div>
							<DocumentDuplicateIcon className="h-4 w-4 text-blue-500" />
						</div>
						<div>Copy company share link</div>
						<div>
							<LinkIcon className="h-4 w-4 text-blue-500" />
						</div>
					</Link>
				</div> */}
				<div className="border-t"></div>
				<div className="flex flex-col w-full p-5 space-y-3">
					<div className="text-gray-400 text-sm">
						Business Credit Scores
					</div>
					<div className="flex flex-row">
						<div className="flex flex-col w-1/2 text-sm space-y-1">
							<div className="text-gray-400">Intelliscore</div>
							<div className="text-lg">
								{fetcher?.data?.experian_business_score}
							</div>
						</div>
						<div className="flex flex-col w-1/2 text-sm space-y-1">
							<div className="text-gray-400">D&B</div>
							<div className="text-lg">
								{fetcher?.data?.dnb_business_score}
							</div>
						</div>
					</div>
				</div>
				<div className="border-t"></div>
				<div className="flex flex-col w-full p-5 space-y-3">
					<div className="text-gray-400 text-sm">
						Personal Credit Scores
					</div>
					<div className="flex flex-row">
						<div className="flex flex-col w-1/3 text-sm space-y-1">
							<div className="text-gray-400">Equifax</div>
							<div className="text-lg">
								{fetcher?.data?.equifax_personal_score}
							</div>
						</div>
						<div className="flex flex-col w-1/3 text-sm space-y-1">
							<div className="text-gray-400">Experian</div>
							<div className="text-lg">
								{fetcher?.data?.experian_personal_score}
							</div>
						</div>
						<div className="flex flex-col w-1/3 text-sm space-y-1">
							<div className="text-gray-400">Transunion</div>
							<div className="text-lg">
								{fetcher?.data?.transunion_personal_score}
							</div>
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
				{/* <div className="border-t"></div>
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
				</div> */}
			</div>
		</div>
	);
};

const Company = ({ company = {} }) => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let set_company = useCompanyStore((state) => state.set_state);
	let set_companies = useCompaniesStore((state) => state.set_state);
	// let company = useCompaniesStore((state) => state.companies[group_id]) ?? {};

	const onSelectCompany = async () => {
		console.log("onSelectCompany");
		console.log(company);
		set_company(["company"], company);
	};

	return (
		<div
			className="flex flex-col  min-w-full max-w-full sm:min-w-[250px] sm:max-w-[250px] h-[250px] bg-gray-50 p-5 justify-between rounded-lg shadow-sm border cursor-pointer"
			onClick={onSelectCompany}
		>
			<div className="flex flex-row justify-between items-center">
				<div>
					<FolderIcon className="w-[40px] h-[40px] text-blue-600" />
				</div>
				<div className="flex flex-col cursor-pointer bg-white p-1 rounded-full ">
					<LinkIcon className="w-5 h-5 text-blue-500" />
					{/* <EllipsisHorizontalIcon className="w-4 h-4 text-gray-400" /> */}
				</div>
			</div>
			<div className="flex flex-col">
				<div className="flex flex-row font-semibold text-gray-600 space-x-1">
					<div>{company.first_name}</div>
					<div>{company.last_name}</div>
				</div>
				<div className="text-sm">{company.email}</div>
			</div>
			{/* <div className="flex flex-col">
				<div className="flex flex-row justify-between items-center">
					<div>
						<Members />
					</div>

					<div>
						<LinkIcon className="w-5 h-5 text-blue-500" />
					</div>
				</div>
			</div> */}
		</div>
	);
};

const Loading = () => {
	return (
		<div className="h-full w-full flex flex-col items-center justify-center">
			<div className="w-1/2 flex flex-col">
				<div className="flex flex-col items-center my-5">
					<img src={cb_logo_3} />
				</div>
				<div className="flex flex-row items-center justify-center">
					<div>
						<svg
							className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="green"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="green"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					</div>
					<div>Loading...</div>
				</div>
			</div>
		</div>
	);
};

export default function Companies() {
	let { pathname } = useLocation();
	let group_id = get_group_id(pathname);
	let {
		owner_companies,
		shared_companies,
		scores = {},
		business = {},
	} = useLoaderData();
	let company = useCompanyStore((state) => state.company);
	let set_company = useCompanyStore((state) => state.set_state);

	useEffect(() => {
		set_company(["company"], {
			group_id,
			scores,
			business,
			...owner_companies[0],
		});
	}, []);

	return (
		<div className="flex flex-row w-full h-full p-5 overflow-hiddens space-x-3 overflow-hidden mb-[60px]">
			<div className="flex flex-col w-full lg:w-[70%] h-full bg-white rounded px-5 overflow-y-scroll border scrollbar-none ">
				<div className="border-b border-gray-200 pb-3 flex flex-row justify-between sticky top-0 bg-white pt-5 ">
					<div>
						<h3 className="mt-2 text-base font-semibold leading-6 text-gray-900">
							Companies
						</h3>
					</div>
					<div></div>
				</div>

				<div className="flex flex-col w-full py-5  scrollbar-none">
					<div className="flex flex-row w-full items-center flex-wrap gap-y-10 justify-start gap-x-5">
						{pipe(
							map((company) => (
								<Company
									key={company.entity_id}
									company={company}
								/>
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
					<div className="flex flex-row w-full items-center flex-wrap gap-y-10 justify-start gap-x-5">
						{pipe(
							map((company) => (
								<Company
									key={company.entity_id}
									company={company}
								/>
							))
						)(shared_companies)}
					</div>
				</div>
			</div>
			<div className="hidden lg:flex flex-col w-[30%]">
				{isEmpty(company) && (
					<div className="flex flex-col w-full h-full rounded border bg-white items-center justify-center">
						<Loading />
					</div>
				)}
				{!isEmpty(company) && <CompayInfo />}
			</div>
		</div>
	);
}
