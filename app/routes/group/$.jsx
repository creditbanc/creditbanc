import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import Directory from "~/components/Directory";
import { get_docs as get_group_docs } from "~/utils/group.server";
import { get_user_id } from "~/utils/auth.server";
import { get_group_id } from "~/utils/helpers";

export const load_group = async ({ resource_id, entity_id }) => {
	console.log("load_group");
	const resources = await get_group_docs({ resource_id, entity_id });
	return resources;
};

export const loader = async ({ request }) => {
	const entity_id = await get_user_id(request);
	const group_id = get_group_id(request.url);
	const resources = await load_group({ resource_id: group_id, entity_id });
	return json({ type: "group", data: resources, entity_id });
};

export default function Group() {
	const { data = [], entity_id = "" } = useLoaderData();
	return <Directory data={data} entity_id={entity_id} />;
}
