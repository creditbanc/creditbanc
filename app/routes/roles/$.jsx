import { useState } from "react";
import {
	pipe,
	map,
	head,
	keys,
	defaultTo,
	isEmpty,
	mergeDeepRight,
} from "ramda";
import { get } from "shades";
import { get_group_id, to_resource_pathname } from "~/utils/helpers";
import { useFetcher, useLocation, useLoaderData } from "@remix-run/react";
import { get_resource_roles } from "~/utils/resource.server";
import GroupSettingsTabs from "~/components/GroupSettingsTabs";
import { permissions_defaults, Permissions } from "~/components/Permissions";
import { RolesSelect } from "~/components/RolesSelect";

export const loader = async ({ request }) => {
	let group_id = get_group_id(request.url);
	let permissions = await get_resource_roles({
		resource_path_id: group_id,
	});

	return permissions;
};

export default function Roles() {
	const location = useLocation();
	const fetcher = useFetcher();
	const permissions = useLoaderData();
	const group_id = get_group_id(location.pathname);
	const roles = pipe(keys)(permissions);

	const [selectedRole, setSelectedRole] = useState(
		pipe(head, defaultTo(""))(roles)
	);

	const selectedRolePermissions = pipe(
		get(selectedRole),
		defaultTo({}),
		mergeDeepRight(permissions_defaults)
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
						<RolesSelect
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
