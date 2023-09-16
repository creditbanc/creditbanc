import { json, createCookieSessionStorage, redirect } from "@remix-run/node";
import { prisma } from "./prisma.server";
import bcrypt from "bcryptjs";
import { create_entity, create as create_user } from "./entity.server";
import { create as create_roles } from "./role.server";
import { create_root, create_group, create_partition } from "./group.server";
import { head, pipe, take } from "ramda";
import { v4 as uuidv4 } from "uuid";
import { get_collection, get_doc, set_doc } from "./firebase";
import { create_role_config } from "~/api/authorization";

let secret = process.env.SESSION_SECRET;

if (!secret) {
	throw new Error("Please set the SESSION_SECRET environment variable");
}

const storage = createCookieSessionStorage({
	cookie: {
		name: "creditbanc_session",
		secure: process.env.NODE_ENV === "production",
		secret: [secret],
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60 * 24 * 30,
		httpOnly: true,
	},
});

export const signup = async ({
	email,
	password,
	redirect_to = "/root",
	new_entity = false,
	first_name,
	last_name,
	plan_id = "essential",
}) => {
	// console.log("signup");
	// console.log("email", email);

	//=> check if a user already exists with that email

	// const exists = await prisma.entity.count({ where: { email } });

	// console.log("exists", exists);

	// if (exists) {
	// 	return json(
	// 		{
	// 			error: "User already exists",
	// 		},
	// 		{ status: 400 }
	// 	);
	// }

	//=> create the entity

	let entity = await create_entity({
		email,
		password,
		first_name,
		last_name,
		plan_id,
	});

	// const entity = await create_user({
	// 	email,
	// 	password,
	// 	first_name,
	// 	last_name,
	// 	plan_id,
	// });

	// if (!entity) {
	// 	return json(
	// 		{
	// 			error: `Something wen't wrong when creating the new account.`,
	// 			fields: { email: email, password: password },
	// 		},
	// 		{ status: 400 }
	// 	);
	// }

	// create partition group

	let partition = await create_partition({ entity_id: entity.id });

	// let { group, resource } = await create_root({
	// 	user_id: entity.id,
	// 	name: "root",
	// });

	// // console.log("root_partition_group");
	// // console.log(group);

	// let { group: root_group, resource: root_group_resource } =
	// 	await create_group({
	// 		name: "root",
	// 		entity_id: entity.id,
	// 		type: "root",
	// 		// root_partition_resource_path_id: resource.id,
	// 		root_partition_resource_path_id: resource.resource_path_id,
	// 	});

	// // console.log("resource", resource);

	// let permissions = {
	// 	[resource.resource_path_id]: {
	// 		"@alpha": {
	// 			can_view: true,
	// 		},
	// 	},
	// };

	// let resource_roles = await create_roles({
	// 	resource_ids: { set: resource.id },
	// 	entity_ids: { set: entity.id },
	// 	type: "resource",
	// 	permissions,
	// });

	// let creator_resource_role = await create_role({
	// 	resource_ids: { set: resource.id },
	// 	entity_ids: { set: entity.id },
	// 	type: "resource",
	// 	name: "root",
	// 	link: {
	// 		create: {
	// 			hash: Buffer.from(`${resource.id}${Date.now()}`).toString(
	// 				"base64"
	// 			),
	// 		},
	// 	},
	// 	settings: {
	// 		create: {
	// 			can_view: true,
	// 		},
	// 	},
	// });

	// let entity_permissions = ["@alpha"];

	// let creator_user_role = await create_roles({
	// 	resource_ids: { set: resource.id },
	// 	entity_ids: { set: entity.id },
	// 	type: "entity",
	// 	permissions: entity_permissions,
	// 	// name: "@alpha",
	// });

	// // let default_user_role = await create_roles({
	// // 	resource_id: resource.id,
	// // 	entity_ids: { set: entity.id },
	// // 	type: "entity",
	// // 	name: "@default",
	// // });

	// await prisma.resource.update({
	// 	where: { id: resource.id },
	// 	data: {
	// 		roles_ids: resource_roles.id,
	// 		// role_ids: {
	// 		// 	push: [creator_resource_role.id, default_resource_role.id],
	// 		// },
	// 		subscription_ids: {
	// 			push: [resource.id],
	// 		},
	// 		subscriber_ids: {
	// 			push: [resource.id],
	// 		},
	// 	},
	// });

	// await prisma.entity.update({
	// 	where: { id: entity.id },
	// 	data: {
	// 		roles_ids: { push: [creator_user_role.id] },
	// 		root_partition_resource_path_id: resource.resource_path_id,
	// 		root_group_resource_path_id: root_group_resource.resource_path_id,
	// 	},
	// });

	// redirect_to = new_entity
	// 	? redirect_to + `&group_id=${root_group_resource.resource_path_id}`
	// 	: redirect_to;

	//=> create administrator role config

	let role_config = await create_role_config({
		group_id: partition.id,
		entity_id: entity.id,
		name: "@administrator",
	});

	redirect_to = new_entity
		? redirect_to + `/resource/e/${entity.id}/g/${partition.id}`
		: redirect_to;

	return create_user_session(entity.id, redirect_to);
};

