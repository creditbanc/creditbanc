import { useEffect } from "react";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
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
import { get_file_id } from "~/utils/helpers";
import Modal from "~/components/Modal";
import { useModalStore } from "~/hooks/useModal";

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

	const onUpload = async (e) => {
		console.log("onUpload");
		e.preventDefault();

		const file = e.target[0]?.files[0];
		if (!file) return;

		const storageRef = ref(storage, `files/${file_id}/${file.name}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		const next = (snapshot) => {
			const progress = Math.round(
				(snapshot.bytesTransferred / snapshot.totalBytes) * 100
			);

			console.log("progress");
			console.log(progress);
		};

		const error = (error) => {
			console.log("error");
			console.log(error);
		};

		const complete = () => {
			getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
				console.log("downloadURL");
				console.log(downloadURL);
			});
		};

		uploadTask.on("state_changed", next, error, complete);
	};

	return (
		<form className="flex flex-row" onSubmit={onUpload}>
			<label
				htmlFor="file-upload"
				className="text-sm flex flex-col justify-center px-4 cursor-pointer"
			>
				Choose File
			</label>
			<input
				id="file-upload"
				type="file"
				className="hidden"
				onChange={(e) => console.log(e.target.files[0]?.name)}
			/>
			<div className="flex flex-row bg-[#55CF9E] py-1 px-2 rounded text-sm text-white cursor-pointer">
				<div className="w-4 mr-2 flex flex-col justify-center">
					<ArrowUpOnSquareIcon />
				</div>
				<button className="flex flex-col justify-center" type="submit">
					Upload
				</button>
			</div>
		</form>
	);
};

export default function Documents() {
	const { data = [], entity_id = "" } = useLoaderData();
	const location = useLocation();
	const file_id = get_file_id(location.pathname);
	const set_modal = useModalStore((state) => state.set_modal);
	const is_open = useModalStore((state) => state.is_open);

	useEffect(() => {
		// on initial render, list all documents
		const listRef = ref(storage, `files/${file_id}`);
		const storage_url = `https://firebasestorage.googleapis.com/v0/b/creditbanc-b9822.appspot.com/o/files`;

		const get_file_url = (itemRef) =>
			`${storage_url}${encodeURIComponent(
				`/${file_id}/${itemRef.name}`
			)}?alt=media`;

		listAll(listRef)
			.then((res) => {
				res.items.forEach((itemRef) => {
					let file_url = get_file_url(itemRef);

					console.log(file_url);
					console.log(itemRef.name);
				});
			})
			.catch((error) => {
				// Uh-oh, an error occurred!
			});
	}, []);

	const onSetUploadModal = () => {
		set_modal({ id: "upload_file_modal", is_open: !is_open });
	};

	return (
		<div className="flex flex-col p-5">
			<Modal id="upload_file_modal">
				<UploadForm />
			</Modal>
			<div className="flex flex-row">
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
			<div className="my-5">
				<Directory data={data} entity_id={entity_id} />
			</div>
		</div>
	);
}
