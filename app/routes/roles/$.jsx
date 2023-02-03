import { Fragment, useState } from "react";
import { Listbox, Transition, Switch } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { pipe, map, head, keys, defaultTo, isEmpty, path } from "ramda";
import { get } from "shades";
import {
	get_group_id,
	get_resource_id,
	to_resource_pathname,
} from "~/utils/helpers";
import {
	useSubmit,
	useFetcher,
	useLocation,
	Link,
	useLoaderData,
} from "@remix-run/react";
import { get_resource_permissions } from "~/utils/role.server";
import GroupSettingsTabs from "~/components/GroupSettingsTabs";
import { inspect } from "~/utils/helpers";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const SelectComponent = ({ roles = [], onSelectRole, selected_role }) => {
	let location = useLocation();
	// console.log("SelectComponent");
	// console.log(roles);
	// console.log(selected_role);
	return (
		<div className="flex flex-row justify-between">
			<Listbox
				value={selected_role}
				onChange={onSelectRole}
				className="w-[100%]"
			>
				{({ open }) => (
					<div className="relative mt-1">
						<Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm min-h-[40px]">
							<span className="block truncate">
								{selected_role}
							</span>
							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon
									className="h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-[calc(100%-20px)] rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{map(
									(option) => (
										<Listbox.Option
											key={option}
											className={({ active }) =>
												classNames(
													active
														? "text-white bg-indigo-600"
														: "text-gray-900",
													"relative cursor-default select-none py-2 pl-3 pr-9"
												)
											}
											value={option}
										>
											{({ selected, active }) => (
												<>
													<span
														className={classNames(
															selected
																? "font-semibold"
																: "font-normal",
															"block truncate"
														)}
													>
														{option}
													</span>

													{option == selected_role ? (
														<span
															className={classNames(
																active
																	? "text-white"
																	: "text-indigo-600",
																"absolute inset-y-0 right-0 flex items-center pr-4"
															)}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 24 24"
																fill="currentColor"
																className="w-6 h-6"
															>
																<path
																	fillRule="evenodd"
																	d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
																	clipRule="evenodd"
																/>
															</svg>
														</span>
													) : null}
												</>
											)}
										</Listbox.Option>
									),
									roles
								)}
							</Listbox.Options>
						</Transition>
					</div>
				)}
			</Listbox>
			<div className="w-[150px] flex flex-col items-end justify-center ml-[10px]">
				<Link
					to={"/roles/new" + to_resource_pathname(location.pathname)}
					type="button"
					className="w-[100%]"
				>
					<div className="flex flex-col items-center justify-center text-xs rounded-md border border-transparent bg-indigo-600 px-2 h-[40px] font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
						Create role
					</div>
				</Link>
			</div>
		</div>
	);
};

const Toggle = ({ onToggleCallback, enabled }) => {
	return (
		<Switch
			checked={enabled}
			onChange={onToggleCallback}
			className={classNames(
				enabled ? "bg-indigo-600" : "bg-gray-200",
				"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
			)}
		>
			{/* <span className="sr-only">Use setting</span> */}
			<span
				className={classNames(
					enabled ? "translate-x-5" : "translate-x-0",
					"pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
				)}
			>
				<span
					className={classNames(
						enabled
							? "opacity-0 ease-out duration-100"
							: "opacity-100 ease-in duration-200",
						"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
					)}
					aria-hidden="true"
				>
					<svg
						className="h-3 w-3 text-gray-400"
						fill="none"
						viewBox="0 0 12 12"
					>
						<path
							d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
				<span
					className={classNames(
						enabled
							? "opacity-100 ease-in duration-200"
							: "opacity-0 ease-out duration-100",
						"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
					)}
					aria-hidden="true"
				>
					<svg
						className="h-3 w-3 text-indigo-600"
						fill="currentColor"
						viewBox="0 0 12 12"
					>
						<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
					</svg>
				</span>
			</span>
		</Switch>
	);
};

