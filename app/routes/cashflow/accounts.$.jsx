import {
	EllipsisHorizontalIcon,
	EyeIcon,
	LinkIcon,
	PlusCircleIcon,
	BuildingLibraryIcon,
	AtSymbolIcon,
	PhoneIcon,
} from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import {
	create_axios_form,
	currency,
	classNames,
	mapIndexed,
	capitalize,
	truncate,
	formatPhoneNumber,
} from "~/utils/helpers";
import { useEffect, useState, Fragment } from "react";
import { set_doc } from "~/utils/firebase";
import { useLoaderData } from "@remix-run/react";
import { get_accounts, get_auths, get_identities } from "~/api/plaid.server";
import {
	prop,
	pipe,
	groupBy,
	mergeAll,
	map,
	values,
	defaultTo,
	flatten,
} from "ramda";
import { create } from "zustand";
import { all, mod, get } from "shades";

export const useAccountStore = create((set) => ({
	account: {},
	set_account: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const useAccounstStore = create((set) => ({
	accounts: [],
	set_accounts: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const loader = async ({ request }) => {
	let location = new URL(request.url);
	let { origin } = location;

	let plaid_create_link_token_url = `${origin}/plaid/create_link_token`;

	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: plaid_create_link_token_url,
	};

	let response = await axios(config);

	let { data } = response;
	let { link_token } = data;

	let { accounts } = await get_accounts();
	let { accounts: identities_accounts } = await get_identities();
	let {
		numbers: { ach, bacs, eft, international },
	} = await get_auths();

	let accounts_payload = pipe(
		groupBy(prop("account_id")),
		map(mergeAll),
		values
	)([
		...accounts,
		...identities_accounts,
		...ach,
		...bacs,
		...eft,
		...international,
	]);

	return { link_token, accounts: accounts_payload };
};

const AccountActionsDropdown = ({ document }) => {
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
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
						{/* <Menu.Item>
							{({ active }) => (
								<div
									// onClick={onDownloadFileClick}
									className={classNames(
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
										"flex flex-row px-4 py-2 text-sm cursor-pointer items-center space-x-3"
									)}
								>
									<div>
										<ArrowDownTrayIcon className="h-4 w-4" />
									</div>
									<div>Download</div>
								</div>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<div
									// onClick={onDeleteFileClick}
									className={classNames(
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
										"flex flex-row px-4 py-2 text-sm cursor-pointer items-center space-x-3"
									)}
								>
									<div>
										<TrashIcon className="h-4 w-4" />
									</div>
									<div>Delete</div>
								</div>
							)}
						</Menu.Item> */}
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

const TableRow = ({ account }) => {
	return (
		<div className="flex flex-row w-full text-gray-700 border-b py-3">
			<div className="flex flex-row space-x-3 w-[300px]">
				<div className="flex flex-col justify-center">
					<span className="inline-flex h-10 w-10 items-center justify-center rounded-full ">
						<BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
						{/* <span className="font-medium leading-none text-white">
							TW
						</span> */}
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
			<div className="flex flex-row w-[230px] items-center space-x-3">
				<div>{account.account}</div>
				<div>
					<EyeIcon className="h-5 w-5 text-gray-400" />
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

export default function Accounts() {
	const { link_token, accounts: accounts_data } = useLoaderData();
	const [location, setLocation] = useState(null);
	const accounts = useAccounstStore((state) => state.accounts);
	const set_accounts = useAccounstStore((state) => state.set_accounts);
	const account = accounts[0] ?? {};

	console.log("accounts");
	console.log(accounts);

	useEffect(() => setLocation(window.location), []);

	useEffect(() => {
		set_accounts(["accounts"], accounts_data);
	}, []);

	const { open, ready } = usePlaidLink({
		token: link_token,
		onSuccess: async (public_token, metadata) => {
			set_plaid(["public_token"], public_token);
			let plaid_exchange_public_token_url = `${location.origin}/plaid/exchange_public_token`;
			let data = create_axios_form({ public_token });

			let config = {
				method: "post",
				maxBodyLength: Infinity,
				headers: { "Content-Type": "multipart/form-data" },
				url: plaid_exchange_public_token_url,
				data,
			};

			let response = await axios(config);
			let { access_token } = response.data;

			if (access_token) {
				console.log("plaid_exchange_public_token_response");
				console.log(access_token);

				let payload = {
					access_token,
				};

				await set_doc(["bank_accounts", access_token], payload);
			}
		},
	});

	return (
		<div className="flex flex-row w-full h-full p-5 overflow-hiddens space-x-3">
			<div className="flex flex-col w-[70%] h-full bg-white rounded p-5">
				<div className="flex flex-row justify-between">
					<div className="flex flex-col mb-7 space-y-2">
						<div className="text-gray-700">Total Balance</div>
						<div className="text-4xl">
							{currency.format(5144707.08)}
						</div>
					</div>
					<div className="flex flex-col">
						<button
							onClick={() => open()}
							type="button"
							className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Add Account
						</button>
					</div>
				</div>
				<div className="flex flex-row text-sm border-b pb-3 text-gray-400">
					<div className="flex flex-col w-[300px]">Account</div>
					<div className="flex flex-col w-[230px]">
						Account number
					</div>
					<div className="flex flex-col w-[200px]">
						Routing number
					</div>
					<div className="flex flex-row flex-1 justify-end">
						<div className="flex flex-col w-[200px]">Balance</div>
						<div className="flex flex-col w-[50px]"></div>
					</div>
				</div>
				<div className="flex flex-col w-full py-3">
					{pipe(
						mapIndexed((account) => (
							<TableRow
								key={account.account_id}
								account={account}
							/>
						))
					)(accounts)}
				</div>
				<div
					className="flex flex-row items-center space-x-5 border-b pb-3 cursor-pointer pl-1.5"
					onClick={() => open()}
				>
					<div>
						<PlusCircleIcon className="h-7 w-7 text-gray-400" />
					</div>
					<div>Link Account</div>
				</div>
			</div>
			<div className="flex flex-col w-[30%] ">
				<div className="flex flex-col bg-white border rounded">
					<div className="p-5">
						<div className="flex flex-row space-x-3 items-center">
							<div>
								<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
									<span className="text-lg font-medium leading-none text-white">
										T
									</span>
								</span>
							</div>
							<div>{account.official_name}</div>
						</div>
					</div>

					<div className="flex flex-row px-5 pb-5">
						<div className="flex flex-col w-1/2 text-sm space-y-1">
							<div className="text-gray-400">Available</div>
							<div className="text-lg">
								{currency.format(
									account?.balances?.available || 0
								)}
							</div>
						</div>
						<div className="flex flex-col w-1/2 text-sm space-y-1">
							<div className="text-gray-400">Current</div>
							<div className="text-lg">
								{currency.format(
									account?.balances?.current || 0
								)}
							</div>
						</div>
					</div>

					<div className="border-t "></div>
					<div className="flex flex-col p-5 text-sm space-y-2">
						<div className=" text-gray-400">Phone numbers</div>
						<div className="flex flex-col space-y-3">
							{pipe(
								get("owners", all, "phone_numbers"),
								defaultTo([]),
								flatten,
								mapIndexed((phone) => (
									<div className="flex flex-row items-center space-x-2">
										<div>
											<PhoneIcon className="h-4 w-4 text-gray-400" />
										</div>
										<div>
											{formatPhoneNumber(phone.data)}
										</div>
									</div>
								))
							)(account)}
						</div>
					</div>
					<div className="border-t "></div>
					<div className="flex flex-col p-5 text-sm space-y-2">
						<div className=" text-gray-400">Emails</div>
						<div className="flex flex-col space-y-2">
							{pipe(
								get("owners", all, "emails"),
								defaultTo([]),
								flatten,
								mapIndexed((email) => (
									<div className="flex flex-row items-center space-x-2">
										<div>
											<AtSymbolIcon className="h-4 w-4 text-gray-400" />
										</div>
										<div>{truncate(30, email.data)}</div>
									</div>
								))
							)(account)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
