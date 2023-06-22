import { Fragment, useRef, useState } from "react";
import {
	EllipsisHorizontalCircleIcon,
	EllipsisHorizontalIcon,
	FaceSmileIcon,
	MagnifyingGlassIcon,
	PaperClipIcon,
} from "@heroicons/react/24/outline";
import { Outlet, useLoaderData } from "@remix-run/react";
import SimpleNavSignedIn from "~/components/SimpleNavSignedIn";
import { get_user_id } from "~/utils/auth.server";
import { classNames } from "~/utils/helpers";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export const loader = async ({ request }) => {
	let entity_id = get_user_id(request);

	return { entity_id };
};

const tabs = [
	{ name: "Personal", href: "#", current: true },
	{ name: "Business", href: "#", current: false },
];

const SubNav = () => {
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
					<nav className="-mb-px flex space-x-5" aria-label="Tabs">
						{tabs.map((tab) => (
							<a
								key={tab.name}
								href={tab.href}
								className={classNames(
									tab.current
										? "border-blue-500 text-blue-600"
										: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
									" border-b-2 py-2 px-1 text-center text-sm "
								)}
								aria-current={tab.current ? "page" : undefined}
							>
								{tab.name}
							</a>
						))}
					</nav>
					<div>
						<EllipsisHorizontalIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
					</div>
				</div>
			</div>
		</div>
	);
};

