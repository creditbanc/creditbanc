import { Fragment, useEffect, useState } from "react";
import { to_resource_pathname } from "~/utils/helpers";
import { useLocation } from "@remix-run/react";
import { DocumentIcon, FolderIcon } from "@heroicons/react/24/outline";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { filter, get } from "shades";
import { head, pipe } from "ramda";
import { redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";

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
		id: "report",
	},
	{
		name: "Documents",
		href: (pathname) =>
			`/credit/documents${to_resource_pathname(pathname)}`,
		icon: FolderIcon,
		current: false,
		id: "documents",
	},
];

const ReportTabsSelect = ({ selected }) => {
	selected = pipe(filter({ id: selected }), head)(tabs);
	const location = useLocation();

	const onSetSelected = (value) => {
		window.location = value.href(location.pathname);
	};

	return (
		<Listbox value={selected} onChange={onSetSelected}>
			{({ open }) => (
				<>
					<div className="relative mt-6">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
							<span className="block truncate">
								{selected.name}
							</span>
							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon
									className="h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{tabs.map((tab) => (
									<Listbox.Option
										key={tab.id}
										className={classNames(
											"relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
										)}
										value={tab}
									>
										<span
											className={classNames(
												tab.id == selected
													? "font-semibold"
													: "font-normal",
												"block truncate"
											)}
										>
											{tab.name}
										</span>
										{tab.id == selected && (
											<span
												className={classNames(
													"absolute inset-y-0 right-0 flex items-center pr-4"
												)}
											>
												<CheckIcon
													className="h-5 w-5"
													aria-hidden="true"
												/>
											</span>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
};

export default function ReportTabs({ selected = "report" }) {
	let location = useLocation();

	return (
		<div>
			<div className="sm:hidden px-4">
				<ReportTabsSelect selected={selected} />
			</div>
			<div className="hidden sm:block ml-5">
				<div className="border-b border-gray-200">
					<nav className="-mb-px flex space-x-8" aria-label="Tabs">
						{tabs.map((tab) => (
							<Link
								key={tab.name}
								to={tab.href(location.pathname)}
								className={classNames(
									selected == tab.id
										? "border-blue-500 text-blue-600"
										: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
									"group inline-flex items-center border-b-2 pt-4 pb-2 px-1 text-sm font-medium"
								)}
							>
								<tab.icon
									className={classNames(
										selected == tab.id
											? "text-blue-500"
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
			</div>
		</div>
	);
}
