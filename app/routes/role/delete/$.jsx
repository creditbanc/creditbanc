import { json, redirect } from "@remix-run/node";

import { delete_role } from "~/utils/role.server";

export const action = async ({ request }) => {
	console.log("DELETE roles");
	let formData = await request.formData();
	let role_id = formData.get("role_id");
	let group_id = formData.get("group_id");
	let entity_id = formData.get("entity_id");
	await delete_role({ group_id, role_id, entity_id });
	return redirect(formData.get("redirect_url"));
};
