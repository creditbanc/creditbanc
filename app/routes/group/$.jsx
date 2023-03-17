import { useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import Directory from "~/components/Directory";
import { get_docs as get_group_docs } from "~/utils/group.server";
import { get_user_id } from "~/utils/auth.server";
import { get_group_id } from "~/utils/helpers";
import { reject, pipe, head, always, tryCatch } from "ramda";
import { get } from "shades";

const is_group = (resource) => resource.model === "group";

export const load_group = async ({ resource_id, entity_id }) => {
	// console.log("load_group");
	const resources = await get_group_docs({ resource_id, entity_id });
	// console.log("resources");
	// console.log(resources);
	return pipe(reject(is_group))(resources);
};

export const loader = async ({ request }) => {
	const entity_id = await get_user_id(request);
	const group_id = get_group_id(request.url);
	const resources = await load_group({ resource_id: group_id, entity_id });
	let head_resource_id = pipe(
		head,
		tryCatch(get("id"), always(null))
	)(resources);

	// console.log("group_id");
	// console.log(group_id);
	// console.log("head_resource_id");
	// console.log(head_resource_id);

	return redirect(
		`/credit/personal/report/personal/resource/e/${entity_id}/g/${group_id}/f/${head_resource_id}`
	);
	// return json({ type: "group", data: resources, entity_id });
};

export default function Group() {
	const { data = [], entity_id = "" } = useLoaderData();
	return <Directory data={data} entity_id={entity_id} />;
}
