import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { classNames, mapIndexed } from "~/utils/helpers";
import { useLoaderData } from "react-router";
import { pipe, map, isEmpty } from "ramda";
import { create } from "zustand";
import { mod } from "shades";
import { get_collection, get_doc, set_doc, update_doc } from "~/utils/firebase";

export const usePermissionsStore = create((set) => ({
	permissions: [],
	set_permissions: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

const default_permissions = [
	{
		id: "credit",
		name: "Credit",
		hidden: false,
		read: true,
		edit: true,
	},
	{
		id: "cashflow",
		name: "Cashflow",
		hidden: false,
		read: true,
		edit: true,
	},
	{
		id: "vault",
		name: "Vault",
		hidden: false,
		read: true,
		edit: true,
	},
	{
		id: "chat",
		name: "Chat",
		hidden: false,
		read: true,
		edit: true,
	},
];

const config_id = "db88508c-b4ea-4dee-8d60-43c5a847c172";

const config_permissions_or_default = (config) => {
	let permissions = pipe(
		map((default_permission) => {
			let { permissions = [] } = config;
			let config_permission =
				permissions.find(
					(permission) => permission.id === default_permission.id
				) ?? {};

			return { ...default_permission, ...config_permission };
		})
	)(default_permissions);

	return permissions;
};

export const loader = async ({ request }) => {
	// let entity_id = await get_user_id(request);

	let config = await get_doc(["role_configs", config_id]);

	let permissions = config_permissions_or_default(config);

	return { config: { ...config, permissions } };
};

const Toggle = ({ index, permission_key }) => {
	let set_permissions = usePermissionsStore((state) => state.set_permissions);
	let permissions = usePermissionsStore((state) => state.permissions);
	let permission = permissions[index];
	let enabled = permission[permission_key];

	const set_enabled = async () => {
		if (permission_key === "hidden" && !enabled == true) {
			set_permissions(["permissions", index], {
				...permissions[index],
				hidden: true,
				read: false,
				edit: false,
			});
		} else {
			set_permissions(["permissions", index], {
				...permissions[index],
				hidden: false,
				[permission_key]: !enabled,
			});
		}
	};

	return (
		<Switch
			checked={false}
			onChange={set_enabled}
			className={classNames(
				enabled ? "bg-blue-600" : "bg-gray-200",
				"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
			)}
		>
			<span
				aria-hidden="true"
				className={classNames(
					enabled ? "translate-x-5" : "translate-x-0",
					"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
				)}
			/>
		</Switch>
	);
};

const Permission = ({ permission, index }) => {
	let { name, hidden, read, edit } = permission;

	return (
		<div className="flex flex-row w-full  text-sm py-3">
			<div className="flex flex-col flex-1">{name}</div>
			<div className="flex flex-col w-[100px]">
				<Toggle permission_key={"hidden"} index={index} />
			</div>
			<div className="flex flex-col w-[100px]">
				<Toggle permission_key={"read"} index={index} />
			</div>
			<div className="flex flex-col w-[100px]">
				<Toggle permission_key={"edit"} index={index} />
			</div>
		</div>
	);
};

const SectionHeading = () => {
	return (
		<div className="flex flex-row justify-between items-end w-full border-b border-gray-200 pb-5">
			<div>
				<h3 className="text-base font-semibold leading-6 text-gray-900">
					Pages Permissions
				</h3>
				<p className="mt-2 max-w-4xl text-sm text-gray-500">
					Select what pages can be viewed or edited.
				</p>
			</div>
			{/* <div>
				<div className="text-blue-600 cursor-pointer text-sm">
					Clear permissions
				</div>
			</div> */}
		</div>
	);
};

export default function Permissions() {
	let { config } = useLoaderData();
	let { permissions, set_permissions } = usePermissionsStore();

	useEffect(() => {
		if (!isEmpty(permissions)) {
			update_doc(["role_configs", config_id], {
				permissions,
			});
		}
	}, [permissions]);

	useEffect(() => {
		set_permissions(["permissions"], config.permissions);
	}, []);

	return (
		<div className="flex flex-col w-full h-full border px-3 pt-3 rounded">
			<div className="flex flex-col my-3">
				<SectionHeading />
			</div>
			<div className="flex flex-row w-full justify-between my-3 text-sm text-gray-400">
				<div className="flex-col flex-1">Page</div>
				<div className="flex flex-col w-[100px]">Hidden</div>
				<div className="flex flex-col w-[100px]">Read</div>
				<div className="flex flex-col w-[100px]">Edit</div>
			</div>
			<div className="flex flex-col w-full border-b"></div>
			<div className="flex flex-col w-full divide-y">
				{pipe(
					mapIndexed((permission, index) => (
						<Permission
							permission={permission}
							index={index}
							key={index}
						/>
					))
				)(permissions)}
			</div>
		</div>
	);
}
