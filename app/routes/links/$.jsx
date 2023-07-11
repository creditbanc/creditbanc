import { get_user_id } from "~/utils/auth.server";
import { set_doc } from "~/utils/firebase";
import { get_group_id } from "~/utils/helpers";

let group_id = "645df45fa279621414e4e586";
let config_id = "4b078ffa-3c1a-4eb7-a2ab-8e2ffdaf035f";

export const loader = async ({ request }) => {
	// const config_id = "db88508c-b4ea-4dee-8d60-43c5a847c172";

	let entity_id = await get_user_id(request);
	let group_id = get_group_id(request.url);
	// let group_id = "1";
	// let entity_id = "1";
	let role_id = group_id + entity_id;

	let test_role = {
		entity_id,
		group_id,
		config_id,
		role_id,
	};

	// console.log("test_role");
	// console.log(test_role);

	// await set_doc(["roles", role_id], test_role);
	// console.log("role_set");

	return null;
};

export default function InviteLink() {
	return <div>hi</div>;
}
