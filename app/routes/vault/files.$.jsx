import {
	ChevronDownIcon,
	DocumentIcon,
	ListBulletIcon,
	ChevronRightIcon,
	TagIcon,
	XMarkIcon,
	EllipsisHorizontalIcon,
	PencilIcon,
	ArrowDownTrayIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import { sample, classNames } from "~/utils/helpers";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import Modal from "~/components/Modal";
import { useModalStore } from "~/hooks/useModal";
import { useEffect, Fragment } from "react";

const navigation = [
	{ name: "All", href: "#", current: true, icon: ListBulletIcon },
	{ name: "Untagged", href: "#", current: false, icon: TagIcon },
	{
		name: "Tags",
		current: false,
		icon: ListBulletIcon,
		children: [
			{ name: "Form 1040", href: "#" },
			{ name: "Form W-2", href: "#" },
			{ name: "Form 1099", href: "#" },
		],
	},
];

const Heading = () => {
	return (
		<div className="border-b border-gray-200 pb-5">
			<div className="flex flex-row justify-between items-end">
				<div className="flex flex-col">
					<h3 className="text-base font-semibold leading-6 text-gray-900">
						Recents
					</h3>
				</div>
				<div className="flex flex-col">
					<button
						type="button"
						className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Upload
					</button>
				</div>
			</div>
		</div>
	);
};

const RecentTagsFilter = () => {
	return (
		<div className="flex flex-col w-full py-5">
			<div className="flex flex-row w-full items-center text-sm space-x-3 ">
				<div className="text-gray-400">Show</div>
				<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer">
					Form 1040
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer">
					Form 1099
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer">
					Form W-2
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer">
					2022
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer">
					2023
				</div>
			</div>
		</div>
	);
};

const FilesTableHeader = () => {
	return (
		<div className="flex flex-col w-full pt-5">
			<div className="flex flex-row w-full text-sm text-gray-400 items-center border-b pb-5">
				<div className="flex flex-col w-[40px]">
					<input
						type="checkbox"
						className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
					/>
				</div>
				<div className="flex flex-col w-[250px]">Name</div>
				<div className="flex flex-col flex-1">Tags</div>
				<div className="flex flex-col w-[80px]">Year</div>
				<div className="flex flex-col w-[100px]">Uploaded</div>
				<div className="flex flex-col w-[50px]"></div>
			</div>
		</div>
	);
};

let category_styles = [
	{
		bg_color: "bg-red-100",
		text_color: "text-red-500",
		border_color: "border-red-500",
	},
	{
		bg_color: "bg-blue-100",
		text_color: "text-blue-500",
		border_color: "border-blue-500",
	},
	{
		bg_color: "bg-purple-100",
		text_color: "text-purple-500",
		border_color: "border-purple-500",
	},
	{
		bg_color: "bg-green-100",
		text_color: "text-green-500",
		border_color: "border-green-500",
	},
	{
		bg_color: "bg-orange-100",
		text_color: "text-orange-500",
		border_color: "border-orange-500",
	},
];

let Category = ({ category }) => {
	let { bg_color, text_color, border_color } = sample(category_styles);

	return (
		<div
			className={`flex flex-col rounded-full w-[90px] overflow-hidden h-[25px] border -ml-[20px] first-of-type:ml-0 justify-center ${bg_color} ${text_color} ${border_color}`}
		>
			<div className={`flex flex-col w-[90%] px-2 overflow-hidden`}>
				<div className={`w-[300px]`}>{category}</div>
			</div>
		</div>
	);
};

const TableRow = () => {
	return (
		<div className="flex flex-row w-full border-b py-3 items-center text-sm">
			<div className="flex flex-col w-[40px]">
				<input
					type="checkbox"
					className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
				/>
			</div>
			<div className="flex flex-col w-[250px]">
				<div className="flex flex-row items-center space-x-3">
					<div className="flex flex-col ">
						<DocumentIcon className="h-4 w-4 text-red-400" />
					</div>
					<div className="flex flex-col">1040</div>
				</div>
			</div>
			<div className="flex flex-col flex-1">
				<div className="flex flex-row w-full">
					<Category category="Form 1040" />
					<Category category="Form 1040" />
					<Category category="Form 1040" />
				</div>
			</div>
			<div className="flex flex-col w-[80px]">
				<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer items-center w-[60px]">
					2022
				</div>
			</div>
			<div className="flex flex-col w-[100px]">
				<div>Dec 5, 2022</div>
			</div>
			<div className="flex flex-col w-[50px]">
				<FileActionsDropdown />
			</div>
		</div>
	);
};

const NavIcon = ({ icon: Icon }) => {
	return <Icon className="h-5 w-5 text-gray-400" />;
};

const SideNav = () => {
	return (
		<ul role="list" className="flex flex-1 flex-col px-2 ">
			{navigation.map((item) => (
				<li key={item.name}>
					{!item.children ? (
						<a
							href={item.href}
							className={classNames(
								item.current
									? "bg-gray-50"
									: "hover:bg-gray-50",
								"flex items-center w-full text-left rounded-md gap-x-3 text-sm leading-6 font-semibold text-gray-700 py-1.5 px-2 my-2"
							)}
						>
							<NavIcon icon={item.icon} />
							{item.name}
						</a>
					) : (
						<Disclosure as="div">
							{({ open }) => (
								<>
									<Disclosure.Button
										className={classNames(
											item.current
												? "bg-gray-50"
												: "hover:bg-gray-50",
											"flex items-center w-full text-left rounded-md gap-x-3 text-sm leading-6 font-semibold text-gray-700 py-1.5 px-2 my-2"
										)}
									>
										{open && (
											<NavIcon icon={ChevronDownIcon} />
										)}

										{!open && (
											<NavIcon icon={ChevronRightIcon} />
										)}

										{item.name}
									</Disclosure.Button>
									<Disclosure.Panel
										as="ul"
										className="mt-1 px-2"
									>
										{item.children.map((subItem) => (
											<li key={subItem.name}>
												<Disclosure.Button
													as="a"
													href={subItem.href}
													className={classNames(
														subItem.current
															? "bg-gray-50"
															: "hover:bg-gray-50",
														"flex flex-row items-center rounded-md py-2 pr-2 pl-4 text-sm leading-6 text-gray-700"
													)}
												>
													<div className="mr-2">
														<NavIcon
															icon={DocumentIcon}
														/>
													</div>
													{subItem.name}
												</Disclosure.Button>
											</li>
										))}
									</Disclosure.Panel>
								</>
							)}
						</Disclosure>
					)}
				</li>
			))}
		</ul>
	);
};

const FileActionsDropdown = () => {
	let set_modal = useModalStore((state) => state.set_modal);

	const onEditFileClick = () => {
		set_modal({
			id: "file_edit_modal",
			is_open: true,
		});
	};

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
									onClick={onEditFileClick}
									className={classNames(
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
										"flex flex-row px-4 py-2 text-sm cursor-pointer items-center space-x-3"
									)}
								>
									<div>
										<PencilIcon className="h-4 w-4" />
									</div>
									<div>Edit</div>
								</div>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<div
									onClick={onEditFileClick}
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
									onClick={onEditFileClick}
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
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

const EditFileModal = () => {
	let set_modal = useModalStore((state) => state.set_modal);

	const onCloseModal = () => {
		set_modal({
			id: "file_edit_modal",
			is_open: false,
		});
	};

	return (
		<Modal id="file_edit_modal" classes="min-w-[700px] min-h-[200px]">
			<div className="flex flex-row w-full py-5 px-5 border-b text-2xl items-center">
				<div className="flex flex-row w-full items-center space-x-3">
					<div className="">
						<DocumentIcon className="h-6 w-6 text-red-400" />
					</div>
					<div>Hi</div>
				</div>
				<div onClick={onCloseModal}>
					<XMarkIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
				</div>
			</div>
			<div className="flex flex-col w-full p-5 text-sm space-y-5">
				<div className="flex flex-col w-full space-y-2">
					<div className="text-gray-400">Document name</div>
					<div className="flex flex-col w-full border-2 rounded h-[50px] justify-center px-2 text-lg font-light">
						<input type="text" className="outline-none w-full" />
					</div>
				</div>

				<div className="flex flex-col w-full space-y-3">
					<div className="flex flex-row justify-between">
						<div className="text-gray-400">Tags</div>
						<div className="text-gray-400 cursor-pointer">
							Clear
						</div>
					</div>
					<div className="flex flex-col w-full text-sm">
						<div className="flex flex-row w-full space-x-3">
							<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer">
								Form 1040
							</div>
							<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer">
								Form 1040
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full space-y-2 border-t pt-3">
					<div className="flex flex-col w-full text-sm">
						<div className="flex flex-row w-full space-x-3">
							<div className="flex flex-col justify-center px-3 py-1 border rounded-full text-gray-500  cursor-pointer">
								Form 1040 +
							</div>
							<div className="flex flex-col justify-center px-3 py-1 border rounded-full text-gray-500  cursor-pointer">
								Form W-2 +
							</div>
							<div className="flex flex-col justify-center px-3 py-1 border rounded-full text-gray-500  cursor-pointer">
								Form 1099 +
							</div>
							<div className="flex flex-col justify-center px-3 py-1 border rounded-full text-gray-500  cursor-pointer">
								Other +
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-col w-full">
					<div className="flex flex-row justify-end space-x-3">
						<button
							onClick={onCloseModal}
							type="button"
							className="bg-white text-gray-700 py-2 px-3 rounded border border-gray-700"
						>
							Cancel
						</button>
						<button
							type="button"
							className="bg-gray-700 text-white py-2 px-3 rounded"
						>
							Save
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default function Files() {
	return (
		<div className="flex flex-col w-full h-full p-5">
			<EditFileModal />
			<div className="flex flex-row w-full border rounded h-full">
				<div className="flex flex-col w-[250px] border-r">
					<SideNav />
				</div>
				<div className="flex flex-col flex-1 p-5">
					<Heading />
					<RecentTagsFilter />
					<FilesTableHeader />
					<div className="flex flex-col w-full">
						<TableRow />
						<TableRow />
						<TableRow />
					</div>
				</div>
			</div>
		</div>
	);
}
