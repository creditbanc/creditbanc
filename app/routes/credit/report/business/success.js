import { cache } from "~/utils/helpers.server";
import { redirect } from "@remix-run/node";
import { curry } from "ramda";

const log_route = `credit.report.business.success`;

export const on_success = curry((request, response) => {
	console.log(`${log_route}.success`);

	if (response.business_report_is_empty == true) {
		return redirect("/home");
	}

	let with_cache = cache(request);
	return with_cache({
		...response,
		cache_dependencies: [
			{
				name: "business_credit_report",
				value: response.report_sha,
			},
		],
	});
});
