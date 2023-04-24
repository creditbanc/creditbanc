import { Link, useLocation } from "@remix-run/react";
import { tabs } from "~/data/personal_tabs";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export const PersonalCreditTabs = ({ selected = "Personal" }) => {
	let location = useLocation();
	let search_params = location.search;

	return (
		<div className="border-b border-gray-200 ">
			<nav
				className="-mb-px flex flex-row justify-start"
				aria-label="Tabs"
			>
				{tabs.map((tab) => (
					<Link
						key={tab.name}
						to={tab.href({
							search: search_params,
							pathname: location.pathname,
						})}
						className={classNames(
							selected == tab.name
								? "border-indigo-500 text-indigo-600"
								: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
							"group inline-flex items-center py-4 px-2 mr-2 border-b-2 font-medium text-sm"
						)}
					>
						<tab.icon
							className={classNames(
								selected == tab.name
									? "text-indigo-500"
									: "text-gray-400 group-hover:text-gray-500",
								"-ml-0.5 mr-2 h-5 w-5"
							)}
							aria-hidden="true"
						/>
						<span>{tab.name}</span>
					</Link>
				))}
			</nav>
		</div>
	);
};

export const PersonalCreditTabsVertical = ({ selected = "Personal" }) => {
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
