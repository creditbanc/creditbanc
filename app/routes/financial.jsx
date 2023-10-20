import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";

import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { classNames, get_group_id, is_location, get_entity_id } from "~/utils/helpers";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { create } from "zustand";
import { map, pipe } from "ramda";
import { mod } from "shades";

export const useAccountsStore = create((set) => ({
	accounts: [],
	set_accounts: (path, value) => set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const loader = async ({ request }) => {
	let { origin, pathname } = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(pathname);

	let { data: accounts = [] } = await axios({
		method: "get",
		url: `${origin}/financial/api/accounts/resource/e/${entity_id}/g/${group_id}`,
	});

	return { entity_id, accounts };
};

const tabs = [
	{
		name: "Cashflow",
		href: ({ entity_id, group_id }) =>
			`/financial/cashflow/resource/e/${entity_id}/g/${group_id}?rand=${Math.random()}`,
		current: (pathname) => is_location("/financial/cashflow", pathname),
	},
	{
		name: "Accounts",
		href: ({ entity_id, group_id }) =>
			`/financial/accounts/resource/e/${entity_id}/g/${group_id}?rand=${Math.random()}`,
		current: (pathname) => is_location("/financial/accounts", pathname),
	},
	// {
	// 	name: "Transactions",
	// 	href: ({ entity_id, group_id }) =>
	// 		`/financial/transactions/resource/e/${entity_id}/g/${group_id}`,
	// 	current: (pathname) => is_location("/financial/transactions", pathname),
	// },
];

const TransactionsDropdown = () => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let accounts = useAccountsStore((state) => state.accounts);

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button
					className={classNames(
						is_location("/financial/transactions", pathname)
							? "border-blue-500 text-blue-600"
							: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
						"flex flex-row border-b-2 py-2 px-1 text-center text-sm cursor-pointer"
					)}
				>
					Transactions
					<ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<Link
									to={`/financial/transactions/resource/e/${entity_id}/g/${group_id}`}
									className={classNames(
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									All transactions
								</Link>
							)}
						</Menu.Item>
						{pipe(
							map((account) => (
								<Menu.Item key={account.account_id}>
									{({ active }) => (
										<Link
											to={`/financial/transactions/resource/e/${entity_id}/g/${group_id}?account_id=${account.account_id}`}
											className={classNames(
												active ? "bg-gray-100 text-gray-900" : "text-gray-700",
												"block px-4 py-2 text-sm"
											)}
										>
											{account.name}
										</Link>
									)}
								</Menu.Item>
							))
						)(accounts)}
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

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
					<div className="-mb-px flex space-x-5" aria-label="Tabs">
						{pipe(
							map((tab) => (
								<a
									key={tab.name}
									href={tab.href({ entity_id, group_id })}
									className={classNames(
										tab.current(pathname)
											? "border-blue-500 text-blue-600"
											: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
										"border-b-2 py-2 px-1 text-center text-sm cursor-pointer"
									)}
								>
									{tab.name}
								</a>
							))
						)(tabs)}
						<TransactionsDropdown />
					</div>
					<div>
						<EllipsisHorizontalIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Financial() {
	let { entity_id, accounts: db_accounts = [] } = useLoaderData();
	let set_accounts = useAccountsStore((state) => state.set_accounts);

	useEffect(() => {
		set_accounts(["accounts"], db_accounts);
	}, [db_accounts]);

	return (
		<div className="flex flex-col w-full h-full bg-gray-50 overflow-hidden">
			<div>
				<SubNav />
			</div>
			<div className="flex flex-col w-full h-full overflow-hidden p-5">
				<Outlet />
			</div>
		</div>
	);
}
