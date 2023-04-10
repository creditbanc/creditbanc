import {
	UserIcon,
	ListBulletIcon,
	ClockIcon,
	BeakerIcon,
	BookOpenIcon,
	ChartPieIcon,
	ClipboardIcon,
	ScaleIcon,
	TrophyIcon,
	Bars3Icon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "@remix-run/react";
import { to_resource_pathname } from "~/utils/helpers";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const tabs = [
	{
		name: "Overview",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/personal/personal" +
			to_resource_pathname(pathname) +
			search,
		icon: Bars3Icon,
		current: true,
	},
	{
		name: "Personal",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/personal/personal" +
			to_resource_pathname(pathname) +
			search,
		icon: UserIcon,
		current: true,
	},
	{
		name: "History",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/personal/accounts" +
			to_resource_pathname(pathname) +
			search,
		icon: BookOpenIcon,
		current: false,
	},
	{
		name: "Debt Usage",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/personal/accounts" +
			to_resource_pathname(pathname) +
			search,
		icon: BeakerIcon,
		current: false,
	},
	{
		name: "Credit Age",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/personal/accounts" +
			to_resource_pathname(pathname) +
			search,
		icon: ClockIcon,
		current: false,
	},
	{
		name: "Account Mix",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/personal/accounts" +
			to_resource_pathname(pathname) +
			search,
		icon: ChartPieIcon,
		current: false,
	},
	{
		name: "Inquiries",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/personal/accounts" +
			to_resource_pathname(pathname) +
			search,
		icon: ClipboardIcon,
		current: false,
	},
	{
		name: "Debt vs Income",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/personal/accounts" +
			to_resource_pathname(pathname) +
			search,
		icon: ScaleIcon,
		current: false,
	},
	{
		name: "Score Factors",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/personal/accounts" +
			to_resource_pathname(pathname) +
			search,
		icon: TrophyIcon,
		current: false,
	},
];

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
		<div className="">
			<nav
				className="-mb-px flex flex-col justify-start"
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
								: " text-gray-500 hover:text-gray-700 hover:border-gray-300",
							"group inline-flex items-center py-4 px-2 border-b font-medium text-sm last-of-type:border-none"
						)}
					>
						<tab.icon
							className={classNames(
								selected == tab.name
									? "text-indigo-500"
									: "text-gray-500 group-hover:text-gray-500",
								"-ml-0.5 mr-3 h-5 w-5"
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
