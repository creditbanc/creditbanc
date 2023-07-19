import { Fragment, useEffect, useState } from "react";
import {
	useLocation,
	useLoaderData,
	useFetcher,
	useActionData,
} from "@remix-run/react";
import ResourceSettingsTabs from "~/components/ResourceSettingsTabs";
import { get_resource_permissions } from "~/utils/role.server";
import {
	classNames,
	get_entity_id,
	get_group_id,
	to_resource_pathname,
} from "~/utils/helpers";
import { keys, head, pipe, defaultTo, map, isEmpty } from "ramda";
import { Listbox, Transition, Menu } from "@headlessui/react";
import { ChevronUpDownIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import copy from "copy-to-clipboard";
import { json } from "@remix-run/node";
import { useModalStore } from "~/hooks/useModal";
import { get_session_entity_id } from "~/utils/auth.server";
import { get_collection } from "~/utils/firebase";
import { filter, mod } from "shades";
import { create } from "zustand";

export const useRolesStore = create((set) => ({
	roles: [],
	set_roles: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const useRoleStore = create((set) => ({
	role: {},
	set_state: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

const LinkIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className="w-6 h-6"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
			/>
		</svg>
	);
};

const RolesDropdown = () => {
	let roles = useRolesStore((state) => state.roles);
	let set_role = useRoleStore((state) => state.set_state);
	let role = useRoleStore((state) => state.role);

	const onSelectRole = (role_id) => {
		set_role(["role"], pipe(filter({ id: role_id }), head)(roles));
	};

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 outline-none border">
					{!isEmpty(role) ? (
						<div className="flex flex-row items-center gap-x-2">
							{role.name}
							<ChevronDownIcon
								className="-mr-1 h-5 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</div>
					) : (
						<div className="flex flex-row gap-x-2">
							Roles
							<ChevronDownIcon
								className="-mr-1 h-5 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</div>
					)}
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
				<Menu.Items className="absolute left-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						{pipe(
							map((role) => (
								<Menu.Item key={role.id}>
									{({ active }) => (
										<div
											onClick={() =>
												onSelectRole(role.id)
											}
											className={classNames(
												active
													? "bg-gray-100 text-gray-900"
													: "text-gray-700",
												"block px-4 py-2 text-sm"
											)}
										>
											{role.name}
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

export default function Invite() {
	const location = useLocation();
	let fetcher = useFetcher();
	// const [roles, setRoles] = useState([]);
	// const [selectedRole, setSelectedRole] = useState({});
	const set_open = useModalStore((state) => state.set_open);
	const [member_email, set_member_email] = useState("");
	let [share_link, set_share_link] = useState("");
	let { pathname } = location;
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let set_roles = useRolesStore((state) => state.set_roles);
	let roles = useRolesStore((state) => state.roles);
	let role = useRoleStore((state) => state.role);
	let set_role = useRoleStore((state) => state.set_state);

	// const onSelectRole = (role_id) => {
	// 	setSelectedRole(pipe(filter({ id: role_id }), head)(roles));
	// };

	const onCopyLink = () => {
		// copy(shareLink + "?role=" + selectedRole);
		let { origin } = window.location;
		copy(
			`${origin}/links/resource/e/${entity_id}/g/${group_id}?config_id=${role.id}`
		);
	};

	const get_roles = async () => {
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

		if (!isEmpty(roles)) {
			set_roles(["roles"], roles);
		}
	};

	useEffect(() => {
		set_share_link(
			`${origin}/links/resource/e/${entity_id}/g/${group_id}?config_id=${role.id}`
		);
	}, [role]);

	useEffect(() => {
		if (!isEmpty(roles)) {
			let role = head(roles);
			set_role(["role"], role);
		}
	}, [roles]);

	useEffect(() => {
		get_roles();
	}, []);

	const onInvite = async () => {
		console.log("onInvite");
		fetcher.submit(
			{
				share_link,
				member_email,
			},
			{ method: "post", action: "/invites/send" }
		);
		set_open(false);
	};

	return (
		<div className="flex flex-col">
			{/* <ResourceSettingsTabs /> */}

			<div className="w-full p-[20px] max-w-lg mx-auto">
				<div className="text-center mb-[20px]">
					<div className="flex flex-col items-center">
						<LinkIcon />
					</div>
					<h2 className="mt-2 mb-2 text-lg font-medium text-gray-900">
						Create an invite link
					</h2>
					<p className="mt-1 text-sm text-gray-500">
						Use links to share and invite people.
					</p>
				</div>

				<div className="mt-[10px] mb-[15px] flex flex-col relative">
					<div className="text-gray-400 text-sm mb-[10px]">
						Select Role
					</div>
					<div className="flex flex-col">
						<RolesDropdown />
					</div>
				</div>

				<div className="mt-[10px] mb-[15px] flex flex-col relative">
					<div className="text-gray-400 text-sm mb-[10px]">
						Invite email
					</div>
					<div className="flex flex-col">
						<div
							className="flex flex-col justify-center h-[45px] w-full rounded-md border pl-[10px] border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							placeholder="Role name"
						>
							<div className="overflow-scroll w-[calc(100%-35px)] scrollbar-none text-gray-400 text-sm flex flex-col justify-center">
								<input
									type="text"
									className="outline-none"
									placeholder="partner@email.com"
									value={member_email}
									onChange={(e) =>
										set_member_email(e.target.value)
									}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-[20px] flex flex-col relative">
					<div className="text-gray-400 text-sm mb-[10px]">
						Document Link
					</div>
					<div className="flex flex-col">
						<div
							className="flex flex-col justify-center  w-full rounded-md border pl-[10px] border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm overflow-hidden"
							placeholder="Role name"
						>
							<div className="flex flex-col overflow-hidden pr-[30px] bg-wite py-2">
								<div
									className="flex flex-col overflow-x-scroll scrollbar-none text-gray-400 text-sm"
									style={{ textWrap: "nowrap" }}
								>
									{share_link}
								</div>
							</div>
						</div>

						<button
							className="absolute right-[10px] flex flex-col items-center justify-center h-[45px]"
							type="submit"
							onClick={onCopyLink}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-4 h-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
								/>
							</svg>
						</button>
					</div>
				</div>
				<div className="mt-[25px] flex flex-row justify-between">
					<button
						type="button"
						className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-blue-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						onClick={onCopyLink}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-3 h-3 mr-[5px]"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
							/>
						</svg>
						Copy link
					</button>

					<button
						type="button"
						className="rounded bg-indigo-600 py-1 px-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						onClick={onInvite}
					>
						Send invite
					</button>
				</div>
			</div>
		</div>
	);
}
