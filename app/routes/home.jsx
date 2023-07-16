import { get_group_id } from "~/utils/helpers";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import {
	get_docs as get_group_docs,
	get_partition_id,
} from "~/utils/group.server";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import SimpleNavSignedIn from "~/components/SimpleNavSignedIn";

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
	var { entity_id } = useLoaderData();

	return (
		<div className="flex flex-col h-full w-full bg-gray-50">
			<div className="flex flex-col border-b w-full bg-white">
				<SimpleNavSignedIn user_id={entity_id} />
			</div>

			<div className="flex flex-row h-full overflow-hidden">
				<div className="flex flex-col flex-1 overflow-scroll">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
