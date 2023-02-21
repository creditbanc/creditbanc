import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { map } from "ramda";
import { to_resource_pathname } from "~/utils/helpers";
import { useLocation, Link } from "@remix-run/react";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export const RolesSelect = ({ roles = [], onSelectRole, selected_role }) => {
	let location = useLocation();

	return (
		<div className="flex flex-row justify-between">
			<Listbox
				value={selected_role}
				onChange={onSelectRole}
				className="w-[100%]"
			>
				{({ open }) => (
					<div className="relative mt-1">
						<Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm min-h-[40px]">
							<span className="block truncate">
								{selected_role}
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
							<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-[calc(100%-20px)] rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{map(
									(option) => (
										<Listbox.Option
											key={option}
											className={({ active }) =>
												classNames(
													active
														? "text-white bg-indigo-600"
														: "text-gray-900",
													"relative cursor-default select-none py-2 pl-3 pr-9"
												)
											}
											value={option}
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
														{option}
													</span>

													{option == selected_role ? (
														<span
															className={classNames(
																active
																	? "text-white"
																	: "text-indigo-600",
																"absolute inset-y-0 right-0 flex items-center pr-4"
															)}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 24 24"
																fill="currentColor"
																className="w-6 h-6"
															>
																<path
																	fillRule="evenodd"
																	d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
																	clipRule="evenodd"
																/>
															</svg>
														</span>
													) : null}
												</>
											)}
										</Listbox.Option>
									),
									roles
								)}
							</Listbox.Options>
						</Transition>
					</div>
				)}
			</Listbox>
			<div className="w-[150px] flex flex-col items-end justify-center ml-[10px]">
				<Link
					to={"/roles/new" + to_resource_pathname(location.pathname)}
					type="button"
					className="w-[100%]"
				>
					<div className="flex flex-col items-center justify-center text-xs rounded-md border border-transparent bg-indigo-600 px-2 h-[40px] font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
						Create role
					</div>
				</Link>
			</div>
		</div>
	);
};
