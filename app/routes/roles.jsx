import { Outlet, useLoaderData } from "@remix-run/react";
import SimpleNavSignedIn from "~/components/SimpleNavSignedIn";
import { get_user_id } from "~/utils/auth.server";
import { classNames, mapIndexed } from "~/utils/helpers";
import {
	EllipsisHorizontalIcon,
	LinkIcon,
	PlusIcon,
	TrashIcon,
	UserIcon,
	UserPlusIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useModalStore } from "~/hooks/useModal";
import Modal from "~/components/Modal";
import { delete_doc, get_collection, set_doc } from "~/utils/firebase";
import { isEmpty, pipe } from "ramda";
import { create } from "zustand";
import { mod } from "shades";
import { v4 as uuidv4 } from "uuid";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

export const useRoleStore = create((set) => ({
	role: {},
	set_role: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const loader = async ({ request }) => {
	let entity_id = await get_user_id(request);

	console.log("entity_id");
	console.log(entity_id);

	let roles = await get_collection({
		path: ["role_configs"],
		queries: [
			{
				param: "entity_id",
				predicate: "==",
				value: entity_id,
			},
		],
	});

	// console.log("roles");
	// console.log(roles);

	return { entity_id, roles };
};

const role_tabs = [
	{ name: "Config", href: "/roles/permissions", current: true },
	{ name: "Members", href: "#", current: false },
];

const RoleNav = () => {
	return (
		<div>
			<div className="sm:hidden bg-white">
				<select
					id="tabs"
					name="tabs"
					className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
					defaultValue={role_tabs.find((tab) => tab.current).name}
				>
					{role_tabs.map((tab) => (
						<option key={tab.name}>{tab.name}</option>
					))}
				</select>
			</div>
			<div className="hidden sm:flex sm:flex-row bg-white px-5 border-b border-gray-200">
				<div className="flex flex-row justify-between w-full items-center">
					<nav className="-mb-px flex space-x-5" aria-label="Tabs">
						{role_tabs.map((tab) => (
							<a
								key={tab.name}
								href={tab.href}
								className={classNames(
									tab.current
										? "border-blue-500 text-blue-600"
										: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
									" border-b-2 py-2 px-1 text-center text-sm "
								)}
								aria-current={tab.current ? "page" : undefined}
							>
								{tab.name}
							</a>
						))}
					</nav>
					<div className="flex flex-row text-sm items-center space-x-3 text-blue-600 cursor-pointer">
						<div>Copy share link</div>
						<div>
							<LinkIcon className="h-4 w-4 text-blue-600" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const EmptyRolesState = () => {
	let set_modal = useModalStore((state) => state.set_modal);

	const onCreateNewRoleModal = () => {
		set_modal({ id: "new_role_modal", is_open: true });
	};

	return (
		<div className="text-center border-dashed p-3 py-5 border-2 rounded">
			<UserPlusIcon className="h-8 w-8 text-gray-400 mx-auto" />
			<h3 className="mt-2 text-sm font-semibold text-gray-900">
				No roles yet
			</h3>
			<p className="mt-1 text-sm text-gray-500">
				Get started by creating a new role.
			</p>
			<div className="mt-6">
				<button
					type="button"
					className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
					onClick={onCreateNewRoleModal}
				>
					<PlusIcon
						className="-ml-0.5 mr-1.5 h-5 w-5"
						aria-hidden="true"
					/>
					New Role
				</button>
			</div>
		</div>
	);
};

const RoleActions = ({ role }) => {
	const onDeleteRole = async () => {
		console.log("onDeleteRole");
		console.log(role);

		await delete_doc(["role_configs", role.id]);
	};

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="flex flex-col rounded-full w-full justify-center items-center gap-x-1.5 bg-white text-sm hover:bg-white p-1">
					<EllipsisHorizontalIcon
						className="h-5 w-5 text-gray-700"
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
				<Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<div
									// onClick={onDeleteRole}
									className={classNames(
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									<div className="flex flex-row items-center space-x-2">
										<div>
											<LinkIcon className="h-4 w-4 text-gray-700" />
										</div>
										<div>Copy share link</div>
									</div>
								</div>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<div
									onClick={onDeleteRole}
									className={classNames(
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									<div className="flex flex-row items-center space-x-2">
										<div>
											<TrashIcon className="h-4 w-4 text-gray-700" />
										</div>
										<div>Delete</div>
									</div>
								</div>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

const RolesNav = () => {
	let { roles } = useLoaderData();

	if (isEmpty(roles)) {
		return (
			<div>
				<EmptyRolesState />
			</div>
		);
	}

	return (
		<nav className="flex flex-1 flex-col" aria-label="Sidebar">
			<ul role="list" className="space-y-3">
				{pipe(
					mapIndexed((role, role_idx) => (
						<li key={role_idx} className="border rounded-lg">
							<div
								className={classNames(
									role.current
										? "bg-gray-50 text-blue-600"
										: "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
									"flex flex-col px-2 py-1.5 text-sm cursor-pointer space-y-2"
								)}
							>
								<div className="flex flex-row items-center justify-between">
									<div className="flex flex-row items-center space-x-2 text-gray-700 font-semibold">
										<div className="pl-1">{role.name}</div>
									</div>
								</div>

								<div className="flex flex-row justify-between px-1">
									<div className="flex flex-row items-center -space-x-1 overflow-hidden">
										<img
											className="inline-block h-5 w-5 rounded-full ring-2 ring-white"
											src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
											alt=""
										/>
										<img
											className="inline-block h-5 w-5 rounded-full ring-2 ring-white"
											src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
											alt=""
										/>
										<img
											className="inline-block h-5 w-5 rounded-full ring-2 ring-white"
											src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
											alt=""
										/>
										<img
											className="inline-block h-5 w-5 rounded-full ring-2 ring-white"
											src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
											alt=""
										/>
									</div>
									<div className="flex flex-row items-center space-x-3">
										<div>
											<LinkIcon className="h-4 w-4 text-blue-600 cursor-pointer" />
										</div>
										<div>
											<RoleActions role={role} />
										</div>
									</div>
								</div>
							</div>
						</li>
					))
				)(roles)}
			</ul>
		</nav>
	);
};

const NewRoleModal = () => {
	let { entity_id } = useLoaderData();
	let set_modal = useModalStore((state) => state.set_modal);
	let set_role = useRoleStore((state) => state.set_role);
	let role = useRoleStore((state) => state.role);

	const onCloseModal = () => {
		set_modal({ id: "new_role_modal", is_open: false });
	};

	const onCreateNewRoleClick = async () => {
		console.log("onCreateNewRoleClick");

		let role_config_id = uuidv4();

		let payload = {
			id: role_config_id,
			entity_id,
			...role,
		};

		console.log("payload");
		console.log(payload);

		await set_doc(["role_configs", role_config_id], payload);

		set_modal({ id: "new_role_modal", is_open: false });
	};

	return (
		<Modal id="new_role_modal" classes="min-w-[500px]">
			<div className="flex flex-row w-full py-5 px-5 border-b text-2xl items-center">
				<div className="flex flex-row w-full items-center space-x-3 text-gray-400">
					<div className="">
						<UserPlusIcon className="h-6 w-6 " />
					</div>
					<div>New Role</div>
				</div>
				<div onClick={onCloseModal}>
					<XMarkIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
				</div>
			</div>
			<div className="flex flex-col p-5">
				<input
					type="text"
					className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 outline-none px-3 py-3"
					placeholder="Role name"
					onChange={(e) => set_role(["role", "name"], e.target.value)}
				/>
			</div>

			<div className="flex flex-col w-full border-b"></div>

			<div className="flex flex-row w-full justify-end p-5">
				<div
					className="flex flex-col bg-blue-600 object-fit px-3 py-2 text-white rounded text-sm cursor-pointer"
					onClick={onCreateNewRoleClick}
				>
					Create new role
				</div>
			</div>
		</Modal>
	);
};

export default function Roles() {
	let { entity_id, roles } = useLoaderData();
	let set_modal = useModalStore((state) => state.set_modal);

	const onCreateNewRoleModal = () => {
		set_modal({ id: "new_role_modal", is_open: true });
	};

	return (
		<div className="flex flex-col w-full h-full bg-gray-50">
			<NewRoleModal />
			<div className="flex flex-col w-full border-b bg-white">
				<SimpleNavSignedIn user_id={entity_id} />
			</div>

			<div className="flex flex-row w-full h-full gap-x-5 p-5">
				<div className="flex flex-col w-[25%] bg-white rounded border">
					<div className="flex flex-row justify-between w-full text-base px-5 items-center h-[37px]">
						<div className="font-semibold">Roles</div>
						<div onClick={onCreateNewRoleModal}>
							<PlusIcon className="h-5 w-5 text-gray-400 cursor-pointer" />
						</div>
					</div>
					<div className="flex flex-col w-full border-t"></div>
					<div className="flex flex-col w-full p-3">
						<RolesNav />
					</div>
				</div>
				<div className="flex flex-col w-[75%] bg-white rounded">
					<RoleNav />
					<div className="flex flex-col w-full p-5">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
}
