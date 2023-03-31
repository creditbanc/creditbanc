import { prisma } from "./prisma.server";
import bcrypt from "bcryptjs";

export const create = async (user_params) => {
	console.log("create user", user_params);
	const { email, password, first_name, last_name } = user_params;

	const hash = await bcrypt.hash(password, 10);

	const user = await prisma.entity.create({
		data: {
			email,
			password: hash,
			first_name,
			last_name,
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
