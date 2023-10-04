import { curry } from "ramda";
import { cache } from "~/utils/helpers.server";
import { redirect } from "@remix-run/node";
import { get_entity_id, get_group_id } from "~/utils/helpers";

const log_route = `credit.report.personal.success`;

export const on_success = curry((request, response) => {
	console.log(`${log_route}.success`);
	const group_id = get_group_id(request.url);
	const entity_id = get_entity_id(request.url);

	if (response.personal_report_is_empty == true) {
		return redirect(`/credit/personal/new/resource/e/${entity_id}/g/${group_id}`);
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
