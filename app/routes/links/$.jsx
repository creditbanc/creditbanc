import { redirect } from "@remix-run/node";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { get_doc, set_doc } from "~/utils/firebase";
import {
	get_entity_id,
	get_group_id,
	use_search_params,
} from "~/utils/helpers";

export const loader = async ({ request }) => {
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(request.url);
	let { config_id } = use_search_params(request);
	let group_entity_id = get_entity_id(request.url);

	let { email, first_name, last_name } = await get_doc(["entity", entity_id]);

	let role_id = entity_id + group_id;

	let role = {
		entity_id,
		group_entity_id,
		group_id,
		config_id,
		role_id,
		email,
		first_name,
		last_name,
	};

	// console.log("role_____");
	// console.log(role);

	await set_doc(["roles", role_id], role);

	return redirect(
		`/companies/dashboard/resource/e/${entity_id}/g/${group_id}`
	);
};