const CanView = ({
	permission_key,
	permission_value,
	role_id,
	onPermissionChange,
}) => {
	const onToggleCallback = () => {
		onPermissionChange({
			permission_key,
			permission_value: !permission_value,
			role_id,
		});
	};

	return (
		<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
			<dt className="text-sm font-bold text-gray-500">Public</dt>
			<dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
				<span className="flex-grow">
					Makes the files in the directory public to members
					(excluding private files).
				</span>
				<span className="ml-4 flex-shrink-0">
					<Toggle
						onToggleCallback={onToggleCallback}
						enabled={permission_value}
					/>
				</span>
			</dd>
		</div>
	);
};

const permissions_components = { can_view: CanView };

const PermissionComponent = ({
	permission_key,
	permission_value,
	role_id,
	onPermissionChange,
}) => {
	let Permission = permissions_components[permission_key];

	return (
		<Permission
			role_id={role_id}
			permission_key={permission_key}
			permission_value={permission_value}
			onPermissionChange={onPermissionChange}
		/>
	);
};

const Permissions = ({ permissions, role_id, onPermissionChange }) => {
	return (
		<div>
			<div className="flex flex-col border rounded-md p-[20px]">
				<div>
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						Permissions
					</h3>
					<p className="mt-1 max-w-2xl text-sm text-gray-500">
						General permissions for the role.
					</p>
				</div>
				<div className="mt-5 border-t border-gray-200">
					<dl className="divide-y divide-gray-200">
						{map(
							(permission_key) => (
								<div key={permission_key}>
									<PermissionComponent
										permission_key={permission_key}
										permission_value={
											permissions[permission_key]
										}
										role_id={role_id}
										onPermissionChange={onPermissionChange}
									/>
								</div>
							),
							keys(permissions_components)
						)}
					</dl>
				</div>
			</div>
		</div>
	);
};

export const loader = async ({ request }) => {
	let group_id = get_group_id(request.url);
	let permissions = await get_resource_permissions({ group_id });
	return permissions;
};

export default function Roles() {
	const location = useLocation();
	const fetcher = useFetcher();
	const permissions = useLoaderData();
	// console.log("permissions", permissions);

	const group_id = get_group_id(location.pathname);
	const resource_path_id = get_resource_id(location.pathname);

	const roles = pipe(keys)(permissions);
	const [selectedRole, setSelectedRole] = useState(
		pipe(head, defaultTo(""))(roles)
	);

	const selectedRolePermissions = pipe(
		get(selectedRole),
		defaultTo({})
	)(permissions);

	const onSelectRole = (role_id) => {
		setSelectedRole(role_id);
	};

	const onPermissionChange = ({
		permission_key,
		permission_value,
		role_id,
	}) => {
		let redirect_url = "/roles" + to_resource_pathname(location.pathname);

		let payload = {
			group_id,
			role_id,
			permission_key,
			permission_value,
			redirect_url,
		};

		// console.log("payload", payload);

		fetcher.submit(payload, {
			method: "post",
			action: `/roles/update` + to_resource_pathname(location.pathname),
		});
	};

	const onDeleteRole = (role_id) => {
		let redirect_url = "/roles" + to_resource_pathname(location.pathname);
		// console.log("selectedRole", selectedRole);
		fetcher.submit(
			{
				role_id: selectedRole,
				group_id,
				redirect_url,
			},
			{
				method: "post",
				action:
					`/roles/delete` + to_resource_pathname(location.pathname),
			}
		);
	};

	return (
		<div className="w-full">
			<GroupSettingsTabs />
			<div className="max-w-7xl mx-auto">
				<div className="px-4 my-4">
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						Roles
					</h3>
					<p className="mt-1 max-w-2xl text-sm text-gray-500">
						Use roles to group your members and assign permissions.
					</p>
				</div>
				<div className="flex flex-col p-[10px]">
					<div className="flex flex-col mb-[20px]">
						<SelectComponent
							roles={roles}
							onSelectRole={onSelectRole}
							selected_role={selectedRole}
						/>
					</div>
					{!isEmpty(roles) && (
						<div className="permissions">
							<div className="flex flex-col mb-[20px]">
								<Permissions
									permissions={selectedRolePermissions}
									role_id={selectedRole}
									onPermissionChange={onPermissionChange}
								/>
							</div>
							<div
								onClick={onDeleteRole}
								className="flex flex-col items-center justify-center cursor-pointer rounded-md border border-transparent bg-red-600 px-3 py-4 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
							>
								Delete role
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
