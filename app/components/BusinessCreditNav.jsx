import { Fragment } from "react";
import { Link, useLocation } from "@remix-run/react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { tabs } from "~/data/personal_tabs";
import { pipe, head } from "ramda";
import { filter } from "shades";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export const VerticalNav = ({ selected = "Personal" }) => {
	let location = useLocation();
	let search_params = location.search;

	return (
		<nav className="flex flex-col justify-start" aria-label="Tabs">
			{tabs.map((tab) => (
				<Link
					key={tab.name}
					to={tab.href({
						search: search_params,
						pathname: location.pathname,
					})}
					className={classNames(
						selected == tab.id
							? " text-indigo-600"
							: " text-gray-500 hover:border-gray-300",
						"group inline-flex items-center py-4 px-2 border-b font-medium text-sm last-of-type:border-none pl-4 hover:text-indigo-600"
					)}
				>
					<tab.icon
						className={classNames(
							selected == tab.id
								? "text-indigo-500"
								: "text-gray-500 group-hover:text-indigo-600",
							"-ml-0.5 mr-3 h-5 w-5 hover:text-indigo-6"
						)}
						aria-hidden="true"
					/>
					<span>{tab.name}</span>
				</Link>
			))}
		</nav>
	);
};
