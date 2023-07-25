import { get_session_entity_id } from "~/utils/auth.server";
import { delete_collection, delete_doc, get_doc } from "~/utils/firebase";
import {
	capitalize,
	classNames,
	currency,
	get_group_id,
} from "~/utils/helpers";
import { isEmpty, map, pipe } from "ramda";
import axios from "axios";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { Fragment, useEffect, useState } from "react";
import {
	BuildingLibraryIcon,
	EllipsisHorizontalIcon,
	EyeIcon,
	EyeSlashIcon,
	LinkIcon,
	ListBulletIcon,
} from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import { create } from "zustand";
import { mod } from "shades";
import { disconnect_plaid } from "~/api/client/plaid";

export const useAccountsStore = create((set) => ({
	accounts: [],
	set_accounts: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const loader = async ({ request }) => {
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(request.url);
	let { origin } = new URL(request.url);

	let plaid_credentials = await get_doc(["plaid_credentials", group_id]);

	if (!isEmpty(plaid_credentials)) {
		let { data: accounts } = await axios({
			method: "get",
			url: `${origin}/financial/api/accounts/resource/e/${entity_id}/g/${group_id}`,
		});

		return {
			accounts,
		};
	}

	return { accounts: [] };
};

const Heading = () => {
	let { pathname } = useLocation();
	let group_id = get_group_id(pathname);
	let set_accounts = useAccountsStore((state) => state.set_accounts);

	const onDisconnectPlaid = async () => {
		await disconnect_plaid({ group_id });

		console.log("plaid credentials deleted");
		console.log("plaid accounts deleted");

		set_accounts(["accounts"], []);
	};

	return (
		<div className="flex flex-row w-full justify-between">
			<div>
				<h2 className="text-base font-semibold leading-7 text-gray-900">
					Bank accounts
				</h2>
				<p className="mt-1 text-sm leading-6 text-gray-500">
					Connect & edit your bank accounts.
				</p>
			</div>
			<div>
				<div
					className="flex flex-col px-3 py-1 bg-gray-200 text-gray-600 rounded text-sm cursor-pointer"
					onClick={onDisconnectPlaid}
				>
					Disconnect all bank accounts
				</div>
			</div>
		</div>
	);
};

const AccountActionsDropdown = ({ document }) => {
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100">
					<EllipsisHorizontalIcon className="h-5 w-5" />
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
				<Menu.Items className="absolute right-0 z-10 mt-3 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<Link
									to={`/financial/transactions`}
									// onClick={onDownloadFileClick}
									className={classNames(
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
										"flex flex-row px-4 py-2 text-sm cursor-pointer items-center space-x-3"
									)}
								>
									<div>
										<ListBulletIcon className="h-4 w-4" />
									</div>
									<div>View Transactions</div>
								</Link>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<div
									// onClick={onEditFileClick}
									className={classNames(
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
										"flex flex-row px-4 py-2 text-sm cursor-pointer items-center space-x-3"
									)}
								>
									<div>
										<LinkIcon className="h-4 w-4" />
									</div>
									<div>Unlink Account</div>
								</div>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

const AccountRow = ({ account }) => {
	// let selected_account = useAccountStore((state) => state.account);
	// const set_account = useAccountStore((state) => state.set_account);
	const [is_account_number_visible, set_is_account_number_visible] =
		useState(false);

	// const onSelectAccount = () => {
	// 	if (selected_account.account_id !== account.account_id) {
	// 		set_account(["account"], account);
	// 	}
	// };

	const onToggleAccountNumberVisibility = () => {
		set_is_account_number_visible(!is_account_number_visible);
	};

	return (
		<div
			className="flex flex-row w-full text-gray-700 border-b py-3 hover:bg-gray-50 cursor-pointer text-sm space-x-2"
			// onClick={onSelectAccount}
		>
			<div className="flex flex-row space-x-3 w-[300px]">
				<div className="flex flex-col justify-center">
					<span className="inline-flex h-10 w-10 items-center justify-center rounded-full ">
						<BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
					</span>
				</div>
				<div className="flex flex-col">
					<div className="flex flex-row space-x-3">
						<div>{capitalize(account.subtype)}</div>
						<div>••{account.account.slice(-4)}</div>
					</div>
					<div className="text-sm text-gray-500">
						{capitalize(account.subtype)} – {account.name}
					</div>
				</div>
			</div>
			<div className="flex flex-row w-[250px] items-center space-x-3">
				{!is_account_number_visible && (
					<input
						type="password"
						value={account.account}
						readOnly={true}
						className="bg-transparent w-[130px] border-none p-0 cursor-default focus:ring-0 outline-none"
					></input>
				)}
				{is_account_number_visible && (
					<div className="w-[130px]">{account.account}</div>
				)}
				<div>
					{is_account_number_visible && (
						<EyeSlashIcon
							className="h-5 w-5 text-gray-400"
							onClick={onToggleAccountNumberVisibility}
						/>
					)}

					{!is_account_number_visible && (
						<EyeIcon
							className="h-5 w-5 text-gray-400"
							onClick={onToggleAccountNumberVisibility}
						/>
					)}
				</div>
			</div>
			<div className="flex flex-row w-[200px] items-center space-x-3">
				<div>{account.routing}</div>
			</div>
			<div className="flex flex-row flex-1 justify-end items-center">
				<div className="flex flex-col w-[200px]">
					{currency.format(account.balances.available)}
				</div>
				<div className="flex flex-col w-[50px]">
					<AccountActionsDropdown />
				</div>
			</div>
		</div>
	);
};

const BankAccounts = () => {
	let { accounts: db_accounts = [] } = useLoaderData();
	const accounts = useAccountsStore((state) => state.accounts);
	const set_accounts = useAccountsStore((state) => state.set_accounts);

	useEffect(() => {
		if (!isEmpty(db_accounts)) {
			set_accounts(["accounts"], db_accounts);
		}
	}, [db_accounts]);

	return (
		<div>
			<ul
				role="list"
				className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
			>
				{pipe(map((account) => <AccountRow account={account} />))(
					accounts
				)}
			</ul>

			<div className="flex border-t border-gray-100 pt-6">
				<button
					type="button"
					className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500"
				>
					<span aria-hidden="true">+</span> Add another bank
				</button>
			</div>
		</div>
	);
};

export default function PlaidSettings() {
	return (
		<div className="flex flex-col w-full">
			<Heading />
			<div className="flex flex-col">
				<BankAccounts />
			</div>
		</div>
	);
}
