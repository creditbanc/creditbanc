import { get, get_group_id } from "~/utils/helpers";
import { get_session_entity_id } from "~/utils/auth.server";
import { get_partition_id } from "~/utils/group.server";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Group from "~/api/client/Group";
import { lastValueFrom, from } from "rxjs";
import { get_doc } from "~/utils/firebase";
import { head, isEmpty, pipe } from "ramda";
import { navigation as application_navigation } from "./apply/navigation";
import { filter } from "shades";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(url.pathname);

	let application = await lastValueFrom(from(get_doc(["application", entity_id])));

	if (!isEmpty(application)) {
		let { step = "lp", group_id } = application;

		console.log("step");
		console.log(step);

		if (step !== "complete") {
			console.log("here");

			let next = pipe(filter({ id: step }), head, get("next"))(application_navigation);

			console.log("next");
			console.log(next);

			return redirect(next({ entity_id, group_id }));
		}
	}

	if (!group_id) {
		let partition_id = await get_partition_id({
			entity_id,
		});

		return redirect(`/home/resource/e/${entity_id}/g/${partition_id}`);
	}

	let group = new Group(group_id);
	let group_response = group.has_reports.fold;
	let response = await lastValueFrom(group_response);

	if (!response.business_report) {
		return redirect(`/credit/business/new/v/1/resource/e/${entity_id}/g/${group_id}`);
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
