import { redirect } from "@remix-run/node";
import { get_session_entity_id } from "~/utils/auth.server";
import { get_doc } from "~/utils/firebase";
import { get_group_id, get_resource_id } from "~/utils/helpers";

export const loader = async ({ request }) => {
	let entity_id = await get_session_entity_id(request);
	let chat_id = get_resource_id(request.url);
	let group_id = get_group_id(request.url);
	let chat_state_id = `${entity_id}${group_id}`;

	let chat_state = await get_doc(["chat_state", chat_state_id]);

	if (!chat_id) {
		return redirect(
			`/chat/id/resource/e/${entity_id}/g/${group_id}/f/${chat_state.current_chat_id}`
		);
	}
};
