import { get_group_id, inspect } from "~/utils/helpers";
import { get_collection } from "~/utils/firebase";
import { head, pipe } from "ramda";
import { Lendflow } from "~/data/lendflow";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let group_id = get_group_id(url.pathname);

	let business_credit_report_queries = [
		{
			param: "group_id",
			predicate: "==",
			value: group_id,
		},
		{
			param: "type",
			predicate: "==",
			value: "business_credit_report",
		},
	];

	let report_response = await get_collection({
		path: ["credit_reports"],
		queries: business_credit_report_queries,
	});

	let report = pipe(head)(report_response);

	let business = Lendflow.business(report);

	return {};
};
