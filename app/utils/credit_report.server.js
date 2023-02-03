import { prisma } from "./prisma.server";
import { create as create_resource } from "./resource.server";

let test = {
	ssn: "1",
	name: "personal",
};

export const create = async (data = {}) => {
	let { root_resource_id } = data;

	const credit_report = await prisma.credit_report.create({
		data: {
			...test,
		},
	});

	let { id: credit_report_id } = credit_report;

	let resource = await create_resource({
		type: "file",
		model: "credit_report",
		resource_path_id: credit_report_id,
	});

	console.log("root_resource_id", root_resource_id);

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

	// await prisma.resource.update({
	// 	where: { id: resource.id },
	// 	data: {
	// 		subscriber_ids: {
	// 			push: [root_resource_id],
	// 		},
	// 	},
	// });

	await prisma.credit_report.update({
		where: { id: credit_report_id },
		data: { resource_id: resource.id },
	});

	return { type: "file", file: credit_report, resource };
};

export const delete_all = async () => {
	const result = await prisma.credit_report.deleteMany({});
	console.log("result", result);
};
