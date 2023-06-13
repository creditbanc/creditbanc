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
} from "@heroicons/react/24/outline";
import {
	sample,
	classNames,
	get_file_id,
	mapIndexed,
	truncate,
} from "~/utils/helpers";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import Modal from "~/components/Modal";
import { useModalStore } from "~/hooks/useModal";
import { useEffect, Fragment, useState } from "react";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { useFilesStore } from "~/hooks/useFiles";
import { delete_doc, get_collection, storage } from "~/utils/firebase";
import {
	ref,
	getDownloadURL,
	uploadBytesResumable,
	getStorage,
	uploadBytes,
	listAll,
} from "firebase/storage";
import {
	findIndex,
	map,
	pipe,
	propEq,
	remove,
	includes,
	isEmpty,
	not,
} from "ramda";
import { set_doc } from "~/utils/firebase";
import moment from "moment";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { filter, matching, mod, get, all } from "shades";

export const useFileStore = create((set) => ({
	file: {},
	set_file: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

let file_id = "6449c89888b2aa8dd68202a8"; // this needs to be changed to the actual resource id

const navigation = [
	{ name: "All", href: "#", current: true, icon: ListBulletIcon },
	{ name: "Untagged", href: "#", current: false, icon: TagIcon },
	{
		name: "Tags",
		current: false,
		icon: ListBulletIcon,
		children: [
			{ name: "Form 1040", href: "#" },
			{ name: "Form W-2", href: "#" },
			{ name: "Form 1099", href: "#" },
		],
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

export const loader = async ({ request }) => {
	let queries = [
		{
			param: "resource_id",
			predicate: "==",
			value: file_id,
		},
	];

	let documents = await get_collection({ queries, path: ["vault"] });

	return {
		documents: pipe(map((doc) => ({ ...doc, visible: true })))(documents),
	};
};

const Heading = () => {
	let set_modal = useModalStore((state) => state.set_modal);

	const onUploadFileModalOpen = () => {
		set_modal({ id: "upload_file_modal", is_open: true });
	};

	return (
		<div className="border-b border-gray-200 pb-5">
			<div className="flex flex-row justify-between items-end">
				<div className="flex flex-col">
					<h3 className="text-base font-semibold leading-6 text-gray-900">
						Documents
					</h3>
				</div>
				<div className="flex flex-col">
					<button
						onClick={onUploadFileModalOpen}
						type="button"
						className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Upload
					</button>
				</div>
			</div>
		</div>
	);
};

const HeaderFilters = () => {
	let files = useFilesStore((state) => state.files);
	let set_files = useFilesStore((state) => state.set_files);

	const onFilterFiles = (tag_id) => {
		set_files(
			["files"],
			pipe(
				mod(all, "visible")(() => true),
				mod(matching({ tags: pipe(filter({ id: tag_id }), isEmpty) }))(
					(value) => ({ ...value, visible: false })
				)
			)(files)
		);
	};

	const onShowAllFiles = () => {
		set_files(["files"], pipe(mod(all, "visible")(() => true))(files));
	};

	return (
		<div className="flex flex-col w-full py-5">
			<div className="flex flex-row w-full items-center text-xs space-x-3">
				<div className="text-gray-400">Show</div>
				<div
					className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center"
					onClick={onShowAllFiles}
				>
					All
				</div>
				<div
					className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center"
					onClick={() => onFilterFiles("1040")}
				>
					Form 1040
				</div>
				<div
					className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center"
					onClick={() => onFilterFiles("1065")}
				>
					Form 1065
				</div>
				<div
					className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center"
					onClick={() => onFilterFiles("1099")}
				>
					Form 1099
				</div>
				<div
					className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center"
					onClick={() => onFilterFiles("1120")}
				>
					Form 1120
				</div>
				<div
					className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center"
					onClick={() => onFilterFiles("W-2")}
				>
					Form W-2
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center">
					2021
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center">
					2022
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center">
					2023
				</div>
			</div>
		</div>
	);
};

const FilesTableHeader = () => {
	return (
		<div className="flex flex-col w-full pt-5">
			<div className="flex flex-row w-full text-sm text-gray-400 items-center border-b pb-5">
				<div className="flex flex-col w-[40px]">
					<input
						type="checkbox"
						className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
					/>
				</div>
				<div className="flex flex-col w-[250px]">Name</div>
				<div className="flex flex-col flex-1">Tags</div>
				<div className="flex flex-col w-[80px]">Year</div>
				<div className="flex flex-col w-[100px]">Uploaded</div>
				<div className="flex flex-col w-[50px]"></div>
			</div>
		</div>
	);
};

let Category = ({ category }) => {
	let { bg_color, text_color, border_color } = sample(category_styles);

	return (
		<div
			className={`flex flex-col rounded-full w-[90px] overflow-hidden h-[25px] border -ml-[20px] first-of-type:ml-0 justify-center ${bg_color} ${text_color} ${border_color}`}
		>
			<div className={`flex flex-col w-[90%] px-2 overflow-hidden`}>
				<div className={`w-[300px]`}>{category}</div>
			</div>
		</div>
	);
};

const TableRow = ({ document }) => {
	let { name, tags, created_at, download_url } = document;

	return (
		<div className="flex flex-row w-full border-b py-3 items-center text-sm">
			<div className="flex flex-col w-[40px]">
				<input
					type="checkbox"
					className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
				/>
			</div>
			<div className="flex flex-col w-[250px]">
				<Link
					target="_blank"
					to={download_url}
					className="flex flex-row items-center space-x-3"
				>
					<div className="flex flex-col ">
						<DocumentIcon className="h-4 w-4 text-red-400" />
					</div>
					<div className="flex flex-col">{truncate(20, name)}</div>
				</Link>
			</div>
			<div className="flex flex-col flex-1">
				<div className="flex flex-row w-full">
					{pipe(
						mapIndexed((tag, tag_index) => (
							<Category category={tag.label} key={tag_index} />
						))
					)(tags)}
				</div>
			</div>
			<div className="flex flex-col w-[80px]">
				<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer items-center w-[60px]">
					2022
				</div>
			</div>
			<div className="flex flex-col w-[100px]">
				<div>{moment(created_at).format("MMM D, YYYY")}</div>
			</div>
			<div className="flex flex-col w-[50px]">
				<FileActionsDropdown document={document} />
			</div>
		</div>
	);
};

const NavIcon = ({ icon: Icon }) => {
	return <Icon className="h-5 w-5 text-gray-400" />;
};

const SideNav = () => {
	return (
		<ul role="list" className="flex flex-1 flex-col px-2 mt-2">
			{navigation.map((item) => (
				<li key={item.name}>
					{!item.children ? (
						<a
							href={item.href}
							className={classNames(
								item.current
									? "bg-gray-50"
									: "hover:bg-gray-50",
								"flex items-center w-full text-left rounded-md gap-x-3 text-sm leading-6 font-semibold text-gray-700 px-2 my-1 py-2"
							)}
						>
							<NavIcon icon={item.icon} />
							{item.name}
						</a>
					) : (
						<Disclosure as="div" defaultOpen={true}>
							{({ open }) => (
								<>
									<Disclosure.Button
										className={classNames(
											item.current
												? "bg-gray-50"
												: "hover:bg-gray-50",
											"flex items-center w-full text-left rounded-md gap-x-3 text-sm leading-6 font-semibold text-gray-700 py-2 px-2 my-1"
										)}
									>
										{open && (
											<NavIcon icon={ChevronDownIcon} />
										)}

										{!open && (
											<NavIcon icon={ChevronRightIcon} />
										)}

										{item.name}
									</Disclosure.Button>
									<Disclosure.Panel
										as="ul"
										className="mt-1 px-2"
									>
										{item.children.map((subItem) => (
											<li key={subItem.name}>
												<Disclosure.Button
													as="a"
													href={subItem.href}
													className={classNames(
														subItem.current
															? "bg-gray-50"
															: "hover:bg-gray-50",
														"flex flex-row items-center rounded-md py-2 pr-2 pl-4 text-sm leading-6 text-gray-700"
													)}
												>
													<div className="mr-2">
														<NavIcon
															icon={DocumentIcon}
														/>
													</div>
													{subItem.name}
												</Disclosure.Button>
											</li>
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
		let blob = await fetch(document.download_url).then((response) =>
			response.blob()
		);

		const url = window.URL.createObjectURL(
			new Blob([blob], { type: blob.type })
		);

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
		<Menu as="div" className="relative inline-block text-left">
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
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
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
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
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
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
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
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
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

const EditFileModal = () => {
	let set_modal = useModalStore((state) => state.set_modal);
	let set_file = useFileStore((state) => state.set_file);
	let set_files = useFilesStore((state) => state.set_files);
	let files = useFilesStore((state) => state.files);
	let file = useFileStore((state) => state.file);
	let { name = "", id, tags = [] } = file;

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

	const onAddTag = (tag) => {
		set_file(["file", "tags"], [...file.tags, tag]);
	};

	const onRemoveTag = (tag_index) => {
		set_file(["file", "tags"], remove(tag_index, 1, file.tags));
	};

	return (
		<Modal id="file_edit_modal" classes="min-w-[700px] min-h-[200px]">
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
						<input
							type="text"
							className="outline-none w-full"
							value={name}
							onChange={onChangeName}
						/>
					</div>
				</div>

				<div className="flex flex-col w-full space-y-3">
					<div className="flex flex-row justify-between">
						<div className="text-gray-400">Tags</div>
						<div className="text-gray-400 cursor-pointer">
							Clear
						</div>
					</div>
					<div className="flex flex-col w-full text-sm">
						<div className="flex flex-row w-full space-x-3">
							{pipe(
								mapIndexed((tag, tag_index) => (
									<div
										className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer"
										key={tag_index}
										onClick={() => onRemoveTag(tag_index)}
									>
										{tag.label}
									</div>
								))
							)(tags)}
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full space-y-2 border-t pt-3">
					<div className="flex flex-col w-full text-sm">
						<div className="flex flex-row w-full space-x-3">
							<div
								className="flex flex-col justify-center px-3 py-1 border rounded-full text-gray-500  cursor-pointer"
								onClick={() =>
									onAddTag({ id: "1040", label: "Form 1040" })
								}
							>
								Form 1040 +
							</div>
							<div
								className="flex flex-col justify-center px-3 py-1 border rounded-full text-gray-500  cursor-pointer"
								onClick={() =>
									onAddTag({ id: "W-2", label: "Form W-2" })
								}
							>
								Form W-2 +
							</div>
							<div
								className="flex flex-col justify-center px-3 py-1 border rounded-full text-gray-500  cursor-pointer"
								onClick={() =>
									onAddTag({ id: "1099", label: "Form 1099" })
								}
							>
								Form 1099 +
							</div>
							<div
								className="flex flex-col justify-center px-3 py-1 border rounded-full text-gray-500  cursor-pointer"
								onClick={() =>
									onAddTag({ id: "other", label: "Other" })
								}
							>
								Other +
							</div>
						</div>
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
		</Modal>
	);
};

const UploadForm = () => {
	const location = useLocation();
	// const file_id = get_file_id(location.pathname);
	const [file_name, set_file_name] = useState("");
	const [progress, set_progress] = useState(0);
	const set_modal = useModalStore((state) => state.set_modal);
	const files = useFilesStore((state) => state.files);
	const set_files = useFilesStore((state) => state.set_files);

	useEffect(() => {
		if (file_name === "") {
			set_progress(0);
		}
	}, [file_name]);

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

		const storageRef = ref(storage, `files/${file_id}/${id}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		const next = (snapshot) => {
			const current_progress = Math.round(
				(snapshot.bytesTransferred / snapshot.totalBytes) * 100
			);

			set_progress(current_progress);
		};

		const error = (error) => {
			console.log("error");
			console.log(error);
		};

		const complete = async () => {
			let download_url = await getDownloadURL(uploadTask.snapshot.ref);

			// console.log("download_url");
			// console.log(download_url);

			let payload = {
				name: file.name,
				download_url,
				tags: [],
				created_at: new Date().toISOString(),
				resource_id: file_id,
				id,
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
			<input
				id="file-upload"
				type="file"
				className="hidden"
				onChange={onSelectFile}
			/>

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
								className={`bg-blue-600 h-2.5 rounded-full ${
									progress > 0 ? `w-[${progress}%]` : "w-0"
								}`}
							></div>
						</div>
					</div>
				</div>
			)}

			<button
				className={`flex flex-row py-1 px-2 rounded justify-center items-center mt-1 ${
					file_name == ""
						? "cursor-not-allowed bg-gray-100 text-gray-400"
						: "text-white cursor-pointer bg-[#55CF9E]"
				}`}
				type="submit"
				disabled={file_name == ""}
			>
				{file_name !== "" && (
					<div className="w-[20px] mr-2 flex flex-col justify-center items-center h-full">
						<ArrowUpOnSquareIcon />
					</div>
				)}

				<div className="flex flex-col justify-center h-[40px]">
					Upload
				</div>
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
		<Modal id="upload_file_modal" classes="min-w-[700px]">
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
		</Modal>
	);
};

export default function Files() {
	let { documents = [] } = useLoaderData();
	const files = useFilesStore((state) => state.files);
	const set_files = useFilesStore((state) => state.set_files);

	useEffect(() => {
		set_files(["files"], documents);
	}, [documents]);

	return (
		<div className="flex flex-col w-full h-full p-5 ">
			<EditFileModal />
			<UploadFileModal />
			<div className="flex flex-row w-full border rounded h-full bg-white">
				<div className="flex flex-col w-[250px] border-r">
					<SideNav />
				</div>
				<div className="flex flex-col flex-1 p-5">
					<Heading />
					<HeaderFilters />
					<FilesTableHeader />
					<div className="flex flex-col w-full">
						{pipe(
							filter({ visible: true }),
							mapIndexed((document, document_index) => (
								<TableRow
									key={document_index}
									document={document}
								/>
							))
						)(files)}
					</div>
				</div>
			</div>
		</div>
	);
}
