import { useEffect, useState, Fragment } from "react";
import CreditNav from "~/components/CreditNav";
import {
	get_group_id,
	get_route_endpoint,
	capitalize,
	has_valid_route_p,
	get_file_id,
	inspect,
	to_resource_pathname,
} from "~/utils/helpers";
import { get_user_id } from "~/utils/auth.server";
import { get_docs as get_group_docs } from "~/utils/group.server";
import { defaultTo, head, isEmpty, pick, pipe } from "ramda";
import { mod, all, filter } from "shades";
import {
	Outlet,
	useLoaderData,
	useLocation,
	useTransition,
} from "@remix-run/react";
import LeftNav from "~/components/LeftNav";
import Share from "~/routes/invites/new/$.jsx";
import { useModalStore } from "~/hooks/useModal";
import { Dialog, Transition } from "@headlessui/react";

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

function Modal({ children }) {
	const is_open = useModalStore((state) => state.is_open);
	const set_open = useModalStore((state) => state.set_open);

	return (
		<Transition.Root show={is_open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={set_open}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
								{children}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}

export default function Credit() {
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
					<Outlet />
				</div>
			</div>
		</div>
	);
}
