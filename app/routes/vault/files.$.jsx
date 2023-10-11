import {
	ChevronDownIcon,
	DocumentIcon,
	ListBulletIcon,
	ChevronRightIcon,
	TagIcon,
	XMarkIcon,
	EllipsisHorizontalIcon,
	PencilIcon,
	ArrowDownTrayIcon,
	TrashIcon,
	ArrowUpOnSquareIcon,
	EyeIcon,
	FolderPlusIcon,
} from "@heroicons/react/24/outline";
import {
	sample,
	classNames,
	get_file_id,
	mapIndexed,
	truncate,
	get_group_id,
	get_entity_id,
	use_client_search_params,
	is_location,
	inspect,
	get_file_resource_path,
	get_file_resource_id,
	store,
	jsreduce,
	jsreduce_with_initial,
	get_file_resource_path_array,
} from "~/utils/helpers";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import Modal from "~/components/Modal";
import { useModalStore } from "~/hooks/useModal";
import { useEffect, Fragment, useState } from "react";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { useFilesStore } from "~/hooks/useFiles";
import { delete_doc, get_collection, get_doc, storage } from "~/utils/firebase";
import { ref, getDownloadURL, uploadBytesResumable, getStorage, uploadBytes, listAll } from "firebase/storage";
import {
	findIndex,
	map,
	pipe,
	propEq,
	remove,
	includes,
	isEmpty,
	not,
	uniqBy,
	prop,
	flatten,
	filter as rfilter,
	omit,
	values,
	pickAll,
	trim,
	identity,
	hasPath,
	head,
	intersperse,
	join,
	split,
	reduce,
	last,
	set,
} from "ramda";
import { set_doc } from "~/utils/firebase";
import moment from "moment";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { filter, matching, mod, get, all } from "shades";
import { is_authorized_f } from "~/api/auth";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { redirect } from "@remix-run/node";
import { FolderIcon } from "@heroicons/react/20/solid";
import { get_resource } from "~/utils/resource.server";

