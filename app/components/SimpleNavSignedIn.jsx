import { Fragment, useEffect, useRef } from "react";
import { Link, useLocation, useSearchParams } from "@remix-run/react";
const cb_logo = "/images/logos/cb_logo_3.png";
import UserAccountNavMenu from "./UserAccountNavMenu";
import { capitalize, classNames, get_entity_id, get_group_id, is_location, mapIndexed, store } from "~/utils/helpers";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { always, equals, head, includes, isEmpty, map, not, pipe, prop, set, take, tryCatch, uniqBy } from "ramda";
import {
	BellIcon,
	ChatBubbleLeftEllipsisIcon,
	ChatBubbleOvalLeftEllipsisIcon,
	CheckIcon,
	Cog6ToothIcon,
	EyeIcon,
	LinkIcon,
	PlusIcon,
	UsersIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { all, filter, get, mod } from "shades";
import { create } from "zustand";
import copy from "copy-to-clipboard";
import Share from "~/routes/invites/new/$.jsx";
import Modal from "~/components/Modal";
import { useModalStore } from "~/hooks/useModal";
import CacheLink from "./CacheLink";
import { ChatBubbleLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import Notification, { notifications_map } from "~/components/Notifications";

let use_notifications_store = store({ notifications: [] });

export const useRolesStore = create((set) => ({
	roles: false,
	set_roles: (path, value) => set((state) => pipe(mod(...path)(() => value))(state)),
}));

const CompaniesDropdown = ({ companies: all_companies = {} }) => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let { shared_companies = [], owner_companies = [] } = all_companies;
	let companies = pipe(uniqBy(prop("id")))([...shared_companies, ...owner_companies]);
	let company = pipe(filter({ group_id }), head)(companies);

	return (
		<Menu as="div" className="relative inline-block text-left z-50">
			<div>
				<Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100">
					{capitalize(company?.legal_name) ||
						`${capitalize(company.first_name)} ${capitalize(company.last_name)}`}
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
				<Menu.Items className="absolute left-0 z-50 mt-2  origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
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
												<div>{company?.legal_name || company?.email}</div>
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
	{
		name: "Cashflow",
		href: ({ entity_id, group_id }) =>
			`/financial/cashflow/resource/e/${entity_id}/g/${group_id}?rand=${Math.random()}`,
		current: (pathname) => is_location("/financial", pathname),
	},
	{
		name: "Vault",
		href: ({ entity_id, group_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents?rand=${Math.random()}`,
		current: (pathname) => is_location("/vault", pathname),
	},
	{
		name: "University",
		href: ({ entity_id, group_id }) => `/university/courses`,
		current: (pathname) => is_location("/university", pathname),
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
		<Menu as="div" className="lg:flex flex-col relative text-left">
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
				<Menu.Items className="absolute right-0 z-20 mt-[40px] w-[300px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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

const discussions = [
	{
		id: 1,
		title: "Atque perspiciatis et et aut ut porro voluptatem blanditiis?",
		href: "#",
		author: { name: "Leslie Alexander", href: "#" },
		date: "2d ago",
		dateTime: "2023-01-23T22:34Z",
		status: "active",
		totalComments: 24,
		commenters: [
			{
				id: 12,
				name: "Emma Dorsey",
				imageUrl:
					"https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
			{
				id: 6,
				name: "Tom Cook",
				imageUrl:
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
			{
				id: 4,
				name: "Lindsay Walton",
				imageUrl:
					"https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
			{
				id: 16,
				name: "Benjamin Russel",
				imageUrl:
					"https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
			{
				id: 23,
				name: "Hector Gibbons",
				imageUrl:
					"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
		],
	},
	{
		id: 2,
		title: "Et ratione distinctio nesciunt recusandae vel ab?",
		href: "#",
		author: { name: "Michael Foster", href: "#" },
		date: "2d ago",
		dateTime: "2023-01-23T19:20Z",
		status: "active",
		totalComments: 6,
		commenters: [
			{
				id: 13,
				name: "Alicia Bell",
				imageUrl:
					"https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
			{
				id: 16,
				name: "Benjamin Russel",
				imageUrl:
					"https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
			{
				id: 3,
				name: "Dries Vincent",
				imageUrl:
					"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
		],
	},
	{
		id: 3,
		title: "Blanditiis perferendis fugiat optio dolor minus ut?",
		href: "#",
		author: { name: "Dries Vincent", href: "#" },
		date: "3d ago",
		dateTime: "2023-01-22T12:59Z",
		status: "resolved",
		totalComments: 22,
		commenters: [
			{
				id: 19,
				name: "Lawrence Hunter",
				imageUrl:
					"https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
			{
				id: 21,
				name: "Angela Fisher",
				imageUrl:
					"https://images.unsplash.com/photo-1501031170107-cfd33f0cbdcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
			{
				id: 14,
				name: "Jenny Wilson",
				imageUrl:
					"https://images.unsplash.com/photo-1507101105822-7472b28e22ac?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
			{
				id: 16,
				name: "Benjamin Russel",
				imageUrl:
					"https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
		],
	},
	{
		id: 4,
		title: "Voluptatum ducimus voluptatem qui in eum quasi consequatur vel?",
		href: "#",
		author: { name: "Lindsay Walton", href: "#" },
		date: "5d ago",
		dateTime: "2023-01-20T10:04Z",
		status: "resolved",
		totalComments: 8,
		commenters: [
			{
				id: 10,
				name: "Emily Selman",
				imageUrl:
					"https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
			{
				id: 11,
				name: "Kristin Watson",
				imageUrl:
					"https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
		],
	},
	{
		id: 5,
		title: "Perferendis cum qui inventore ut excepturi nostrum occaecati?",
		href: "#",
		author: { name: "Courtney Henry", href: "#" },
		date: "5d ago",
		dateTime: "2023-01-20T20:12Z",
		status: "active",
		totalComments: 15,
		commenters: [
			{
				id: 11,
				name: "Kristin Watson",
				imageUrl:
					"https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
			{
				id: 6,
				name: "Tom Cook",
				imageUrl:
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
			{
				id: 10,
				name: "Emily Selman",
				imageUrl:
					"https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
			{
				id: 16,
				name: "Benjamin Russel",
				imageUrl:
					"https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
			},
		],
	},
];

const NotificationsHeading = ({ children }) => {
	return (
		<div className="border-b border-gray-100 bg-white px-3 py-4 flex flex-row justify-between">
			<h3 className="text-base font-semibold leading-6 text-gray-900">Notifications</h3>
			{children}
		</div>
	);
};

const NotificationsFooter = () => {
	return (
		<div className="border-t border-gray-100 bg-white px-3 py-4">
			<div className="flex flex-row items-center text-sm gap-x-2">
				<div className="flex flex-row">
					<div>
						<CheckIcon className="h-4 w-4 text-blue-400" />
					</div>
					<div className="-ml-2">
						<CheckIcon className="h-4 w-4 text-blue-400" />
					</div>
				</div>
				<div>Mark all as read</div>
			</div>
		</div>
	);
};

const NotificationsList = () => {
	let notifications = use_notifications_store((state) => state.notifications);

	return (
		<ul role="list" className="divide-y divide-gray-100 ">
			{discussions.map((notification) => (
				<li
					key={notification?.id}
					className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap"
				>
					<div>
						<p className="text-sm font-semibold leading-6 text-gray-900">
							<a className="hover:underline">{notification?.title}</a>
						</p>
						<div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
							<p>
								<a href={notification?.author?.href} className="hover:underline">
									{notification?.author?.name}
								</a>
							</p>
							<svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
								<circle cx={1} cy={1} r={1} />
							</svg>
							<p>
								<time dateTime={notification?.dateTime}>{notification?.date}</time>
							</p>
						</div>
					</div>
					<dl className="flex w-full flex-none justify-between gap-x-8 sm:w-auto">
						<div className="flex -space-x-0.5">
							<dt className="sr-only">Commenters</dt>
							{notification?.commenters?.map((commenter) => (
								<dd key={commenter?.id}>
									<img
										className="h-6 w-6 rounded-full bg-gray-50 ring-2 ring-white"
										src={commenter?.imageUrl}
										alt={commenter?.name}
									/>
								</dd>
							))}
						</div>
						<div className="flex w-16 gap-x-2.5">
							<dt>
								<span className="sr-only">Total comments</span>
								{notification?.status === "resolved" ? (
									<CheckCircleIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
								) : (
									<ChatBubbleLeftIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
								)}
							</dt>
							<dd className="text-sm leading-6 text-gray-900">{notification?.totalComments}</dd>
						</div>
					</dl>
				</li>
				// <Notification notification={notification} />
			))}
		</ul>
	);
};

const NotificationsDropdown = () => {
	let notifications = use_notifications_store((state) => state.notifications);
	let notification_button_ref = useRef(null);

	console.log("notifications_____");
	console.log(notifications);

	const onCloseNotifications = () => {
		notification_button_ref.current?.click();
	};

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button
					className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
					ref={notification_button_ref}
				>
					<BellIcon className="h-6 w-6 text-gray-500" />
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
				<Menu.Items className="absolute right-0 z-10 mt-1 w-[500px] max-h-[450px] overflow-y-scroll origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none scrollbar-none">
					<div className="sticky top-0">
						<NotificationsHeading>
							<div className="border rounded-lg p-1 cursor-pointer" onClick={onCloseNotifications}>
								<XMarkIcon className="h-4 w-4 text-gray-500" />
							</div>
						</NotificationsHeading>
					</div>
					<div className="py-1 px-6">
						<NotificationsList />
					</div>
					<div className="sticky bottom-0">
						<NotificationsFooter />
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

export default function Nav({ entity_id, roles, companies, notifications = [] }) {
	let location = useLocation();
	let group_id = get_group_id(location.pathname);
	let { pathname } = location;
	let is_companies_dashboard = is_location("/companies/dashboard", pathname);
	let { set_props: set_notifications } = use_notifications_store((state) => state);

	let set_roles = useRolesStore((state) => state.set_roles);

	useEffect(() => {
		set_roles(["roles"], roles);
	}, [roles]);

	useEffect(() => {
		if (!isEmpty(notifications)) {
			set_notifications({ notifications });
		}
	}, [notifications]);

	const Nav = () => {
		return (
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
		);
	};

	return (
		<div className="flex flex-col w-full lg:h-[65px] justify-center">
			<Modal id="share_modal">
				<div className="flex flex-col bg-white rounded-lg w-full lg:w-[600px] p-[20px]">
					<Share session_entity_id={entity_id} roles={roles} />
				</div>
			</Modal>
			<div className="flex flex-row justify-between px-5">
				<div className="hidden sm:flex flex-col justify-center w-[150px]">
					<Link to={`/home/resource/e/${entity_id}/g/${group_id}?rand=${Math.random()}`}>
						<img src={cb_logo} className="block h-5 w-auto" />
					</Link>
				</div>

				<div className="flex flex-row flex-1 justify-between lg:items-center mt-1">
					<div className="">
						<CompaniesDropdown companies={companies} />
					</div>
					<div className="hidden lg:flex flex-col justify-center">{!is_companies_dashboard && <Nav />}</div>
					<div className="flex flex-row items-center space-x-3">
						{!is_location("/companies/dashboard", pathname) && (
							<div className="hidden lg:flex flex-col">
								<ShareDropdown session_entity_id={entity_id} />
							</div>
						)}

						<div className="flex flex-row">
							<div className="flex flex-col hover:bg-gray-50 px-3 py-2 rounded-md cursor-pointer">
								<ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-gray-500" />
							</div>

							<div className="flex flex-col">
								<NotificationsDropdown notifications={notifications} />
							</div>
						</div>
					</div>
				</div>

				{entity_id && (
					<div className="flex flex-col items-center w-[50px] justify-center">
						<UserAccountNavMenu />
					</div>
				)}
			</div>
			<div className="flex flex-col w-full lg:hidden items-center py-2 border-t">
				<div className="flex w-full flex-row justify-between px-5">
					<div>
						<Nav />
					</div>
					<div className="flex flex-col w-[150px]">
						<ShareDropdown />
					</div>
				</div>
			</div>
		</div>
	);
}
