import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { get_entity_id, get_group_id, get_resource_id, is_location } from "~/utils/helpers";
import { useModalStore } from "~/hooks/useModal";
import Modal from "~/components/Modal";
import { useEffect, useState } from "react";
import { EllipsisHorizontalIcon, HashtagIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { v4 as uuidv4 } from "uuid";
import {
	delete_doc,
	get_collection,
	get_collection_listener,
	get_doc,
	get_doc_listener,
	set_doc,
} from "~/utils/firebase";
import { defaultTo, findIndex, head, isEmpty, map, pipe, prop, propEq, sortBy } from "ramda";
import { get, mod, filter } from "shades";
import { create } from "zustand";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { classNames } from "~/utils/helpers";

import avatars from "~/data/avatars";

const useChatsStore = create((set) => ({
	channels: [],
	direct_messages: [],
	set_chats_state: (path, value) => set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const loader = async ({ request }) => {
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(request.url);
	let chat_state_id = `${entity_id}${group_id}`;

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

	channels = await Promise.all(
		pipe(
			map(async (channel) => {
				let channel_state = await get_doc(["channel_state", channel.id]);
				let entity_channel_state = await get_doc(["entity_channel_state", channel.id + entity_id]);

				let unread = channel_state.num_of_messages - entity_channel_state.num_of_messages;

				return {
					...channel,
					unread,
					entity_channel_messages: entity_channel_state.num_of_messages,
				};
			})
		)(channels)
	);

	// if (channels.length === 0) {
	// 	let default_channel = await create_default_channel({ group_id });

	// 	await set_doc(["chat_state", chat_state_id], {
	// 		id: chat_state_id,
	// 		current_chat_id: default_channel.id,
	// 	});

	// 	return redirect(
	// 		`/chat/id/resource/e/${entity_id}/g/${group_id}/f/${default_channel.id}`
	// 	);
	// }

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

	direct_messages = await Promise.all(
		pipe(
			map(async (channel) => {
				let channel_state = await get_doc(["channel_state", channel.id]);
				let entity_channel_state = await get_doc(["entity_channel_state", channel.id + entity_id]);

				let unread = channel_state.num_of_messages - entity_channel_state.num_of_messages;

				return {
					...channel,
					unread,
					entity_channel_messages: entity_channel_state.num_of_messages,
				};
			})
		)(direct_messages)
	);

	return { entity_id, channels, direct_messages, chat_state };
};

const DirectMessage = ({ unread = 0, id, selected = false, chat }) => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	let member = pipe(filter({ entity_id: (member_id) => entity_id !== member_id }), head)(chat.members);

	let avatar = avatars(member.email, { size: 35 });

	return (
		<Link
			className="flex flex-row text-sm items-center justify-between border-b cursor-pointer pr-4 pl-1 hover:bg-gray-100"
			to={`/chat/id/resource/e/${entity_id}/g/${group_id}/f/${id}?rand=${Math.random()}`}
		>
			<div className="flex flex-row flex-1 space-x-3 items-center px-2 py-3">
				<div>
					<div
						className={`inline-block rounded-full border-blue-500 ${selected && "border-4 shadow-sm"}`}
						dangerouslySetInnerHTML={{ __html: avatar }}
					/>
				</div>
				<div>
					<div className="font-semibold">{`${member.first_name} ${member.last_name}`}</div>
					<div className="text-xs text-gray-400">{member.email}</div>
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

		set_chats_state(["channels"], pipe(filter({ id: (id) => id !== channel_id }))(channels));
	};

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="flex flex-col w-full justify-center gap-x-1.5 rounded-full text-sm font-semibold text-gray-900 hover:bg-gray-50">
					<EllipsisHorizontalIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
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
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
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
				to={`/chat/id/resource/e/${entity_id}/g/${group_id}/f/${id}?rand=${Math.random()}`}
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
				<div className="border rounded-lg p-2 cursor-pointer" onClick={onCloseModal}>
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
	let { pathname } = useLocation();
	let { entity_id, channels: server_channels, direct_messages: server_direct_messages } = useLoaderData();
	let set_modal = useModalStore((state) => state.set_modal);
	let channels = useChatsStore((state) => state.channels);
	let direct_messages = useChatsStore((state) => state.direct_messages);
	let set_chats_state = useChatsStore((state) => state.set_chats_state);
	let chat_id = get_resource_id(pathname);
	let group_id = get_group_id(pathname);
	const [is_listening_to_channels, set_is_listening_to_channels] = useState(false);
	const [is_listening_to_direct_messages, set_is_listening_to_direct_messages] = useState(false);

	useEffect(() => {
		if (server_channels.length > 0) {
			set_chats_state(["channels"], server_channels);
		}
	}, [server_channels]);

	useEffect(() => {
		if (server_channels.length > 0) {
			set_chats_state(["direct_messages"], server_direct_messages);
		}
	}, [server_direct_messages]);

	const onNewChannelClick = () => {
		set_modal({ id: "new_channel_modal", is_open: true });
	};

	const init_channel_state_listener = async () => {
		get_collection_listener(
			{
				path: ["channel_state"],
				queries: [
					{
						param: "group_id",
						predicate: "==",
						value: group_id,
					},
				],
			},
			(snapshot) => {
				return pipe(
					map(async (change) => {
						let channel_state = change.doc.data();

						let { chat_id, num_of_messages, group_id } = channel_state;

						let channel_index = channels.findIndex((channel) => channel.id === chat_id);

						let channel = channels[channel_index];

						if (channel) {
							let unread = num_of_messages - channel?.entity_channel_messages;

							set_chats_state(
								["channels"],
								pipe(
									mod(channel_index)((channel) => ({
										...channel,
										unread,
									}))
								)(channels)
							);
						}
					})
				)(snapshot.docChanges());
			}
		);
	};

	const init_direct_messages_state_listener = async () => {
		get_collection_listener(
			{
				path: ["channel_state"],
				queries: [
					{
						param: "group_id",
						predicate: "==",
						value: group_id,
					},
				],
			},
			(snapshot) => {
				return pipe(
					map(async (change) => {
						let channel_state = change.doc.data();

						let { chat_id, num_of_messages, group_id } = channel_state;

						let channel_index = direct_messages.findIndex((channel) => channel.id === chat_id);

						let channel = direct_messages[channel_index];

						if (channel) {
							let unread = num_of_messages - channel?.entity_channel_messages;

							set_chats_state(
								["direct_messages"],
								pipe(
									mod(channel_index)((channel) => ({
										...channel,
										unread,
									}))
								)(direct_messages)
							);
						}
					})
				)(snapshot.docChanges());
			}
		);
	};

	useEffect(() => {
		if (!isEmpty(channels) && !is_listening_to_channels) {
			set_is_listening_to_channels(true);
			init_channel_state_listener();
		}
	}, [channels, is_listening_to_channels]);

	useEffect(() => {
		if (!isEmpty(direct_messages) && !is_listening_to_direct_messages) {
			set_is_listening_to_direct_messages(true);
			init_direct_messages_state_listener();
		}
	}, [direct_messages, is_listening_to_direct_messages]);

	return (
		<div className="flex flex-col w-full h-full bg-gray-50 overflow-hidden">
			<NewChannelModal />

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
									unread={channel.unread}
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
							map((chat) => (
								<DirectMessage
									unread={chat.unread}
									id={chat.id}
									key={chat.id}
									selected={chat_id == chat.id}
									chat={chat}
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
