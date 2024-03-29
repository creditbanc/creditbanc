import { DocumentIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { get_entity_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { head, pipe } from "ramda";
import { server_timestamp, set_doc, storage } from "~/utils/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocation } from "@remix-run/react";
import { filter } from "shades";
import { events_map } from "~/data/events";

const files = [
	{
		year: 2020,
		path: "documents.taxreturns.2020",
		resource_id: "2020",
		type: "taxreturns",
	},
	{
		year: 2021,
		path: "documents.taxreturns.2021",
		resource_id: "2021",
		type: "taxreturns",
	},
	{
		year: 2022,
		path: "documents.taxreturns.2022",
		resource_id: "2022",
		type: "taxreturns",
	},
	{
		year: 2023,
		path: "documents.taxreturns.2023",
		resource_id: "2023",
		type: "taxreturns",
	},
];

const File = ({ file: file_props }) => {
	const { pathname } = useLocation();
	let [file_name, set_file_name] = useState("");
	let [selected_file, set_selected_file] = useState(undefined);
	const [progress, set_progress] = useState(undefined);
	let group_id = get_group_id(pathname);
	let entity_id = get_entity_id(pathname);

	const onUpload = async (file) => {
		console.log("onUpload");
		if (!file) return;

		let id = uuidv4();
		console.log("uuid");
		console.log(id);

		const storageRef = ref(storage, `files/${group_id}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		const next = (snapshot) => {
			const current_progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
			console.log("current_progress");
			console.log(current_progress);

			set_progress(current_progress);
		};

		const error = (error) => {
			console.log("error");
			console.log(error);
		};

		const complete = async () => {
			let download_url = await getDownloadURL(uploadTask.snapshot.ref);
			let resource_id = file_props.resource_id;
			let path = file_props.path;

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

			await set_doc(["events", event_id], event_payload);
			await set_doc(["vault", id], payload);

			// set_files(["files"], [...files, payload]);
		};

		uploadTask.on("state_changed", next, error, complete);
	};

	const onSelectFile = (e) => {
		console.log("onSelectFile");
		let file = e.target.files[0];
		set_selected_file(file);
	};

	useEffect(() => {
		if (selected_file) {
			let file_name = selected_file.name;
			set_file_name(file_name);
			onUpload(selected_file);
		}
	}, [selected_file]);

	const UploadFileButton = () => {
		return (
			<form className="flex flex-col h-full">
				<div className={`flex flex-row`} disabled={progress !== undefined}>
					<input id="file-upload" type="file" className="hidden" onChange={onSelectFile} />

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
							{file_name == "" ? file_props.year : file_name}
						</p>
					</div>
				</div>
				{progress !== 100 && (
					<div className="flex flex-row gap-x-3">
						<div className="flex flex-col items-center justify-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 border cursor-pointer">
							Don't have
						</div>
						<div className="flex flex-col items-center justify-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 border cursor-pointer">
							<UploadFileButton />
						</div>
					</div>
				)}
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
					filter({ type: "taxreturns" }),
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
					<Upload type={"taxreturns"} />
				</div>
			</div>
		</div>
	);
}
