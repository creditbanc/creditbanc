import {
	BuildingOfficeIcon,
	CreditCardIcon,
	UserIcon,
	UsersIcon,
	ListBulletIcon,
} from "@heroicons/react/20/solid";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const tabs = [
	{ name: "Personal", href: "#", icon: UserIcon, current: true },
	{ name: "Accounts", href: "#", icon: ListBulletIcon, current: false },
];

export const TabsTwo = () => {
	return (
		<div>
			<nav
				className="isolate flex divide-x divide-gray-200 rounded-lg  border"
				aria-label="Tabs"
			>
				{tabs.map((tab, tabIdx) => (
					<a
						key={tab.name}
						href={tab.href}
						className={classNames(
							tab.current
								? "text-gray-900"
								: "text-gray-500 hover:text-gray-700",
							tabIdx === 0 ? "rounded-l-lg" : "",
							tabIdx === tabs.length - 1 ? "rounded-r-lg" : "",
							"group relative min-w-0 flex-1 overflow-hidden bg-white py-2 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
						)}
						aria-current={tab.current ? "page" : undefined}
					>
						<span>{tab.name}</span>
						<span
							aria-hidden="true"
							className={classNames(
								tab.current
									? "bg-indigo-500"
									: "bg-transparent",
								"absolute inset-x-0 bottom-0 h-0.5"
							)}
						/>
					</a>
				))}
			</nav>
		</div>
	);
};

export default function PersonalCreditTabs() {
	return (
		<div className="border-b  border-gray-200 ">
			<nav
				className="-mb-px flex flex-row justify-start"
				aria-label="Tabs"
			>
				{tabs.map((tab) => (
					<a
						key={tab.name}
						href={tab.href}
						className={classNames(
							tab.current
								? "border-indigo-500 text-indigo-600"
								: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
							"group inline-flex items-center py-4 px-2 mr-2 border-b-2 font-medium text-sm"
						)}
						aria-current={tab.current ? "page" : undefined}
					>
						<tab.icon
							className={classNames(
								tab.current
									? "text-indigo-500"
									: "text-gray-400 group-hover:text-gray-500",
								"-ml-0.5 mr-2 h-5 w-5"
							)}
							aria-hidden="true"
						/>
						<span>{tab.name}</span>
					</a>
				))}
			</nav>
		</div>
	);
}
