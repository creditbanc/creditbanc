import { get_collection, get_doc } from "~/utils/firebase";
import { defaultTo, head, isEmpty, pipe } from "ramda";
import { filter, get } from "shades";

export const get_permissions = async (entity_id, group_id) => {
	// check if entity is the owner/creator of the resource

	let role_config_response = await get_collection({
		path: ["role_configs"],
		queries: [
			{ param: "entity_id", predicate: "==", value: entity_id },
			{ param: "group_id", predicate: "==", value: group_id },
		],
	});

	// console.log("role_config_response");
	// console.log(role_config_response);

	if (!isEmpty(role_config_response)) {
		return Infinity;
	}

	// if entity is not the owner get the config_id of the role
	let role_response = await get_collection({
		path: ["roles"],
		queries: [
			{ param: "entity_id", predicate: "==", value: entity_id },
			{ param: "group_id", predicate: "==", value: group_id },
		],
	});

	// console.log("role_response");
	// console.log(role_response);

	let role = pipe(head, defaultTo({}))(role_response);

	if (role.config_id) {
		let config_response = await get_doc(["role_configs", role.config_id]);

		return config_response;
	}

	// if there is no role config id then get the default config for the group
};

export const validate_permission = (permission_id, action, permissions) => {
	let has_permission = pipe(
		filter({ id: permission_id }),
		head,
		get(action)
	)(permissions);

	return has_permission;
};

export const is_authorized_f = async (
	entity_id,
	group_id,
	resource,
	action
) => {
	let role = await get_permissions(entity_id, group_id);

	if (role == Infinity) {
		return true;
	}

	let { permissions } = role;

	let has_permission = validate_permission(resource, action, permissions);
	return has_permission;
};
