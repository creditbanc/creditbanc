import { Switch } from "@headlessui/react";
import { map, keys } from "ramda";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

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

export const CanView = ({
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
			<dt className="text-sm font-bold text-gray-900">Public</dt>
			<dd className="mt-1 flex text-sm text-gray-500 sm:col-span-2 sm:mt-0">
				<span className="flex-grow">
					<div className="mb-1">
						Makes the files in the group public to members with this
						role.
					</div>
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

export const CanShare = ({
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
			<dt className="text-sm font-bold text-gray-900">Share</dt>
			<dd className="mt-1 flex text-sm text-gray-500 sm:col-span-2 sm:mt-0">
				<span className="flex-grow">
					<div className="mb-1">
						Allows this role to invite and share with others.
					</div>
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

export const CanManageRoles = ({
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
			<dt className="text-sm font-bold text-gray-900">Manage Roles</dt>
			<dd className="mt-1 flex text-sm text-gray-500 sm:col-span-2 sm:mt-0">
				<span className="flex-grow">
					<div className="mb-1">
						Allows members to create new roles and edit or delete
						roles lower than their highest role. Also allows members
						to change permissions of individual channels that they
						have access to.
					</div>
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

export const permissions_defaults = {
	can_view: false,
	can_share: false,
	can_manage_roles: false,
};

export const permissions_components = {
	can_view: CanView,
	can_share: CanShare,
	can_manage_roles: CanManageRoles,
};

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

export const Permissions = ({ permissions, role_id, onPermissionChange }) => {
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
