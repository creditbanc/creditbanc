import { curry } from "ramda";
import { cache } from "~/utils/helpers.server";
import { redirect } from "@remix-run/node";

const log_route = `credit.report.personal.success`;

export const on_success = curry((request, response) => {
	console.log(`${log_route}.success`);

	if (response.personal_report_is_empty == true) {
		return redirect("/credit/personal/new");
	}

	let with_cache = cache(request);
	return with_cache({
		...response,
		cache_dependencies: [
			{
				name: "personal_credit_report",
				value: response.report_sha,
			},
		],
	});
});
