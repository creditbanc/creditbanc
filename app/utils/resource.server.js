import {
	__,
	defaultTo,
	head,
	pipe,
	has,
	length,
	ifElse,
	gt,
	always,
	last,
	isEmpty,
	uniq,
	pick,
	map,
	without,
	omit,
	keys,
	flatten,
	includes,
	equals,
	reduceRight,
	mergeDeepRight,
	reject,
	uniqBy,
	prop,
	values,
	tryCatch,
	isNil,
	mapObjIndexed,
	indexBy,
	groupBy,
} from "ramda";
import { get, matching, all, mod, filter, cons } from "shades";
import { prisma } from "./prisma.server";
import { get_user_session } from "./auth.server";
const util = require("util");
import { get_resource_id, inspect, get_group_id, trim } from "./helpers";

let test = {
	// type: "group",
};

// const inspect = (obj) => {
// 	console.log(util.inspect(obj, false, null, true));
// 	return obj;
// };

export const create = async (data = {}) => {
	const result = await prisma.resource.create({
		data: {
			...test,
			...data,
		},
	});

	return result;
};

const actions_map = {
	can_view: "can_view",
};

const db_actions = {
	can_view: (permission) => {
		console.log("permission", permission);
		let value = permission["can_view"];
		return value;
	},
};

export const is_signed_in_p = async (request) => {
	// console.log("is_signed_in_p");
	const session = await get_user_session(request);
	let entity_id = session.get("entity_id");
	return entity_id ? true : false;
};

export const is_link_with_role_p = async (request) => {
	const url = new URL(request.url);
	const role = url.searchParams.get("role");
	return role ? true : false;
};

export const get_link_role = (request) => {
	const url = new URL(request.url);
	const role = url.searchParams.get("role");
	return role;
};

export const get_link_hash = async (request) => {
	const url = new URL(request.url);
	const hash = url.searchParams.get("role");
	return hash ?? "";
};

export const is_valid_link_p = async (hash) => {
	console.log("hash", hash);
	let link = await prisma.link.findFirst({
		where: { hash },
	});
	return link;
};

export const get_role = async (query) => {
	let role = await prisma.role.findFirst({ ...query });
	return role;
};

// export const get_resource_id = async (request) => {
// 	const url = new URL(request.url);
// 	return last(url.pathname.split("/")) ?? "";
// };

const get_group_default_permissions = async ({ resource_path_id }) => {
	// console.log("get_group_default_permissions");
	let roles = await get_resource_roles({ resource_path_id });
	let default_role = get("@default")(roles);
	return default_role;
};

let get_group_role_permissions = async (request) => {
	const entity_id = await get_entity_id(request);
	const resource_path_id = get_resource_id(request.url);
	const group_id = get_group_id(request.url);
	let role_id = await get_link_hash(request);

	let resource = await prisma.resource.findFirst({
		where: { resource_path_id: group_id },
		include: {
			roles: true,
		},
	});

	const with_role_ids = mapObjIndexed((permissions, role_id) => ({
		...permissions,
		role_id,
	}));

	let resource_roles_permissions = tryCatch(
		pipe(
			get("roles", all, "permissions", group_id),
			map(with_role_ids),
			map(values),
			flatten,
			indexBy(prop("role_id")),
			map(omit(["role_id"]))
		),
		always({})
	)(resource);

	// console.log("resource_roles_permissions", resource_roles_permissions);

	let permissions = pipe(
		map((role_id) => get(role_id)(resource_roles_permissions)),
		reduceRight(mergeDeepRight, {})
	)([role_id]);

	// console.log("permissions", permissions);
	return permissions;
};

export const get_entity_id = async (request) => {
	const session = await get_user_session(request);
	return session.get("entity_id");
};

