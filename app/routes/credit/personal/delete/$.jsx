import {
	is_resource_owner_p,
	unsubscribe_entity_from_shared_resource,
	unsubscribe_entity_from_resource,
} from "~/utils/resource.server";
import { get_user_id } from "~/utils/auth.server";

export const action = async ({ request }) => {
	// console.log("delete_personal_report");
	const entity_id = await get_user_id(request);
	const form = await request.formData();
	const file_id = form.get("file_id");
	const group_id = form.get("group_id");

	const is_resource_owner = await is_resource_owner_p({
		entity_id,
		file_id,
	});

	if (!is_resource_owner) {
		await unsubscribe_entity_from_shared_resource({
			entity_id,
			file_id,
		});
	}

	if (is_resource_owner) {
		await unsubscribe_entity_from_resource({
			group_id,
			file_id,
		});
	}

	return null;
};
