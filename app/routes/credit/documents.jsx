import CreditNav from "~/components/CreditNav";
import { get_group_id } from "~/utils/helpers";
import { get_user_id } from "~/utils/auth.server";
import { get_docs as get_group_docs } from "~/utils/group.server";
import { defaultTo, pipe } from "ramda";
import { filter } from "shades";
import { Outlet, useLoaderData } from "@remix-run/react";
import LeftNav from "~/components/LeftNav";
import Share from "~/routes/invites/new/$.jsx";
import Modal from "~/components/Modal";
import ReportTabs from "~/components/ReportTabs";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let user_id = await get_user_id(request);
	let group_id = get_group_id(url.pathname);

	let group_docs = await get_group_docs({
		resource_id: group_id,
		entity_id: user_id,
	});

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

	return { origin: url.origin, user_id, reports };
};

export default function Documents() {
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