export const get_entity_roles = async ({
	resource_path_id,
	entity_id,
	resource_ids,
	link_role = "",
	is_owner,
}) => {
	console.log("get_entity_roles");
	let entity_roles = tryCatch(
		pipe(
			defaultTo([]),
			// inspect,
			get(all, "permissions"),
			flatten,
			uniq,
			reject(isNil)
		),
		always([])
	);

	const get_entity_roles_docs = async ({ entity_id, resource_ids }) => {
		// console.log("resource_ids", resource_ids);

		let entity_roles_response = await prisma.roles.findMany({
			where: {
				entity_ids: {
					has: entity_id,
				},
				resource_ids: {
					hasEvery: resource_ids,
				},
				type: "entity",
			},
		});

		// console.log("entity_roles_response");
		// inspect(entity_roles_response);

		return entity_roles_response;
	};

	if (is_owner) {
		console.log("get_entity_roles_is_owner");
		const resource = await prisma.resource.findMany({
			where: { resource_path_id: { in: resource_ids }, type: "group" },
			include: {
				roles: {
					where: {
						type: "resource",
					},
				},
			},
		});

		// console.log("owner_resource");
		// inspect(resource);

		let roles = tryCatch(
			pipe(
				head,
				get("roles", all, "permissions"),
				map(values),
				flatten,
				map(keys),

				flatten
			),
			always([])
		)(resource);

		return roles;
	}

	if (!entity_id) {
		return uniq(trim([link_role, "@default"]));
	}

	if (resource_ids) {
		let entity_roles_response = await get_entity_roles_docs({
			entity_id,
			resource_ids,
		});

		return pipe(
			entity_roles,
			(roles) => trim([...roles, link_role, "@default"]),
			uniq
		)(entity_roles_response);
	}

	if (resource_path_id) {
		const resource = await prisma.resource.findFirst({
			where: { resource_path_id },
		});

		let entity_roles_response = await get_entity_roles_docs(
			entity_id,
			resource.id
		);

		return pipe(
			entity_roles,
			(roles) => trim([...roles, link_role, "@default"]),
			uniq
		)(entity_roles_response);
	}
};

export const get_resource_roles = async ({
	resource_ids,
	resource_path_id,
	is_owner = false,
}) => {
	console.log("get_resource_roles");

	let get_resource_id = async ({ resource_ids, is_owner }) => {
		if (is_owner) {
			let resource = await prisma.resource.findFirst({
				where: {
					type: "group",
					resource_path_id: {
						equals: head(resource_ids),
					},
				},
			});

			return resource.id;
		} else {
			let resource = await prisma.resource.findFirst({
				where: {
					type: "group",
					subscriber_ids: {
						hasEvery: resource_ids,
					},
				},
			});

			return resource.id;
		}
	};

	let permissions = tryCatch(
		pipe(
			// inspect,
			(resource) =>
				get(
					"roles",
					all,
					"permissions",
					resource.resource_path_id
				)(resource),
			head
		),
		always({})
	);

	let resource_roles = async (resource_id) => {
		let response = await prisma.resource.findFirst({
			where: {
				id: {
					equals: resource_id,
				},
			},
			include: {
				roles: {
					where: {
						type: {
							equals: "resource",
						},
					},
				},
			},
		});

		// console.log("resource_roles_response");
		// inspect(response);
		return response;
	};

	if (resource_ids) {
		let resource_id = await get_resource_id({ resource_ids, is_owner });
		// console.log("resource_id", resource_id);
		let resource_roles_response = await resource_roles(resource_id);
		// console.log("resource_roles_response");
		// inspect(resource_roles_response);
		return pipe(permissions)(resource_roles_response);
	}

	if (resource_path_id) {
		console.log("resource_path_id");
		// console.log(get_resource_roles);
		let resource = await prisma.resource.findFirst({
			where: { resource_path_id },
		});
		let resource_roles_response = await resource_roles(resource.id);

		// console.log(resource_roles_response);
		return permissions(resource_roles_response);
	}
};

const get_permissions = ({ entity_roles, resource_permissions }) => {
	let permissions = pipe(
		map((role_id) => get(role_id)(resource_permissions)),
		reject(isNil),
		map(mapObjIndexed((value, key) => ({ name: key, value }))),
		map(values),
		flatten,
		groupBy(prop("name")),
		mod(all, all)(get("value")),
		mod(all)(includes(true))
	)(entity_roles);
	return permissions;
};

const get_permission = ({ permission, entity_roles, resource_permissions }) => {
	let permissions = get_permissions({ entity_roles, resource_permissions });
	return pipe(get(permission))(permissions);
};

export const get_resource = async ({ resource_id, resource_path_id }) => {
	if (resource_id) {
		const resource = await prisma.resource.findFirst({
			where: { id: resource_id },
		});
		return resource;
	}

	if (resource_path_id) {
		const resource = await prisma.resource.findFirst({
			where: { resource_path_id },
		});
		return resource;
	}
};

