import CreditNav from "~/components/CreditNav";
import { get_group_id, get_report_endpoint, classNames } from "~/utils/helpers";
import { get_user_id } from "~/utils/auth.server";
import { get_docs as get_group_docs } from "~/utils/group.server";
import { defaultTo, pipe } from "ramda";
import { filter } from "shades";
import { Outlet, useLoaderData, useLocation, Link } from "@remix-run/react";
import LeftNav from "~/components/LeftNav";
import Share from "~/routes/invites/new/$.jsx";
import Modal from "~/components/Modal";
import ReportTabs from "~/components/ReportTabs";
import SimpleNavSignedIn from "~/components/SimpleNavSignedIn";
import {
	EllipsisHorizontalCircleIcon,
	EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

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

const tabs = [
	{ name: "Personal", href: "/financial/cashflow", current: true },
	{ name: "Business", href: "/financial/accounts", current: false },
];

const SubNav = () => {
	return (
		<div>
			<div className="sm:hidden bg-white">
				<select
					id="tabs"
					name="tabs"
					className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
					defaultValue={tabs.find((tab) => tab.current).name}
				>
					{tabs.map((tab) => (
						<option key={tab.name}>{tab.name}</option>
					))}
				</select>
			</div>
			<div className="hidden sm:flex sm:flex-row bg-white px-5 border-b border-gray-200">
				<div className="flex flex-row justify-between w-full items-center">
					<nav className="-mb-px flex space-x-5" aria-label="Tabs">
						{tabs.map((tab) => (
							<a
								key={tab.name}
								href={tab.href}
								className={classNames(
									tab.current
										? "border-blue-500 text-blue-600"
										: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
									" border-b-2 py-2 px-1 text-center text-sm "
								)}
								aria-current={tab.current ? "page" : undefined}
							>
								{tab.name}
							</a>
						))}
					</nav>
					<div>
						<EllipsisHorizontalIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Report() {
	var { origin, user_id, reports } = useLoaderData();
	let location = useLocation();

	return (
		<div className="flex flex-col w-full h-full bg-gray-50">
			{/* <Modal>
				<Share />
			</Modal> */}
			{/* <div className="flex flex-col border-b">
				<CreditNav
					user_id={user_id}
					origin={origin}
					can_share={true}
					reports={reports}
				/>
			</div> */}
			<div className="flex flex-col w-full border-b bg-white">
				<SimpleNavSignedIn user_id={user_id} />
			</div>
			<div>
				<SubNav />
			</div>

			<Outlet />

			{/* <div className="flex flex-row h-full overflow-hidden">
				{user_id && <LeftNav data={reports} can_manage_roles={false} />}
				<div className="flex flex-col flex-1 overflow-y-scroll overflow-x-hidden">
					<ReportTabs
						selected={get_report_endpoint(location.pathname)}
					/>
					<Outlet />
				</div>
			</div> */}
		</div>
	);
}
