import { pipe, reject } from "ramda";
import { useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import Directory from "~/components/Directory";
import {
	get_root_docs,
	get_root_group_resource_path_id,
} from "~/utils/group.server";
import { get_user, get_user_id } from "~/utils/auth.server";
import { has_resource_url_p } from "~/utils/helpers";

const is_root_resource = (resource) => resource.name === "root";

export const load_root = async ({ entity_id }) => {
	console.log("load_root");
	const resources = await get_root_docs({ entity_id });
	const resources_without_root = pipe(reject(is_root_resource))(resources);
	return resources_without_root;
};

export const loader = async ({ request }) => {
	console.log("root_loader");
	let entity_id = await get_user_id(request);
	let has_resource = has_resource_url_p(request.url);
	if (!entity_id) return redirect(`/`);
	let root_gruop_resource_path_id = await get_root_group_resource_path_id({
		entity_id,
	});
	console.log("root_gruop_id");
	// console.log(root_gruop_id);
	if (!has_resource)
		return redirect(
			`/group/resource/e/${entity_id}/g/${root_gruop_resource_path_id}`
		);
	const resources = await load_root({ entity_id });
	return json({ data: resources, entity_id });
};

// const RootActionsMenu = ({ resource_id }) => {
// 	const location = useLocation();
// 	let pathname = location.pathname;

// 	const Icon = ({ component: IconComponent }) => {
// 		return <IconComponent />;
// 	};

// 	return (
// 		<div className="flex flex-col">
// 			<Popover className="relative flex flex-col">
// 				{({ open }) => (
// 					<>
// 						<Popover.Button
// 							className={classNames(
// 								open ? "text-gray-900" : "text-gray-500",
// 								"group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
// 							)}
// 						>
// 							<svg
// 								xmlns="http://www.w3.org/2000/svg"
// 								viewBox="0 0 20 20"
// 								fill="currentColor"
// 								className="w-5 h-5"
// 							>
// 								<path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
// 							</svg>
// 						</Popover.Button>

// 						<Transition
// 							as={Fragment}
// 							enter="transition ease-out duration-200"
// 							enterFrom="opacity-0 translate-y-1"
// 							enterTo="opacity-100 translate-y-0"
// 							leave="transition ease-in duration-150"
// 							leaveFrom="opacity-100 translate-y-0"
// 							leaveTo="opacity-0 translate-y-1"
// 						>
// 							<Popover.Panel className="absolute z-10 mt-8 w-screen max-w-[200px] transform right-0">
// 								<div className="overflow-hidden rounded shadow-lg ring-1 ring-black ring-opacity-5 ">
// 									<div className="border-b border-gray-200 bg-white px-5 py-2 ">
// 										<h3 className="text-sm font-medium leading-6 text-gray-900">
// 											Actions
// 										</h3>
// 									</div>
// 									<div className="relative grid  bg-white py-2">
// 										{group_actions.map((item, idx) => (
// 											<Link
// 												to={item.href(pathname)}
// 												key={idx}
// 												className="flex flex-row transition duration-150 ease-in-out hover:bg-gray-50 px-5 py-2 cursor-pointer text-sm"
// 											>
// 												<div className="mr-[10px]">
// 													<Icon
// 														component={
// 															icons[item.key]
// 														}
// 													/>
// 												</div>
// 												<div>{item.text}</div>
// 											</Link>
// 										))}
// 									</div>
// 								</div>
// 							</Popover.Panel>
// 						</Transition>
// 					</>
// 				)}
// 			</Popover>
// 		</div>
// 	);
// };

export default function Root() {
	const { data = [], entity_id = "" } = useLoaderData();
	return <Directory data={data} entity_id={entity_id} />;
}
