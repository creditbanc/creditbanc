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

export function CreditTabsSelect({ selected = "Personal" }) {
	selected = pipe(filter({ id: selected }), head)(tabs);
	let location = useLocation();
	let search_params = location.search;

	const onSelectTab = (tab) => {
		window.location = tab.href({
			search: search_params,
			pathname: location.pathname,
		});
	};

	return (
		<Listbox value={selected} onChange={onSelectTab}>
			{({ open }) => (
				<>
					<div className="relative mt-2">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6">
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
										className={({ active }) =>
											classNames(
												active
													? "bg-blue-600 text-white"
													: "text-gray-900",
												"relative cursor-default select-none py-2 pl-3 pr-9"
											)
										}
										value={tab}
									>
										{({ selected, active }) => (
											<>
												<span
													className={classNames(
														selected
															? "font-semibold"
															: "font-normal",
														"block truncate"
													)}
												>
													{tab.name}
												</span>

												{selected ? (
													<span
														className={classNames(
															active
																? "text-white"
																: "text-blue-600",
															"absolute inset-y-0 right-0 flex items-center pr-4"
														)}
													>
														<CheckIcon
															className="h-5 w-5"
															aria-hidden="true"
														/>
													</span>
												) : null}
											</>
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
								? "border-blue-500 text-blue-600"
								: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
							"group inline-flex items-center py-4 px-2 mr-2 border-b-2 font-medium text-sm"
						)}
					>
						<tab.icon
							className={classNames(
								selected == tab.name
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
	);
};

export const PersonalCreditTabsVertical = ({ selected = "Personal" }) => {
	let location = useLocation();
	let search_params = location.search;

	return (
		<nav
			className="flex flex-col justify-start bg-white rounded border"
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
						selected == tab.id
							? " text-blue-600"
							: " text-gray-500 hover:border-gray-300",
						"group inline-flex items-center py-4 px-2 border-b font-medium text-sm last-of-type:border-none pl-4 hover:text-blue-600"
					)}
				>
					<tab.icon
						className={classNames(
							selected == tab.id
								? "text-blue-500"
								: "text-gray-500 group-hover:text-blue-600",
							"-ml-0.5 mr-3 h-5 w-5 hover:text-blue-6"
						)}
						aria-hidden="true"
					/>
					<span>{tab.name}</span>
				</Link>
			))}
		</nav>
	);
};
