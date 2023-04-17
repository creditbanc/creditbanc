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

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const tabs = [
	{
		name: "Report",
		href: (pathname) =>
			`/credit/report/personal/personal${to_resource_pathname(pathname)}`,
		icon: DocumentIcon,
		current: true,
	},
	{
		name: "Documents",
		href: (pathname) =>
			`/credit/documents${to_resource_pathname(pathname)}`,
		icon: FolderIcon,
		current: false,
	},
];

function Tabs() {
	let location = useLocation();
	return (
		<div>
			<div className="sm:hidden">
				<label htmlFor="tabs" className="sr-only">
					Select a tab
				</label>

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
			<div className="hidden sm:block ml-5">
				<div className="border-b border-gray-200">
					<nav className="-mb-px flex space-x-8" aria-label="Tabs">
						{tabs.map((tab) => (
							<a
								key={tab.name}
								href={tab.href(location.pathname)}
								className={classNames(
									tab.current
										? "border-indigo-500 text-indigo-600"
										: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
									"group inline-flex items-center border-b-2 pt-4 pb-2 px-1 text-sm font-medium"
								)}
								aria-current={tab.current ? "page" : undefined}
							>
								<tab.icon
									className={classNames(
										tab.current
											? "text-indigo-500"
											: "text-gray-400 group-hover:text-gray-500",
										"-ml-0.5 mr-2 h-5 w-5"
									)}
									aria-hidden="true"
								/>
								<span>{tab.name}</span>
							</a>
						))}
					</nav>
				</div>
			</div>
		</div>
	);
}

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
					<Tabs />
					<Outlet />
				</div>
			</div>
		</div>
	);
}
