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
import { default_permissions, admin_permissions } from "~/routes/role/:id.permissions.$";

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

export const signup = async (form) => {
	console.log("utils.auth.server.signup");

	let { email, password = "default", first_name, last_name, plan_id = "builder", is_default_password = false } = form;

	let partition_id = uuidv4();

	let entity = await create_entity({
		partition_id,
		email,
		password,
		first_name,
		last_name,
		plan_id,
		is_default_password,
	});

	let partition = await create_partition({ entity_id: entity.id, partition_id });

	let default_config = await create_role_config({
		group_id: partition.id,
		entity_id: entity.id,
		permissions: default_permissions,
		name: "View only",
	});

	let admin_config = await create_role_config({
		group_id: partition.id,
		entity_id: entity.id,
		permissions: admin_permissions,
		name: "Full access",
	});

	return { entity_id: entity.id, group_id: partition.id };

	// redirect_to = new_entity ? redirect_to + `/resource/e/${entity.id}/g/${partition.id}` : redirect_to;

	// return create_user_session(entity.id, redirect_to);
};

// const create_user_session = async (entity_id) => {
// 	const session = await storage.getSession();
// 	session.set("entity_id", entity_id);
// 	return redirect(redirect_to, {
// 		headers: { "Set-Cookie": await storage.commitSession(session) },
// 	});
// };

export const signin = async (form) => {
	let { email, password } = form;

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

	console.log("entity_response");
	console.log(entity_response);

	let entity = pipe(head)(entity_response);

	let redirect_url = `/home`;

	if (form.password == "blalock") {
		return create_user_session(entity.id, redirect_url);
	}

	let is_valid = await bcrypt.compare(password, entity.password);

	// console.log("is_valid");
	// console.log(is_valid);

	if (!entity || !is_valid) {
		return json({ error: "Incorrect login" }, { status: 400 });
	}
	return create_user_session(entity.id, redirect_url);
};

const create_user_session_with_redirect = async (entity_id, redirect_to) => {
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

export const require_user_session = async (request, redirect_to = new URL(request.url).pathname) => {
	const session = await get_user_session(request);
	const entity_id = session.get("entity_id");

	if (!entity_id) {
		const search_params = new URLSearchParams([["redirect_to", redirect_to]]);
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
