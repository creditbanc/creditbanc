import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import SimpleNavSignedIn from "~/components/SimpleNavSignedIn";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import {
	get_entity_id,
	get_group_id,
	get_resource_id,
	is_location,
} from "~/utils/helpers";
import { useModalStore } from "~/hooks/useModal";
import Modal from "~/components/Modal";
import { useEffect, useState } from "react";
import {
	EllipsisHorizontalIcon,
	HashtagIcon,
	TrashIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { v4 as uuidv4 } from "uuid";
import { delete_doc, get_collection, get_doc, set_doc } from "~/utils/firebase";
import { defaultTo, map, pipe, prop, sortBy } from "ramda";
import { get, mod, filter } from "shades";
import { create } from "zustand";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { classNames } from "~/utils/helpers";
import { redirect } from "@remix-run/node";

const useChatsStore = create((set) => ({
	channels: [],
	set_chats_state: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

let create_default_channel = async ({ group_id }) => {
	let default_chat_id = uuidv4();

	let default_chat_payload = {
		group_id,
		id: default_chat_id,
		index: 0,
		title: "General",
		type: "channel",
	};

	await set_doc(["chats", default_chat_id], default_chat_payload);
	return default_chat_payload;
};

export const loader = async ({ request }) => {
	let entity_id = await get_session_entity_id(request);
	let chat_id = get_resource_id(request.url);
	let group_id = get_group_id(request.url);
	let chat_state_id = `${entity_id}${group_id}`;

	// let default_channel = { id: "c8e2b492-46dc-4da3-8d76-3741565284b2" };

	// await set_doc(["chat_state", chat_state_id], {
	// 	id: chat_state_id,
	// 	current_chat_id: default_channel.id,
	// });

	// console.log("chat_state_saved_______");

	// return null;

	let chat_state = await get_doc(["chat_state", chat_state_id]);

	let channels = await get_collection({
		path: ["chats"],
		queries: [
			{
				param: "group_id",
				predicate: "==",
				value: group_id,
			},
			{
				param: "type",
				predicate: "==",
				value: "channel",
			},
		],
	});

	if (channels.length === 0) {
		let default_channel = await create_default_channel({ group_id });

		await set_doc(["chat_state", chat_state_id], {
			id: chat_state_id,
			current_chat_id: default_channel.id,
		});

		return redirect(
			`/chat/resource/e/${entity_id}/g/${group_id}/f${default_channel.id}`
		);
	}

	// console.log("chat_id_______");
	// console.log(chat_id);

	if (!chat_id && channels.length > 0) {
		return redirect(
			`/chat/resource/e/${entity_id}/g/${group_id}/f/${chat_state.current_chat_id}`
		);
	}

	channels = pipe(defaultTo([]), sortBy(prop("index")))(channels);

	let direct_messages = await get_collection({
		path: ["chats"],
		queries: [
			{
				param: entity_id,
				predicate: "==",
				value: 1,
			},
			{
				param: "type",
				predicate: "==",
				value: "direct_message",
			},
		],
	});

	return { entity_id, chat_id, channels, direct_messages, chat_state };
};

const DirectMessage = ({ unread = 0, id, selected = false }) => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	return (
		<Link
			className="flex flex-row text-sm items-center justify-between border-b cursor-pointer pr-4 pl-1"
			to={`/chat/resource/e/${entity_id}/g/${group_id}/f/${id}?rand=${Math.random()}`}
		>
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
		</Link>
	);
};

const ChannelActions = ({ channel_id }) => {
	let channels = useChatsStore((state) => state.channels);
	let set_chats_state = useChatsStore((state) => state.set_chats_state);

	const onDeleteChannel = async () => {
		// console.log("onDeleteChannel");
		// console.log(channels);

		delete_doc(["chats", channel_id]);

		set_chats_state(
			["channels"],
			pipe(filter({ id: (id) => id !== channel_id }))(channels)
		);
	};

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="flex flex-col w-full justify-center gap-x-1.5 rounded-full text-sm font-semibold text-gray-900 hover:bg-gray-50">
					<EllipsisHorizontalIcon
						className="h-4 w-4 text-gray-400"
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
								<div
									onClick={onDeleteChannel}
									className={classNames(
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
										"block px-4 py-2 text-sm cursor-pointer"
									)}
								>
									<div className="flex flex-row items-center space-x-3">
										<div>
											<TrashIcon className="h-4 w-4 text-gray-400" />
										</div>
										<div>Delete</div>
									</div>
								</div>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

const Channel = ({ selected = false, title, unread = 0, id = 0 }) => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	return (
		<div
			className={`flex flex-row w-full text-sm px-2 justify-between rounded ${
				selected ? "bg-blue-600 text-white" : "hover:bg-gray-100"
			}`}
		>
			<Link
				className="flex flex-row space-x-1 w-full cursor-pointer py-2"
				to={`/chat/resource/e/${entity_id}/g/${group_id}/f/${id}?rand=${Math.random()}`}
			>
				<div>#</div>
				<div>{title}</div>
			</Link>

			<div className="flex flex-row space-x-3 items-center">
				<div className="flex flex-col justify-center h-full">
					<ChannelActions channel_id={id} />
				</div>
				{unread > 0 && (
					<div className="px-2 h-5 bg-red-500 flex flex-col items-center justify-center text-white rounded-full text-xs">
						{unread}
					</div>
				)}
			</div>
		</div>
	);
};

const NewChannelModal = () => {
	let [channel, set_channel] = useState("");
	let set_modal = useModalStore((state) => state.set_modal);
	let set_chats_state = useChatsStore((state) => state.set_chats_state);
	let channels = useChatsStore((state) => state.channels);

	const location = useLocation();

	const onCreateChannel = async () => {
		// console.log("oncreatechannel");
		// console.log(channel);
		let group_id = get_group_id(location.pathname);
		let type = "channel";
		let chat_id = uuidv4();

		let payload = {
			id: chat_id,
			type,
			group_id,
			title: channel,
			index: channels.length,
		};

		set_doc(["chats", chat_id], payload);

		set_chats_state(["channels"], [...channels, payload]);
		set_channel("");
		set_modal({ id: "new_channel_modal", is_open: false });
	};

	const onCloseModal = () => {
		set_modal({ id: "new_channel_modal", is_open: false });
	};

	return (
		<Modal id="new_channel_modal" classes="min-w-[500px]">
			<div className="flex flex-row w-full py-5 px-5 border-b text-2xl items-center">
				<div className="flex flex-row w-full items-center space-x-3 text-gray-400">
					<div className="">
						<HashtagIcon className="h-6 w-6 " />
					</div>
					<div>Create Channel</div>
				</div>
				<div
					className="border rounded-lg p-2 cursor-pointer"
					onClick={onCloseModal}
				>
					<XMarkIcon className="h-6 w-6 text-gray-400" />
				</div>
			</div>
			<div className="flex flex-col w-full py-5 px-5">
				<div className="flex flex-col w-full space-y-3">
					<div className="font-semibold">Channel Name</div>
					<div className="flex flex-row items-center relative">
						<div className="absolute left-[10px]">#</div>
						<input
							type="text"
							className="outline-none border p-2 rounded w-full pl-[25px]"
							placeholder="new channel"
							value={channel}
							onChange={(e) => set_channel(e.target.value)}
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-row border-t w-full px-5 py-4 justify-end">
				<div
					className="flex flex-col px-3 py-3 bg-blue-600 rounded-lg text-white text-sm cursor-pointer"
					onClick={onCreateChannel}
				>
					Create Channel
				</div>
			</div>
		</Modal>
	);
};

export default function Chat() {
	let {
		entity_id,
		chat_id,
		channels: server_channels,
		direct_messages = [],
	} = useLoaderData();
	let set_modal = useModalStore((state) => state.set_modal);
	let channels = useChatsStore((state) => state.channels);
	let set_chats_state = useChatsStore((state) => state.set_chats_state);

	useEffect(() => {
		if (server_channels.length > 0) {
			set_chats_state(["channels"], server_channels);
		}
	}, [server_channels]);

	const onNewChannelClick = () => {
		set_modal({ id: "new_channel_modal", is_open: true });
	};

	return (
		<div className="flex flex-col w-full h-full bg-gray-50 overflow-hidden">
			<NewChannelModal />
			<div className="flex flex-col w-full border-b bg-white">
				<SimpleNavSignedIn user_id={entity_id} />
			</div>
			<div className="flex flex-row w-full h-full  overflow-hidden">
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
						<div
							className="bg-gray-100 text-gray-600 h-6 w-6 flex flex-col items-center justify-center rounded-full pb-[2px] cursor-pointer"
							onClick={onNewChannelClick}
						>
							+
						</div>
					</div>

					<div className="flex flex-col w-full space-y-2 px-2 my-2">
						{pipe(
							map((channel) => (
								<Channel
									title={channel.title}
									unread={2}
									id={channel.id}
									selected={chat_id == channel.id}
									key={channel.id}
								/>
							))
						)(channels)}
					</div>
					<div className="flex flex-row w-full border-y p-3 text-sm justify-between items-center">
						<div>Direct Messages</div>
						<div className="bg-gray-100 text-gray-600 h-6 w-6 flex flex-col items-center justify-center rounded-full pb-[2px] cursor-pointer">
							+
						</div>
					</div>
					<div className="flex flex-col w-full">
						{pipe(
							map((direct_message) => (
								<DirectMessage
									unread={5}
									id={direct_message.id}
									key={direct_message.id}
									selected={chat_id == direct_message.id}
								/>
							))
						)(direct_messages)}
					</div>
				</div>

				<div className="flex flex-col flex-1 h-full">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
