import { to_resource_pathname } from "~/utils/helpers";
import { useLocation } from "@remix-run/react";
import { DocumentIcon, FolderIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const tabs = [
	{
		name: "Report",
		href: (pathname) =>
			`/credit/report/personal/personal${to_resource_pathname(pathname)}`,
		icon: DocumentIcon,
		current: true,
	},
	{
		name: "Documents",
		href: (pathname) =>
			`/credit/documents${to_resource_pathname(pathname)}`,
		icon: FolderIcon,
		current: false,
	},
];

export default function Tabs() {
	let location = useLocation();
	return (
		<div>
			<div className="sm:hidden">
				<label htmlFor="tabs" className="sr-only">
					Select a tab
				</label>

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
			<div className="hidden sm:block ml-5">
				<div className="border-b border-gray-200">
					<nav className="-mb-px flex space-x-8" aria-label="Tabs">
						{tabs.map((tab) => (
							<a
								key={tab.name}
								href={tab.href(location.pathname)}
								className={classNames(
									tab.current
										? "border-indigo-500 text-indigo-600"
										: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
									"group inline-flex items-center border-b-2 pt-4 pb-2 px-1 text-sm font-medium"
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
			</div>
		</div>
	);
}
