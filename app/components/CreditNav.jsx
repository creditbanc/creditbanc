import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition, Dialog } from "@headlessui/react";
import { BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "@remix-run/react";
import {
	mapIndexed,
	to_group_pathname,
	to_resource_pathname,
} from "~/utils/helpers";
import { isEmpty, map, pipe } from "ramda";
import { useModalStore } from "~/hooks/useModal";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const BurgerIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className="w-6 h-6 text-gray-400"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
			/>
		</svg>
	);
};

const PersonIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke="currentColor"
			className="w-6 h-6"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
	);
};

const BusinessIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke="currentColor"
			className="w-6 h-6"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
			/>
		</svg>
	);
};

const SettingsIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke="currentColor"
			className="w-6 h-6"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
			/>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
	);
};

function Panel({ is_open, setPanel, reports = {} }) {
	let location = useLocation();

	const onLinkClick = (url) => {
		window.location.href = url;
	};

	if (isEmpty(reports)) {
		return <div></div>;
	}

	return (
		<Transition.Root show={is_open} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={setPanel}>
				<div className="fixed inset-0" />

				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-900"
								enterFrom="-translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-900"
								leaveFrom="translate-x-0"
								leaveTo="-translate-x-full"
							>
								<Dialog.Panel className="pointer-events-auto w-screen max-w-full">
									<div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
										<div className="px-4 sm:px-6 border-b">
											<div className="flex items-start justify-between">
												<Dialog.Title className="text-lg font-medium text-gray-900 w-full pb-2">
													Reports
												</Dialog.Title>
												<div className="ml-3 flex h-7 items-center">
													<button
														type="button"
														className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
														onClick={() =>
															setPanel(false)
														}
													>
														<span className="sr-only">
															Close panel
														</span>
														<XMarkIcon
															className="h-6 w-6"
															aria-hidden="true"
														/>
													</button>
												</div>
											</div>
										</div>
										<div className="relative mt-6 flex-1 px-4 sm:px-6">
											<div className="absolute inset-0 px-4 sm:px-6">
												<div
													className="w-full h-full "
													aria-hidden="true"
												>
													<fieldset>
														<div className="">
															<div className="flex flex-row">
																<div className="mr-2">
																	<PersonIcon />
																</div>
																<div>
																	Personal
																	reports
																</div>
															</div>

															<div className="py-5">
																{pipe(
																	mapIndexed(
																		(
																			report,
																			idx
																		) => (
																			<div
																				className="relative flex items-start ml-2"
																				onClick={() =>
																					onLinkClick(
																						"/credit/personal/report/personal" +
																							to_group_pathname(
																								location.pathname
																							) +
																							`/f/${report.id}` +
																							location.search
																					)
																				}
																				key={
																					idx
																				}
																			>
																				<div className="text-sm border-l pl-2 py-2">
																					<div className="font-medium text-gray-500 cursor-pointer">
																						{
																							report.id
																						}
																					</div>
																				</div>
																			</div>
																		)
																	)
																)(
																	reports.personal_credit_reports
																)}
															</div>

															<div className="flex flex-row">
																<div className="mr-2">
																	<BusinessIcon />
																</div>
																<div>
																	Business
																	reports
																</div>
															</div>

															<div className="py-5">
																{pipe(
																	mapIndexed(
																		(
																			report,
																			idx
																		) => (
																			<div
																				className="relative flex items-start ml-2"
																				key={
																					idx
																				}
																			>
																				<div className="text-sm border-l pl-2">
																					<div className="font-medium text-gray-500 cursor-pointer">
																						{
																							report.id
																						}
																					</div>
																				</div>
																			</div>
																		)
																	)
																)(
																	reports.business_credit_reports
																)}
															</div>
														</div>
													</fieldset>
												</div>
											</div>
											<div className="absolute bottom-0 left-[15px] right-[15px] flex flex-col border-t pt-3">
												<Link
													className="flex flex-row cursor-pointer w-[100px]"
													to={
														"/roles" +
														to_resource_pathname(
															location.pathname
														)
													}
												>
													<div className="mr-3">
														<SettingsIcon />
													</div>
													<div>Settings</div>
												</Link>
											</div>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}

export default function Nav({
	origin,
	can_share = false,
	reports = {},
	user_id = false,
}) {
	const location = useLocation();
	let url = origin + location.pathname + location.search;
	let resource_pathname = to_resource_pathname(url);
	let share_link = "/links/new" + resource_pathname;
	const [panel, setPanel] = useState(false);
	const set_open = useModalStore((state) => state.set_open);
	const is_open = useModalStore((state) => state.is_open);

	const onPanelToggle = () => {
		setPanel(!panel);
	};

	const onModalToggle = () => {
		set_open(!is_open);
	};

	return (
		<Disclosure as="nav" className="bg-white shadow top-0 sticky z-50">
			{({ open }) => (
				<>
					<Panel
						is_open={panel}
						setPanel={setPanel}
						reports={reports}
					/>

					<div className="mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex h-16 justify-between">
							<div className="flex flex-row">
								{user_id && (
									<div className="sm:hidden flex flex-col items-center justify-center mr-5">
										<div
											className="cursor-pointer"
											onClick={onPanelToggle}
										>
											<BurgerIcon />
										</div>
									</div>
								)}
								<a
									className="flex flex-shrink-0 items-center"
									href="/"
								>
									<img
										className="block h-8 w-auto lg:hidden"
										src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
										alt="Your Company"
									/>
									<img
										className="hidden h-8 w-auto lg:block"
										src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
										alt="Your Company"
									/>
								</a>
							</div>

							{can_share && (
								<div className="flex space-x-8 items-center">
									<div className="hidden sm:flex -space-x-2 overflow-hidden">
										<div className="relative inline-flex items-center justify-center w-9 h-9 overflow-hidden bg-white rounded-full border border-gray-200 text-xs ">
											<span className="font-medium text-gray-600 dark:text-gray-300">
												JL
											</span>
										</div>
										<div className="relative inline-flex items-center justify-center w-9 h-9 overflow-hidden bg-white rounded-full border border-gray-200 text-xs">
											<span className="font-medium text-gray-600 dark:text-gray-300">
												JL
											</span>
										</div>
										<div className="relative inline-flex items-center justify-center w-9 h-9 overflow-hidden bg-white rounded-full border border-gray-200 text-xs">
											<span className="font-medium text-gray-600 dark:text-gray-300">
												JL
											</span>
										</div>
										<div className="relative inline-flex items-center justify-center w-9 h-9 overflow-hidden rounded-full border text-gray-600 border-gray-200 bg-white text-xs">
											+99
										</div>
									</div>
									<div
										type="button"
										className="text-blue-700 border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800 flex flex-row items-center justify-center cursor-pointer"
										onClick={onModalToggle}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-5 h-5 mr-2"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
											/>
										</svg>
										<div>Share</div>
									</div>
								</div>
							)}

							{user_id && (
								<div className="ml-6 flex items-center">
									<Menu as="div" className="relative ml-3">
										<div>
											<Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
												<img
													className="h-8 w-8 rounded-full"
													src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
													alt=""
												/>
											</Menu.Button>
										</div>
										<Transition
											as={Fragment}
											enter="transition ease-out duration-200"
											enterFrom="transform opacity-0 scale-95"
											enterTo="transform opacity-100 scale-100"
											leave="transition ease-in duration-75"
											leaveFrom="transform opacity-100 scale-100"
											leaveTo="transform opacity-0 scale-95"
										>
											<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active
																	? "bg-gray-100"
																	: "",
																"block px-4 py-2 text-sm text-gray-700"
															)}
														>
															Your Profile
														</a>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active
																	? "bg-gray-100"
																	: "",
																"block px-4 py-2 text-sm text-gray-700"
															)}
														>
															Settings
														</a>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<Link
															to={"/signout"}
															className={classNames(
																active
																	? "bg-gray-100"
																	: "",
																"block px-4 py-2 text-sm text-gray-700"
															)}
														>
															Sign out
														</Link>
													)}
												</Menu.Item>
											</Menu.Items>
										</Transition>
									</Menu>
								</div>
							)}
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden">
						<div className="space-y-1 pt-2 pb-3">
							{/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
							<Disclosure.Button
								as="a"
								href="#"
								className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
							>
								Dashboard
							</Disclosure.Button>
							<Disclosure.Button
								as="a"
								href="#"
								className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
							>
								Team
							</Disclosure.Button>
						</div>
						<div className="border-t border-gray-200 pt-4 pb-3">
							<div className="flex items-center px-4">
								<div className="flex-shrink-0">
									<img
										className="h-10 w-10 rounded-full"
										src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
										alt=""
									/>
								</div>
								<div className="ml-3">
									<div className="text-base font-medium text-gray-800">
										Tom Cook
									</div>
									<div className="text-sm font-medium text-gray-500">
										tom@example.com
									</div>
								</div>
								<button
									type="button"
									className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								>
									<span className="sr-only">
										View notifications
									</span>
									<BellIcon
										className="h-6 w-6"
										aria-hidden="true"
									/>
								</button>
							</div>
							<div className="mt-3 space-y-1">
								<Disclosure.Button
									as="a"
									href="#"
									className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
								>
									Your Profile
								</Disclosure.Button>
								<Disclosure.Button
									as="a"
									href="#"
									className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
								>
									Settings
								</Disclosure.Button>
								<Disclosure.Button
									as="a"
									href="#"
									className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
								>
									Sign out
								</Disclosure.Button>
							</div>
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
