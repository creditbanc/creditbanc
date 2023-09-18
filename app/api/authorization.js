import { v4 as uuidv4 } from "uuid";
import { server_timestamp, set_doc } from "~/utils/firebase";

export const create_role_config = async ({
	group_id,
	entity_id,
	name,
	permissions,
}) => {
	let role_id = group_id + entity_id;
	let config_id = uuidv4();

	let role = {
		entity_id,
		group_id,
		role_id,
		id: config_id,
		name,
		permissions,
		created_at: server_timestamp(),
	};

	await set_doc(["role_configs", config_id], role);

	return role;
};
