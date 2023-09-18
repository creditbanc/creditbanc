import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import {
	classNames,
	get_config_id,
	get_group_id,
	mapIndexed,
	trim,
	use_client_search_params,
} from "~/utils/helpers";
import { pipe, map, isEmpty, filter, head } from "ramda";
import { create } from "zustand";
import { get, mod } from "shades";
import { get_collection, get_doc, set_doc, update_doc } from "~/utils/firebase";
import { useLoaderData, useLocation } from "@remix-run/react";
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
import { get_session_entity_id } from "~/utils/auth.server";

const log_route = `role:id.permissions`;

const subject = new Subject();

const $loader = subject.pipe(
	rxfilter((message) => message.id == "load"),
	concatMap(({ args: { request } }) => {
		let url = new URL(request.url);
		let group_id = rxof(get_group_id(url.pathname));
		let entity_id = from(get_session_entity_id(request));
		let config_id = get_config_id(url.pathname);

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
									param: "id",
									predicate: "==",
									value: config_id,
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
			rxmap((roles) => {
				return pipe(
					filter((role) => role.id == config_id),
					head,
					(config) => ({
						config,
					})
				)(roles);
			})
		);

		return is_authorized.pipe(
			tap((value) => {
				console.log(`${log_route}.tap`);
				console.log(value);
			})
		);
	})
);

export const usePermissionsStore = create((set) => ({
	permissions: [],
	set_permissions: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const default_permissions = [
	{
		id: "credit",
		name: "Credit",
		hidden: false,
		read: true,
		edit: false,
	},
	{
		id: "cashflow",
		name: "Cashflow",
		hidden: false,
		read: true,
		edit: false,
	},
	{
		id: "accounts",
		name: "Accounts",
		hidden: false,
		read: true,
		edit: false,
	},
	{
		id: "transactions",
		name: "Transactions",
		hidden: false,
		read: true,
		edit: false,
	},
	{
		id: "vault",
		name: "Vault",
		hidden: false,
		read: true,
		edit: false,
	},
	{
		id: "chat",
		name: "Chat",
		hidden: false,
		read: true,
		edit: false,
	},
	{
		id: "share",
		name: "Share",
		hidden: false,
		read: true,
		edit: false,
	},
];

export const admin_permissions = [
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
		id: "accounts",
		name: "Accounts",
		hidden: false,
		read: true,
		edit: true,
	},
	{
		id: "transactions",
		name: "Transactions",
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
	{
		id: "share",
		name: "Share",
		hidden: false,
		read: true,
		edit: true,
	},
];

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
			next: () => error ?? null,
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

const Toggle = ({ index, permission_key }) => {
	let set_permissions = usePermissionsStore((state) => state.set_permissions);
	let permissions = usePermissionsStore((state) => state.permissions);
	let permission = permissions[index];
	let enabled = permission[permission_key];

	const set_enabled = async () => {
		if (permission_key === "hidden" && !enabled == true) {
			return set_permissions(["permissions", index], {
				...permissions[index],
				hidden: true,
				read: false,
				edit: false,
			});
		}

		if (permission_key === "read" && !enabled == false) {
			return set_permissions(["permissions", index], {
				...permission,
				read: false,
				edit: false,
			});
		}

		if (permission_key === "edit" && !enabled == true) {
			return set_permissions(["permissions", index], {
				...permission,
				hidden: false,
				read: true,
				edit: true,
			});
		}

		return set_permissions(["permissions", index], {
			...permission,
			hidden: false,
			[permission_key]: !enabled,
		});
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

const RoleHeading = () => {
	let { config } = useLoaderData();

	return (
		<div className=" pb-2">
			<div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
				<h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
					Role:
				</h3>
				<h3 className="ml-1 mt-1 truncate text-base text-gray-500">
					{config?.name}
				</h3>
			</div>
		</div>
	);
};

export default function Permissions() {
	let { config } = useLoaderData();

	let { permissions: config_permissions = [] } = config;
	let { permissions, set_permissions } = usePermissionsStore();
	let { pathname } = useLocation();
	let config_id = get_config_id(pathname);

	useEffect(() => {
		if (!isEmpty(permissions)) {
			update_doc(["role_configs", config_id], {
				permissions,
			});
		}
	}, [permissions]);

	useEffect(() => {
		set_permissions(["permissions"], config_permissions);
	}, []);

	return (
		<div className="flex flex-col w-full h-full">
			<div className="mb-3">
				<RoleHeading />
			</div>
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
		</div>
	);
}
