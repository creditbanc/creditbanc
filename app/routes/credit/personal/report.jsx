import { useEffect, useState, Fragment } from "react";
import {
	Outlet,
	useLoaderData,
	useLocation,
	useTransition,
} from "@remix-run/react";
import CreditNav from "~/components/CreditNav";
import { useLayoutStore } from "~/stores/useLayoutStore";
import LeftNav from "~/components/LeftNav";
import { useElmSize } from "~/hooks/useElmSize";
import {
	get_group_id,
	get_route_endpoint,
	capitalize,
	has_valid_route_p,
	get_file_id,
	inspect,
	to_resource_pathname,
} from "~/utils/helpers";
import { get_docs as get_group_docs } from "~/utils/group.server";
import { defaultTo, head, isEmpty, pick, pipe } from "ramda";
import { mod, all, filter } from "shades";
// import PersonalCreditTabs from "~/components/PersonalCreditTabs";
import CreditScoreHero from "~/components/CreditScoreHero";
import CreditHeroGradient from "~/components/CreditHeroGradient";
import { get_user_id } from "~/utils/auth.server";
import { validate_action, is_resource_owner_p } from "~/utils/resource.server";
import { redirect } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { Dialog, Transition } from "@headlessui/react";
import Share from "~/routes/invites/new/$.jsx";
import { useModalStore } from "~/hooks/useModal";
// import { useSpinner } from "~/root";

export const loader = async ({ request }) => {
	let url = new URL(request.url);

	if (!has_valid_route_p("credit/personal/report", request.url))
		return redirect("/");

	let user_id = await get_user_id(request);
	let group_id = get_group_id(url.pathname);
	let file_id = get_file_id(url.pathname);

	let is_resource_owner = await is_resource_owner_p({
		entity_id: user_id,
		group_id,
		file_id,
	});

	let permissions = await validate_action({
		entity_id: user_id,
		group_resource_path_id: group_id,
		resource_path_id: file_id,
		is_owner: is_resource_owner,
		request,
	});

	// console.log("permissions");
	// console.log(permissions);

	// console.log("is_resource_owner");
	// console.log(is_resource_owner);

	let { can_view = false } = permissions ?? {};

	if (!can_view) return redirect("/");

	let group_docs = await get_group_docs({
		resource_id: group_id,
		entity_id: user_id,
	});

	let report = pipe(
		filter((report) => report.id == file_id),
		head
	)(group_docs);

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

	return { reports, origin: url.origin, user_id, permissions, report };
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

// const Spinner = () => {
// 	return <div>spinner</div>;
// };

export default function CreditReport() {
	console.log("CreditReport");
	// const transition = useTransition();
	// const show_spinner = transition.state !== "idle";
	var {
		origin = "",
		permissions = {},
		user_id,
		report,
		reports,
	} = useLoaderData() ?? {};
	const [target, setTarget] = useState();
	const elmSize = useElmSize(target);
	let setContentWidth = useLayoutStore((state) => state.set_content_width);

	let location = useLocation();

	// const show_spinner = useSpinner((state) => state.show_spinner);

	// console.log("show_spinner");
	// console.log(show_spinner);

	useEffect(() => {
		if (elmSize) {
			setContentWidth(elmSize.width);
		}
	}, [elmSize]);

	// if (show_spinner) {
	// 	return <Spinner />;
	// }

	return (
		<div className="flex flex-col flex-1 overflow-scroll">
			<div className="flex flex-col w-full">
				{/* <CreditHeroGradient /> */}
				<div
					className="flex flex-col w-full p-[10px] max-w-5xl mx-auto"
					ref={setTarget}
				>
					<CreditScoreHero report={report} />
					<div className="mt-3 mb-1">
						{/* <PersonalCreditTabs
							selected={capitalize(
								get_route_endpoint(location.pathname)
							)}
						/> */}
					</div>
					<div className="py-3">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
}
