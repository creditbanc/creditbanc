import { pipe, prop, uniqBy } from "ramda";
import { get, all } from "shades";
import { get_collection } from "~/utils/firebase";

export const get_owner_companies_ids = async (entity_id) => {
	let owner_queries = [
		{
			param: "entity_id",
			predicate: "==",
			value: entity_id,
		},
	];

	let owner_companies = await get_collection({
		path: ["role_configs"],
		queries: owner_queries,
	});

	owner_companies = pipe(
		uniqBy(prop("group_id")),
		get(all, "group_id")
	)(owner_companies);

	return owner_companies;
};

export const get_shared_companies_ids = async (entity_id) => {
	let shared_queries = [
		{
			param: "entity_id",
			predicate: "==",
			value: entity_id,
		},
	];

	let shared_companies = await get_collection({
		path: ["roles"],
		queries: shared_queries,
	});

	shared_companies = pipe(
		uniqBy(prop("group_id")),
		get(all, "group_id")
	)(shared_companies);

	return shared_companies;
};
