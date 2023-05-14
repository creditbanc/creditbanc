import { prisma } from "./prisma.server";
import { create as create_resource } from "./resource.server";

export const create = async (payload) => {
	let { group_id, ...rest } = payload;
	if (!group_id) throw new Error("group_id is required");

	// let credit_report = CreditReport(credit_report_data);
	// let liabilities = Liabilities(credit_report.liabilities());
	// let trade_lines = liabilities.trade_lines();

	const credit_report_record = await prisma.business_credit_report.create({
		data: {
			...rest,
			type: "business_credit_report",
		},
	});

	let { id: credit_report_id } = credit_report_record;

	let credit_report_resource = await create_resource({
		type: "file",
		model: "business_credit_report",
		resource_path_id: credit_report_id,
	});

	console.log("credit_report_resource");
	console.log(credit_report_resource);

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

	await prisma.business_credit_report.update({
		where: { id: credit_report_id },
		data: { resource_id: credit_report_resource.id },
	});

	return { type: "file", file: credit_report_record, credit_report_resource };
};

export const update_business_report = async (report_id, data) => {
	let updated_report = await prisma.business_credit_report.update({
		where: { id: report_id },
		data: {
			...data,
		},
	});

	return updated_report;
};
