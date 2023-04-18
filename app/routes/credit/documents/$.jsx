import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import { pipe, reject } from "ramda";
import { useLoaderData } from "@remix-run/react";
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
} from "firebase/storage";

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

export default function Documents() {
	const { data = [], entity_id = "" } = useLoaderData();

	const onUpload = async (e) => {
		console.log("onUpload");
		e.preventDefault();

		const file = e.target[0]?.files[0];
		if (!file) return;

		const storageRef = ref(storage, `files/${file.name}`);
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
				// setImgUrl(downloadURL);
			});
		};

		uploadTask.on("state_changed", next, error, complete);
	};

	return (
		<div className="flex flex-col p-5">
			<div className="flex flex-col">
				<div className="flex flex-row">
					<form className="flex flex-row" onSubmit={onUpload}>
						<label
							for="file-upload"
							className="text-sm flex flex-col justify-center px-4 cursor-pointer"
						>
							Choose File
						</label>
						<input
							id="file-upload"
							type="file"
							className="hidden"
							onChange={(e) =>
								console.log(e.target.files[0]?.name)
							}
						/>
						<div className="flex flex-row bg-[#55CF9E] py-1 px-2 rounded text-sm text-white cursor-pointer">
							<div className="w-4 mr-2 flex flex-col justify-center">
								<ArrowUpOnSquareIcon />
							</div>
							<button
								className="flex flex-col justify-center"
								type="submit"
							>
								Upload
							</button>
						</div>
					</form>
				</div>
			</div>
			<div className="my-5">
				{/* <div className="my-5">
					<form className="form" onSubmit={onUpload}>
						<input type="file" />
						<button type="submit" className="bg-blue-300 px-3">
							Upload
						</button>
					</form>
				</div> */}

				<Directory data={data} entity_id={entity_id} />
			</div>
		</div>
	);
}