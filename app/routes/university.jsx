import { Outlet, useLoaderData } from "@remix-run/react";
import SimpleNavSignedIn from "~/components/SimpleNavSignedIn";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";

export const loader = async ({ request }) => {
	let entity_id = await get_session_entity_id(request);

	return { entity_id };
};

export default function University() {
	let { entity_id } = useLoaderData();
	return (
		<div className="flex flex-col w-full h-full bg-gray-50">
			{/* <div className="flex flex-col w-full border-b bg-white">
				<SimpleNavSignedIn user_id={entity_id} />
			</div> */}

			<Outlet />
		</div>
	);
}
