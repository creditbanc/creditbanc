import { json, redirect } from "@remix-run/node";
import { set_permission } from "~/utils/role.server";

export const action = async ({ request }) => {
	console.log("update_roles_action");
	let formData = await request.formData();
	let permission_value =
		formData.get("permission_value") === "true" ? true : false;
	let permission_key = formData.get("permission_key");
	let role_id = formData.get("role_id");
	let group_id = formData.get("group_id");
	let redirect_url = formData.get("redirect_url");

	await set_permission({
		group_id,
		role_id,
		permission_key,
		permission_value,
	});

	return redirect(redirect_url);
};
