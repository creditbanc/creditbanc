import CreditNav from "~/components/CreditNav";
import { get_group_id, to_resource_pathname } from "~/utils/helpers";
import { get_user_id } from "~/utils/auth.server";
import { get_docs as get_group_docs } from "~/utils/group.server";
import { defaultTo, pipe } from "ramda";
import { filter } from "shades";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import LeftNav from "~/components/LeftNav";
import Share from "~/routes/invites/new/$.jsx";
import Modal from "~/components/Modal";
import { DocumentIcon, FolderIcon } from "@heroicons/react/24/outline";
import ReportTabs from "~/components/ReportTabs";

export const loader = async ({ request }) => {
	let url = new URL(request.url);

	// if (!has_valid_route_p("credit/personal/report", request.url))
	// 	return redirect("/");

	let user_id = await get_user_id(request);
	let group_id = get_group_id(url.pathname);
	// let file_id = get_file_id(url.pathname);

	// let is_resource_owner = await is_resource_owner_p({
	// 	entity_id: user_id,
	// 	group_id,
	// 	file_id,
	// });

	// let permissions = await validate_action({
	// 	entity_id: user_id,
	// 	group_resource_path_id: group_id,
	// 	resource_path_id: file_id,
	// 	is_owner: is_resource_owner,
	// 	request,
	// });

	// console.log("permissions");
	// console.log(permissions);

	// console.log("is_resource_owner");
	// console.log(is_resource_owner);

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
	// console.log(report);

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

	return { reports, origin: url.origin, user_id };
};

export default function Report() {
	var { origin, user_id, reports } = useLoaderData();

	return (
		<div className="flex flex-col h-full w-full">
			<Modal>
				<Share />
			</Modal>
			<CreditNav
				user_id={user_id}
				origin={origin}
				can_share={true}
				reports={reports}
			/>
			<div className="flex flex-row h-full overflow-hidden">
				{user_id && <LeftNav data={reports} can_manage_roles={false} />}
				<div className="flex flex-col flex-1 overflow-scroll">
					<ReportTabs />
					<Outlet />
				</div>
			</div>
		</div>
	);
}
