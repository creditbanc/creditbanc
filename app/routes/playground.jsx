import {
	DocumentIcon,
	SparklesIcon,
	ChevronDownIcon,
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

import { mapIndexed } from "~/utils/helpers";
import { pipe } from "ramda";
import { delete_doc, get_collection, get_doc, server_timestamp, storage } from "~/utils/firebase";
import { ref, getDownloadURL, uploadBytesResumable, getStorage, uploadBytes, listAll } from "firebase/storage";
import { useModalStore } from "~/hooks/useModal";
import Modal from "~/components/Modal";
import { useState } from "react";

const files = [
	{
		year: 2020,
	},
	{
		year: 2021,
	},
	{
		year: 2022,
	},
	{
		year: 2023,
	},
];

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
				<div className="flex flex-col p-5 ">{/* <File /> */}</div>
			</div>
		</Modal>
	);
};

const File = ({ file }) => {
	let { is_open, set_modal } = useModalStore((state) => state);
	let [file_name, set_file_name] = useState("a");
	const [progress, set_progress] = useState(50);

	const onUpload = async (e) => {
		console.log("onUpload");
		e.preventDefault();

		const file = e.target[0]?.files[0];
		if (!file) return;

		let file_name = file.name;
		set_file_name(file_name);

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

			let event_id = uuidv4();

			let event_payload = {
				id: event_id,
				created_at: server_timestamp(),
				entity_id,
				group_id,
				...pipe(filter({ resource: "vault", id: "upload" }), head)(events_map),
				meta: {
					name: payload.name,
					id: payload.id,
					download_url: payload.download_url,
					path: payload.path,
				},
			};

			console.log("event_payload");
			console.log(event_payload);

			// await set_doc(["events", event_id], event_payload);
			// await set_doc(["vault", id], payload);

			set_files(["files"], [...files, payload]);
		};

		uploadTask.on("state_changed", next, error, complete);
	};

	// const onSelectFile = (e) => {
	// 	console.log("onSelectFile");
	// 	// console.log(e.target.files[0]?.name);

	// 	let file_name = e.target.files[0]?.name;
	// 	set_file_name(file_name);
	// };

	const UploadFileButton = () => {
		return (
			<form className="flex flex-col h-full">
				{/* {file_name !== "" && (
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
						</div>
						<div
							className="flex flex-col w-[15px] self-start mr-1.5 cursor-pointer text-gray-400"
							onClick={() => set_file_name("")}
						>
							<XMarkIcon />
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
				)} */}

				<div className={`flex flex-row`} disabled={progress !== undefined}>
					<input id="file-upload" type="file" className="hidden" onChange={onUpload} />

					<label
						htmlFor="file-upload"
						className="flex flex-col items-center justify-center w-full cursor-pointer "
					>
						<div>Click to select file</div>
					</label>
				</div>
			</form>
		);
	};

	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-row w-full items-center justify-between">
				<div className="flex min-w-0 gap-x-4">
					<div className="flex flex-col justify-center">
						<DocumentIcon className="flex-shrink-0 h-6 w-6 text-gray-400" />
					</div>
					<div className="min-w-0 flex-auto">
						<p className="text-sm font-semibold leading-6 text-gray-900">
							{file_name == "" ? file.year : file_name}
						</p>
					</div>
				</div>
				<div className="flex flex-row gap-x-3">
					<div className="flex flex-col items-center justify-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 border cursor-pointer">
						Don't have
					</div>
					<div className="flex flex-col items-center justify-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 border cursor-pointer">
						<UploadFileButton />
					</div>
				</div>
			</div>
			<div className="flex flex-col w-full mt-5">
				<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
					<div className={`bg-blue-600 h-2.5 rounded-full w-0`} style={{ width: `${progress}%` }}></div>
				</div>
			</div>
		</div>
	);
};

const Upload = () => {
	return (
		<div className="flex flex-col w-full px-1 pt-5 bg-white rounded">
			<UploadFileModal />
			<div className="flex flex-row justify-between border-b pb-3 mb-3">
				<div className="flex flex-col gap-y-1">
					<div>Upload Tax Returns</div>
					<div className="text-sm text-gray-400">
						Upload and attach your business tax returns to your loan application
					</div>
				</div>
				<div>
					<SparklesIcon className="flex-shrink-0 h-6 w-6 text-gray-400" />
				</div>
			</div>
			<ul role="list" className="flex flex-col gap-y-2">
				{pipe(
					mapIndexed((file, index) => (
						<li key={index} className="flex flex-col w-full gap-x-6 py-5 border rounded-lg px-3">
							<File file={file} />
						</li>
					))
				)(files)}
			</ul>
		</div>
	);
};

export default function Playground() {
	return (
		<div className="flex flex-col w-full h-full items-center justify-center">
			<div className="flex flex-col w-[600px] bg-gray-50 border p-1 rounded">
				<div className="flex flex-col w-full p-3 bg-white rounded">
					<Upload />
				</div>
			</div>
		</div>
	);
}
