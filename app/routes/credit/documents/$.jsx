import { useEffect, useState } from "react";
import {
	ArrowUpOnSquareIcon,
	XMarkIcon,
	DocumentIcon,
} from "@heroicons/react/24/outline";
import { pipe, reject } from "ramda";
import { useLoaderData, useLocation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import Directory from "~/components/Directory";
import { get_root_docs } from "~/utils/group.server";
import { get_user_id } from "~/utils/auth.server";
import { storage } from "~/utils/firebase";
import {
	ref,
	getDownloadURL,
	uploadBytesResumable,
	getStorage,
	uploadBytes,
	listAll,
} from "firebase/storage";
import { get_file_id, mapIndexed } from "~/utils/helpers";
import Modal from "~/components/Modal";
import { useModalStore } from "~/hooks/useModal";
import { useFilesStore } from "~/hooks/useFiles";

export const action = async ({ request }) => {};

const is_root_resource = (resource) => resource.name === "root";

export const load_root = async ({ entity_id }) => {
	const resources = await get_root_docs({ entity_id });
	const resources_without_root = pipe(reject(is_root_resource))(resources);
	return resources_without_root;
};

export const loader = async ({ request }) => {
	let entity_id = await get_user_id(request);
	if (!entity_id) return redirect(`/`);
	const resources = await load_root({ entity_id });
	return json({ data: resources, entity_id });
};

const UploadForm = () => {
	const location = useLocation();
	const file_id = get_file_id(location.pathname);
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

		const storageRef = ref(storage, `files/${file_id}/${file.name}`);
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

		const complete = () => {
			getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
				set_files({
					files: [
						...files,
						{ name: file.name, url: downloadURL, id: files.length },
					],
				});
			});
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
		<form className="flex flex-col" onSubmit={onUpload}>
			{file_name === "" && (
				<div className="flex flec-cold items-center justify-center w-full h-[200px] border border-dashed rounded border-gray-300 text-gray-300 mb-1">
					<label
						htmlFor="file-upload"
						className="flex flex-col items-center cursor-pointer"
					>
						<div className="w-[50px] my-2">
							<ArrowUpOnSquareIcon />
						</div>
						<div>Click to select file</div>
					</label>
				</div>
			)}

			<input
				id="file-upload"
				type="file"
				className="hidden"
				onChange={onSelectFile}
			/>

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
				<div className="w-[20px] mr-2 flex flex-col justify-center items-center h-full">
					<ArrowUpOnSquareIcon />
				</div>
				<div className="flex flex-col justify-center h-[30px]">
					Upload
				</div>
			</button>
		</form>
	);
};

export default function Documents() {
	const { data = [], entity_id = "" } = useLoaderData();
	const location = useLocation();
	const file_id = get_file_id(location.pathname);
	const set_modal = useModalStore((state) => state.set_modal);
	const is_open = useModalStore((state) => state.is_open);
	const files = useFilesStore((state) => state.files);
	const set_files = useFilesStore((state) => state.set_files);

	useEffect(() => {
		// on initial render, list all documents
		const listRef = ref(storage, `files/${file_id}`);
		const storage_url = `https://firebasestorage.googleapis.com/v0/b/creditbanc-b9822.appspot.com/o/files`;

		const get_file_url = (itemRef) =>
			`${storage_url}${encodeURIComponent(
				`/${file_id}/${itemRef.name}`
			)}?alt=media`;

		listAll(listRef).then((res) => {
			pipe(
				mapIndexed((file, idx) => ({
					id: idx,
					name: file.name,
					url: get_file_url(file),
				})),
				(files) => set_files({ files })
			)(res.items);
		});
	}, []);

	const onSetUploadModal = () => {
		set_modal({ id: "upload_file_modal", is_open: !is_open });
	};

	return (
		<div className="flex flex-col p-5">
			<Modal id="upload_file_modal">
				<div className="border-b border-gray-200 bg-white mb-3">
					<h3 className="text-base font-semibold leading-6 text-gray-900 mb-2">
						Upload
					</h3>
				</div>
				<UploadForm />
			</Modal>
			<div className="flex flex-row my-1">
				<div
					className="flex flex-row bg-[#55CF9E] py-1.5 px-2 rounded text-sm text-white cursor-pointer w-fit"
					onClick={onSetUploadModal}
				>
					<div className="w-4 mr-2 flex flex-col justify-center">
						<ArrowUpOnSquareIcon />
					</div>
					<button
						className="flex flex-col justify-center"
						type="submit"
					>
						Upload File
					</button>
				</div>
			</div>
			<div className="my-3">
				<Directory data={files} entity_id={entity_id} />
			</div>
		</div>
	);
}
