import { Link, Outlet, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { FingerPrintIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Nav from "~/components/TopNavNoSharing";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { create } from "zustand";

const useSettingsNavStore = create((set) => ({
	current: "/settings/plan",
	set_current_tab: (current) => set({ current }),
}));

const secondaryNavigation = [
	{
		name: "Account",
		href: "/settings/account",
		icon: UserCircleIcon,
	},
	{
		name: "Plan",
		href: "/settings/plan",
		icon: FingerPrintIcon,
	},
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export const loader = async ({ request }) => {
	let url = new URL(request.url);

	if (url.pathname == "/settings") return redirect("/settings/account");

	let entity_id = await get_session_entity_id(request);
	return { entity_id };
};

function Heading() {
	return (
		<div className="border-b border-gray-200 pb-5 w-full flex flex-col">
			<h3 className="text-base font-semibold leading-6 text-gray-900 px-8 lg:px-0">
				Settings
			</h3>
		</div>
	);
}

export default function Account() {
	var { entity_id } = useLoaderData();
	let location = useLocation();
	let current_tab = location.pathname;

	return (
		<div>
			<div className="flex flex-col w-full border-b">
				<Nav entity_id={entity_id} />
			</div>

			<div className="flex flex-col items-center w-full pt-8">
				<div className="flex flex-col max-w-7xl w-full lg:px-8">
					<Heading />
				</div>
			</div>

			<div className="mx-auto max-w-7xl lg:flex lg:gap-x-16 lg:px-8">
				<aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
					<nav className="flex-none px-4 sm:px-6 lg:px-0">
						<ul
							role="list"
							className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
						>
							{secondaryNavigation.map((item) => (
								<li key={item.name}>
									<Link
										to={item.href}
										className={classNames(
											item.href === current_tab
												? "bg-gray-50 text-indigo-600"
												: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
											"group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold"
										)}
									>
										<item.icon
											className={classNames(
												item.href === current_tab
													? "text-indigo-600"
													: "text-gray-400 group-hover:text-indigo-600",
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

				<main className="px-4 py-8 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
