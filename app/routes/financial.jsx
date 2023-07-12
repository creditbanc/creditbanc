import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import SimpleNavSignedIn from "~/components/SimpleNavSignedIn";
import { get_user_id } from "~/utils/auth.server";
import {
	classNames,
	get_group_id,
	is_location,
	get_entity_id,
} from "~/utils/helpers";
import {
	EllipsisHorizontalCircleIcon,
	EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

export const loader = async ({ request }) => {
	let entity_id = await get_user_id(request);

	return { entity_id };
};

const tabs = [
	{
		name: "Cashflow",
		href: ({ entity_id, group_id }) =>
			`/financial/cashflow/resource/e/${entity_id}/g/${group_id}`,
		current: (pathname) => is_location("/financial/cashflow", pathname),
	},
	{
		name: "Accounts",
		href: ({ entity_id, group_id }) =>
			`/financial/accounts/resource/e/${entity_id}/g/${group_id}`,
		current: (pathname) => is_location("/financial/accounts", pathname),
	},
	{
		name: "Transactions",
		href: ({ entity_id, group_id }) =>
			`/financial/transactions/resource/e/${entity_id}/g/${group_id}`,
		current: (pathname) => is_location("/financial/transactions", pathname),
	},
];

const SubNav = () => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

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
							<Link
								key={tab.name}
								to={tab.href({ entity_id, group_id })}
								className={classNames(
									tab.current(pathname)
										? "border-blue-500 text-blue-600"
										: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
									"border-b-2 py-2 px-1 text-center text-sm cursor-pointer"
								)}
								aria-current={
									tab.current(pathname) ? "page" : undefined
								}
							>
								{tab.name}
							</Link>
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

export default function Cashflow() {
	let { entity_id } = useLoaderData();
	return (
		<div className="flex flex-col w-full h-full bg-gray-50">
			<div className="flex flex-col w-full border-b bg-white">
				<SimpleNavSignedIn user_id={entity_id} />
			</div>
			<div>
				<SubNav />
			</div>

			<Outlet />
		</div>
	);
}