export const get_resource_permissions = async ({
	resource_id,
	resource_path_id,
	entity_id,
	link_role = "",
	is_owner,
	group_resource_path_id,
}) => {
	// console.log("get_resource_permissions");
	// console.log("resource_path_id", resource_path_id);
	// console.log("group_resource_path_id", group_resource_path_id);

	let resource_ids = trim([group_resource_path_id, resource_path_id]);

	// console.log("resource_ids");
	// inspect(resource_ids);

	// console.log("is_owner");
	// console.log(is_owner);

	let entity_roles = await get_entity_roles({
		entity_id,
		resource_ids,
		link_role,
		is_owner,
	});

	// console.log("entity_roles");
	// inspect(entity_roles);

	let resource_permissions = await get_resource_roles({
		resource_ids: [group_resource_path_id, resource_path_id],
		is_owner,
	});

	// console.log("resource_permissions");
	// inspect(resource_permissions);

	let permissions = get_permissions({
		entity_roles,
		resource_permissions,
	});

	// console.log("permissions");
	// inspect(permissions);

	return permissions;
};

const has_action_permission = (action, permissions) => {
	let action_resolver_name = actions_map[action];
	let has_permission = db_actions[action_resolver_name](permissions);
	return has_permission;
};

export const validate_action = async ({
	resource_id,
	group_resource_path_id,
	resource_path_id,
	entity_id = false,
	action = false,
	request,
	link_role = "",
	is_owner = false,
}) => {
	console.log("validate_action");
	const is_signed_in = await is_signed_in_p(request);

	let _return = (permissions) => {
		if (permissions && action) {
			let has_permission = has_action_permission(action, permissions);
			return { [action]: has_permission };
		}

		if (permissions && !action) {
			return permissions;
		}

		if (!permissions && !action) {
			return {};
		}
	};

	if (!is_signed_in) {
		console.log("!is_signed_in");
		let is_link_with_role = await is_link_with_role_p(request);

		if (is_link_with_role) {
			console.log("is_link_with_role");
			let link_role = get_link_role(request);

			let permissions = await get_resource_permissions({
				resource_path_id,
				link_role,
			});

			return _return(permissions);
		}

		if (!is_link_with_role) {
			console.log("!is_link_with_role");

			let permissions = await get_group_default_permissions({
				resource_path_id: group_resource_path_id,
			});

			// console.log("permissions");
			// inspect(permissions);

			return _return(permissions);
		}
	}

	if (is_signed_in) {
		console.log("is_signed_in");
		let is_link_with_role = await is_link_with_role_p(request);

		console.log("is_link_with_role", is_link_with_role);

		const entity_id = await get_entity_id(request);

		if (is_link_with_role) {
			console.log("is_link_with_role");
			let link_role = await get_link_role(request);

			let permissions = await get_resource_permissions({
				entity_id,
				resource_path_id,
				link_role,
			});

			return _return(permissions);
		}

		if (!is_link_with_role) {
			console.log("is_not_link_with_role");

			let permissions = await get_resource_permissions({
				entity_id,
				group_resource_path_id,
				resource_path_id,
				link_role,
				is_owner,
			});

			return _return(permissions);
		}
	}
};

export const get_resources = async ({ entity_id, root = false }) => {
	// const session = await get_user_session(request);
	// const entity_id = session.get("entity_id");

	let entity = await prisma.entity.findFirst({
		where: {
			id: entity_id,
		},
	});

	// entity = head(entity);

	let roles = await prisma.role.findMany({
		where: {
			type: "resource",
			entity_ids: {
				hasEvery: [entity_id],
			},
			// resource_ids: {
			// 	hasEvery: [entity.root_resource_id],
			// },
		},
		include: {
			resources: true,
		},
	});

	// inspect(roles);

	let resources_without_self = pipe(
		get(all, "resources"),
		flatten,
		uniqBy(prop("id")),
		filter({ id: (id) => id == entity.root_resource_id }),
		inspect
	)(roles);

	console.log("entity", entity);

	return entity;
};

export const get_docs = async (resource_type, query) => {
	const result = await prisma[resource_type].findMany({ ...query });

	return result;
};

export const delete_docs = async (id) => {
	const result = await prisma.resource.deleteMany({
		where: { type: "group" },
	});

	console.log("result", result);
};

export const delete_all = async () => {
	const result = await prisma.resource.deleteMany({});
	console.log("result", result);
};

export const get_resource_type = async ({ resource_id }) => {
	console.log("get_resource_type");
	let resource = await prisma.resource.findFirst({
		where: {
			resource_path_id: resource_id,
		},
		select: {
			model: true,
		},
	});

	let { model } = resource;

	return model;
};
