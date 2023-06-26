import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import SimpleNavSignedIn from "~/components/SimpleNavSignedIn";
import { get_user_id } from "~/utils/auth.server";
import { get_group_id, get_resource_id } from "~/utils/helpers";
import { useModalStore } from "~/hooks/useModal";
import Modal from "~/components/Modal";
import { useEffect, useState } from "react";
import { HashtagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { v4 as uuidv4 } from "uuid";
import { get_collection, set_doc } from "~/utils/firebase";
import { map, pipe, prop, sortBy } from "ramda";
import { mod } from "shades";
import { create } from "zustand";

const useChatsStore = create((set) => ({
	channels: [],
	set_chats_state: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const loader = async ({ request }) => {
	let entity_id = get_user_id(request);
	let chat_id = get_resource_id(request.url);
	let group_id = get_group_id(request.url);

	let channels = await get_collection({
		path: ["chats"],
		queries: [
			{
				param: "group_id",
				predicate: "==",
				value: group_id,
			},
		],
	});

	// console.log("channels");
	// console.log(channels);

	channels = pipe(sortBy(prop("index")))(channels);

	return { entity_id, chat_id, channels };
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

const Channel = ({ selected = false, title, unread = 0, id = 0 }) => {
	return (
		<Link
			to={`/chat/resource/e/6461f488df5523110dece1ea/g/6461f489df5523110dece1ed/f/${id}?rand=${Math.random()}`}
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
		</Link>
	);
};

const NewChanelModal = () => {
	let [channel, set_channel] = useState("");
	let set_modal = useModalStore((state) => state.set_modal);
	let set_chats_state = useChatsStore((state) => state.set_chats_state);
	let channels = useChatsStore((state) => state.channels);

	const location = useLocation();

	// useEffect(() => {
	// 	set_channel("");
	// }, []);

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
	let { entity_id, chat_id, channels: server_channels } = useLoaderData();
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
			<NewChanelModal />
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

				<div className="flex flex-col flex-1 h-full">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
