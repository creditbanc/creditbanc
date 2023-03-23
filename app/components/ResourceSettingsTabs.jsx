import { useLocation } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { to_resource_pathname } from "~/utils/helpers";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const tabs = [
	{ name: "Share", href: "#", current: true },
	{ name: "Links", href: "#", current: false },
];

export default function Tabs() {
	const location = useLocation();
	let { pathname } = location;

	return (
		<div className="px-[10px]">
			<div className="border-b border-gray-200 flex flex-row">
				<Link
					className="flex flex-col border border-gray-300 rounded cursor-pointer p-[3px] fixed top-[15px] right-[10px]"
					to={
						"/credit/report/personal/personal" +
						to_resource_pathname(pathname)
					}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 19 19"
						fill="currentColor"
						className="w-5 h-5 fill-gray-300 "
					>
						<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
					</svg>
				</Link>

				<nav className="-mb-px flex space-x-8" aria-label="Tabs">
					{tabs.map((tab) => (
						<a
							key={tab.name}
							href={tab.href}
							className={classNames(
								tab.current
									? "border-indigo-500 text-indigo-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
								"whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
							)}
							aria-current={tab.current ? "page" : undefined}
						>
							{tab.name}
						</a>
					))}
				</nav>
			</div>
		</div>
	);
}
