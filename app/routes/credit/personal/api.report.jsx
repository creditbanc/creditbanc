import { get_credit_report } from "~/data/array";
import { search_params } from "~/utils/helpers";

export const loader = async ({ request }) => {
	console.log("api.report.jsx");
	let { displayToken, reportKey } = search_params(request);

	let response = await get_credit_report(reportKey, displayToken);
	console.log("response");
	console.log(response);

	return response;
};
