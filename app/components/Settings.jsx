import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition, Switch } from "@headlessui/react";
import {
	CheckIcon,
	ChevronUpDownIcon,
	PaperClipIcon,
} from "@heroicons/react/20/solid";
import {
	indexBy,
	pipe,
	values,
	prop,
	map,
	head,
	omit,
	keys,
	split,
	join,
	reject,
	equals,
	slice,
} from "ramda";
import { get, mod, all, filter } from "shades";
import { inspect } from "~/utils/helpers";
import { useSubmit, useFetcher, useLocation, Link } from "@remix-run/react";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const SelectComponent = ({ options = [], onSelectRole, selected_role }) => {
	return (
		<Listbox value={selected_role} onChange={onSelectRole}>
			{({ open }) => (
				<div className="relative mt-1">
					<Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
						<span className="block truncate">
							{selected_role.name}
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
							{map(
								(option) => (
									<Listbox.Option
										key={option.id}
										className={({ active }) =>
											classNames(
												active
													? "text-white bg-indigo-600"
													: "text-gray-900",
												"relative cursor-default select-none py-2 pl-3 pr-9"
											)
										}
										value={option.id}
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
													{option.name}
												</span>

												{option.id == selected.id ? (
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
								values(options)
							)}
						</Listbox.Options>
					</Transition>
				</div>
			)}
		</Listbox>
	);
};

const Toggle = ({ onToggleCallback, enabled }) => {
	return (
		<Switch
			checked={enabled}
			onChange={onToggleCallback}
			className={classNames(
				enabled ? "bg-indigo-600" : "bg-gray-200",
				"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
			)}
		>
			{/* <span className="sr-only">Use setting</span> */}
			<span
				className={classNames(
					enabled ? "translate-x-5" : "translate-x-0",
					"pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
				)}
			>
				<span
					className={classNames(
						enabled
							? "opacity-0 ease-out duration-100"
							: "opacity-100 ease-in duration-200",
						"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
					)}
					aria-hidden="true"
				>
					<svg
						className="h-3 w-3 text-gray-400"
						fill="none"
						viewBox="0 0 12 12"
					>
						<path
							d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
				<span
					className={classNames(
						enabled
							? "opacity-100 ease-in duration-200"
							: "opacity-0 ease-out duration-100",
						"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
					)}
					aria-hidden="true"
				>
					<svg
						className="h-3 w-3 text-indigo-600"
						fill="currentColor"
						viewBox="0 0 12 12"
					>
						<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
					</svg>
				</span>
			</span>
		</Switch>
	);
};

const CanView = ({
	permission_key,
	permission_value,
	role_id,
	onPermissionChange,
}) => {
	const onToggleCallback = () => {
		onPermissionChange({
			permission_key,
			permission_value: !permission_value,
			role_id,
		});
	};

	return (
		<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
			<dt className="text-sm font-bold text-gray-500">Public</dt>
			<dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
				<span className="flex-grow">
					Makes the files in the directory public to members
					(excluding private files).
				</span>
				<span className="ml-4 flex-shrink-0">
					<Toggle
						onToggleCallback={onToggleCallback}
						enabled={permission_value}
					/>
				</span>
			</dd>
		</div>
	);
};

const permissions_components = { can_view: CanView };

const PermissionComponent = ({
	permission_key,
	permission_value,
	role_id,
	onPermissionChange,
}) => {
	let Permission = permissions_components[permission_key];

	return (
		<Permission
			role_id={role_id}
			permission_key={permission_key}
			permission_value={permission_value}
			onPermissionChange={onPermissionChange}
		/>
	);
};

const Permissions = ({ permissions, role_id, onPermissionChange }) => {
	return (
		<div>
			<div className="flex flex-col border rounded-md p-[20px]">
				<div>
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						Permissions
					</h3>
					<p className="mt-1 max-w-2xl text-sm text-gray-500">
						General permissions for the role.
					</p>
				</div>
				<div className="mt-5 border-t border-gray-200">
					<dl className="divide-y divide-gray-200">
						{map(
							(permission_key) => (
								<div key={permission_key}>
									<PermissionComponent
										permission_key={permission_key}
										permission_value={
											permissions[permission_key]
										}
										role_id={role_id}
										onPermissionChange={onPermissionChange}
									/>
								</div>
							),
							keys(permissions_components)
						)}
					</dl>
				</div>
			</div>
		</div>
	);
};

const tabs = [
	{ name: "Roles", href: "#", current: true },
	{ name: "Links", href: "#", current: false },
	{ name: "Members", href: "#", current: false },
];

const build_directory_resource_path = ({ current_path }) => {
	return pipe(
		split("/"),
		reject(equals("")),
		slice(0, -1),
		join("/"),
		(path) => `/${path}`
	)(current_path);
};

export const Tabs = () => {
	const location = useLocation();
	let pathname = location.pathname;

	return (
		<div className="px-[10px]">
			<div className="border-b border-gray-200 flex flex-row">
				<Link
					className="flex flex-col border border-gray-300 rounded cursor-pointer p-[3px] fixed top-[15px] right-[10px]"
					to={build_directory_resource_path({
						current_path: pathname,
					})}
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
};

export default function Settings({ data }) {
	const settings = useFetcher();
	const defult_role = pipe(values, head)(data);
	const [selectedRole, setSelectedRole] = useState(defult_role);
	const [permissions, setPermissions] = useState(
		pipe(get("settings"))(defult_role)
	);

	let options = pipe(
		mod(all)((role) => ({ id: role.id, name: role.name })),
		values,
		indexBy(prop("id"))
	)(data);

	const onSelectRole = (role_id) => {
		setSelectedRole(pipe(get(role_id))(options));
	};

	const onPermissionChange = ({
		permission_key,
		permission_value,
		role_id,
	}) => {
		settings.submit(
			{ permission_key, permission_value, role_id },
			{
				method: "post",
				action: `/roles/1`,
			}
		);
	};

	useEffect(() => {
		setPermissions(pipe(get(selectedRole.id, "settings"))(data));
	}, [selectedRole]);

	useEffect(() => {
		if (settings.data) {
			let { permission_key, permission_value, role_id } = settings.data;

			setPermissions((prev) => ({
				...prev,
				[permission_key]: permission_value,
			}));
		}
	}, [settings]);

	return (
		<div>
			<Tabs />

			<div className="flex flex-col p-[10px]">
				<div className="flex flex-col mb-[20px]">
					<SelectComponent
						options={options}
						onSelectRole={onSelectRole}
						selected_role={selectedRole}
					/>
				</div>
				<div className="flex flex-col mb-[20px]">
					<Permissions
						permissions={permissions}
						role_id={selectedRole.id}
						onPermissionChange={onPermissionChange}
					/>
				</div>
			</div>
		</div>
	);
}
