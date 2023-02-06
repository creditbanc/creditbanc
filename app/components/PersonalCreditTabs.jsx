import {
	BuildingOfficeIcon,
	CreditCardIcon,
	UserIcon,
	UsersIcon,
} from "@heroicons/react/20/solid";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const tabs = [
	{ name: "Account", href: "#", icon: UserIcon, current: false },
	{ name: "Company", href: "#", icon: BuildingOfficeIcon, current: false },
	{ name: "Members", href: "#", icon: UsersIcon, current: true },
	{ name: "Billing", href: "#", icon: CreditCardIcon, current: false },
];

export default function PersonalCreditTabs() {
	return (
		<div className="border-b border-t border-gray-200 mt-[20px]">
			<nav
				className="-mb-px flex flex-row justify-between"
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
							"group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm"
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
