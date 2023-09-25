import { get_group_id } from "~/utils/helpers";
import { is_authorized_f } from "~/api/auth";
import { get_session_entity_id } from "~/utils/auth.server";
import { redirect } from "@remix-run/node";

export const is_authorized = async (request) => {
	let url = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(url.pathname);
	let is_authorized = await is_authorized_f(entity_id, group_id, "credit", "read");
	return is_authorized;
};
