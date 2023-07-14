import { redirect } from "@remix-run/node";
import { get_user_id } from "~/utils/auth.server";
import { set_doc } from "~/utils/firebase";
import { get_group_id, use_search_params } from "~/utils/helpers";

export const loader = async ({ request }) => {
	let entity_id = await get_user_id(request);
	let group_id = get_group_id(request.url);
	let { config_id } = use_search_params(request);

	let role_id = entity_id + group_id;

	let role = {
		entity_id,
		group_id,
		config_id,
		role_id,
	};

	await set_doc(["roles", role_id], role);

	return redirect(
		`/companies/dashboard/resource/e/${entity_id}/g/${group_id}`
	);
};