export const useFileStore = create((set) => ({
	file: {},
	set_file: (path, value) => set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const useSideNavStore = create((set) => ({
	selected: "all",
	set_state: (path, value) => set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const loader = async ({ request }) => {
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(request.url);
	let path = get_file_resource_path(request.url);

	let is_authorized = await is_authorized_f(entity_id, group_id, "vault", "read");

	if (!is_authorized) {
		return redirect(`/home/resource/e/${entity_id}/g/${group_id}`);
	}

	let queries = [
		{
			param: "group_id",
			predicate: "==",
			value: group_id,
		},
		{
			param: "path",
			predicate: "==",
			value: path,
		},
	];

	let documents = await get_collection({ path: ["vault"], queries });

	let tag_queries = [
		{
			param: "group_id",
			predicate: "==",
			value: group_id,
		},
	];

	let tags = await get_collection({ path: ["tags"], tag_queries });

	return { documents, all_tags: tags };
};

const balance_sheet_folders = [
	{
		parent: "balancesheet",
		id: "balancesheet2023",
		name: "2023",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/balancesheet/f/2023`,
	},
	{
		parent: "balancesheet",
		id: "balancesheet2022",
		name: "2022",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/balancesheet/f/2022`,
	},
	{
		parent: "balancesheet",
		id: "balancesheet2021",
		name: "2021",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/balancesheet/f/2021`,
	},
];

const income_statement_folders = [
	{
		parent: "incomestatement",
		id: "incomestatement2023",
		name: "2023",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/incomestatement/f/2023`,
	},
	{
		parent: "incomestatement",
		id: "incomestatement2022",
		name: "2022",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/incomestatement/f/2022`,
	},
	{
		parent: "incomestatement",
		id: "incomestatement2021",
		name: "2021",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/incomestatement/f/2021`,
	},
];

const tax_returns_folders = [
	{
		parent: "taxreturns",
		id: "taxreturns2023",
		name: "2023",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/taxreturns/f/2023`,
	},
	{
		parent: "taxreturns",
		id: "taxreturns2022",
		name: "2022",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/taxreturns/f/2022`,
	},
	{
		parent: "taxreturns",
		id: "taxreturns2021",
		name: "2021",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/taxreturns/f/2021`,
	},
];

const bank_statements_folders = [
	{
		parent: "bankstatements",
		id: "bankstatements2023",
		name: "2023",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/bankstatements/f/2023`,
	},
	{
		parent: "bankstatements",
		id: "bankstatements2022",
		name: "2022",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/bankstatements/f/2022`,
	},
	{
		parent: "bankstatements",
		id: "bankstatements2021",
		name: "2021",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/bankstatements/f/2021`,
	},
];

const corporate_documents_folders = [
	{
		parent: "corporatedocuments",
		id: "corporatedocuments2023",
		name: "2023",

		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/corporatedocuments/f/2023`,
	},
	{
		parent: "corporatedocuments",
		id: "corporatedocuments2022",
		name: "2022",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/corporatedocuments/f/2022`,
	},
	{
		parent: "corporatedocuments",
		id: "corporatedocuments2021",
		name: "2021",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/corporatedocuments/f/2021`,
	},
];

let folders = [
	{
		id: "balancesheet",
		name: "Balance sheets",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/balancesheet`,
		children: balance_sheet_folders,
	},
	{
		id: "incomestatement",
		name: "Income statements",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/incomestatement`,
		children: income_statement_folders,
	},
	{
		id: "taxreturns",
		name: "Tax returns",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/taxreturns`,
		children: tax_returns_folders,
	},
	{
		id: "bankstatements",
		name: "Bank statements",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/bankstatements`,
		children: bank_statements_folders,
	},
	{
		id: "corporatedocuments",
		name: "Corporate documents",
		href: ({ group_id, entity_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents/f/corporatedocuments`,
		children: corporate_documents_folders,
	},
];

let folders_path_map = {
	documents: folders,
	balancesheet: balance_sheet_folders,
	incomestatement: income_statement_folders,
	taxreturns: tax_returns_folders,
	bankstatements: bank_statements_folders,
	corporatedocuments: corporate_documents_folders,
};

const navigation = [
	{
		name: "All documents",
		id: "documents",
		current: true,
		icon: ListBulletIcon,
		href: ({ group_id, entity_id }) => `/vault/files/resource/e/${entity_id}/g/${group_id}/f/documents`,
	},
	{
		name: "Folders",
		current: false,
		icon: ListBulletIcon,
		children: folders,
	},
];

const category_styles = [
	{
		bg_color: "bg-red-100",
		text_color: "text-red-500",
		border_color: "border-red-500",
	},
	{
		bg_color: "bg-blue-100",
		text_color: "text-blue-500",
		border_color: "border-blue-500",
	},
	{
		bg_color: "bg-purple-100",
		text_color: "text-purple-500",
		border_color: "border-purple-500",
	},
	{
		bg_color: "bg-green-100",
		text_color: "text-green-500",
		border_color: "border-green-500",
	},
	{
		bg_color: "bg-orange-100",
		text_color: "text-orange-500",
		border_color: "border-orange-500",
	},
];

const Heading = () => {
	let { pathname } = useLocation();
	let resource_id = get_file_id(pathname);
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	let resource_paths = (pathname) => {
		let resource_path_array = get_file_resource_path_array(pathname);

		if (resource_path_array.length == 1) {
			return [`f/${resource_path_array[0]}`];
		}

		let paths = pipe(
			jsreduce((acc, curr, index) => {
				if (index == 1) {
					return [`f/${acc}`, `f/${acc}/f/${curr}`];
				}

				return [...acc, `${last(acc)}/f/${curr}`];
			})
		)(resource_path_array);
		return paths;
	};

	let resource_path_links = (pathname, entity_id, group_id) => {
		let paths = resource_paths(pathname);
		let payload = pipe(
			map((path) => ({
				id: pipe(split("/"), last, decodeURI)(path),
				href: decodeURI(`/vault/files/resource/e/${entity_id}/g/${group_id}/${path}`),
			}))
		)(paths);

		return payload;
	};

	let paths = resource_path_links(pathname, entity_id, group_id);

	let set_modal = useModalStore((state) => state.set_modal);

	let top_level_folders = pipe(filter(pipe(hasPath(["children"]), not)), map(pickAll(["id", "name"])))(navigation);
	let children = pipe(
		get(all, "children", all),
		flatten,
		filter(identity),
		map(pickAll(["id", "name", "children"]))
	)(navigation);

	let sub_children = pipe(
		get(all, "children", all),
		flatten,
		filter(identity),
		map(pickAll(["id", "name", "parent"]))
	)(children);

	let nav_folders = [...top_level_folders, ...children, ...sub_children];

	const onUploadFileModalOpen = () => {
		set_modal({ id: "upload_file_modal", is_open: true });
	};

	const onNewFolderModalOpen = () => {
		set_modal({ id: "new_folder_modal", is_open: true });
	};

	return (
		<div className="border-b border-gray-200 pb-2 bg-white py-3">
			<div className="flex flex-row justify-between items-end">
				<div className="flex flex-row gap-x-2">
					<div className="flex flex-row gap-x-2">
						{pipe(
							mapIndexed((path, index) => (
								<div
									key={index}
									className="flex flex-row gap-x-2 text-base font-semibold leading-6 text-gray-900"
								>
									<div>
										<Link to={path.href}>{path.id}</Link>
									</div>
									{index !== paths.length - 1 && <div>/</div>}
								</div>
							))
						)(paths)}
					</div>
				</div>
				<div className="flex flex-row gap-x-3">
					<div className="flex flex-col">
						<button
							onClick={onNewFolderModalOpen}
							type="button"
							className="rounded-full bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-500 shadow-sm"
						>
							<div className="flex flex-row items-center gap-x-2">
								<div>
									<FolderPlusIcon className="h-4 w-4" />
								</div>
								<div>New Folder</div>
							</div>
						</button>
					</div>
					<div className="flex flex-col">
						<button
							onClick={onUploadFileModalOpen}
							type="button"
							className="rounded-full bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-500 shadow-sm"
						>
							<div className="flex flex-row items-center gap-x-2">
								<div>
									<ArrowUpOnSquareIcon className="h-4 w-4" />
								</div>
								<div>Upload</div>
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

const HeaderFilters = () => {
	let { documents } = useLoaderData();
	// let files = useFilesStore((state) => state.files);
	let set_files = useFilesStore((state) => state.set_files);

	const onFilterFiles = (tag_id) => {
		set_files(
			["files"],
			pipe(
				filter({
					tags: (tags) => pipe(filter({ id: tag_id }), isEmpty, not)(tags),
				})
			)(documents)
		);
	};

	const onShowAllFiles = () => {
		set_files(["files"], documents);
	};

	return (
		<div className="flex flex-col w-full py-5">
			<div className="flex flex-row w-full items-center text-xs ">
				<div className="flex flex-row w-full  space-x-3">
					<div className="mt-1">
						<div className="text-gray-400">Show</div>
					</div>
					<div className="flex flex-row w-full flex-wrap gap-y-3">
						<div
							className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[50px] mr-3"
							onClick={onShowAllFiles}
						>
							All
						</div>
						<div
							className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[100px] mr-3"
							onClick={() => onFilterFiles("1040")}
						>
							Form 1040
						</div>
						<div
							className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[100px] mr-3"
							onClick={() => onFilterFiles("1065")}
						>
							Form 1065
						</div>
						<div
							className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[100px] mr-3"
							onClick={() => onFilterFiles("1099")}
						>
							Form 1099
						</div>
						<div
							className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[100px] mr-3"
							onClick={() => onFilterFiles("1120")}
						>
							Form 1120
						</div>
						<div
							className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[100px] mr-3"
							onClick={() => onFilterFiles("W-2")}
						>
							Form W-2
						</div>
						<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[50px] mr-3">
							2021
						</div>
						<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[50px] mr-3">
							2022
						</div>
						<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[50px] mr-3">
							2023
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const FilesTableHeader = () => {
	return (
		<div className="flex flex-col w-full bg-white top-0 sticky z-20">
			<div className="flex flex-row w-full text-sm text-gray-400 items-center border-b py-3">
				<div className="flex flex-col w-[40px]">
					{/* <input
						type="checkbox"
						className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
					/> */}
				</div>
				<div className="flex flex-col w-[250px]">Name</div>
				<div className="hidden lg:flex flex-col w-[300px]">Tags</div>
				{/* <div className="hidden lg:flex flex-col w-[80px]">Year</div> */}
				<div className="hidden lg:flex flex-col w-[100px]">Uploaded</div>
				<div className="flex flex-col w-[50px]"></div>
			</div>
		</div>
	);
};

let Category = ({ category }) => {
	let { bg_color, text_color, border_color } = sample(category_styles);

	return (
		<div
			className={`flex flex-col rounded-full max-w-[90px] overflow-hidden h-[25px] border -ml-[20px] first-of-type:ml-0 justify-center px-1.5 ${bg_color} ${text_color} ${border_color}`}
		>
			<div className={`flex flex-col w-[90%] px-2 overflow-hidden`}>
				<div className={`max-w-[200px] text-center`}>{category}</div>
			</div>
		</div>
	);
};

const TableRow = ({ document }) => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let { name, tags, created_at, download_url, path, id } = document;
	let set_modal = useModalStore((state) => state.set_modal);
	let set_file = useFileStore((state) => state.set_file);

	const onSelectFile = () => {
		set_file(["file"], document);

		set_modal({
			id: "file_edit_modal",
			is_open: true,
		});
	};

	return (
		<div className="flex flex-row w-full border-b py-3 items-center text-sm">
			<div className="flex flex-col w-[40px]">
				<input
					readOnly={true}
					checked={false}
					onClick={onSelectFile}
					type="checkbox"
					className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
				/>
			</div>
			<div className="flex flex-col w-[250px]">
				{document.type == "folder" && (
					<Link
						to={pipe(
							split("."),
							intersperse("f"),
							join("/"),
							(value) => `/vault/files/resource/e/${entity_id}/g/${group_id}/f/${value}/f/${name}`
						)(path)}
						className="flex flex-row items-center space-x-3"
					>
						<div className="flex flex-col ">
							<FolderIcon className="h-4 w-4 text-blue-400" />
						</div>
						<div className="flex flex-col">{truncate(20, name)}</div>
					</Link>
				)}

				{document.type != "folder" && (
					<Link target="_blank" to={download_url} className="flex flex-row items-center space-x-3">
						<div className="flex flex-col ">
							<DocumentIcon className="h-4 w-4 text-red-400" />
						</div>
						<div className="flex flex-col">{truncate(20, name)}</div>
					</Link>
				)}
			</div>
			<div className="hidden lg:flex flex-col w-[300px]">
				<div className="flex flex-row w-full">
					{pipe(mapIndexed((tag, tag_index) => <Category category={tag.id} key={tag_index} />))(tags)}
				</div>
			</div>
			{/* <div className="hidden lg:flex flex-col w-[80px]">
				<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer items-center w-[60px]">
					2022
				</div>
			</div> */}
			<div className="hidden lg:flex flex-col w-[100px]">
				<div>{moment(created_at).format("MMM D, YYYY")}</div>
			</div>
			<div className="flex flex-col flex-1">
				<FileActionsDropdown document={document} />
			</div>
		</div>
	);
};

const NavIcon = ({ icon: Icon }) => {
	return <Icon className="h-5 w-5 text-gray-400" />;
};

const SideNav = () => {
	const { pathname } = useLocation();
	let group_id = get_group_id(pathname);
	let entity_id = get_entity_id(pathname);
	let { documents } = useLoaderData();
	let set_nav = useSideNavStore((state) => state.set_state);

	const onsNavSelect = (param) => {
		set_nav(["selected"], param);
	};

	let tags = pipe(get(all, "tags"), flatten, uniqBy(prop("id")))(documents);

	const RenderFolderChild = ({ item }) => {
		if (!item.children)
			return (
				<Link key={index} to={item.href({ entity_id, group_id })}>
					<div className="flex flex-row w-full justify-between items-center hover:bg-gray-50 py-2 px-2 rounded">
						<div className="flex flex-row items-center gap-x-2">
							<div>
								<FolderIcon className="h-4 w-4 text-blue-400" />
							</div>
							<div>{item?.name}</div>
						</div>
						<div>
							<ChevronRightIcon className="h-4 w-4 text-gray-400" />
						</div>
					</div>
				</Link>
			);

		return (
			<Disclosure as="div" defaultOpen={false}>
				{({ open }) => (
					<div className="flex flex-col w-full">
						<div className="flex flex-row w-full items-center gap-x-1">
							<Disclosure.Button
								className={classNames(
									item.current ? "bg-gray-50" : "hover:bg-gray-50",
									"flex items-center text-left rounded-md gap-x-3 text-sm leading-6 text-gray-700 py-1 px-1 my-1"
								)}
							>
								{open && <ChevronDownIcon className="h-3 w-3 text-gray-400" />}

								{!open && <ChevronRightIcon className="h-3 w-3 text-gray-400" />}
							</Disclosure.Button>
							<Link to={item.href({ entity_id, group_id })}>
								<div className="flex flex-row w-full justify-between items-center hover:bg-gray-50 py-2 px-2 rounded">
									<div className="flex flex-row items-center gap-x-2">
										<div>{item?.name}</div>
									</div>
								</div>
							</Link>
						</div>
						<Disclosure.Panel as="ul" className="flex flex-col mt-1 pl-6 text-sm">
							{item.children.map((folder, index) => (
								<Link key={index} to={folder.href({ entity_id, group_id })}>
									<div className="flex flex-row w-full justify-between items-center hover:bg-gray-50 py-2 px-2 rounded">
										<div className="flex flex-row items-center gap-x-2">
											<div>
												<FolderIcon className="h-4 w-4 text-blue-400" />
											</div>
											<div>{folder?.name}</div>
										</div>
									</div>
								</Link>
							))}
						</Disclosure.Panel>
					</div>
				)}
			</Disclosure>
		);
	};

	return (
		<ul role="list" className="flex flex-1 flex-col px-2 mt-2">
			{navigation.map((item) => (
				<li key={item.name}>
					{!item.children ? (
						<Link
							to={item.href({ entity_id, group_id })}
							// onClick={() => onsNavSelect(item.id)}
							className={classNames(
								item.current ? "bg-gray-50" : "hover:bg-gray-50",
								"flex items-center w-full text-left rounded-md gap-x-3 text-sm leading-6 font-semibold text-gray-700 px-2 my-1 py-2 cursor-pointer"
							)}
						>
							<NavIcon icon={item.icon} />
							{item.name}
						</Link>
					) : (
						<Disclosure as="div" defaultOpen={true}>
							{({ open }) => (
								<>
									<Disclosure.Button
										className={classNames(
											item.current ? "bg-gray-50" : "hover:bg-gray-50",
											"flex items-center w-full text-left rounded-md gap-x-3 text-sm leading-6 font-semibold text-gray-700 py-2 px-2 my-1"
										)}
									>
										{open && <NavIcon icon={ChevronDownIcon} />}

										{!open && <NavIcon icon={ChevronRightIcon} />}

										{item.name}
									</Disclosure.Button>
									<Disclosure.Panel as="ul" className="flex flex-col mt-1 pl-6 text-sm">
										{item.children.map((folder, index) => (
											<RenderFolderChild key={index} item={folder} />
										))}
									</Disclosure.Panel>
								</>
							)}
						</Disclosure>
					)}
				</li>
			))}
		</ul>
	);
};

const FileActionsDropdown = ({ document }) => {
	let files = useFilesStore((state) => state.files);
	let set_files = useFilesStore((state) => state.set_files);
	let set_modal = useModalStore((state) => state.set_modal);
	let set_file = useFileStore((state) => state.set_file);

	const onEditFileClick = () => {
		set_file(["file"], document);

		set_modal({
			id: "file_edit_modal",
			is_open: true,
		});
	};

	const onDownloadFileClick = async () => {
		let blob = await fetch(document.download_url).then((response) => response.blob());

		const url = window.URL.createObjectURL(new Blob([blob], { type: blob.type }));

		const link = window.document.createElement("a");
		link.href = url;
		link.download = document.name;

		window.document.body.appendChild(link);
		link.click();

		link.parentNode.removeChild(link);
	};

	const onDeleteFileClick = async () => {
		let { id } = document;
		let file_path = ["vault", id];
		await delete_doc(file_path);

		let index = pipe(findIndex(propEq("id", id)))(files);
		set_files(["files"], remove(index, 1, files));
	};

	return (
		<Menu as="div" className="flex flex-col items-end relative text-left">
			<div>
				<Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
					<EllipsisHorizontalIcon className="h-5 w-5" />
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
				<Menu.Items className="absolute right-0 z-10 mt-3 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<Link
									to={document.download_url}
									target="_blank"
									className={classNames(
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"flex flex-row px-4 py-2 text-sm cursor-pointer items-center space-x-3"
									)}
								>
									<div>
										<EyeIcon className="h-4 w-4" />
									</div>
									<div>View</div>
								</Link>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<div
									onClick={onEditFileClick}
									className={classNames(
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"flex flex-row px-4 py-2 text-sm cursor-pointer items-center space-x-3"
									)}
								>
									<div>
										<PencilIcon className="h-4 w-4" />
									</div>
									<div>Edit</div>
								</div>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<div
									onClick={onDownloadFileClick}
									className={classNames(
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"flex flex-row px-4 py-2 text-sm cursor-pointer items-center space-x-3"
									)}
								>
									<div>
										<ArrowDownTrayIcon className="h-4 w-4" />
									</div>
									<div>Download</div>
								</div>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<div
									onClick={onDeleteFileClick}
									className={classNames(
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"flex flex-row px-4 py-2 text-sm cursor-pointer items-center space-x-3"
									)}
								>
									<div>
										<TrashIcon className="h-4 w-4" />
									</div>
									<div>Delete</div>
								</div>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

const use_tag_store = store({ name: "" });
const use_tags_store = store({ all_tags: [], file_tags: [] });

const EditFileModal = () => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let resource_path = get_file_resource_path(pathname);

	let set_modal = useModalStore((state) => state.set_modal);
	let set_file = useFileStore((state) => state.set_file);
	let set_files = useFilesStore((state) => state.set_files);
	let files = useFilesStore((state) => state.files);
	let file = useFileStore((state) => state.file);
	let { name = "", id } = file;

	let tag = use_tag_store((state) => state.name);
	let set_tag_path = use_tag_store((state) => state.set_path);

	let { all_tags = [], file_tags = [] } = use_tags_store((state) => state);
	let set_tags = use_tags_store((state) => state.set_path);

	useEffect(() => {
		let tags = pipe(filter((tag) => tag.resource_id == file.id))(all_tags);

		console.log("tags");
		console.log(all_tags);
		console.log(tags);
		console.log(file);
		set_tags(["file_tags"], tags);
	}, [file.id, all_tags]);

	const onCloseModal = () => {
		set_modal({
			id: "file_edit_modal",
			is_open: false,
		});
	};

	const onChangeName = (e) => {
		set_file(["file", "name"], e.target.value);
	};

	const update_files = () => {
		let { id } = file;
		let index = pipe(findIndex(propEq("id", id)))(files);
		set_files(["files"], pipe(mod(index)(() => file))(files));
	};

	const onSaveFileChanges = async () => {
		await set_doc(["vault", id], file);

		update_files();

		set_modal({
			id: "file_edit_modal",
			is_open: false,
		});
	};

	const onAddTag = async () => {
		let tag_id = uuidv4();
		let payload = {
			id: tag_id,
			name: tag,
			entity_id,
			group_id,
			path: resource_path,
			resource_id: file.id,
		};

		console.log("onAddTag");
		console.log(payload);
		console.log(file);

		set_tag_path(["name"], "");
		await set_doc(["tags", tag_id], payload);
		set_tags(["all_tags"], [...all_tags, payload]);
	};

	const onRemoveTag = (tag_index) => {
		// set_file(["file", "tags"], remove(tag_index, 1, file.tags));
	};

	// const DefaultTags = () => {
	// 	return (
	// 		<div className="flex flex-col w-full space-y-2 border-t pt-3">
	// 			<div className="flex flex-col w-full text-xs md:text-sm">
	// 				<div className="flex flex-row w-full space-x-3">
	// 					<div
	// 						className="flex flex-col justify-center px-3 py-1 border rounded-full text-gray-500  cursor-pointer"
	// 						onClick={() => onAddTag({ id: "1040", label: "Form 1040" })}
	// 					>
	// 						Form 1040 +
	// 					</div>
	// 					<div
	// 						className="flex flex-col justify-center px-3 py-1 border rounded-full text-gray-500  cursor-pointer"
	// 						onClick={() => onAddTag({ id: "W-2", label: "Form W-2" })}
	// 					>
	// 						Form W-2 +
	// 					</div>
	// 					<div
	// 						className="flex flex-col justify-center px-3 py-1 border rounded-full text-gray-500  cursor-pointer"
	// 						onClick={() => onAddTag({ id: "1099", label: "Form 1099" })}
	// 					>
	// 						Form 1099 +
	// 					</div>
	// 					<div
	// 						className="flex flex-col justify-center px-3 py-1 border rounded-full text-gray-500  cursor-pointer"
	// 						onClick={() => onAddTag({ id: "other", label: "Other" })}
	// 					>
	// 						Other +
	// 					</div>
	// 				</div>
	// 			</div>
	// 		</div>
	// 	);
	// };

	return (
		<Modal id="file_edit_modal">
			<div className="w-[calc(100vw-30px)] md:w-[700px] min-h-[200px] bg-white rounded-lg">
				<div className="flex flex-row w-full py-5 px-5 border-b text-2xl items-center">
					<div className="flex flex-row w-full items-center space-x-3">
						<div className="">
							<DocumentIcon className="h-6 w-6 text-red-400" />
						</div>
						<div>{truncate(30, name)}</div>
					</div>
					<div onClick={onCloseModal}>
						<XMarkIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
					</div>
				</div>
				<div className="flex flex-col w-full p-5 text-sm space-y-5">
					<div className="flex flex-col w-full space-y-2">
						<div className="text-gray-400">Document name</div>
						<div className="flex flex-col w-full border-2 rounded h-[50px] justify-center px-2 text-lg font-light">
							<input type="text" className="outline-none w-full" value={name} onChange={onChangeName} />
						</div>
					</div>

					<div className="flex flex-col w-full space-y-3">
						<div className="flex flex-row justify-between">
							<div className="text-gray-400">Tags</div>
							<div className="text-gray-400 cursor-pointer">Clear</div>
						</div>
						<div className="flex flex-col w-full text-sm">
							<div className="flex flex-row w-full space-x-3">
								{pipe(
									mapIndexed((tag, tag_index) => (
										<div
											className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer"
											key={tag_index}
											onClick={() => onRemoveTag(tag.id)}
										>
											{tag.name}
										</div>
									))
								)(file_tags)}
							</div>
						</div>
					</div>

					<div className="flex flex-row w-full border-t pt-3 gap-x-3">
						<div className="flex flex-col flex-1 border rounded p-1 px-3 text-base">
							<input
								type="text"
								name="tag"
								id="tag"
								value={tag}
								onChange={(e) => set_tag_path(["name"], e.target.value)}
								className="flex flex-col w-full h-full outline-none"
							/>
						</div>
						<div
							className="flex flex-col w-[100px] items-center py-2 px-3 bg-blue-600 text-white cursor-pointer"
							onClick={onAddTag}
						>
							Add Tag
						</div>
					</div>

					<div className="flex flex-col w-full">
						<div className="flex flex-row justify-end space-x-3">
							<button
								onClick={onCloseModal}
								type="button"
								className="bg-white text-gray-700 py-2 px-3 rounded border border-gray-700"
							>
								Cancel
							</button>
							<button
								type="button"
								className="bg-gray-700 text-white py-2 px-3 rounded"
								onClick={onSaveFileChanges}
							>
								Save
							</button>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};

const UploadForm = () => {
	const { pathname } = useLocation();
	let group_id = get_group_id(pathname);
	let entity_id = get_entity_id(pathname);
	const [file_name, set_file_name] = useState("");
	const [progress, set_progress] = useState(undefined);
	const set_modal = useModalStore((state) => state.set_modal);
	const files = useFilesStore((state) => state.files);
	const set_files = useFilesStore((state) => state.set_files);

	useEffect(() => {
		if (progress === 100) {
			set_modal({ id: "upload_file_modal", is_open: false });
		}
	}, [progress]);

	const onUpload = async (e) => {
		e.preventDefault();

		const file = e.target[0]?.files[0];
		if (!file) return;

		let id = uuidv4();

		const storageRef = ref(storage, `files/${group_id}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		const next = (snapshot) => {
			const current_progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
			// console.log("current_progress");
			// console.log(current_progress);

			set_progress(current_progress);
		};

		const error = (error) => {
			console.log("error");
			console.log(error);
		};

		const complete = async () => {
			let download_url = await getDownloadURL(uploadTask.snapshot.ref);
			let resource_id = get_file_id(pathname);
			let path = get_file_resource_path(pathname);

			let payload = {
				name: file.name,
				download_url,
				tags: [],
				created_at: new Date().toISOString(),
				group_id,
				entity_id,
				id,
				resource_id,
				type: file.type,
				size: file.size,
				path,
			};

			await set_doc(["vault", id], payload);

			set_files(["files"], [...files, payload]);
		};

		uploadTask.on("state_changed", next, error, complete);
	};

	const onSelectFile = (e) => {
		console.log("onSelectFile");
		// console.log(e.target.files[0]?.name);

		let file_name = e.target.files[0]?.name;
		set_file_name(file_name);
	};

	return (
		<form className="flex flex-col h-full" onSubmit={onUpload}>
			<input id="file-upload" type="file" className="hidden" onChange={onSelectFile} />

			{file_name === "" && (
				<label
					htmlFor="file-upload"
					className="flex flex-col items-center justify-center w-full border border-dashed rounded border-gray-300 text-gray-300 mb-1 h-[300px] cursor-pointer"
				>
					<div className="flex flex-col items-center">
						<div className="w-[50px] my-2">
							<ArrowUpOnSquareIcon />
						</div>
						<div>Click to select file</div>
					</div>
				</label>
			)}

			{file_name !== "" && (
				<div className="bg-gray-50 flex flex-col items-center rounded my-2 pb-3 pt-2">
					<div className="flex flex-row w-full mb-3">
						<div className="flex flex-col w-[50px] items-center">
							<div className="w-[30px] h-[30px] bg-[#fff] flex flex-col items-center justify-center border border-gray-300 rounded">
								<div className="w-[17px] flex flex-col items-center justify-center text-gray-400">
									<DocumentIcon />
								</div>
							</div>
						</div>
						<div className="flex flex-col grow justify-center">
							<p className="text-xs">{file_name}</p>
						</div>
						<div
							className="flex flex-col w-[15px] self-start mr-1.5 cursor-pointer text-gray-400"
							onClick={() => set_file_name("")}
						>
							<XMarkIcon />
						</div>
					</div>
					<div className="flex flex-col w-full px-2">
						<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
							<div
								className={`bg-blue-600 h-2.5 rounded-full w-0`}
								style={{ width: `${progress}%` }}
							></div>
						</div>
					</div>
				</div>
			)}

			<button
				className={`flex flex-row py-1 px-2 rounded justify-center items-center mt-1 ${
					progress !== undefined
						? "cursor-not-allowed bg-gray-100 text-gray-400"
						: "text-white cursor-pointer bg-[#55CF9E]"
				}`}
				type="submit"
				disabled={progress !== undefined}
			>
				{file_name !== "" && (
					<div className="w-[20px] mr-2 flex flex-col justify-center items-center h-full">
						<ArrowUpOnSquareIcon />
					</div>
				)}

				<div className="flex flex-col justify-center h-[40px]">Upload {progress}</div>
			</button>
		</form>
	);
};

const UploadFileModal = () => {
	let set_modal = useModalStore((state) => state.set_modal);

	const onCloseModal = () => {
		set_modal({ id: "upload_file_modal", is_open: false });
	};

	return (
		<Modal id="upload_file_modal">
			<div className="flex flex-col h-full w-[calc(100vw-30px)] md:w-[700px] rounded-lg bg-white">
				<div className="flex flex-row w-full py-5 px-5 border-b text-2xl items-center">
					<div className="flex flex-row w-full items-center space-x-3 text-gray-400">
						<div className="">
							<DocumentIcon className="h-6 w-6 " />
						</div>
						<div>Upload File</div>
					</div>
					<div onClick={onCloseModal}>
						<XMarkIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
					</div>
				</div>
				<div className="flex flex-col p-5 ">
					<UploadForm />
				</div>
			</div>
		</Modal>
	);
};

const use_folder_store = store({ name: "" });

const NewFolderForm = () => {
	let name = use_folder_store((state) => state.name);
	let set_path = use_folder_store((state) => state.set_path);
	let { pathname } = useLocation();
	let group_id = get_group_id(pathname);
	let entity_id = get_entity_id(pathname);
	let resource_id = get_file_resource_id(pathname);
	let file_path = get_file_resource_path(pathname);
	let files = useFilesStore((state) => state.files);
	let set_files = useFilesStore((state) => state.set_files);
	let set_modal = useModalStore((state) => state.set_modal);

	const onCreateNewFolder = async () => {
		let id = uuidv4();

		let payload = {
			name,
			tags: [],
			created_at: new Date().toISOString(),
			group_id,
			entity_id,
			id,
			type: "folder",
			path: file_path,
		};

		await set_doc(["vault", id], payload);

		set_files(["files"], [...files, payload]);

		set_modal({
			id: "new_folder_modal",
			is_open: false,
		});
	};

	return (
		<div className="flex flex-col w-full gap-y-3">
			<div className="flex flex-col w-full gap-y-2">
				<div className="text-gray-400">Folder name</div>
				<div className="flex flex-col w-full border-2 rounded h-[50px] justify-center px-2 text-lg font-light">
					<input
						type="text"
						className="outline-none w-full"
						placeholder="name"
						value={name}
						onChange={(e) => set_path(["name"], e.target.value)}
					/>
				</div>
			</div>
			<div className="flex flex-col w-full border-t items-end pt-3 mt-3 text-sm">
				<div
					className="flex flex-col px-5 py-1 bg-blue-600 text-white rounded-full cursor-pointer"
					onClick={onCreateNewFolder}
				>
					Save
				</div>
			</div>
		</div>
	);
};

const NewFolderModal = () => {
	let set_modal = useModalStore((state) => state.set_modal);

	const onCloseModal = () => {
		set_modal({ id: "new_folder_modal", is_open: false });
	};

	return (
		<Modal id="new_folder_modal">
			<div className="flex flex-col h-full w-[calc(100vw-30px)] md:w-[700px] rounded-lg bg-white">
				<div className="flex flex-row w-full py-5 px-5 border-b text-2xl items-center">
					<div className="flex flex-row w-full items-center space-x-3 text-gray-400">
						<div className="">
							<DocumentIcon className="h-6 w-6 " />
						</div>
						<div>Create New Folder</div>
					</div>
					<div onClick={onCloseModal}>
						<XMarkIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
					</div>
				</div>
				<div className="flex flex-col p-5 ">
					<NewFolderForm />
				</div>
			</div>
		</Modal>
	);
};

const FolderRow = ({ folder }) => {
	const { pathname } = useLocation();
	let group_id = get_group_id(pathname);
	let entity_id = get_entity_id(pathname);

	return (
		<Link
			to={folder.href({ group_id, entity_id })}
			className="flex flex-row w-full border-b py-3 items-center text-sm cursor-pointer"
		>
			<div className="flex flex-col w-[40px]">
				<FolderIcon className="h-5 w-5 text-blue-400" />
			</div>
			<div className="flex flex-col w-[250px]">
				<div className="flex flex-col">{folder.name}</div>
			</div>
		</Link>
	);
};

export default function Files() {
	const { pathname } = useLocation();
	let { documents = [], all_tags = [] } = useLoaderData();
	const files = useFilesStore((state) => state.files);
	const set_files = useFilesStore((state) => state.set_files);
	const selected_nav = useSideNavStore((state) => state.selected);
	const resource_id = get_file_resource_id(pathname);
	const file_path = get_file_resource_path(pathname);
	const set_tags = use_tags_store((state) => state.set_path);

	useEffect(() => {
		// console.log("all_tags");
		// console.log(all_tags);
		if (!isEmpty(all_tags)) {
			set_tags(["all_tags"], all_tags);
		}
	}, [all_tags]);

	useEffect(() => {
		set_files(["files"], documents);
	}, [documents]);

	useEffect(() => {
		if (selected_nav == "all") {
			return set_files(["files"], documents);
		}

		if (selected_nav == "untagged") {
			return set_files(["files"], filter({ tags: (tags) => isEmpty(tags) })(documents));
		}

		set_files(
			["files"],
			pipe(
				filter({
					tags: (tags) => pipe(filter({ id: selected_nav }), isEmpty, not)(tags),
				})
			)(documents)
		);
	}, [selected_nav]);

	const DefaultFolders = ({ resource_id }) => {
		let path = folders_path_map[resource_id];
		if (!path) return null;
		return <div>{pipe(mapIndexed((folder, index) => <FolderRow key={index} folder={folder} />))(path)}</div>;
	};

	return (
		<div className="flex flex-col w-full h-full p-5">
			<EditFileModal />
			<UploadFileModal />
			<NewFolderModal />
			<div className="flex flex-row h-full space-x-4">
				<div className="flex flex-row w-full border rounded h-full bg-white flex-1">
					<div className="hidden lg:flex flex-col w-[250px] border-r">
						<SideNav />
					</div>
					<div className="flex flex-col flex-1 px-5 pb-5 overflow-y-scroll relative  scrollbar-none bg-white">
						<Heading />
						{/* <HeaderFilters /> */}
						<FilesTableHeader />
						<DefaultFolders resource_id={resource_id} />

						<div className="flex flex-col w-full mb-[50px]">
							{pipe(
								// filter({ visible: true }),
								mapIndexed((document, document_index) => (
									<TableRow key={document_index} document={document} />
								))
							)(files)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