const MessageActions = () => {
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white text-sm font-semibold text-gray-900 ">
					<EllipsisHorizontalIcon
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
				<Menu.Items className="absolute right-1 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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

const Message = () => {
	return (
		<div className="flex flex-row w-full py-3">
			<div className="flex flex-col w-[50px] pt-1">
				<img
					className="inline-block h-8 w-8 rounded-full"
					src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				/>
			</div>
			<div className="text-sm flex flex-col flex-1 space-y-1">
				<div className="font-semibold">Talan Rosser</div>
				<div className="flex flex-col text-gray-500 space-y-2">
					<div className="bg-gray-100 w-fit rounded-full px-4 py-2">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Nunc auctor finibus velit, at eleifend diam placerat et.
						Maecenas leo elit, aliquet semper molestie vel,
						consectetur sed ante.
					</div>
					<div className="bg-gray-100 w-fit rounded-full px-4 py-2">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					</div>
					<div className="bg-gray-100 w-fit rounded-full px-4 py-2">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Nunc auctor finibus velit, at eleifend diam placerat et.
					</div>
				</div>
			</div>
			<div className="flex flex-row w-[100px] text-xs  justify-end space-x-3 text-gray-600">
				<div>2:31 PM</div>
				<div>
					<MessageActions />
				</div>
			</div>
		</div>
	);
};

const Members = () => {
	return (
		<div className="flex -space-x-1 overflow-hidden">
			<img
				className="inline-block h-5 w-5 rounded-full ring-2 ring-white"
				src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt=""
			/>
			<img
				className="inline-block h-5 w-5 rounded-full ring-2 ring-white"
				src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt=""
			/>
			<img
				className="inline-block h-5 w-5 rounded-full ring-2 ring-white"
				src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
				alt=""
			/>
			<img
				className="inline-block h-5 w-5 rounded-full ring-2 ring-white"
				src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt=""
			/>
		</div>
	);
};

const ChatTextArea = () => {
	let text_area_ref = useRef(null);
	let [num_of_rows, set_num_of_rows] = useState(1);

	const onKeyDown = (event) => {
		var key = event.keyCode;
		if (key === 13) {
			if (num_of_rows <= 10) {
				set_num_of_rows(num_of_rows + 1);
			}
		}

		if (key === 8) {
			let text_area_value = event.target.value;
			var lines = text_area_value.split(/\r|\r\n|\n/);
			set_num_of_rows(lines.length);
		}
	};

	return (
		<textarea
			ref={text_area_ref}
			rows={num_of_rows}
			className="outline-none w-full text-gray-600 resize-none scrollbar-none text-sm pb-[2px]"
			onKeyUp={onKeyDown}
			placeholder="Write a message..."
		></textarea>
	);
};

const MemberActionsDropdown = () => {
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ">
					<EllipsisHorizontalIcon
						className="h-5 w-5 text-gray-400"
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
				<Menu.Items className="absolute right-5 z-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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

const Member = () => {
	return (
		<div className="flex flex-row text-sm items-center justify-between border-b cursor-pointer">
			<div className="flex flex-row flex-1 space-x-3 items-center px-2 py-3">
				<div>
					<img
						className="inline-block h-8 w-8 rounded-full"
						src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
						alt=""
					/>
				</div>
				<div>
					<div className="font-semibold">Darrell Steward</div>
					<div className="text-xs text-gray-400">
						darrell.s@gmail.com
					</div>
				</div>
			</div>
			<div className="flex flex-col w-[50px]">
				<MemberActionsDropdown />
			</div>
		</div>
	);
};

const DirectMessage = ({ unread = 0 }) => {
	return (
		<div className="flex flex-row text-sm items-center justify-between border-b cursor-pointer pr-4 pl-1">
			<div className="flex flex-row flex-1 space-x-3 items-center px-2 py-3">
				<div>
					<img
						className="inline-block h-8 w-8 rounded-full"
						src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
						alt=""
					/>
				</div>
				<div>
					<div className="font-semibold">Darrell Steward</div>
					<div className="text-xs text-gray-400">
						darrell.s@gmail.com
					</div>
				</div>
			</div>
			<div className="flex flex-col items-end text-xs space-y-2">
				<div className="text-gray-400">17h ago</div>
				{unread > 0 && (
					<div className="flex flex-col px-2 h-5 bg-red-500 items-center justify-center text-white rounded-full text-xs">
						{unread}
					</div>
				)}
			</div>
		</div>
	);
};

const Channel = ({ selected = false, title, unread = 0 }) => {
	return (
		<div
			className={`flex flex-row w-full text-sm px-2 py-2 justify-between rounded cursor-pointer  ${
				selected ? "bg-blue-600 text-white" : "hover:bg-gray-100"
			}`}
		>
			<div className="flex flex-row space-x-2">
				<div>#</div>
				<div>{title}</div>
			</div>
			<div>
				{unread > 0 && (
					<div className="px-2 h-5 bg-red-500 flex flex-col items-center justify-center text-white rounded-full text-xs">
						{unread}
					</div>
				)}
			</div>
		</div>
	);
};

export default function Chat() {
	let { entity_id } = useLoaderData();

	return (
		<div className="flex flex-col w-full h-full bg-gray-50 overflow-hidden">
			<div className="flex flex-col w-full border-b bg-white">
				<SimpleNavSignedIn user_id={entity_id} />
			</div>

			<div className="flex flex-row w-full justify-between items-center px-5 py-2 border-b bg-white">
				<div className="flex flex-row items-center space-x-5 pb-1">
					<div>
						<img
							className="inline-block h-10 w-10 rounded-full"
							src="https://www.massmoments.org/assets/images/9/05_07.3_1958-cabd01ba.jpg"
						/>
					</div>
					<div className="space-y-1">
						<div className="font-semibold">Berkshire</div>
						<div className="text-sm flex flex-row items-center space-x-2">
							<div>
								<Members />
							</div>
							<div className="flex flex-row items-center space-x-2">
								<div className="text-gray-600">8 members</div>
								<div className="h-1 w-1  bg-gray-600 rounded-full"></div>
								<div className="text-green-500">4 Online</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-row space-x-5">
					<div>
						<MagnifyingGlassIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
					</div>
					<div>
						<EllipsisHorizontalIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
					</div>
				</div>
			</div>
			<div className="flex flex-row flex-1 overflow-hidden">
				<div className="flex flex-col w-[300px] bg-white border-r overflow-scroll scrollbar-none">
					<div className="flex flex-col w-full py-3 px-3 sticky top-0 bg-white">
						<div>
							<input
								type="text"
								className="border border-b-2 rounded-full py-[7px] px-2 pl-3 text-sm w-full"
								placeholder="Search"
							/>
						</div>
					</div>
					<div className="flex flex-row w-full border-b p-3 text-sm justify-between items-center">
						<div>Channels</div>
						<div className="bg-gray-100 text-gray-600 h-6 w-6 flex flex-col items-center justify-center rounded-full pb-[2px] cursor-pointer">
							+
						</div>
					</div>

					<div className="flex flex-col w-full space-y-2 px-2 my-2">
						<Channel title={"App"} unread={2} />
						<Channel
							selected={true}
							title={"General"}
							unread={12}
						/>
						<Channel title={"Accounting"} />
					</div>
					<div className="flex flex-row w-full border-y p-3 text-sm justify-between items-center">
						<div>Direct Messages</div>
						<div className="bg-gray-100 text-gray-600 h-6 w-6 flex flex-col items-center justify-center rounded-full pb-[2px] cursor-pointer">
							+
						</div>
					</div>
					<div className="flex flex-col w-full">
						<DirectMessage unread={5} />
						<DirectMessage />
						<DirectMessage />
						<DirectMessage />
						<DirectMessage unread={100} />
						<DirectMessage />
						<DirectMessage />
						<DirectMessage />
						<DirectMessage />
						<DirectMessage />
					</div>
				</div>

				<div className="flex flex-col flex-1 h-full justify-between overflow-hidden">
					<div className="flex flex-col flex-1 bg-white px-5 justify-end overflow-hidden">
						<div className="flex flex-col w-full h-full  overflow-y-scroll overflow-x-hidden scrollbar-none py-3">
							<Message />
							<Message />
							<Message />
							<Message />
							<Message />
							<Message />
							<Message />
							<Message />
							<Message />
							<Message />
							<Message />
							<Message />
							<Message />
							<Message />
							<Message />
							<Message />
						</div>
					</div>
					<div className="flex flex-col w-full bg-white px-3 pb-3">
						<div className="flex flex-row w-full h-full border p-2 rounded ">
							<div className="flex flex-row flex-1 h-full items-end space-x-5 ">
								<div>
									<PaperClipIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
								</div>
								<div className="flex flex-col w-full">
									<ChatTextArea />
								</div>
							</div>
							<div className="flex flex-row  h-full">
								<div className="flex flex-col justify-end h-full -mt-0.5 items-center w-full ">
									<FaceSmileIcon className="h-6 w-6 text-gray-400 cursor-pointer " />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-[300px] bg-white border-l">
					<div className="flex flex-col w-full">
						<div className="flex flex-row w-full border-b p-3 text-sm justify-between items-center">
							<div>Members</div>
							<div className="bg-gray-100 text-gray-600 h-6 w-6 flex flex-col items-center justify-center rounded-full pb-[2px] cursor-pointer">
								+
							</div>
						</div>
						<div className="flex flex-col w-full">
							<Member />
							<Member />
							<Member />
						</div>
						<div className="flex flex-row w-full border-b p-3 text-xs text-gray-400 cursor-pointer items-center">
							<div className="flex flex-row space-x-[1px]">
								<div>4</div>
								<div className="-mt-[1px]">+</div>
							</div>
							<div className="flex flex-row ml-1">
								<div>Members</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
