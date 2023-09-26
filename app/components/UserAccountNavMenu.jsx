import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { classNames, get_entity_id, get_group_id } from "~/utils/helpers";
import avatars from "~/data/avatars";
import { Cog8ToothIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { is_entity_super } from "~/api/auth";

export default function UserAccountNavMenu() {
	let { identity: entity } = useLoaderData();
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	let avatar = avatars(entity?.email, { size: 35 });

	return (
		<Menu as="div" className="relative ml-3">
			<div>
				<Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none">
					<div
						className={`inline-block rounded-full border-blue-500`}
						dangerouslySetInnerHTML={{ __html: avatar }}
					/>
				</Menu.Button>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-200"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<Menu.Item>
						{({ active }) => (
							<Link
								to={`/roles/resource/e/${entity_id}/g/${group_id}`}
								className={classNames(
									active ? "bg-gray-100" : "",
									"block px-4 py-2 text-sm text-gray-700"
								)}
							>
								Roles
							</Link>
						)}
					</Menu.Item>
					<Menu.Item>
						{({ active }) => (
							<Link
								to={`/settings/account/resource/e/${entity_id}/g/${group_id}`}
								className={classNames(
									active ? "bg-gray-100" : "",
									"block px-4 py-2 text-sm text-gray-700"
								)}
							>
								Settings
							</Link>
						)}
					</Menu.Item>

					{is_entity_super(entity) && (
						<Menu.Item>
							{({ active }) => (
								<Link
									to="/admin/entities"
									className={classNames(
										active ? "bg-gray-100" : "",
										"block px-4 py-2 text-sm text-gray-700"
									)}
								>
									Admin
								</Link>
							)}
						</Menu.Item>
					)}
					<Menu.Item>
						{({ active }) => (
							<Link
								to={"/signout"}
								className={classNames(
									active ? "bg-gray-100" : "",
									"block px-4 py-2 text-sm text-gray-700"
								)}
							>
								Sign out
							</Link>
						)}
					</Menu.Item>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
