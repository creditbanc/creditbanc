import { get_group_id } from "~/utils/helpers";
import { get_session_entity_id } from "~/utils/auth.server";
import { get_partition_id } from "~/utils/group.server";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(url.pathname);

	if (!group_id) {
		let partition_id = await get_partition_id({
			entity_id,
		});

		return redirect(`/home/resource/e/${entity_id}/g/${partition_id}`);
	}

	return { entity_id };
};

export default function Home() {
	return (
		<div className="flex flex-col h-full w-full bg-gray-50 overflow-hidden">
			<div className="flex flex-col w-full h-full">
				<Outlet />
			</div>
		</div>
	);
}
