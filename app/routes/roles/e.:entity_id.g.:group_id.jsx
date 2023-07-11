import { Link, useLoaderData } from "@remix-run/react";
import { get_user_id } from "~/utils/auth.server";
import { classNames, mapIndexed } from "~/utils/helpers";
import {
	Cog6ToothIcon,
	EllipsisHorizontalIcon,
	LinkIcon,
	PlusIcon,
	TrashIcon,
	UserIcon,
	UserPlusIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useModalStore } from "~/hooks/useModal";
import { delete_doc, get_collection, set_doc } from "~/utils/firebase";
import { isEmpty, pipe } from "ramda";
import { create } from "zustand";
import { mod } from "shades";
import { v4 as uuidv4 } from "uuid";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

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
								<Link
									to={`/role/${role.id}/permissions`}
									className={classNames(
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									<div className="flex flex-row items-center space-x-2">
										<div>
											<Cog6ToothIcon className="h-4 w-4 text-gray-700" />
										</div>
										<div>Edit role</div>
									</div>
								</Link>
							)}
						</Menu.Item>
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

const RolesList = () => {
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
							<Link
								to={`/role/1/permissions`}
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
							</Link>
						</li>
					))
				)(roles)}
			</ul>
		</nav>
	);
};

const SectionHeading = () => {
	let set_modal = useModalStore((state) => state.set_modal);
	const onCreateNewRoleModal = () => {
		set_modal({ id: "new_role_modal", is_open: true });
	};

	return (
		<div className="border-b border-gray-200 py-2 px-6">
			<div className="flex flex-row w-full justify-between items-center">
				<div>
					<h3 className="text-base font-semibold leading-6 text-gray-900">
						Roles
					</h3>
				</div>
				<div
					className="flex flex-row items-center gap-x-3 cursor-pointer"
					onClick={onCreateNewRoleModal}
				>
					<div>New Role</div>
					<div>
						<PlusIcon className="h-5 w-5 text-gray-700 " />
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Roles() {
	return (
		<div className="flex flex-col w-full items-center ">
			<div className="flex flex-col w-[800px] bg-white rounded">
				<SectionHeading />
				<div className="flex flex-col p-5 w-full">
					<RolesList />
				</div>
			</div>
		</div>
	);
}
