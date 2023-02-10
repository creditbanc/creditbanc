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
	{
		name: "Personal",
		href: (pathname) => "/credit/personal/personal",
		icon: UserIcon,
		current: true,
	},
	{
		name: "Accounts",
		href: (pathname) => "/credit/personal/accounts",
		icon: ListBulletIcon,
		current: false,
	},
];

export default function PersonalCreditTabs({ selected = "Personal" }) {
	return (
		<div className="border-b  border-gray-200 ">
			<nav
				className="-mb-px flex flex-row justify-start"
				aria-label="Tabs"
			>
				{tabs.map((tab) => (
					<a
						key={tab.name}
						href={tab.href()}
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
					</a>
				))}
			</nav>
		</div>
	);
}
