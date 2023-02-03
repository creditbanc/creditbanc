import { prisma } from "./prisma.server";

export const delete_all = async () => {
	const result = await prisma.settings.deleteMany({});
	console.log("result", result);
};
