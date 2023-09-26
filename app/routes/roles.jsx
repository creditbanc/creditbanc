import { Outlet, useLoaderData } from "@remix-run/react";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { delete_doc, get_collection, set_doc } from "~/utils/firebase";
import { isEmpty, pipe } from "ramda";
import { create } from "zustand";
import { mod } from "shades";

export const useRoleStore = create((set) => ({
	role: {},
	set_role: (path, value) => set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const loader = async ({ request }) => {
	let entity_id = await get_session_entity_id(request);

	// console.log("entity_id");
	// console.log(entity_id);

	let roles = await get_collection({
		path: ["role_configs"],
		queries: [
			{
				param: "entity_id",
				predicate: "==",
				value: entity_id,
			},
		],
	});

	// console.log("roles");
	// console.log(roles);

	return { entity_id, roles };
};

export default function Roles() {
	let { entity_id, roles } = useLoaderData();
	// let set_modal = useModalStore((state) => state.set_modal);

	return (
		<div className="flex flex-col w-full h-full bg-gray-50">
			<div className="flex flex-col w-full h-full p-5 ">
				<div className="flex flex-col w-full">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
