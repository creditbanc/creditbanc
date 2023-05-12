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

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let user_id = await get_user_id(request);
	let group_id = get_group_id(url.pathname);

	// console.log("group_id");
	// console.log(group_id);

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

	// if (!has_valid_route_p("credit/personal/report", request.url))
	// 	return redirect("/");

	// let { can_view = false } = permissions ?? {};

	// if (!can_view) return redirect("/");

	let group_docs = await get_group_docs({
		resource_id: group_id,
		entity_id: user_id,
	});

	// let report = pipe(
	// 	filter((report) => report.id == file_id),
	// 	head
	// )(group_docs);

	// console.log("group_docs");
	// console.log(group_docs);

	let reports = pipe((resources) => ({
		personal_credit_reports: pipe(
			filter({ model: "personal_credit_report" }),
			defaultTo([])
		)(resources),
		business_credit_reports: pipe(
			filter({ model: "business_credit_report" }),
			defaultTo([])
		)(resources),
	}))(group_docs);

	// return null;
	return { reports, origin: url.origin, user_id };
};

export default function Home() {
	var { origin, user_id, reports } = useLoaderData();

	return (
		<div className="flex flex-col h-full w-full">
			<div className="flex flex-col border-b">
				<CreditNav
					user_id={user_id}
					origin={origin}
					can_share={false}
					reports={reports}
				/>
			</div>
			<div className="flex flex-row h-full overflow-hidden">
				{user_id && <LeftNav data={reports} can_manage_roles={false} />}
				<div className="flex flex-col flex-1 overflow-scroll">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
