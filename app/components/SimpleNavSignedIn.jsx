import { Fragment, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "@remix-run/react";
const cb_logo = "/images/logos/cb_logo_3.png";
import UserAccountNavMenu from "./UserAccountNavMenu";
import { classNames, get_entity_id, get_group_id, is_location, mapIndexed } from "~/utils/helpers";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { always, equals, includes, isEmpty, map, not, pipe, prop, set, tryCatch, uniqBy } from "ramda";
import {
	ChatBubbleLeftEllipsisIcon,
	Cog6ToothIcon,
	EyeIcon,
	LinkIcon,
	PlusIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";
import { all, get, mod } from "shades";
import { create } from "zustand";
import copy from "copy-to-clipboard";
import Share from "~/routes/invites/new/$.jsx";
import Modal from "~/components/Modal";
import { useModalStore } from "~/hooks/useModal";
import CacheLink from "./CacheLink";

export const useRolesStore = create((set) => ({
	roles: false,
	set_roles: (path, value) => set((state) => pipe(mod(...path)(() => value))(state)),
}));

const Companies = ({ companies: all_companies = {} }) => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let { shared_companies, owner_companies } = all_companies;
	let companies = pipe(uniqBy(prop("id")))([...shared_companies, ...owner_companies]);

	return (
		<Menu as="div" className="relative inline-block text-left z-50">
			<div>
				<Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100">
					Companies
					<ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute left-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
					<div className="py-1">
						<Menu.Item className="border-b">
							{({ active }) => (
								<Link
									to={`/companies/dashboard/resource/e/${entity_id}/g/${group_id}`}
									className={classNames(
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									All Companies
								</Link>
							)}
						</Menu.Item>
						{pipe(
							map((company) => (
								<Menu.Item key={company.id} className="border-b last:border-b-0">
									{({ active }) => (
										<Link
											to={`/home/resource/e/${company.id}/g/${company.group_id}`}
											className={classNames(
												active ? "bg-gray-100 text-gray-900" : "text-gray-700",
												"block px-4 py-2 text-sm"
											)}
										>
											<div className="flex flex-col">
												<div className="flex flex-row gap-x-1 font-semibold">
													<div>{company.first_name}</div>
													<div>{company.last_name}</div>
												</div>
												<div>{company.email}</div>
											</div>
										</Link>
									)}
								</Menu.Item>
							))
						)(companies)}
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

// let navigation = [
// 	{
// 		name: "Cashflow",
// 		href: ({ entity_id, group_id }) =>
// 			`/financial/cashflow/resource/e/${entity_id}/g/${group_id}`,
// 		current: (pathname) => is_location("/financial", pathname),
// 	},
// 	{
// 		name: "Vault",
// 		href: ({ entity_id, group_id }) =>
// 			`/vault/files/resource/e/${entity_id}/g/${group_id}`,
// 		current: (pathname) => is_location("/vault", pathname),
// 	},
// 	{
// 		name: "University",
// 		href: ({ entity_id, group_id }) =>
// 			`/university/courses/resource/e/${entity_id}/g/${group_id}`,
// 		current: (pathname) => is_location("/university", pathname),
// 	},
// ];

let navigation = [
	{
		name: "Business",
		href: ({ entity_id, group_id }) =>
			`/credit/report/business/experian/status/resource/e/${entity_id}/g/${group_id}?rand=${Math.random()}`,
		current: (pathname) => is_location("/credit/report/business/experian", pathname),
	},
	// {
	// 	name: "Dun & Bradstreet",
	// 	href: ({ entity_id, group_id }) => `/credit/report/business/dnb/overview/resource/e/${entity_id}/g/${group_id}`,
	// 	current: (pathname) => is_location("/credit/report/business/dnb", pathname),
	// },
	{
		name: "Personal",
		href: ({ entity_id, group_id }) =>
			`/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}?rand=${Math.random()}`,
		current: (pathname) => is_location("/credit/report/personal", pathname),
	},
];

const ShareDropdown = () => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let roles = useRolesStore((state) => state.roles);
	let set_modal = useModalStore((state) => state.set_modal);

	let can_manage_roles = tryCatch(pipe(get(all, "name"), includes("@administrator")), always(false))(roles);

	let can_share = pipe(equals(false), not)(roles);

	const onCopyShareLink = (config_id, e) => {
		e.preventDefault();
		let { origin } = window.location;
		copy(`${origin}/links/resource/e/${entity_id}/g/${group_id}?config_id=${config_id}`);
	};

	const onShareModal = (e) => {
		set_modal({
			is_open: true,
			id: "share_modal",
		});
	};

	if (!can_share) {
		return <div></div>;
	}

	if (!can_manage_roles && can_share) {
		return (
			<div className="flex flex-row divide-x bg-blue-600 text-white rounded-full px-3 py-1.5 text-sm cursor-pointer space-x-3">
				<div className="flex flex-col w-full items-center " onClick={onShareModal}>
					<div className="flex flex-row space-x-2">
						<div>
							<UsersIcon className="h-5 w-5 text-white" />
						</div>
						<div>Share</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div className="flex flex-row divide-x bg-blue-600 text-white rounded-full px-3 py-1.5 text-sm cursor-pointer space-x-3">
				<div className="flex flex-col w-full items-center " onClick={onShareModal}>
					<div className="flex flex-row space-x-2">
						<div>
							<UsersIcon className="h-5 w-5 text-white" />
						</div>
						<div>Share</div>
					</div>
				</div>
				<Menu.Button className="flex flex-row items-center pl-1">
					<ChevronDownIcon className="h-5 w-5 text-white" />
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<Link
							to={`/roles/resource/e/${entity_id}/g/${group_id}`}
							className={classNames("hover:bg-gray-100 hover:text-gray-900 text-gray-700 block text-sm")}
						>
							<div className="flex flex-row justify-between items-center cursor-pointer border-b px-4 py-2">
								<div>Manage Roles</div>
								<div className="flex flex-row space-x-5">
									<div>
										<EyeIcon className="h-4 w-4 text-gray-400" />
									</div>
								</div>
							</div>
						</Link>

						{pipe(
							mapIndexed((role) => (
								<Menu.Item key={role.id}>
									{({ active }) => (
										<div
											className={classNames(
												active ? "bg-gray-100 text-gray-900" : "text-gray-700",
												"block px-4 py-2 text-sm"
											)}
										>
											<div
												className="flex flex-row justify-between items-center"
												// to={`/role/${role.id}/permissions/resource/e/${entity_id}/g/${group_id}`}
											>
												<div>{role.name}</div>
												<div className="flex flex-row space-x-5">
													<div
														className="cursor-pointer"
														onClick={(e) => onCopyShareLink(role.id, e)}
													>
														<LinkIcon
															className={`h-4 w-4 hover:text-blue-600 text-gray-400`}
														/>
													</div>
													<Link
														to={`/role/${role.id}/permissions/resource/e/${entity_id}/g/${group_id}`}
														className="cursor-pointer"
													>
														<Cog6ToothIcon
															className={`h-4 w-4 hover:text-blue-600 text-gray-400`}
														/>
													</Link>
												</div>
											</div>
										</div>
									)}
								</Menu.Item>
							))
						)(roles)}
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

const CreditDropdown = () => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button
					className={`flex flex-row px-4 py-2 rounded-full cursor-pointer hover:bg-gray-100 ${
						is_location("credit", pathname) && "bg-gray-100"
					}`}
				>
					Credit
					<ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute left-[-50%] z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<Link
									to={`/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}`}
									className={classNames(
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									Personal
								</Link>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<Link
									to={`/credit/report/business/experian/overview/resource/e/${entity_id}/g/${group_id}`}
									className={classNames(
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									Intelliscore
								</Link>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<Link
									to={`/credit/report/business/dnb/overview/resource/e/${entity_id}/g/${group_id}`}
									className={classNames(
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									Dun & Bradstreet
								</Link>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

export default function Nav({ entity_id, roles, companies }) {
	let location = useLocation();
	let group_id = get_group_id(location.pathname);
	let { pathname } = location;
	let is_companies_dashboard = is_location("/companies/dashboard", pathname);

	let set_roles = useRolesStore((state) => state.set_roles);

	useEffect(() => {
		set_roles(["roles"], roles);
	}, [roles]);

	return (
		<div className="flex flex-col w-full h-[65px] justify-center px-5">
			<Modal id="share_modal">
				<Share session_entity_id={entity_id} roles={roles} />
			</Modal>
			<div className="flex flex-row justify-between">
				<div className="flex flex-col justify-center w-[150px]">
					<Link to={`/home/resource/e/${entity_id}/g/${group_id}?rand=${Math.random()}`}>
						<img src={cb_logo} className="hidden sm:block h-5 w-auto" />
					</Link>
				</div>

				<div className="flex flex-row flex-1 justify-between  items-center mt-1">
					<div className="">
						<Companies companies={companies} />
					</div>
					<div className="flex flex-col justify-center">
						{!is_companies_dashboard && (
							<div className="flex flex-row space-x-3 text-xs lg:text-sm">
								{/* <CreditDropdown /> */}
								{pipe(
									mapIndexed((item, key) => (
										<CacheLink
											to={item.href({
												entity_id: entity_id,
												group_id: get_group_id(pathname),
											})}
											key={key}
											className={`px-4 py-2 rounded-full cursor-pointer hover:bg-gray-100 ${
												item.current(pathname) && "bg-gray-100"
											}`}
										>
											{item.name}
										</CacheLink>
									))
								)(navigation)}
							</div>
						)}
					</div>
					<div className="flex flex-row items-center space-x-3">
						{/* <div>
							<div className="flex -space-x-1 overflow-hidden">
								<img
									className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
									src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									alt=""
								/>
								<img
									className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
									src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									alt=""
								/>
								<img
									className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
									src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
									alt=""
								/>
								<img
									className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
									src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									alt=""
								/>
							</div>
						</div> */}
						{!is_location("/companies/dashboard", pathname) && (
							<ShareDropdown session_entity_id={entity_id} />
						)}

						{/* <Link
							to={`/chat/resource/e/${entity_id}/g/${group_id}?rand=${Math.random()}`}
							className=" bg-gray-100 flex flex-col items-center rounded-full p-2 cursor-pointer relative"
						>
							<div className="absolute -top-2 left-0 text-xs">
								<div className="flex flex-col bg-red-500 rounded-full text-white h-4 w-4 items-center justify-center">
									1
								</div>
							</div>
							<ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-gray-500" />
						</Link> */}
					</div>
				</div>

				{entity_id && (
					<div className="flex flex-col items-center w-[50px] justify-center">
						<UserAccountNavMenu />
					</div>
				)}
			</div>
		</div>
	);
}
