import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import { pipe, reject } from "ramda";
import { useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import Directory from "~/components/Directory";
import {
	get_root_docs,
	get_root_group_resource_path_id,
} from "~/utils/group.server";
import { get_user, get_user_id } from "~/utils/auth.server";
import { has_resource_url_p } from "~/utils/helpers";

export const action = async ({ request }) => {};

const is_root_resource = (resource) => resource.name === "root";

export const load_root = async ({ entity_id }) => {
	console.log("load_root");
	const resources = await get_root_docs({ entity_id });
	const resources_without_root = pipe(reject(is_root_resource))(resources);
	return resources_without_root;
};

export const loader = async ({ request }) => {
	console.log("root_loader");
	let entity_id = await get_user_id(request);
	let has_resource = has_resource_url_p(request.url);
	if (!entity_id) return redirect(`/`);
	let root_gruop_resource_path_id = await get_root_group_resource_path_id({
		entity_id,
	});
	console.log("root_gruop_id");
	// console.log(root_gruop_id);
	if (!has_resource)
		return redirect(
			`/group/resource/e/${entity_id}/g/${root_gruop_resource_path_id}`
		);
	const resources = await load_root({ entity_id });
	return json({ data: resources, entity_id });
};

export default function Documents() {
	const { data = [], entity_id = "" } = useLoaderData();

	return (
		<div className="flex flex-col p-5">
			<div className="flex flex-col">
				<div className="flex flex-row">
					<div className="flex flex-row bg-[#55CF9E] py-1 px-2 rounded-sm text-sm text-white cursor-pointer">
						<div className="w-4 mr-2">
							<ArrowUpOnSquareIcon />
						</div>
						<div>Upload</div>
					</div>
				</div>
			</div>
			<div className="my-5">
				<Directory data={data} entity_id={entity_id} />
			</div>
		</div>
	);
}
