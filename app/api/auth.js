import { get_collection, get_doc } from "~/utils/firebase";
import {
	always,
	defaultTo,
	gt as rgt,
	head,
	includes,
	isEmpty,
	length,
	pipe,
	tryCatch,
	flip,
} from "ramda";
import { filter, get } from "shades";
import { inspect } from "~/utils/helpers";

let gt = flip(rgt);

export const is_entity_super = (entity) => {
	let super_roles = ["admin", "super"];
	let result = tryCatch(
		pipe(
			get("roles"),
			filter((value) => includes(value, super_roles)),
			length,
			gt(0)
		),
		always(false)
	)(entity);

	return result;
};

const is_super_p = async (entity_id) => {
	let entity = await get_doc(["entity", entity_id]);
	return is_entity_super(entity);
};

export const get_permissions = async (entity_id, group_id) => {
	// console.log("get_permissions");
	// console.log(entity_id);
	// console.log(group_id);
	// check if is an admin or super
	let is_super = await is_super_p(entity_id);
	// let is_super = false;
	if (is_super) {
		return Infinity;
	}

	// check if entity is the owner/creator of the resource

	let role_config_response = await get_collection({
		path: ["role_configs"],
		queries: [
			{ param: "entity_id", predicate: "==", value: entity_id },
			{ param: "group_id", predicate: "==", value: group_id },
		],
	});

	// console.log("role_config_response");
	// inspect(role_config_response);

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

	return false;
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

	// console.log("api.auth.is_authorized_f");
	// console.log(role);

	if (role == Infinity) {
		return true;
	}

	if (!role) {
		return false;
	}

	let { permissions } = role;

	// console.log("permissions");
	// console.log(permissions);

	let has_permission = validate_permission(resource, action, permissions);
	return has_permission;
};
