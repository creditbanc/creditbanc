import { Outlet, useLoaderData } from "@remix-run/react";
import SimpleNavSignedIn from "~/components/SimpleNavSignedIn";
import { get_user_id } from "~/utils/auth.server";
import { classNames } from "~/utils/helpers";
import {
	DocumentIcon,
	EllipsisHorizontalCircleIcon,
	EllipsisHorizontalIcon,
	LinkIcon,
	PlusIcon,
	UserPlusIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useModalStore } from "~/hooks/useModal";
import Modal from "~/components/Modal";
import { useEffect } from "react";

export const loader = async ({ request }) => {
	let entity_id = get_user_id(request);

	return { entity_id };
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

const roles_nav = [
	{ name: "Dashboard", href: "#", current: true },
	{ name: "Team", href: "#", current: false },
	{ name: "Projects", href: "#", current: false },
	{ name: "Calendar", href: "#", current: false },
	{ name: "Documents", href: "#", current: false },
	{ name: "Reports", href: "#", current: false },
];

const RolesNav = () => {
	return (
		<nav className="flex flex-1 flex-col" aria-label="Sidebar">
			<ul role="list" className="-mx-2 space-y-1">
				{roles_nav.map((item) => (
					<li key={item.name}>
						<a
							href={item.href}
							className={classNames(
								item.current
									? "bg-gray-50 text-blue-600"
									: "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
								"group flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold"
							)}
						>
							{item.name}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
};

const NewRoleModal = () => {
	let set_modal = useModalStore((state) => state.set_modal);

	const onCloseModal = () => {
		set_modal({ id: "new_role_modal", is_open: false });
	};

	const onCreateNewRoleClick = () => {
		console.log("onCreateNewRoleClick");
	};

	return (
		<Modal id="new_role_modal" classes="min-w-[700px]">
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
					placeholder="role name"
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
	let { entity_id } = useLoaderData();
	let set_modal = useModalStore((state) => state.set_modal);

	// useEffect(() => {
	// 	set_modal({ id: "new_role_modal", is_open: true });
	// }, []);

	const onCreateNewRoleModal = () => {
		console.log("onCreateNewRoleModal");
		set_modal({ id: "new_role_modal", is_open: true });
	};

	return (
		<div className="flex flex-col w-full h-full bg-gray-50">
			<NewRoleModal />
			<div className="flex flex-col w-full border-b bg-white">
				<SimpleNavSignedIn user_id={entity_id} />
			</div>

			<div className="flex flex-row w-full h-full gap-x-5 p-5">
				<div className="flex flex-col w-[25%] bg-white rounded">
					<div className="flex flex-row justify-between w-full text-base px-5 items-center h-[37px]">
						<div>Roles</div>
						<div onClick={onCreateNewRoleModal}>
							<PlusIcon className="h-5 w-5 text-gray-400 cursor-pointer" />
						</div>
					</div>
					<div className="flex flex-col w-full border-t"></div>
					<div className="flex flex-col w-full p-5">
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
