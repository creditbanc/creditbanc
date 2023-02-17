import { to_resource_pathname, get_group_id } from "~/utils/helpers";
import { json } from "@remix-run/node";
import { create } from "~/utils/personal_credit_report.server";

export const loader = async ({ request }) => {
	console.log("create_personal_credit_report");
	let { url } = request;
	let group_id = get_group_id(url);
	console.log("group_id", group_id);

	let credit_report = await create({ group_id });
	console.log(credit_report);

	return json({ data: "hello world" });
};
