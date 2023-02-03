import { pipe, reject } from "ramda";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { json } from "@remix-run/node";
import Directory from "~/components/Directory";
import { get_root_docs } from "~/utils/group.server";
import { get_user_id } from "~/utils/auth.server";

const is_root_resource = (resource) => resource.name === "root";

export const load_root = async ({ entity_id }) => {
	console.log("load_root");
	const resources = await get_root_docs({ entity_id });
	const resources_without_root = pipe(reject(is_root_resource))(resources);
	return resources_without_root;
};

export const loader = async ({ request }) => {
	const entity_id = await get_user_id(request);
	const resources = await load_root({ entity_id });
	return json({ data: resources, entity_id });
};

export default function Root() {
	const { data = [], entity_id = "" } = useLoaderData();
	return <Directory data={data} entity_id={entity_id} />;
}
