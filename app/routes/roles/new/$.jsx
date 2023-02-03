import { useState } from "react";
import {
	useLocation,
	useSubmit,
	useLoaderData,
	useFetcher,
} from "@remix-run/react";
import { to_resource_pathname, get_group_id, inspect } from "~/utils/helpers";
import { create_group_role, get_resource_roles } from "~/utils/role.server";
import { json, redirect } from "@remix-run/node";
import { get_user_id } from "~/utils/auth.server";
import { includes, map } from "ramda";
import GroupSettingsTabs from "~/components/GroupSettingsTabs";

const MinusIcon = ({ className }) => (
	<div className={className}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className="w-4 h-4 text-gray-400"
		>
			<path
				fillRule="evenodd"
				d="M3.75 12a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z"
				clipRule="evenodd"
			/>
		</svg>
	</div>
);

export const action = async ({ request }) => {
	let formData = await request.formData();
	let group_id = formData.get("group_id");
	let entity_id = formData.get("entity_id");
	let redirect_url = formData.get("redirect_url");
	let role_id = formData.get("role_id");

	let roles = await get_resource_roles({ resource_id: group_id });

	// inspect(roles, "get_resource_roles");

	let group_has_role = includes(role_id, roles);

	if (group_has_role) {
		console.log("group_has_role");
	} else {
		console.log("!group_has_role");
		await create_group_role({
			entity_id,
			group_id,
			role_id,
		});
	}

	return redirect(redirect_url);
};

export const loader = async ({ request }) => {
	const entity_id = await get_user_id(request);
	const group_id = get_group_id(request.url);
	let roles = await get_resource_roles({ resource_id: group_id });
	return { entity_id, group_id, roles };
};

export default function NewRole() {
	let { entity_id, group_id, roles = [] } = useLoaderData();
	let fetcher = useFetcher();
	let location = useLocation();
	let submit = useSubmit();
	const [roleId, setRoleId] = useState("");

	// console.log("entity_id:", entity_id);
	// console.log("group_id:", group_id);

	const onCreateNewRole = (event) => {
		console.log("onCreateNewRole");
		event.preventDefault();

		let redirect_url = "/roles" + to_resource_pathname(location.pathname);

		const formData = new FormData();
		formData.append("group_id", group_id);
		formData.append("entity_id", entity_id);
		formData.append("redirect_url", redirect_url);
		formData.append("role_id", roleId);

		submit(formData, {
			method: "post",
			action: "roles/new" + to_resource_pathname(location.pathname),
		});
	};

	const onDeleteRole = (role_id) => {
		console.log("onDeleteRole");
		let redirect_url = "/roles" + to_resource_pathname(location.pathname);
		fetcher.submit(
			{ group_id, entity_id, role_id, redirect_url },
			{
				method: "post",
				action: "roles/delete",
			}
		);
	};

	return (
		<div className="flex flex-col">
			<GroupSettingsTabs />

			<div className="mx-auto max-w-lg p-[20px]">
				<div>
					<div className="text-center">
						<svg
							className="mx-auto h-12 w-12 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 48 48"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
							/>
						</svg>
						<h2 className="mt-2 mb-2 text-lg font-medium text-gray-900">
							Add new role
						</h2>
						<p className="mt-1 text-sm text-gray-500">
							Use roles to group your members and assign
							permissions.
						</p>
					</div>
					<form className="mt-6 flex" onSubmit={onCreateNewRole}>
						<label htmlFor="name" className="sr-only">
							Role name
						</label>
						<input
							type="name"
							name="name"
							id="name"
							className="block w-full rounded-md border pl-[10px] border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							placeholder="Role name"
							value={roleId}
							onChange={(e) => setRoleId(e.target.value)}
						/>
						<button
							type="submit"
							className="ml-4 flex-shrink-0 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Add role
						</button>
					</form>
				</div>
				<div className="mt-10">
					<h3 className="text-sm font-medium text-gray-500">
						Group roles
					</h3>
					<ul
						role="list"
						className="mt-4 divide-y divide-gray-200 border-t border-b border-gray-200"
					>
						{map(
							(role) => (
								<li
									key={role}
									className="flex items-center justify-between space-x-3 py-4"
								>
									<div className="flex min-w-0 flex-1 items-center space-x-3">
										<div className="flex-shrink-0">
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
													d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
												/>
											</svg>
										</div>
										<div className="min-w-0 flex-1">
											<p className="truncate text-sm font-medium text-gray-900">
												{role}
											</p>
										</div>
									</div>
									<div className="flex-shrink-0">
										<button
											type="button"
											className="inline-flex items-center rounded-full border border-transparent bg-gray-100 py-2 px-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
											onClick={() => onDeleteRole(role)}
										>
											<MinusIcon className="mr-[5px]" />

											<span className="text-sm font-medium text-gray-900">
												Delete
												<span className="sr-only">
													{role}
												</span>
											</span>
										</button>
									</div>
								</li>
							),
							roles
						)}
					</ul>
				</div>
			</div>
		</div>
	);
}
