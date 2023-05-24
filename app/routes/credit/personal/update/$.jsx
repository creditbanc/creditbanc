import { prisma } from "~/utils/prisma.server";
import {
	appKey,
	authenticate_url,
	new_credit_report,
	authenticate_user,
} from "~/data/array";
import { get_user_id } from "~/utils/auth.server";

export const action = async ({ request }) => {
	console.log("update");
	let entity_id = await get_user_id(request);
	const form = await request.formData();
	const request_payload = JSON.parse(form.get("payload"));
	let { report_id, redirect_to } = request_payload;

	let report = await prisma.personal_credit_report.findUnique({
		where: {
			id: report_id,
		},
	});

	let { clientKey, userToken } = report;

	let new_report_payload = {
		clientKey,
		productCode: "credmo3bReportScore",
		userToken,
	};

	console.log("new_report_payload");
	console.log(new_report_payload);

	let response = await new_credit_report(new_report_payload);

	// let { displayToken = null, reportKey = null, error = null } = response;

	console.log("request_payload");
	console.log(request_payload);
	console.log("report");
	console.log(report);
	console.log("response");
	console.log(response);

	let { displayToken = null, reportKey = null, error = null } = response;

	if (displayToken && reportKey) {
		console.log("updating report");
		prisma.personal_credit_report.update({
			where: {
				id: report_id,
			},
			data: {
				displayToken,
				reportKey,
			},
		});
	}

	return null;
};
