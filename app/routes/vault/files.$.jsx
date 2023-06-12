import {
	ChevronDownIcon,
	DocumentIcon,
	ListBulletIcon,
	ChevronRightIcon,
	TagIcon,
} from "@heroicons/react/24/outline";
import { sample } from "~/utils/helpers";
import { Disclosure } from "@headlessui/react";

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

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

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
						className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
				<div className="flex flex-col w-[80px]">Uploaded</div>
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
			<div className="flex flex-col w-[80px]">
				<div>Dec 5, 2022</div>
			</div>
		</div>
	);
};

const NavIcon = ({ icon: Icon }) => {
	return <Icon className="h-5 w-5 text-gray-400" />;
};

const SideNav = () => {
	return (
		<nav className="flex flex-1 flex-col">
			<ul role="list" className="flex flex-1 flex-col gap-y-7 px-2 mt-2">
				<li>
					<ul role="list" className="space-y-1">
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
														<NavIcon
															icon={
																ChevronDownIcon
															}
														/>
													)}

													{!open && (
														<NavIcon
															icon={
																ChevronRightIcon
															}
														/>
													)}

													{item.name}
												</Disclosure.Button>
												<Disclosure.Panel
													as="ul"
													className="mt-1 px-2"
												>
													{item.children.map(
														(subItem) => (
															<li
																key={
																	subItem.name
																}
															>
																<Disclosure.Button
																	as="a"
																	href={
																		subItem.href
																	}
																	className={classNames(
																		subItem.current
																			? "bg-gray-50"
																			: "hover:bg-gray-50",
																		"flex flex-row items-center rounded-md py-2 pr-2 pl-4 text-sm leading-6 text-gray-700"
																	)}
																>
																	<div className="mr-2">
																		<NavIcon
																			icon={
																				DocumentIcon
																			}
																		/>
																	</div>
																	{
																		subItem.name
																	}
																</Disclosure.Button>
															</li>
														)
													)}
												</Disclosure.Panel>
											</>
										)}
									</Disclosure>
								)}
							</li>
						))}
					</ul>
				</li>
			</ul>
		</nav>
	);
};

export default function Files() {
	return (
		<div className="flex flex-col w-full h-full p-5">
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
