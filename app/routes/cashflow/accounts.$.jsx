import {
	EllipsisHorizontalIcon,
	EyeIcon,
	LinkIcon,
	PlusCircleIcon,
	BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "~/utils/helpers";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import { create_axios_form, currency } from "~/utils/helpers";
import { useEffect, useState } from "react";
import { set_doc } from "~/utils/firebase";
import { useLoaderData } from "@remix-run/react";

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

	// let transactions = await sync_transactions();
	// console.log("transactions");
	// inspect(length(transactions));

	// pipe(
	// 	map(async (transaction) => {
	// 		await set_doc(
	// 			["transactions", transaction.transaction_id],
	// 			transaction
	// 		);
	// 		console.log(`transaction ${transaction.transaction_id} saved`);
	// 		return transaction;
	// 	})
	// )(transactions);

	return { link_token };
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
			<div className="flex flex-row space-x-3 w-[250px]">
				<div className="flex flex-col justify-center">
					<span className="inline-flex h-10 w-10 items-center justify-center rounded-full ">
						<BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
						{/* <span className="font-medium leading-none text-white">
							TW
						</span> */}
					</span>
				</div>
				<div className="flex flex-col">
					<div>Checking ••9876</div>
					<div className="text-sm text-gray-500">Savings – Chase</div>
				</div>
			</div>
			<div className="flex flex-row w-[200px] items-center space-x-3">
				<div>6324309876</div>
				<div>
					<EyeIcon className="h-5 w-5 text-gray-400" />
				</div>
			</div>
			<div className="flex flex-row w-[200px] items-center space-x-3">
				<div>6324309876</div>
			</div>
			<div className="flex flex-row flex-1 justify-end items-center">
				<div className="flex flex-col w-[200px]">
					{currency.format(1000000)}
				</div>
				<div className="flex flex-col w-[50px]">
					<AccountActionsDropdown />
				</div>
			</div>
		</div>
	);
};

export default function Accounts() {
	const { link_token } = useLoaderData();
	const [location, setLocation] = useState(null);

	useEffect(() => setLocation(window.location), []);

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
		<div className="flex flex-col w-full h-full p-5 overflow-hidden">
			<div className="flex flex-col w-full h-full bg-white rounded p-5">
				<div className="flex flex-row justify-between">
					<div className="flex flex-col mb-7 space-y-2">
						<div className="text-gray-700">Total Balance</div>
						<div className="text-4xl">
							{currency.format(5144707.08)}
						</div>
					</div>
					<div className="flex flex-col">
						<button
							// onClick={onUploadFileModalOpen}
							type="button"
							className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Add Account
						</button>
					</div>
				</div>
				<div className="flex flex-row text-sm border-b pb-3 text-gray-400">
					<div className="flex flex-col w-[250px]">Account</div>
					<div className="flex flex-col w-[200px]">
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
					<TableRow />
					<TableRow />
					<TableRow />
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
		</div>
	);
}
