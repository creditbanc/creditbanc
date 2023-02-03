import { prisma } from "./prisma.server";

export const create = async (data) => {
	console.log("create link");

	const response = await prisma.entity.create({
		data,
	});

	return response;
};

export const delete_all = async () => {
	const result = await prisma.link.deleteMany({});
	console.log("result", result);
};

export const delete_docs = async (id) => {
	const result = await prisma.link.deleteMany({
		where: { OR: [{ name: "owner" }, { name: "test" }] },
	});

	console.log("result", result);
};
