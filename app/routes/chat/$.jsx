import { redirect } from "@remix-run/node";
import { head, isEmpty, pipe } from "ramda";
import { get_session_entity_id } from "~/utils/auth.server";
import { get_collection, get_count, get_doc, set_doc } from "~/utils/firebase";
import { get_group_id, get_resource_id } from "~/utils/helpers";

export const loader = async ({ request }) => {
	let entity_id = await get_session_entity_id(request);
	let chat_id = get_resource_id(request.url);
	let group_id = get_group_id(request.url);
	let chat_state_id = `${entity_id}${group_id}`;

	let channels_queries = [
		{
			param: "group_id",
			predicate: "==",
			value: group_id,
		},
		{
			param: "type",
			predicate: "==",
			value: "channel",
		},
	];

	let channels_count = await get_count({
		path: ["chats"],
		queries: channels_queries,
	});

	let chat_state = await get_doc(["chat_state", chat_state_id]);

	if (isEmpty(chat_state) && channels_count > 0) {
		let channel_response = await get_collection({
			path: ["chats"],
			queries: [...channels_queries, { param: "title", predicate: "==", value: "General" }],
		});

		let default_channel = pipe(head)(channel_response);

		await set_doc(["chat_state", chat_state_id], {
			id: chat_state_id,
			current_chat_id: default_channel.id,
		});

		return redirect(`/chat/id/resource/e/${entity_id}/g/${group_id}/f/${default_channel.id}`);
	}

	// if (channels.length === 0) {
	// 	let default_channel = await create_default_channel({ group_id });

	// 	await set_doc(["chat_state", chat_state_id], {
	// 		id: chat_state_id,
	// 		current_chat_id: default_channel.id,
	// 	});

	// 	return redirect(
	// 		`/chat/id/resource/e/${entity_id}/g/${group_id}/f/${default_channel.id}`
	// 	);
	// }

	if (!chat_id) {
		return redirect(`/chat/id/resource/e/${entity_id}/g/${group_id}/f/${chat_state.current_chat_id}`);
	}
	return null;
};
