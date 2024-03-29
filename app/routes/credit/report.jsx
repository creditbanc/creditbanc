import { get_group_id, get_report_endpoint, classNames, get_entity_id, is_location } from "~/utils/helpers";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { Outlet, useLocation, Link } from "@remix-run/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export const loader = async ({ request }) => {
	let user_id = await get_session_entity_id(request);
	return { user_id };
};

const tabs = [
	{
		name: "Personal",
		href: ({ entity_id, group_id }) => `/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}`,
		current: (pathname) => is_location("/credit/report/personal", pathname),
	},
	// { name: "Business", href: "/financial/accounts", current: false },
];

const BusinessDropdown = () => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button
					className={classNames(
						is_location("/credit/report/business", pathname)
							? "border-blue-500 text-blue-600"
							: " border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
						"flex flex-row items-center border-b-2 py-2 px-1 text-center text-sm gap-x-1"
					)}
				>
					Business
					<ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
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
				<Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<Link
									to={`/credit/report/business/experian/status/resource/e/${entity_id}/g/${group_id}`}
									className={classNames(
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									Dun & Bradstreet
								</Link>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<Link
									to={`/credit/report/business/experian/status/resource/e/${entity_id}/g/${group_id}`}
									className={classNames(
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									Experian
								</Link>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

const SubNav = () => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	return (
		<div>
			<div className="sm:hidden bg-white">
				<select
					id="tabs"
					name="tabs"
					className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
					defaultValue={tabs.find((tab) => tab.current).name}
				>
					{tabs.map((tab) => (
						<option key={tab.name}>{tab.name}</option>
					))}
				</select>
			</div>
			<div className="hidden sm:flex sm:flex-row bg-white px-5 border-b border-gray-200">
				<div className="flex flex-row justify-between w-full items-center">
					<nav className="-mb-px flex space-x-5" aria-label="Tabs">
						{tabs.map((tab) => (
							<Link
								key={tab.name}
								to={tab.href({ entity_id, group_id })}
								className={classNames(
									tab.current(pathname)
										? "border-blue-500 text-blue-600"
										: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
									" border-b-2 py-2 px-1 text-center text-sm "
								)}
								aria-current={tab.current(pathname) ? "page" : undefined}
							>
								{tab.name}
							</Link>
						))}
						<BusinessDropdown />
					</nav>
					<div>
						<EllipsisHorizontalIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Report() {
	return (
		<div className="flex flex-col w-full h-full bg-gray-50 overflow-hidden">
			{/* <div>
				<SubNav />
			</div> */}
			<div className="flex flex-col w-full h-full overflow-hidden p-5">
				<Outlet />
			</div>
		</div>
	);
}
