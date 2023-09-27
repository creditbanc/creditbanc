import { pipe, head } from "ramda";
import { get_collection, server_timestamp, set_doc } from "./firebase";
import { v4 as uuidv4 } from "uuid";

export const create_partition = async ({ entity_id }) => {
	console.log("create_partition");

	let partition_id = uuidv4();

	let payload = {
		id: partition_id,
		entity_id,
		type: "partition",
		model: "group",
		created_at: server_timestamp(),
	};

	await set_doc(["group", partition_id], payload);

	return payload;
};

export const create_root = async () => {};

export const create_group = async () => {};

export const create_directory = async () => {};

export const get_partition_id = async ({ entity_id }) => {
	console.log("get_root_group_resource_path_id");

	let partion_queries = [
		{
			param: "entity_id",
			predicate: "==",
			value: entity_id,
		},
		{
			param: "type",
			predicate: "==",
			value: "partition",
		},
	];

	let partition_response = await get_collection({
		path: ["group"],
		queries: partion_queries,
	});

	let partition = pipe(head)(partition_response);

	let { id } = partition;
	return id;
};

export const get_root_docs = async () => {};

export const get_docs = async () => {};

export const delete_all = async () => {};

export const get_group_roles = async () => {};

export const delete_docs = async () => {};
