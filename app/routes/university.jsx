import { Outlet, useLoaderData } from "@remix-run/react";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";

export const loader = async ({ request }) => {
	let entity_id = await get_session_entity_id(request);

	return { entity_id };
};

export default function University() {
	let { entity_id } = useLoaderData();
	return (
		<div className="flex flex-col w-full h-full bg-gray-50 overflow-hidden">
			<div className="flex flex-col w-full h-full overflow-hidden p-5">
				<Outlet />
			</div>
		</div>
	);
}
