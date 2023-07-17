import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { classNames, get_role_id } from "~/utils/helpers";
import { useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { NoSymbolIcon, UserIcon } from "@heroicons/react/24/outline";
import { get_collection } from "~/utils/firebase";
import { useLoaderData } from "@remix-run/react";

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

export const loader = async ({ request }) => {
	let { pathname } = new URL(request.url);
	let config_id = get_role_id(pathname);

	let roles_queries = [
		{
			param: "config_id",
			predicate: "==",
			value: config_id,
		},
	];

	let roles = await get_collection({
		path: ["roles"],
		queries: roles_queries,
	});

	console.log("roles_____");
	console.log(roles);

	return { roles };
};

const MemberActionsDropdown = () => {
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
					Actions
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
				<Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow ring-1 ring-black ring-opacity-5 focus:outline-none">
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
									<div className="flex flex-row gap-x-2">
										<div>
											<NoSymbolIcon className="h-5 w-5 text-gray-400" />
										</div>
										<div>Block</div>
									</div>
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
									<div className="flex flex-row gap-x-2">
										<div>
											<UserIcon className="h-5 w-5 text-gray-400" />
										</div>
										<div>Change role</div>
									</div>
								</a>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

const MembersList = () => {
	let { roles = [] } = useLoaderData();

	return (
		<ul role="list" className="divide-y divide-gray-100">
			{roles.map((person, index) => (
				<li key={index} className="flex py-5">
					<div className="flex flex-row w-[400px] gap-x-5 overflow-hidden">
						<img
							className="h-12 w-12 flex-none rounded-full bg-gray-50"
							src={person.imageUrl}
							alt=""
						/>
						<div className="min-w-0 flex-auto">
							<p className="text-sm font-semibold leading-6 text-gray-900">
								{person.entity_id}
							</p>
							<p className="mt-1 truncate text-xs leading-5 text-gray-500">
								{person.email}
							</p>
						</div>
					</div>

					<div className="flex flex-col w-[150px]">
						<p className="text-sm leading-6 text-gray-900">
							{person.role}
						</p>
					</div>

					<div className="hidden sm:flex sm:flex-col sm:items-end flex-1">
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

const MemberSearch = () => {
	const [query, setQuery] = useState("");
	const [selectedPerson, setSelectedPerson] = useState(null);

	const filteredPeople =
		query === ""
			? people
			: people.filter((person) => {
					return person.name
						.toLowerCase()
						.includes(query.toLowerCase());
			  });

	return (
		<Combobox as="div" value={selectedPerson} onChange={setSelectedPerson}>
			<div className="relative w-[500px]">
				<Combobox.Input
					className="w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-gray-900 border sm:text-sm sm:leading-6 outline-none"
					onChange={(event) => setQuery(event.target.value)}
					displayValue={(person) => person?.name}
					placeholder="Search members"
				/>
				<Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
					<ChevronUpDownIcon
						className="h-5 w-5 text-gray-400"
						aria-hidden="true"
					/>
				</Combobox.Button>

				{filteredPeople.length > 0 && (
					<Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{filteredPeople.map((person, index) => (
							<Combobox.Option
								key={index}
								value={person}
								className={({ active }) =>
									classNames(
										"relative cursor-default select-none py-2 pl-3 pr-9",
										active
											? "bg-indigo-600 text-white"
											: "text-gray-900"
									)
								}
							>
								{({ active, selected }) => (
									<>
										<span
											className={classNames(
												"block truncate",
												selected && "font-semibold"
											)}
										>
											{person.name}
										</span>

										{selected && (
											<span
												className={classNames(
													"absolute inset-y-0 right-0 flex items-center pr-4",
													active
														? "text-white"
														: "text-indigo-600"
												)}
											>
												<CheckIcon
													className="h-5 w-5"
													aria-hidden="true"
												/>
											</span>
										)}
									</>
								)}
							</Combobox.Option>
						))}
					</Combobox.Options>
				)}
			</div>
		</Combobox>
	);
};

const PageHeading = () => {
	return (
		<div className="flex flex-row w-full justify-between items-center border-b border-gray-200 pb-5">
			<h3 className="text-base font-semibold leading-6 text-gray-900">
				Members
			</h3>

			<div>
				<MemberSearch />
			</div>
		</div>
	);
};

export default function Members() {
	return (
		<div className="flex flex-col w-full h-full overflow-y-scroll scrollbar-none">
			<div className="flex flex-row b-3 sticky top-0 bg-white z-20 w-full">
				<PageHeading />
			</div>
			<div className="flex flex-col px-4 mb-[70px]">
				<MembersList />
			</div>
		</div>
	);
}
