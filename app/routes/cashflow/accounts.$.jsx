import { currency } from "~/utils/helpers";
import {
	EllipsisHorizontalIcon,
	PencilIcon,
	ArrowDownTrayIcon,
	TrashIcon,
	EyeIcon,
	LinkIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "~/utils/helpers";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

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
					<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
						<span className="font-medium leading-none text-white">
							TW
						</span>
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
	return (
		<div className="flex flex-col w-full h-full p-5 overflow-hidden">
			<div className="flex flex-col w-full h-full bg-white rounded p-5">
				<div className="flex flex-row text-sm border-b pb-3">
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
			</div>
		</div>
	);
}
