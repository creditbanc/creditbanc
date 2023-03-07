import { get_group_id, get_file_id, inspect } from "~/utils/helpers";
import { get_user_id } from "~/utils/auth.server";
import { get_entity_roles, get_link_role } from "~/utils/resource.server";
import { redirect } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import {
	uniq,
	map,
	isEmpty,
	flatten,
	tryCatch,
	always,
	head,
	pipe,
} from "ramda";
import { all, get, includes, filter as sfilter } from "shades";
import { to_route_pathname } from "~/utils/helpers";

const get_resource = async ({ resource_path_id }) => {
	let resource = await prisma.resource.findFirst({
		where: {
			resource_path_id,
		},
	});

	return resource;
};

const add_subscriber_to_resource = async ({
	resource_path_id,
	entity_group_resource_path_id,
}) => {
	let resource = await get_resource({ resource_path_id });
	let { subscriber_ids } = resource;

	return await prisma.resource.update({
		where: { id: resource.id },
		data: {
			subscriber_ids: uniq([
				...subscriber_ids,
				entity_group_resource_path_id,
				resource_path_id,
			]),
		},
	});
};

const add_subscriber_to_group = async ({
	resource_path_id,
	entity_group_resource_path_id,
	group_resource_path_id,
}) => {
	let resource = await get_resource({
		resource_path_id: group_resource_path_id,
	});

	let { subscriber_ids } = resource;

	return await prisma.resource.update({
		where: { id: resource.id },
		data: {
			subscriber_ids: uniq([
				...subscriber_ids,
				entity_group_resource_path_id,
				resource_path_id,
			]),
		},
	});
};

const create_entity_role = async ({
	role,
	entity_id,
	entity_group_resource_path_id,
	resource_path_id,
}) => {
	let entity_roles = await prisma.roles.findMany({
		where: {
			resource_ids: {
				hasEvery: [entity_group_resource_path_id, resource_path_id],
			},
			entity_ids: {
				has: entity_id,
			},
			type: "entity",
		},
	});

	let entity_role = tryCatch(
		sfilter({ permissions: includes(role) }),
		always([])
	)(entity_roles);

	if (isEmpty(entity_role)) {
		let entity_payload = {
			type: "entity",
			permissions: [role],
			entity_ids: [entity_id],
			resource_ids: [entity_group_resource_path_id, resource_path_id],
		};

		let entity_role = await prisma.roles.create({
			data: entity_payload,
		});

		return entity_role;
	} else {
		return entity_role;
	}
};

const create_entity_roles = async ({
	entity_roles,
	entity_id,
	entity_group_resource_path_id,
	group_resource_path_id,
	resource_path_id,
}) => {
	// role,
	// entity_id,
	// entity_group_resource_path_id,
	// resource_path_id,

	let roles = flatten(
		await Promise.all(
			map(async (role) => {
				return await create_entity_role({
					role,
					entity_id,
					entity_group_resource_path_id,
					group_resource_path_id,
					resource_path_id,
				});
			}, entity_roles)
		)
	);

	return roles;
};

const get_entity_group = async ({ entity_id }) => {
	let root_group = await prisma.resource.findMany({
		where: {
			model: "group",
			type: "root",
			entity_ids: {
				has: entity_id,
			},
		},
	});

	return head(root_group);
};

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let entity_id = await get_user_id(request);
	let resource_url = url.pathname.replace("/links/", "/");

	if (!entity_id) return redirect(resource_url);

	let group_resource_path_id = get_group_id(url.pathname);
	let resource_path_id = get_file_id(url.pathname);
	let link_role = get_link_role(request);
	let entity_root_group = await get_entity_group({ entity_id });

	// console.log("route_pathname");
	// console.log(entity_id);
	// console.log(entity_root_group);

	let entity_roles = await get_entity_roles({
		entity_id,
		resource_ids: [group_resource_path_id, resource_path_id],
		link_role,
	});

	// console.log("entity_rolesssss", entity_roles);

	await add_subscriber_to_resource({
		resource_path_id,
		entity_group_resource_path_id: entity_root_group.resource_path_id,
	});

	await add_subscriber_to_group({
		group_resource_path_id,
		resource_path_id,
		entity_group_resource_path_id: entity_root_group.resource_path_id,
	});

	await create_entity_roles({
		entity_roles,
		entity_id,
		entity_group_resource_path_id: entity_root_group.resource_path_id,
		group_resource_path_id,
		resource_path_id,
	});

	let resource_route = `resource/e/${entity_id}/g/${entity_root_group.resource_path_id}/f/${resource_path_id}`;

	let redirect_path = pipe(
		to_route_pathname,
		(path) => path.replace("/links/", "/"),
		(path) => `${path}/${resource_route}`
	)(url.pathname);

	return redirect(redirect_path);
};
