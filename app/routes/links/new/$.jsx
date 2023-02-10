import { Fragment, useState } from "react";
import { useLocation, useLoaderData, useHref, Link } from "@remix-run/react";
import ResourceSettingsTabs from "~/components/ResourceSettingsTabs";
import { get_resource_permissions } from "~/utils/role.server";
import { get_group_id, to_resource_pathname } from "~/utils/helpers";
import { keys, head, pipe, defaultTo, map } from "ramda";
import { Listbox, Transition, Switch } from "@headlessui/react";
import { ChevronUpDownIcon, EnvelopeIcon } from "@heroicons/react/20/solid";
import copy from "copy-to-clipboard";

const LinkIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className="w-6 h-6"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
			/>
		</svg>
	);
};

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const SelectComponent = ({ roles = [], onSelectRole, selected_role }) => {
	// let location = useLocation();
	// console.log("SelectComponent");
	// console.log(roles);
	// console.log(selected_role);
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
							<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
		</div>
	);
};

export const loader = async ({ request }) => {
	let group_id = get_group_id(request.url);
	let permissions = await get_resource_permissions({ group_id });
	let url = new URL(request.url);
	return { url, permissions };
};

export default function NewLink() {
	const location = useLocation();
	const { url: current_url, permissions } = useLoaderData();
	const url = new URL(current_url);
	const origin = url.origin;
	let [shareLink, setShareLink] = useState(
		origin +
			"/credit/personal/personal" +
			to_resource_pathname(location.pathname)
	);
	const roles = pipe(keys)(permissions);
	const [selectedRole, setSelectedRole] = useState(
		pipe(head, defaultTo(""))(roles)
	);

	const onSelectRole = (role_id) => {
		setSelectedRole(role_id);
	};

	const onCopyLink = () => {
		copy(shareLink + "?role=" + selectedRole);
	};

	return (
		<div className="flex flex-col">
			<ResourceSettingsTabs />

			<div className="w-full p-[20px] max-w-lg mx-auto">
				<div className="text-center mb-[20px]">
					<div className="flex flex-col items-center">
						<LinkIcon />
					</div>
					<h2 className="mt-2 mb-2 text-lg font-medium text-gray-900">
						Create shareable link
					</h2>
					<p className="mt-1 text-sm text-gray-500">
						Use links to share and invite people.
					</p>
				</div>

				<div className="flex flex-col max-w-lg relative">
					<div className="text-gray-400 text-sm mb-[10px]">Roles</div>
					<SelectComponent
						roles={roles}
						onSelectRole={onSelectRole}
						selected_role={selectedRole}
					/>
				</div>
				<div className="mt-[20px] flex flex-col relative">
					<div className="text-gray-400 text-sm mb-[10px]">
						Document Link
					</div>
					<div className="flex flex-col">
						<div
							className="flex flex-col justify-center h-[45px] w-full rounded-md border pl-[10px] border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							placeholder="Role name"
						>
							<div className="overflow-scroll w-[calc(100%-35px)] scrollbar-none text-gray-400 text-sm">
								{shareLink}
							</div>
						</div>

						<button
							className="absolute right-[10px] flex flex-col items-center justify-center h-[45px]"
							type="submit"
							onClick={onCopyLink}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-4 h-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
								/>
							</svg>
						</button>
					</div>
				</div>
				<div className="mt-[25px]">
					<button
						type="button"
						className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-blue-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						onClick={onCopyLink}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-3 h-3 mr-[5px]"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
							/>
						</svg>
						Copy link
					</button>
				</div>
			</div>
		</div>
	);
}