export const signin = async (form) => {
	let { email, password } = form;
	// console.log("form_____");
	// console.log(form);

	let entity_queries = [
		{
			param: "email",
			predicate: "==",
			value: email,
		},
	];

	const entity_response = await get_collection({
		path: ["entity"],
		queries: entity_queries,
	});

	let entity = pipe(head)(entity_response);

	// const user = await prisma.entity.findFirst({
	// 	where: { email },
	// });

	// console.log("entity");
	// console.log(entity);

	// let partition_queries = [
	// 	{ param: "entity_id", predicate: "==", value: entity.id },
	// 	{ param: "type", predicate: "==", value: "partition" },
	// ];

	// let partition_response = await get_collection({
	// 	path: ["group"],
	// 	queries: partition_queries,
	// });

	// let partition = pipe(head)(partition_response);

	// let root_group = await prisma.resource.findFirst({
	// 	where: {
	// 		resource_path_id: user.root_group_resource_path_id,
	// 	},
	// 	include: {
	// 		subscriptions: {
	// 			where: {
	// 				type: "file",
	// 			},
	// 			take: 1,
	// 		},
	// 	},
	// });

	// let file = root_group.subscriptions[0];

	// let file_map = {
	// 	personal_credit_report: "personal",
	// 	business_credit_report: "business",
	// };

	let redirect_url = `/home`;

	// console.log("redirect_url");
	// console.log(redirect_url);

	if (!entity || !(await bcrypt.compare(password, entity.password))) {
		return json(
			{
				error: "Incorrect login",
			},
			{ status: 400 }
		);
	}

	return create_user_session(entity.id, redirect_url);
};

const create_user_session = async (entity_id, redirect_to) => {
	const session = await storage.getSession();
	session.set("entity_id", entity_id);
	return redirect(redirect_to, {
		headers: { "Set-Cookie": await storage.commitSession(session) },
	});
};

export const get_user_session = (request) => {
	// console.log("get_user_session");
	// console.log(request.headers);
	return storage.getSession(request.headers.get("Cookie"));
};

export const require_user_session = async (
	request,
	redirect_to = new URL(request.url).pathname
) => {
	const session = await get_user_session(request);
	const entity_id = session.get("entity_id");

	if (!entity_id) {
		const search_params = new URLSearchParams([
			["redirect_to", redirect_to],
		]);
		throw redirect(`/signin?${search_params.toString()}`);
	}

	return entity_id;
};

export const get_session_entity_id = async (request) => {
	const session = await get_user_session(request);
	const user_id = session.get("entity_id");

	// console.log("user_get_session_entity_idid");
	// console.log(session.data);
	// console.log(user_id);

	if (!user_id || typeof user_id !== "string") {
		return null;
	}

	return user_id;
};

export const get_entity = async (request) => {
	const entity_id = await get_session_entity_id(request);

	if (typeof entity_id !== "string") {
		return null;
	}

	try {
		let entity = get_doc(["entity", entity_id]);
		return entity;
	} catch {
		throw logout(request);
	}
};

export const get_user_id = async (request) => {
	const session = await get_user_session(request);
	const user_id = session.get("entity_id");

	if (!user_id || typeof user_id !== "string") {
		return null;
	}

	return user_id;
};

export const get_user = async (request) => {
	const user_id = await get_user_id(request);

	if (typeof user_id !== "string") {
		return null;
	}

	try {
		const user = await prisma.entity.findUnique({
			where: { id: user_id },
			// select: { id: true, email: true, name: true },
		});
		return user;
	} catch {
		throw logout(request);
	}
};

export const logout = async (redirect_to, request) => {
	const session = await get_user_session(request);

	return redirect(redirect_to, {
		headers: { "Set-Cookie": await storage.destroySession(session) },
	});
};
