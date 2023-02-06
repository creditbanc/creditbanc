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
} from "ramda";
import { get, matching, all, mod, filter } from "shades";
import { prisma } from "./prisma.server";
import { get_user_session } from "./auth.server";
const util = require("util");
import { get_resource_id, inspect, get_group_id } from "./helpers";

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
	view: "can_view",
};

const db_actions = {
	can_view: (permission) => {
		console.log("permission", permission);
		let value = permission["can_view"];
		return value;
	},
};

export const is_signed_in_p = async (request) => {
	const session = await get_user_session(request);
	let entity_id = session.get("entity_id");
	return entity_id ? true : false;
};

export const is_link_with_role_p = async (request) => {
	const url = new URL(request.url);
	const role = url.searchParams.get("role");
	return role ? true : false;
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

let get_group_default_permissions = async (request) => {
	const entity_id = await get_entity_id(request);
	const resource_path_id = get_resource_id(request.url);
	const group_id = get_group_id(request.url);

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
	)(["@default"]);

	// console.log("permissions", permissions);
	return permissions;
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

export const get_role_persmissions = async (request) => {
	console.log("get_role_persmissions");

	const entity_id = await get_entity_id(request);
	const resource_path_id = get_resource_id(request.url);
	const group_id = get_group_id(request.url);

	// console.log("entity_id", entity_id);
	// console.log("resource_path_id", resource_path_id);
	// console.log("group_id", group_id);

	const resource = await prisma.resource.findFirst({
		where: { resource_path_id: group_id },
		include: {
			roles: { include: { entities: { include: { roles: true } } } },
		},
	});

	// inspect(resource);

	let entity_roles = tryCatch(
		pipe(
			get("roles", all, "entities", all, "roles"),
			flatten,
			filter((role) => role.type == "entity"),
			get(all, "permissions"),
			flatten,
			uniq,
			reject(isNil)
		),
		always([])
	)(resource);

	// inspect(entity_roles, "entity_roles");

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

	if (isEmpty(entity_roles)) {
		// this usually means that they are accessing a resource that has a role
		// associated at the root branch scope
		// check first if the signed in user has a role set at the root of the branch
		// of the resource they are trying to access

		// this checks if they are a member of that specific resource
		// for example if they got an invite link to it, in which case
		// they would have an entity role

		const entity_roles = await prisma.role.findMany({
			where: {
				type: "entity",
				entity_ids: { hasEvery: [entity_id] },
				resource_ids: { hasEvery: [group_resource_id] },
			},
			include: {
				settings: true,
			},
		});

		// console.log("entity_roles", entity_roles);

		const entity_resource_roles = await prisma.role.findMany({
			where: {
				type: "resource",
				name: { in: pipe(get(all, "name"))(entity_roles) },
				resource_ids: { hasEvery: [group_resource_id] },
			},
			include: {
				settings: true,
			},
		});

		// console.log("entity_resource_roles", entity_resource_roles);

		const group_default_roles = await prisma.role.findMany({
			where: {
				type: "resource",
				name: "@default",
				resource_ids: { hasEvery: [group_resource_id] },
			},
			include: {
				settings: true,
			},
		});

		// console.log("group_default_roles", group_default_roles);

		let role_permissions = get_roles_permissions([
			entity_roles,
			group_default_roles,
			entity_resource_roles,
		]);

		// console.log("role_permissions", role_permissions);

		let permission_keys = get_permission_keys(role_permissions);

		let permissions = get_permissions(permission_keys, role_permissions);
		// console.log("permissions", permissions);
		return permissions;

		// return head(group_default_roles);
	}

	if (!isEmpty(entity_roles)) {
		let permissions = pipe(
			map((role_id) => get(role_id)(resource_roles_permissions)),
			reduceRight(mergeDeepRight, {})
		)(entity_roles);

		return permissions;
	}
};

export const validate_action = async (request) => {
	console.log("validate_action");
	// let user_email = "test@gmail.com";
	let resource_id = "63c93877b4a41136dd3789d5";
	let resource_path_id = "63c93877b4a41136dd3789d4";
	let user_id = "63c3f24c0692ede4c82199f7";
	let action = "view";
	// let role_name = 'test'

	// console.log("validate_user");
	const is_signed_in = await is_signed_in_p(request);

	if (!is_signed_in) {
		console.log("!is_signed_in");
		let is_link_with_role = await is_link_with_role_p(request);
		console.log("is_link_with_role", is_link_with_role);

		if (is_link_with_role) {
			let link_hash = await get_link_hash(request);
			// console.log("link_hash", link_hash);
			let link = await is_valid_link_p(link_hash);
			// console.log("is_valid_link", link);

			let permissions = await get_group_role_permissions(request);

			if (permissions) {
				let action_resolver_name = actions_map[action];
				let has_permission =
					db_actions[action_resolver_name](permissions);

				return has_permission;
			}

			// if (link) {
			// 	let role = await get_role({
			// 		where: { id: link.role_id },
			// 		include: { settings: true },
			// 	});

			// 	console.log("role", role);
			// 	let { settings } = role;

			// 	let action_resolver_name = actions_map[action];
			// 	let has_permission = db_actions[action_resolver_name](settings);
			// 	console.log("has_permission", has_permission);

			// 	return has_permission;
			// }
		}

		if (!is_link_with_role) {
			console.log("!is_link_with_role");
			// person is not signed in and is trying to access a resource
			// without a valid link hash

			let permissions = await get_group_default_permissions(request);

			if (permissions) {
				let action_resolver_name = actions_map[action];
				let has_permission =
					db_actions[action_resolver_name](permissions);

				return has_permission;
			}
		}
	}

	if (is_signed_in) {
		console.log("is_signed_in");
		let is_link_with_role = await is_link_with_role_p(request);
		// console.log("is_link_with_role", is_link_with_role);
		const entity_id = await get_entity_id(request);
		// console.log("entity_id", entity_id);

		if (is_link_with_role) {
			let link_hash = await get_link_hash(request);
			console.log("link_hash", link_hash);
			let link = await is_valid_link_p(link_hash);
			console.log("is_valid_link", link);

			if (link) {
				let role = await get_role({
					where: { id: link.role_id },
					include: { settings: true },
				});

				console.log("role", role);
				let { settings } = role;

				let action_resolver_name = actions_map[action];
				let has_permission = db_actions[action_resolver_name](settings);
				console.log("has_permission", has_permission);

				return has_permission;
			}
		}

		if (!is_link_with_role) {
			console.log("is_not_link_with_role");
			// return false;
			let permissions = await get_role_persmissions(request);
			// console.log("permissions", permissions);

			if (permissions) {
				let action_resolver_name = actions_map[action];
				let has_permission =
					db_actions[action_resolver_name](permissions);
				// console.log("has_permission", has_permission);

				return has_permission;
			}
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
