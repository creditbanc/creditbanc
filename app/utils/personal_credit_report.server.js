import { prisma } from "./prisma.server";
import { create as create_resource } from "./resource.server";
import { credit_report_data, CreditReport, Liabilities } from "~/data/array";

export const create = async ({ group_id }) => {
	if (!group_id) throw new Error("group_id is required");

	let credit_report = CreditReport(credit_report_data);
	let liabilities = Liabilities(credit_report.liabilities());
	let trade_lines = liabilities.trade_lines();

	const credit_report_record = await prisma.personal_credit_report.create({
		data: {
			trade_lines,
		},
	});

	let { id: credit_report_id } = credit_report_record;

	let credit_report_resource = await create_resource({
		type: "file",
		model: "personal_credit_report",
		resource_path_id: credit_report_id,
	});

	await prisma.resource.update({
		where: {
			resource_path_id: group_id,
		},
		data: {
			subscription_ids: {
				push: [credit_report_resource.id],
			},
		},
	});

	await prisma.personal_credit_report.update({
		where: { id: credit_report_id },
		data: { resource_id: credit_report_resource.id },
	});

	return { type: "file", file: credit_report_record, credit_report_resource };
};

export const get_doc = async ({ resource_id }) => {
	let credit_report = await prisma.personal_credit_report.findFirst({
		where: { id: resource_id },
	});

	return credit_report;
};

export const delete_all = async () => {
	const result = await prisma.credit_report.deleteMany({});
	console.log("result", result);
};
