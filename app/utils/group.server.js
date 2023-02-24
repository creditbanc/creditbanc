import { all, get, mod } from "shades";
import { pipe, flatten, uniqBy, prop, pick, map, reject } from "ramda";
import { prisma } from "./prisma.server";
const util = require("util");
import {
	create as create_resource,
	get as get_resource,
} from "./resource.server";
import { inspect } from "./helpers";

import { create as create_role } from "./role.server";

// const inspect = (obj) => {
// 	console.log(util.inspect(obj, false, null, true));
// 	return obj;
// };

export const create_root = async (data = {}) => {
	console.log("create_partition");
	let { name } = data;

	let group = await prisma.group.create({
		data: {
			name,
		},
	});

	let { id: group_id } = group;

	let resource = await create_resource({
		type: "partition",
		model: "group",
		resource_path_id: group_id,
	});

	await prisma.group.update({
		where: { id: group_id },
		data: { resource_id: resource.id },
	});

	return { type: "group", group, resource };
};

export const create_group = async ({ name, entity_id } = {}) => {
	console.log("create_group");

	let entity = await prisma.entity.findFirst({
		where: {
			id: entity_id,
		},
	});

	let { root_resource_id } = entity;

	let group = await prisma.group.create({
		data: {
			name,
		},
	});

	let { id: group_id } = group;

	let resource = await create_resource({
		type: "group",
		model: "group",
		resource_path_id: group_id,
	});

	// group resource roles need to go together into one json object
	// the pattern being resource_path_id/role_id/permissions

	let permissions = {
		[resource.resource_path_id]: {
			"@alpha": {
				can_view: true,
			},
			"@default": {
				can_view: true,
			},
		},
	};

	let resource_role = await create_role({
		resource_ids: { set: resource.id },
		entity_ids: { set: entity_id },
		type: "resource",
		permissions,
	});

	let entity_permissions = ["@alpha", "@default"];

	let entity_role = await create_role({
		resource_ids: { set: resource.id },
		entity_ids: { set: entity_id },
		type: "entity",
		permissions: entity_permissions,
	});

	await prisma.resource.update({
		where: { id: root_resource_id },
		data: {
			subscription_ids: {
				push: [resource.id],
			},
		},
	});

	await prisma.resource.update({
		where: { id: resource.id },
		data: {
			roles_ids: {
				push: [resource_role.id],
			},
			subscription_ids: {
				push: [resource.id],
			},
			subscriber_ids: {
				push: [root_resource_id, resource.id],
			},
		},
	});

	await prisma.group.update({
		where: { id: group_id },
		data: { resource_id: resource.id },
	});

	await prisma.entity.update({
		where: { id: entity_id },
		data: {
			roles_ids: { push: [entity_role.id] },
		},
	});

	return { type: "group", group, resource };
};

export const create_directory = async (data = {}) => {
	console.log("create_directory");
	let { root_resource_id, name } = data;
	console.log("data", data);

	let group = await prisma.group.create({
		data: {
			name,
		},
	});

	let { id: group_id } = group;

	let resource = await create_resource({
		type: "directory",
		model: "group",
		resource_path_id: group_id,
	});

	await prisma.resource.update({
		where: {
			resource_path_id: root_resource_id,
		},
		data: {
			subscription_ids: {
				push: [resource.id],
			},
		},
	});

	await prisma.resource.update({
		where: { id: resource.id },
		data: {
			subscriber_ids: {
				push: [root_resource_id],
			},
		},
	});

	await prisma.group.update({
		where: { id: group_id },
		data: { resource_id: resource.id },
	});

	return { type: "group", group, resource };
};

export const get_root_docs = async ({ entity_id }) => {
	let entity = await prisma.entity.findFirst({
		where: { id: entity_id },
	});

	// let partition = await prisma.entity.findFirst({
	// 	where: { id: entity_id },
	// 	include: {
	// 		roles: {
	// 			include: {
	// 				resources: {
	// 					where: {
	// 						type: "partition",
	// 					},
	// 					include: {
	// 						subscriptions: {
	// 							include: {
	// 								roles: {
	// 									where: { type: "resource" },
	// 								},
	// 							},
	// 						},
	// 					},
	// 				},
	// 			},
	// 		},
	// 	},
	// });

	// inspect(partition);

	let root_resource = await prisma.resource.findFirst({
		where: { id: entity.root_resource_id },
	});

	const get_resources = async (subscription_ids) => {
		let resources = await Promise.all(
			subscription_ids.map(async (resource_id) => {
				let resource = await prisma.group.findFirst({
					where: { resource_id },
				});
				return { ...resource, type: "group" };
			})
		);

		return resources;
	};

	let resources = await get_resources(root_resource.subscription_ids);

	return resources;
};

export const get_docs = async ({ resource_id }) => {
	let resource = await prisma.resource.findMany({
		where: {
			resource_path_id: resource_id,
		},
		include: {
			subscriptions: true,
		},
	});

	// console.log("resource");
	// inspect(resource);

	const is_group = (subscription) => subscription.type == "group";

	let subscription_ids = pipe(
		get(all, "subscriptions"),
		flatten,
		uniqBy(prop("id")),
		mod(all)(pick(["id", "type", "model", "resource_path_id"])),
		reject(is_group)
	)(resource);

	const get_resources = async (subscription_ids) => {
		let resources = await Promise.all(
			subscription_ids.map(async (subscription) => {
				let { model, type, resource_path_id } = subscription;

				let resource = await prisma[model].findFirst({
					where: { id: resource_path_id },
				});
				return { ...resource, type, model };
			})
		);

		return resources;
	};

	let resources = await get_resources(subscription_ids);

	return resources;
};

export const delete_all = async () => {
	const result = await prisma.group.deleteMany({});
	console.log("result", result);
};

// export const root_resource_id = async (entity_id) => {
// 	let root_resource = await prisma.role.findFirst({
// 		where: { name: "0", entity_id },
// 		include: { resources: true },
// 	});

// 	console.log("root_resource", root_resource);
// 	return root_resource;
// };

export const get_group_roles = async ({ group_id }) => {
	// console.log("get_group_roles");
	let group = await prisma.resource.findFirst({
		where: { resource_path_id: group_id },
		include: {
			roles: {
				where: { type: "resource" },
			},
		},
	});

	// inspect(group, "grouppppp");

	return pipe(uniqBy(prop("id")))(group.roles);
};

export const delete_docs = async (id) => {
	const result = await prisma.group.deleteMany({
		where: { OR: [{ name: "owner" }, { name: "test" }] },
	});

	console.log("result", result);
};
