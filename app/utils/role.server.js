import {
	flatten,
	pipe,
	head,
	isEmpty,
	hasPath,
	reject,
	filter,
	values,
	map,
	dissoc,
	tryCatch,
	keys,
	always,
	isNil,
} from "ramda";
import { all, get, includes, mod } from "shades";
import { inspect } from "./helpers";
import { prisma } from "./prisma.server";

let role_permission_defaults = { can_view: false };

export const create_group_role = async ({ group_id, entity_id, role_id }) => {
	console.log("create_group_role");
	// console.log(role_id);

	const resource = await prisma.resource.findFirst({
		where: {
			resource_path_id: group_id,
		},
		include: {
			roles: {
				where: { type: "resource" },
			},
		},
	});

	let role_name = role_id;

	let resource_roles = pipe(get("roles", 0))(resource);
	let resource_roles_id = tryCatch(
		pipe(get("id")),
		always(undefined)
	)(resource_roles);

	let entity_role = await create({
		resource_ids: { set: resource.id },
		entity_ids: { set: entity_id },
		type: "entity",
		permissions: [role_name],
	});

	if (resource_roles_id) {
		console.log("resource_roles_id");

		let permissions = pipe(
			get("permissions"),
			mod(group_id, role_name)(() => role_permission_defaults)
		)(resource_roles);

		await prisma.roles.update({
			where: { id: resource_roles_id },
			data: {
				permissions,
			},
		});

		await prisma.resource.update({
			where: { id: resource.id },
			data: {
				roles_ids: { push: entity_role.id },
			},
		});
	} else {
		console.log("!resource_roles_id");
		let permissions = {
			[group_id]: {
				[role_name]: role_permission_defaults,
			},
		};

		resource_roles = await prisma.roles.create({
			data: {
				resource_ids: { set: [resource.id] },
				entity_ids: { set: [entity_id] },
				type: "resource",
				permissions,
			},
		});

		await prisma.resource.update({
			where: { id: resource.id },
			data: {
				roles_ids: { set: [entity_role.id, resource_roles.id] },
			},
		});
	}

	await prisma.entity.update({
		where: { id: entity_id },
		data: {
			roles_ids: { push: entity_role.id },
		},
	});
};

export const create = async (data) => {
	console.log("create_role");

	const result = await prisma.roles.create({
		data: {
			// ...test,
			...data,
		},
	});

	return result;
};

export const delete_docs = async (id) => {
	const result = await prisma.role.deleteMany({
		where: { type: "resource" },
	});
};

export const get_resource_roles = async ({ resource_id }) => {
	const resource = await prisma.resource.findFirst({
		where: {
			resource_path_id: resource_id,
		},
		include: {
			roles: { where: { type: "resource" } },
		},
	});

	return tryCatch(
		pipe(
			get("roles", 0, "permissions"),
			values,
			map(keys),
			flatten,
			reject(isNil)
		),
		always([])
	)(resource);
};

export const get_resource_permissions = async ({ group_id }) => {
	// console.log("get_resource_permissions");
	// console.log(group_id);
	const resource = await prisma.resource.findFirst({
		where: {
			resource_path_id: group_id,
		},
		include: {
			roles: { where: { type: "resource" } },
		},
	});

	return tryCatch(
		pipe(get("roles", 0, "permissions", group_id)),
		always({})
	)(resource);
};

export const set_permission = async ({
	group_id,
	role_id,
	permission_key,
	permission_value,
	resource_path_id,
}) => {
	console.log("set_permission");
	console.log("role_id", role_id);
	console.log("permission_key", permission_key);
	console.log("permission_value", permission_value);
	console.log("group_id", group_id);
	console.log("resource_path_id", resource_path_id);

	let resource = await prisma.resource.findFirst({
		where: {
			resource_path_id: group_id,
		},
		include: {
			roles: { where: { type: "resource" } },
		},
	});

	let roles_id = pipe(get("roles", 0, "id"))(resource);
	let roles = pipe(get("roles", 0, "permissions"))(resource);
	// inspect(roles, "roles");

	let has_role_path = pipe(hasPath([group_id, role_id]))(roles);

	let permissions;

	if (has_role_path) {
		permissions = pipe(
			mod(group_id, role_id, permission_key)(() => permission_value)
		)(roles);
	}

	if (!has_role_path) {
		permissions = pipe(
			mod(group_id)(() => ({
				[role_id]: {
					[permission_key]: permission_value,
				},
			}))
		)(roles);
	}

	// inspect(permissions, "permissions");

	await prisma.roles.update({
		where: {
			id: roles_id,
		},
		data: {
			permissions,
		},
	});
};

export const delete_role = async ({ group_id, role_id, entity_id }) => {
	console.log("delete_role");
	let group_roles = await prisma.resource.findFirst({
		where: {
			resource_path_id: group_id,
		},
		include: {
			roles: true,
		},
	});

	inspect(group_roles, "group_roles");

	let roles = pipe(
		get("roles"),
		filter((role) => role.type == "resource"),
		head
	)(group_roles);

	let roles_id = pipe(get("id"))(roles);

	// console.log("roles_id", roles_id);

	const permissions = pipe(
		get("permissions"),
		mod(all)(dissoc(role_id))
	)(roles);

	// inspect(permissions, "permissionssss");

	const is_only_role = pipe(
		values,
		flatten,
		reject(isEmpty),
		isEmpty
	)(permissions);

	let entity_roles_ids = pipe(
		get("roles"),
		filter(
			(role) =>
				role.type == "entity" && includes(role_id, role.permissions)
		),
		get(all, "id")
	)(group_roles);

	// console.log(entity_roles_ids, "entity_roles_ids");

	if (is_only_role) {
		await prisma.roles.deleteMany({
			where: {
				resource_ids: { has: group_roles.id },
			},
		});

		await prisma.roles.deleteMany({
			where: {
				id: { in: entity_roles_ids },
			},
		});
	} else {
		await prisma.roles.update({
			where: {
				id: roles_id,
			},
			data: {
				permissions,
			},
		});
	}
};

export const delete_all = async () => {
	const result = await prisma.roles.deleteMany();
	console.log("result", result);
};
