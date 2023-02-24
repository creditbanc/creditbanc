import { Link, useLocation } from "@remix-run/react";
import { equals, join, map, pipe, reject, split, __, includes } from "ramda";
import Nav from "~/components/Nav";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { is_root_path_p, to_resource_pathname } from "~/utils/helpers";

const FolderIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className="w-5 h-5 fill-blue-300 mr-[8px]"
		>
			<path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
		</svg>
	);
};

const FileIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			className="w-5 h-5 fill-blue-300 mr-[8px]"
		>
			<path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
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
			className="w-4 h-4 stroke-gray-800"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
			/>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
	);
};

const ShareIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 20 20"
		fill="currentColor"
		className="w-5 h-5"
	>
		<path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
		<path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
	</svg>
);

const ReportIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		className="w-5 h-5"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
		/>
	</svg>
);

const GroupIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 20 20"
		fill="currentColor"
		className="w-5 h-5"
	>
		<path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
	</svg>
);

const build_group_path = ({ pathname, resource_id }) => {
	return "/group" + to_resource_pathname(pathname) + `/g/${resource_id}`;
};

const build_file_path = ({ pathname, resource_id }) => {
	return (
		"/credit/personal/report/personal" +
		to_resource_pathname(pathname) +
		`/f/${resource_id}`
	);
};

const build_resource_path = ({ resource_id, pathname }) => {
	// console.log("build_resource_path");

	const is_root_path = pipe(is_root_path_p)(pathname);
	// console.log("is_root_path", is_root_path);
	// console.log("pathname", pathname);
	if (is_root_path) {
		return build_group_path({ pathname, resource_id });
	} else {
		return build_file_path({ pathname, resource_id });
	}
};

const build_action_path = ({ current_path, resource_action_path }) => {
	let path = pipe(split("/"), reject(equals("")), join("/"))(current_path);
	return `/${path}`;
};

const group_actions = [
	{
		text: "New Group",
		key: "new_group",
		href: (pathname) => `/group/new` + to_resource_pathname(pathname),
	},
	{
		text: "New Credit Report",
		key: "new_credit_report",
		href: (pathname) =>
			"/credit/personal/new" + to_resource_pathname(pathname),
	},
	{
		text: "Share",
		key: "new_link",
		href: (pathname) => "/links/new" + to_resource_pathname(pathname),
	},
];

const resource_actions = [
	{
		text: "Share",
		key: "new_link",
		href: (pathname) => "/links/new" + to_resource_pathname(pathname),
	},
];

