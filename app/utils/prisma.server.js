import { PrismaClient } from "@prisma/client";

let prisma;
global.__db;

if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient();
	prisma.$connect();
} else {
	if (!global.__db) {
		global.__db = new PrismaClient();
	}
	prisma = global.__db;
}

// let prisma = PrismaClient;
// var __db = PrismaClient | undefined;

// if (process.env.NODE_ENV === "production") {
// 	prisma = new PrismaClient();
// } else {
// 	if (!__db) {
// 		__db = new PrismaClient();
// 	}
// 	prisma = __db;
// }

export { prisma };
