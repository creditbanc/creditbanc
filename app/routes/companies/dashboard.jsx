import { FolderIcon } from "@heroicons/react/20/solid";
import {
	EllipsisHorizontalIcon,
	EllipsisVerticalIcon,
	LinkIcon,
	ListBulletIcon,
	ArrowRightIcon,
	DocumentDuplicateIcon,
	CalendarIcon,
	ChartPieIcon,
	FolderIcon as FolderIconOutline,
	HomeIcon,
	UsersIcon,
	BriefcaseIcon,
	DocumentIcon,
	CurrencyDollarIcon,
	FolderOpenIcon,
	UserIcon,
	UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";

const Account = ({ account }) => {
	return (
		<div
			className="flex flex-col min-w-full md:min-w-[47%] lg:min-w-[31%] xl:min-w-[23%]  h-[200px] bg-gray-50 p-5 justify-between rounded-lg shadow-sm border cursor-pointer"
			onClick={() => console.log("single cick")}
			onDoubleClick={() => console.log("double click")}
		>
			<div className="flex flex-row justify-between items-center">
				<div>
					<FolderIcon className="w-[40px] h-[40px] text-blue-600" />
				</div>
				<div className="flex flex-col cursor-pointer bg-white p-1 rounded-full border">
					<EllipsisHorizontalIcon className="w-4 h-4 text-gray-400" />
				</div>
			</div>
			<div className="flex flex-col">
				<div className="font-semibold text-gray-600">Credit Banc</div>
			</div>
			<div className="flex flex-col">
				<div className="flex flex-row justify-between items-center">
					<div className="flex -space-x-2 overflow-hidden">
						<img
							className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
							src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
							alt=""
						/>
						<img
							className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
							src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
							alt=""
						/>
						<img
							className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
							src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
							alt=""
						/>
						<img
							className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
							src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
							alt=""
						/>
					</div>
					<div>
						<div>
							<LinkIcon className="w-5 h-5 text-blue-500" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const navigation = [
	{
		name: "Business Credit Report",
		href: "#",
		icon: BriefcaseIcon,
		current: true,
	},
	{
		name: "Personal Credit Report",
		href: "#",
		icon: UserCircleIcon,
		current: false,
	},
	{ name: "Cashflow", href: "#", icon: CurrencyDollarIcon, current: false },
	{ name: "Vault", href: "#", icon: FolderOpenIcon, current: false },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const QuickLinks = () => {
	return (
		<nav className="flex flex-1 flex-col" aria-label="Sidebar">
			<ul role="list" className="-mx-2 space-y-1">
				{navigation.map((item) => (
					<li key={item.name}>
						<a
							href={item.href}
							className={classNames(
								item.current
									? "bg-gray-50 text-indigo-600"
									: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
								"group flex gap-x-2 rounded-md px-2 py-1 text-xs leading-6 font-semibold"
							)}
						>
							<item.icon
								className={classNames(
									item.current
										? "text-indigo-600"
										: "text-gray-400 group-hover:text-indigo-600",
									"h-5 w-5 shrink-0"
								)}
								aria-hidden="true"
							/>
							{item.name}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default function Companies() {
	return (
		<div className="flex flex-row w-full h-full p-5 overflow-hiddens space-x-3 overflow-hidden">
			<div className="flex flex-col w-[70%] h-full bg-white rounded px-5 pt-5">
				<div className="border-b border-gray-200 pb-3 flex flex-row justify-between">
					<div>
						<h3 className="mt-2 text-base font-semibold leading-6 text-gray-900">
							Companies
						</h3>
					</div>
					<div></div>
				</div>

				<div className="flex flex-col w-full py-5 overflow-y-scroll scrollbar-none">
					<div className="flex flex-row w-full items-center flex-wrap gap-y-10 justify-between xl:justify-start xl:gap-x-5">
						<Account />
						<Account />
						<Account />
						<Account />
						<Account />
						<Account />
						<Account />
						<Account />
						<Account />
						<Account />
						<Account />
						<Account />
						<Account />
						<Account />
						<Account />
						<Account />
						<Account />
						<Account />
						<Account />
						<Account />
					</div>
				</div>
			</div>
			<div className="flex flex-col w-[30%] ">
				<div className="flex flex-col bg-white border rounded">
					<div className="p-5">
						<div className="flex flex-row space-x-3 items-center">
							<div>
								<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
									<span className="text-lg font-medium leading-none text-white">
										C
									</span>
								</span>
							</div>
							<div>Credit Banc</div>
						</div>
					</div>

					<Link
						to={`/cashflow/transactions`}
						className="px-5 mb-4 flex flex-row items-center space-x-3 text-blue-500 cursor-pointer text-sm"
					>
						<div>
							<DocumentDuplicateIcon className="h-4 w-4 text-blue-500" />
						</div>
						<div>Copy copmany share link</div>
						<div>
							<LinkIcon className="h-4 w-4 text-blue-500" />
						</div>
					</Link>

					<div className="flex flex-row px-5 pb-5">
						<div className="flex flex-col w-1/2 text-sm space-y-1">
							<div className="text-gray-400">Personal</div>
							<div className="text-lg">780</div>
						</div>
						<div className="flex flex-col w-1/2 text-sm space-y-1">
							<div className="text-gray-400">Business</div>
							<div className="text-lg">80</div>
						</div>
					</div>

					<div className="border-t "></div>
					<div className="flex flex-col p-5 text-sm space-y-3">
						<div className=" text-gray-400">Quick Links</div>
						<div className="flex flex-col ml-5">
							<QuickLinks />
						</div>
					</div>
					{/* <div className="border-t "></div>
					<div className="flex flex-col p-5 text-sm space-y-2">
						<div className=" text-gray-400">Emails</div>
						<div className="flex flex-col space-y-2">a</div>
					</div> */}
					<div className="border-t "></div>
					<div className="flex flex-col p-3 text-sm space-y-2">
						<div>Notes</div>
						<div className="flex flex-col w-full">
							<textarea
								rows={4}
								className="border rounded p-3"
							></textarea>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}