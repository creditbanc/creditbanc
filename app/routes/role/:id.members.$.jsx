import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { classNames } from "~/utils/helpers";

const people = [
	{
		name: "Leslie Alexander",
		email: "leslie.alexander@example.com",
		role: "Co-Founder / CEO",
		imageUrl:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		lastSeen: "3h ago",
		lastSeenDateTime: "2023-01-23T13:23Z",
	},
	{
		name: "Michael Foster",
		email: "michael.foster@example.com",
		role: "Co-Founder / CTO",
		imageUrl:
			"https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		lastSeen: "3h ago",
		lastSeenDateTime: "2023-01-23T13:23Z",
	},
	{
		name: "Dries Vincent",
		email: "dries.vincent@example.com",
		role: "Business Relations",
		imageUrl:
			"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		lastSeen: null,
	},
	{
		name: "Lindsay Walton",
		email: "lindsay.walton@example.com",
		role: "Front-end Developer",
		imageUrl:
			"https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		lastSeen: "3h ago",
		lastSeenDateTime: "2023-01-23T13:23Z",
	},
	{
		name: "Courtney Henry",
		email: "courtney.henry@example.com",
		role: "Designer",
		imageUrl:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		lastSeen: "3h ago",
		lastSeenDateTime: "2023-01-23T13:23Z",
	},
	{
		name: "Tom Cook",
		email: "tom.cook@example.com",
		role: "Director of Product",
		imageUrl:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		lastSeen: null,
	},
	{
		name: "Lindsay Walton",
		email: "lindsay.walton@example.com",
		role: "Front-end Developer",
		imageUrl:
			"https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		lastSeen: "3h ago",
		lastSeenDateTime: "2023-01-23T13:23Z",
	},
	{
		name: "Courtney Henry",
		email: "courtney.henry@example.com",
		role: "Designer",
		imageUrl:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		lastSeen: "3h ago",
		lastSeenDateTime: "2023-01-23T13:23Z",
	},
	{
		name: "Tom Cook",
		email: "tom.cook@example.com",
		role: "Director of Product",
		imageUrl:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		lastSeen: null,
	},
];

const MemberActionsDropdown = () => {
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
					Options
					<ChevronDownIcon
						className="-mr-1 h-5 w-5 text-gray-400"
						aria-hidden="true"
					/>
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
								<a
									href="#"
									className={classNames(
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									Account settings
								</a>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<a
									href="#"
									className={classNames(
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									Support
								</a>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<a
									href="#"
									className={classNames(
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									License
								</a>
							)}
						</Menu.Item>
						<form method="POST" action="#">
							<Menu.Item>
								{({ active }) => (
									<button
										type="submit"
										className={classNames(
											active
												? "bg-gray-100 text-gray-900"
												: "text-gray-700",
											"block w-full px-4 py-2 text-left text-sm"
										)}
									>
										Sign out
									</button>
								)}
							</Menu.Item>
						</form>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

const MembersList = () => {
	return (
		<ul role="list" className="divide-y divide-gray-100">
			{people.map((person) => (
				<li key={person.email} className="flex py-5">
					<div className="flex flex-row w-[400px] gap-x-5 overflow-hidden">
						<img
							className="h-12 w-12 flex-none rounded-full bg-gray-50"
							src={person.imageUrl}
							alt=""
						/>
						<div className="min-w-0 flex-auto">
							<p className="text-sm font-semibold leading-6 text-gray-900">
								{person.name}
							</p>
							<p className="mt-1 truncate text-xs leading-5 text-gray-500">
								{person.email}
							</p>
						</div>
					</div>

					<div className="flex flex-col w-[150px]">a</div>

					<div className="hidden sm:flex sm:flex-col sm:items-end flex-1">
						<p className="text-sm leading-6 text-gray-900">
							{person.role}
						</p>

						<MemberActionsDropdown />

						{/* {person.lastSeen ? (
							<p className="mt-1 text-xs leading-5 text-gray-500">
								Last seen{" "}
								<time dateTime={person.lastSeenDateTime}>
									{person.lastSeen}
								</time>
							</p>
						) : (
							<div className="mt-1 flex items-center gap-x-1.5">
								<div className="flex-none rounded-full bg-emerald-500/20 p-1">
									<div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
								</div>
								<p className="text-xs leading-5 text-gray-500">
									Online
								</p>
							</div>
						)} */}
					</div>
				</li>
			))}
		</ul>
	);
};

const PageHeading = () => {
	return (
		<div className="border-b border-gray-200 pb-5">
			<h3 className="text-base font-semibold leading-6 text-gray-900">
				Members
			</h3>
		</div>
	);
};

export default function Members() {
	return (
		<div className="flex flex-col w-full h-full overflow-y-scroll scrollbar-none">
			<div className="flex flex-col b-3 sticky top-0 bg-white z-20">
				<PageHeading />
			</div>
			<div className="flex flex-col px-4">
				<MembersList />
			</div>
		</div>
	);
}