let icons = {
	new_link: ShareIcon,
	new_credit_report: ReportIcon,
	new_group: GroupIcon,
};

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const ResourceFileActionsMenu = ({ resource }) => {
	const location = useLocation();
	let pathname = location.pathname;
	// console.log("ResourceActionsMenu");
	// console.log(resource);

	return (
		<div className="flex flex-col">
			<Popover className="relative">
				{({ open }) => (
					<>
						<Popover.Button
							className={classNames(
								open ? "text-gray-900" : "text-gray-500",
								"group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								className="w-5 h-5"
							>
								<path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
							</svg>
						</Popover.Button>

						<Transition
							as={Fragment}
							enter="transition ease-out duration-200"
							enterFrom="opacity-0 translate-y-1"
							enterTo="opacity-100 translate-y-0"
							leave="transition ease-in duration-150"
							leaveFrom="opacity-100 translate-y-0"
							leaveTo="opacity-0 translate-y-1"
						>
							<Popover.Panel className="absolute z-10 mt-2 w-screen max-w-[200px] transform right-0">
								<div className="overflow-hidden rounded shadow-lg ring-1 ring-black ring-opacity-5 ">
									<div className="border-b border-gray-200 bg-white px-5 py-2 ">
										<h3 className="text-sm font-medium leading-6 text-gray-900">
											Actions
										</h3>
									</div>
									<div className="relative grid  bg-white py-2">
										{resource_actions.map((item, idx) => (
											<Link
												to={item.href(
													pathname + `/f/1`
												)}
												key={idx}
												className="flex flex-row transition duration-150 ease-in-out hover:bg-gray-50 px-5 py-2 cursor-pointer text-sm"
											>
												<div className="mr-[10px]">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 20 20"
														fill="currentColor"
														className="w-5 h-5"
													>
														<path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
													</svg>
												</div>
												<div>{item.text}</div>
											</Link>
										))}
									</div>
								</div>
							</Popover.Panel>
						</Transition>
					</>
				)}
			</Popover>
		</div>
	);
};

const ResourceGroupActionsMenu = ({ resource_id }) => {
	const location = useLocation();
	let pathname = location.pathname;

	const Icon = ({ component: IconComponent }) => {
		return <IconComponent />;
	};

	return (
		<div className="flex flex-col">
			<Popover className="relative flex flex-col">
				{({ open }) => (
					<>
						<Popover.Button
							className={classNames(
								open ? "text-gray-900" : "text-gray-500",
								"group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								className="w-5 h-5"
							>
								<path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
							</svg>
						</Popover.Button>

						<Transition
							as={Fragment}
							enter="transition ease-out duration-200"
							enterFrom="opacity-0 translate-y-1"
							enterTo="opacity-100 translate-y-0"
							leave="transition ease-in duration-150"
							leaveFrom="opacity-100 translate-y-0"
							leaveTo="opacity-0 translate-y-1"
						>
							<Popover.Panel className="absolute z-10 mt-8 w-screen max-w-[200px] transform right-0">
								<div className="overflow-hidden rounded shadow-lg ring-1 ring-black ring-opacity-5 ">
									<div className="border-b border-gray-200 bg-white px-5 py-2 ">
										<h3 className="text-sm font-medium leading-6 text-gray-900">
											Actions
										</h3>
									</div>
									<div className="relative grid bg-white py-2">
										{group_actions.map((item, idx) => (
											<Link
												to={item.href(pathname)}
												key={idx}
												className="flex flex-row transition duration-150 ease-in-out hover:bg-gray-50 px-5 py-2 cursor-pointer text-sm"
											>
												<div className="mr-[10px]">
													<Icon
														component={
															icons[item.key]
														}
													/>
												</div>
												<div>{item.text}</div>
											</Link>
										))}
									</div>
								</div>
							</Popover.Panel>
						</Transition>
					</>
				)}
			</Popover>
		</div>
	);
};

let directory_type_enums = ["partition", "group", "directory"];

let is_directory_type = pipe(includes(__, directory_type_enums));

const ResourceFile = ({ resource }) => {
	// console.log("ResourceFile");
	// console.log(resource);
	const location = useLocation();
	let pathname = location.pathname;
	let is_directory_or_group = is_directory_type(resource.type);

	return (
		<div className="px-3 py-2" key={resource.id}>
			<div className="flex flex-row items-center justify-between">
				<div className="flex flex-col">
					<Link
						to={build_resource_path({
							pathname,
							resource_id: resource.id,
						})}
						className="flex flex-row items-center cursor-pointer"
					>
						{is_directory_or_group ? <FolderIcon /> : <FileIcon />}

						<p className="truncate text-sm text-gray-800">
							{resource.name || "Daniel Arzuaga"}
						</p>
					</Link>
				</div>
				<div className="flex flex-row items-center">
					<ResourceFileActionsMenu resource_id={resource.id} />
					<Link
						to={"/roles" + to_resource_pathname(location.pathname)}
						className="ml-2 flex flex-col cursor-pointer"
					>
						<SettingsIcon />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default function Directory({ data }) {
	const location = useLocation();
	let pathname = location.pathname;

	return (
		<div>
			<Nav />
			<div className="bg-white p-[10px] max-w-7xl mx-auto">
				<div className="py-2 flex flex-col">
					<div className="flex flex-row justify-between px-[5px]">
						<div className="flex flex-row items-center">
							<div className="flex flex-col mr-[10px]">
								Documents
							</div>
							<div className="flex flex-col">
								<Link
									to={
										"/roles" +
										to_resource_pathname(pathname)
									}
								>
									<SettingsIcon />
								</Link>
							</div>
						</div>
						<ResourceGroupActionsMenu />
					</div>
				</div>
				<ul
					role="list"
					className="divide-y divide-gray-200 border rounded"
				>
					{map(
						(resource) => (
							<ResourceFile
								key={resource.id}
								resource={resource}
							/>
						),
						data
					)}
				</ul>
			</div>
		</div>
	);
}
