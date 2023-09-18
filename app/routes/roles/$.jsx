import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import {
	classNames,
	get_config_id,
	get_entity_id,
	get_group_id,
	mapIndexed,
} from "~/utils/helpers";
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
import { filter, head, isEmpty, pipe, set } from "ramda";
import { create } from "zustand";
import { mod } from "shades";
import { v4 as uuidv4 } from "uuid";
import { Fragment, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Modal from "~/components/Modal";
import { redirect } from "react-router-dom";
import { create_role_config } from "~/api/authorization";
import copy from "copy-to-clipboard";

import {
	map as rxmap,
	filter as rxfilter,
	concatMap,
	tap,
	take,
} from "rxjs/operators";
import {
	from,
	lastValueFrom,
	forkJoin,
	Subject,
	of as rxof,
	merge,
	throwError,
} from "rxjs";
import { fold, ifFalse } from "~/utils/operators";
import { is_authorized_f } from "~/api/auth";

const log_route = `roles.$`;

const subject = new Subject();

const $loader = subject.pipe(
	rxfilter((message) => message.id == "load"),
	concatMap(({ args: { request } }) => {
		let url = new URL(request.url);
		let group_id = rxof(get_group_id(url.pathname));
		let entity_id = from(get_session_entity_id(request));

		let entity_group_id = forkJoin({
			entity_id,
			group_id,
		});

		let redirect_home = entity_group_id.pipe(
			concatMap(({ entity_id, group_id }) =>
				throwError(() =>
					Response.redirect(
						`${url.origin}/home/resource/e/${entity_id}/g/${group_id}`
					)
				)
			)
		);

		let edit_roles = (group_id) =>
			rxof(group_id).pipe(
				rxfilter((group_id) => group_id !== undefined),
				concatMap((group_id) =>
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
						})
					)
				)
			);

		let is_authorized = entity_group_id.pipe(
			concatMap(({ entity_id, group_id }) =>
				is_authorized_f(entity_id, group_id, "share", "edit")
			),
			concatMap(ifFalse(redirect_home)),
			concatMap(() => group_id),
			concatMap(edit_roles),
			rxmap((roles) => ({ roles }))
		);

		return is_authorized.pipe(
			tap((value) => {
				console.log(`${log_route}.tap`);
				console.log(value);
			})
		);
	})
);

export const useRoleStore = create((set) => ({
	role: {},
	set_role: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const useRolesStore = create((set) => ({
	roles: [],
	set_roles: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

// export const loader = async ({ request }) => {
// 	let entity_id = await get_session_entity_id(request);

// 	let roles = await get_collection({
// 		path: ["role_configs"],
// 		queries: [
// 			{
// 				param: "entity_id",
// 				predicate: "==",
// 				value: entity_id,
// 			},
// 		],
// 	});

// 	// console.log("roles");
// 	// console.log(roles);

// 	return { entity_id, roles };
// };

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

const RoleActions = ({ role }) => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	let set_roles = useRolesStore((state) => state.set_roles);
	let roles = useRolesStore((state) => state.roles);

	const onDeleteRole = async (e) => {
		e.preventDefault();

		await delete_doc(["role_configs", role.id]);

		set_roles(
			["roles"],
			roles.filter((r) => r.id !== role.id)
		);
	};

	const onCopyShareLink = () => {
		let { origin } = window.location;

		copy(
			`${origin}/links/resource/e/${entity_id}/g/${group_id}?config_id=${role.id}`
		);
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
									to={`/role/${role.id}/permissions/resource/e/${entity_id}/g/${group_id}`}
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
									onClick={onCopyShareLink}
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

const RolesList = () => {
	let { roles: db_roles } = useLoaderData();
	let roles = useRolesStore((state) => state.roles);
	let set_roles = useRolesStore((state) => state.set_roles);
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	useEffect(() => {
		set_roles(["roles"], db_roles);
	}, [db_roles]);

	if (isEmpty(roles)) {
		return (
			<div>
				<EmptyRolesState />
			</div>
		);
	}

	const onCopyShareLink = (config_id) => {
		let { origin } = window.location;

		copy(
			`${origin}/links/resource/e/${entity_id}/g/${group_id}?config_id=${config_id}`
		);
	};

	return (
		<nav className="flex flex-1 flex-col" aria-label="Sidebar">
			<ul role="list" className="space-y-3">
				{pipe(
					mapIndexed((role, role_idx) => (
						<li key={role_idx} className="border rounded-lg">
							<div
								// to={`/role/1/permissions`}
								className={classNames(
									role.current
										? "bg-gray-50 text-blue-600"
										: "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
									"flex flex-col px-2 py-1.5 text-sm cursor-pointer space-y-2"
								)}
							>
								<div className="flex flex-row items-center justify-between py-1">
									<Link
										to={`/role/${role.id}/permissions/resource/e/${entity_id}/g/${group_id}`}
										className="flex flex-col space-y-3 flex-1"
									>
										<div className="flex flex-row items-center space-x-2 text-gray-700 font-semibold">
											<div className="pl-1">
												{role.name}
											</div>
										</div>
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
									</Link>
									<div className="flex flex-row h-full items-center space-x-3">
										<div
											onClick={() =>
												onCopyShareLink(role.id)
											}
										>
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
	let { pathname } = useLocation();
	let entity_id = get_entity_id(useLocation().pathname);
	let set_modal = useModalStore((state) => state.set_modal);
	let set_role = useRoleStore((state) => state.set_role);
	let role = useRoleStore((state) => state.role);
	let set_roles = useRolesStore((state) => state.set_roles);
	let roles = useRolesStore((state) => state.roles);
	let group_id = get_group_id(pathname);

	const onCloseModal = () => {
		set_modal({ id: "new_role_modal", is_open: false });
	};

	const onCreateNewRoleClick = async () => {
		console.log("onCreateNewRoleClick");

		let payload = {
			group_id,
			entity_id,
			...role,
		};

		let role_config = await create_role_config(payload);
		let { id: role_config_id } = role_config;

		// console.log("payload");
		// console.log(payload);

		// await set_doc(["role_configs", role_config_id], payload);

		set_roles(["roles"], [...roles, role_config]);
		set_modal({ id: "new_role_modal", is_open: false });
		window.location = `/role/${role_config_id}/permissions/resource/e/${entity_id}/g/${group_id}`;
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
		<div className="flex flex-col w-full items-center">
			<NewRoleModal />
			<div className="flex flex-col w-full lg:w-[800px] bg-white rounded">
				<SectionHeading />
				<div className="flex flex-col p-5 w-full">
					<RolesList />
				</div>
			</div>
		</div>
	);
}
