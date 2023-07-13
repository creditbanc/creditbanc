import { get_group_id } from "~/utils/helpers";
import { defaultTo, head, pipe } from "ramda";
import { Lendflow } from "~/data/lendflow";
import { Array } from "~/data/array";
import { get_collection } from "~/utils/firebase";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let group_id = get_group_id(url.pathname);

	let personal_credit_report_queries = [
		{
			param: "group_id",
			predicate: "==",
			value: group_id,
		},
		{
			param: "type",
			predicate: "==",
			value: "personal_credit_report",
		},
	];

	let personal_credit_report_response = await get_collection({
		path: ["credit_reports"],
		queries: personal_credit_report_queries,
	});

	let personal_credit_report = pipe(
		head,
		defaultTo({})
	)(personal_credit_report_response);

	let { data: personal = undefined } = personal_credit_report;

	let personal_credit_report_payload = {
		experian_personal_score: personal ? Array.experian.score(personal) : 0,
		equifax_personal_score: personal ? Array.equifax.score(personal) : 0,
		transunion_personal_score: personal
			? Array.transunion.score(personal)
			: 0,
	};

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

	let business_credit_report_response = await get_collection({
		path: ["credit_reports"],
		queries: business_credit_report_queries,
	});

	let business_credit_report = pipe(
		head,
		defaultTo({})
	)(business_credit_report_response);

	let business_credit_report_payload = {
		experian_business_score: business_credit_report
			? Lendflow.experian.score(business_credit_report)
			: 0,
		dnb_business_score: business_credit_report
			? Lendflow.dnb.score(business_credit_report)
			: 0,
	};

	let payload = {
		...personal_credit_report_payload,
		...business_credit_report_payload,
	};

	return payload;
};
