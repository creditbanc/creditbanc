import { Link, Outlet, useLocation } from "@remix-run/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { classNames, get_entity_id, get_group_id, is_location } from "~/utils/helpers";

const navigation = [
	{
		name: "Account",
		href: ({ entity_id, group_id }) => `/settings/account/resource/e/${entity_id}/g/${group_id}`,
		icon: UserCircleIcon,
		selected: (pathname) => is_location("/settings/account", pathname),
	},
	// {
	// 	name: "Plan",
	// 	href: ({ entity_id, group_id }) =>
	// 		`/settings/plan/resource/e/${entity_id}/g/${group_id}`,
	// 	icon: FingerPrintIcon,
	// 	selected: (pathname) => is_location("/settings/plan", pathname),
	// },
	// {
	// 	name: "Bank Accounts",
	// 	href: ({ entity_id, group_id }) =>
	// 		`/settings/plaid/resource/e/${entity_id}/g/${group_id}`,
	// 	icon: BuildingLibraryIcon,
	// 	selected: (pathname) => is_location("/settings/plaid", pathname),
	// },
];

function Heading() {
	return (
		<div className="border-b border-gray-200 pb-5 w-full flex flex-col">
			<h3 className="text-base font-semibold leading-6 text-gray-900 px-8 lg:px-0">Settings</h3>
		</div>
	);
}

export default function Account() {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let location = useLocation();
	let current_tab = location.pathname;

	return (
		<div>
			<div className="flex flex-col items-center w-full pt-8">
				<div className="flex flex-col w-full lg:px-8">
					<Heading />
				</div>
			</div>

			<div className="flex flex-col lg:flex-row w-full gap-y-5 px-8 lg:py-8 lg:gap-x-5">
				<aside className="flex flex-col flex-1 py-4">
					<nav className="">
						<ul role="list" className="flex gap-x-3 gap-y-3 whitespace-nowrap lg:flex-col">
							{navigation.map((item) => (
								<li key={item.name}>
									<Link
										to={item.href({ entity_id, group_id })}
										className={classNames(
											item.selected(pathname)
												? "bg-gray-50 text-blue-600"
												: "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
											"group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold"
										)}
									>
										<item.icon
											className={classNames(
												item.href === current_tab
													? "text-blue-600"
													: "text-gray-400 group-hover:text-blue-600",
												"h-6 w-6 shrink-0"
											)}
											aria-hidden="true"
										/>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</aside>

				<main className="flex flex-col w-full lg:w-[75%]">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
