import { Fragment, useEffect } from "react";
import { Link, useSearchParams } from "@remix-run/react";
const cb_logo = "/images/logos/cb_logo_3.png";
import UserAccountNavMenu from "./UserAccountNavMenu";
import { classNames, mapIndexed } from "~/utils/helpers";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { map, pipe, set } from "ramda";
import {
	ChatBubbleLeftEllipsisIcon,
	Cog6ToothIcon,
	EyeIcon,
	LinkIcon,
	PlusIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";
import { get_collection } from "~/utils/firebase";
import { mod } from "shades";
import { create } from "zustand";

export const useRolesStore = create((set) => ({
	roles: [],
	set_roles: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

const Companies = () => {
	return (
		<Menu as="div" className="relative inline-block text-left z-50">
			<div>
				<Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 text-sm font-semibold text-gray-900  hover:bg-gray-50">
					Companies
					<ChevronDownIcon
						className="-mr-1 h-5 w-5 text-gray-400"
						aria-hidden="true"
					/>
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
				<Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<Link
									to={`/companies/dashboard`}
									className={classNames(
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									All Companies
								</Link>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<a
									href="#"
									className={classNames(
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									Support
								</a>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<a
									href="#"
									className={classNames(
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									License
								</a>
							)}
						</Menu.Item>
						<form method="POST" action="#">
							<Menu.Item>
								{({ active }) => (
									<button
										type="submit"
										className={classNames(
											active
												? "bg-gray-100 text-gray-900"
												: "text-gray-700",
											"block w-full px-4 py-2 text-left text-sm"
										)}
									>
										Sign out
									</button>
								)}
							</Menu.Item>
						</form>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

let navigation = [
	{ name: "Credit", href: "#", current: true },
	{ name: "Cashflow", href: "/financial/cashflow", current: false },
	{ name: "Vault", href: "/vault/files", current: false },
	{ name: "University", href: "/university/courses", current: false },
];

const ShareDropdown = () => {
	let roles = useRolesStore((state) => state.roles);

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="flex flex-row items-center space-x-2 bg-blue-600 text-white rounded-full px-3 py-1.5 text-sm cursor-pointer">
					<div>
						<UsersIcon className="h-5 w-5 text-white" />
					</div>
					<div>Share</div>
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
				<Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<Link
							to={`/roles/e/1/g/1`}
							className={classNames(
								"hover:bg-gray-100 hover:text-gray-900 text-gray-700 block text-sm"
							)}
						>
							<div className="flex flex-row justify-between items-center cursor-pointer border-b px-4 py-2">
								<div>View Roles</div>
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
												active
													? "bg-gray-100 text-gray-900"
													: "text-gray-700",
												"block px-4 py-2 text-sm"
											)}
										>
											<div className="flex flex-row justify-between items-center">
												<div>{role.name}</div>
												<div className="flex flex-row space-x-5">
													<div className="cursor-pointer">
														<LinkIcon
															className={`h-4 w-4 hover:text-blue-600 text-gray-400`}
														/>
													</div>
													<Link
														to={`/role/1/permissions`}
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

export default function Nav({ user_id }) {
	let set_roles = useRolesStore((state) => state.set_roles);

	useEffect(() => {
		// let roles = get_collection({path: ['role_configs'], queries: [{where: ['user_id', '==', user_id]}]})

		const get_roles = async () => {
			console.log("get_roles");
			let roles_response = await get_collection({
				path: ["role_configs"],
				queries: [
					{ param: "entity_id", predicate: "==", value: user_id },
					{ param: "group_id", predicate: "==", value: "1" },
				],
			});

			console.log("roles_response");
			console.log(roles_response);

			set_roles(["roles"], roles_response);
		};

		get_roles();
	}, []);

	return (
		<div className="flex flex-col w-full  h-[65px] justify-center px-5">
			<div className="flex flex-row justify-between">
				<div className="flex flex-col justify-center w-[150px]">
					<Link to={"/"}>
						<img
							src={cb_logo}
							className="hidden sm:block h-5 w-auto"
						/>
					</Link>
				</div>

				<div className="flex flex-row flex-1 justify-between  items-center mt-1 pr-5">
					<div className="">
						<Companies />
					</div>
					<div className="flex flex-col justify-center">
						<div className="flex flex-row space-x-3 text-xs lg:text-sm">
							{pipe(
								mapIndexed((item, key) => (
									<Link
										to={item.href}
										key={key}
										className={`px-4 py-2 rounded-full cursor-pointer hover:bg-gray-100 ${
											item.current && "bg-gray-100"
										}`}
									>
										{item.name}
									</Link>
								))
							)(navigation)}
						</div>
					</div>
					<div className="flex flex-row items-center space-x-3">
						<div>
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
						</div>
						<ShareDropdown />
						{/* <div className="flex flex-row items-center space-x-2 bg-blue-600 text-white rounded-full px-3 py-1.5 text-sm cursor-pointer">
							<div>
								<UsersIcon className="h-5 w-5 text-white" />
							</div>
							<div>Share</div>
						</div> */}
						<Link
							to={`/chat`}
							className=" bg-gray-100 flex flex-col items-center rounded-full p-2 cursor-pointer relative"
						>
							<div className="absolute -top-2 left-0 text-xs">
								<div className="flex flex-col bg-red-500 rounded-full text-white h-4 w-4 items-center justify-center">
									1
								</div>
							</div>
							<ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-gray-500" />
						</Link>
					</div>
				</div>

				{user_id && (
					<div className="flex flex-col items-center w-[50px] justify-center">
						<UserAccountNavMenu />
					</div>
				)}
			</div>
		</div>
	);
}
