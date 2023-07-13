import { get_group_id } from "~/utils/helpers";
import { get_user_id } from "~/utils/auth.server";
import LeftNav from "~/components/LeftNav";
import CreditNav from "~/components/CreditNav";
import {
	get_docs as get_group_docs,
	get_root_group_resource_path_id,
} from "~/utils/group.server";
import { defaultTo, pipe } from "ramda";
import { filter } from "shades";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import SimpleNav from "~/components/SimpleNav";
import SimpleNavSignedIn from "~/components/SimpleNavSignedIn";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let user_id = await get_user_id(request);
	let group_id = get_group_id(url.pathname);

	if (!group_id) {
		let root_gruop_resource_path_id = await get_root_group_resource_path_id(
			{
				entity_id: user_id,
			}
		);

		return redirect(
			`/home/resource/e/${user_id}/g/${root_gruop_resource_path_id}`
		);
	}

	return { user_id };
};

export default function Home() {
	var { user_id } = useLoaderData();

	return (
		<div className="flex flex-col h-full w-full bg-gray-50">
			<div className="flex flex-col border-b w-full bg-white">
				<SimpleNavSignedIn user_id={user_id} />
			</div>

			<div className="flex flex-row h-full overflow-hidden">
				<div className="flex flex-col flex-1 overflow-scroll">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
