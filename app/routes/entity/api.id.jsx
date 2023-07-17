import { get_session_entity_id } from "~/utils/auth.server";

export const loader = async ({ request }) => {
	return await get_session_entity_id(request);
};
