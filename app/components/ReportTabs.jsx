import { Fragment, useEffect, useState } from "react";
import { get_report_type, to_resource_pathname, trim } from "~/utils/helpers";
import { useLocation } from "@remix-run/react";
import { DocumentIcon, FolderIcon } from "@heroicons/react/24/outline";
import { Listbox, Transition, Menu } from "@headlessui/react";
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpDownIcon,
} from "@heroicons/react/20/solid";
import { filter, get, mod } from "shades";
import { defaultTo, head, pipe, split } from "ramda";
import { Link } from "@remix-run/react";
import { create } from "zustand";

const useReport = create((set) => ({
	type: "personal",
	set_report: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const business_tabs = [
	{
		name: "Documents",
		href: (pathname) =>
			`/credit/documents${to_resource_pathname(pathname)}`,
		icon: FolderIcon,
		current: false,
		id: "documents",
	},
];

const personal_tabs = [
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

const reports_items = [
	{
		name: "Experian",
		href: (pathname) =>
			`/credit/report/business/experian/overview${to_resource_pathname(
				pathname
			)}`,
		icon: FolderIcon,
		current: false,
		id: "experian",
	},
	{
		name: "Dun & Bradstreet",
		href: (pathname) =>
			`/credit/report/business/dnb/overview${to_resource_pathname(
				pathname
			)}`,
		icon: FolderIcon,
		current: false,
		id: "dnb",
	},
];

function BusinessReportsDropdown() {
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div className="flex flex-col h-full justify-end">
				<Menu.Button className="flex flex-row gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-500">
					Business Reports
					<ChevronDownIcon
						className="-mr-1 h-5 w-5 text-gray-400"
						aria-hidden="true"
					/>
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						{reports_items.map((item) => (
							<Menu.Item key={item.id}>
								{({ active }) => (
									<Link
										to={item.href(location.pathname)}
										className={classNames(
											active
												? "bg-gray-100 text-gray-900"
												: "text-gray-700",
											"block px-4 py-2 text-sm"
										)}
									>
										{item.name}
									</Link>
								)}
							</Menu.Item>
						))}
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}

const ReportTabsSelect = ({ selected = "experian" }) => {
	let report_type = useReport((state) => state.type);
	const location = useLocation();
	const tabs = report_type === "business" ? reports_items : personal_tabs;

	selected = pipe(
		filter({ id: selected }),
		head,
		defaultTo("experian")
	)(tabs);

	const onSetSelected = (value) => {
		window.location = value.href(location.pathname);
	};

	return (
		<Listbox value={selected} onChange={onSetSelected}>
			{({ open }) => (
				<>
					<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
						<span className="block truncate">{selected.name}</span>
						<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
							<ChevronUpDownIcon
								className="h-5 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</span>
					</Listbox.Button>

					<div className="relative mt-6">
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
	const report_type = useReport((state) => state.type);
	const set_report = useReport((state) => state.set_report);
	let location = useLocation();

	useEffect(() => {
		let report_type = get_report_type(location.pathname);
		if (report_type == "business" || report_type == "personal") {
			set_report(["type"], report_type);
		}
	}, [location.pathname]);

	const tabs = report_type == "business" ? business_tabs : personal_tabs;

	return (
		<div className="h-[40px] mt-3">
			<div className="sm:hidden px-2">
				<ReportTabsSelect selected={selected} />
			</div>
			<div className="hidden relative sm:block w-full ml-5 z-10 bg-white">
				<div className="border-b border-gray-200 flex flex-row">
					{report_type == "business" && <BusinessReportsDropdown />}
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
