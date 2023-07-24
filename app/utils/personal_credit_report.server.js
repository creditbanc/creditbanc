import { set_doc } from "./firebase";
import { prisma } from "./prisma.server";
import { create as create_resource } from "./resource.server";
import { credit_report_data, CreditReport, Liabilities } from "~/data/array";

export const create = async (payload) => {
	let { group_id, id } = payload;
	if (!group_id) throw new Error("group_id is required");

	// let id = group_id + "personal_credit_report";

	await set_doc(["credit_reports", id], payload);

	return payload;
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
