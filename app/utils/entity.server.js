import { set_doc } from "./firebase";
import { prisma } from "./prisma.server";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export const create_entity = async (entity_params) => {
	let { password } = entity_params;
	const hash = await bcrypt.hash(password, 10);
	let entity_id = uuidv4();

	let payload = {
		...entity_params,
		id: entity_id,
		password: hash,
	};

	await set_doc(["entity", entity_id], payload);
	return payload;
};

export const create = async (user_params) => {
	console.log("create user", user_params);
	const { email, password, first_name, last_name, plan_id } = user_params;

	const hash = await bcrypt.hash(password, 10);

	const user = await prisma.entity.create({
		data: {
			email,
			password: hash,
			first_name,
			last_name,
			plan_id,
		},
	});

	return user;
};

export const delete_all = async () => {
	const result = await prisma.entity.deleteMany({});
	console.log("result", result);
};

export const delete_docs = async (where) => {
	const result = await prisma.entity.deleteMany({
		where: { OR: [{ name: "owner" }, { name: "test" }] },
	});

	console.log("result", result);
};
