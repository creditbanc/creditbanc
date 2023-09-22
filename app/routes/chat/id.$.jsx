import { Fragment, useEffect, useRef, useState } from "react";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	EllipsisHorizontalIcon,
	FaceSmileIcon,
	HashtagIcon,
	MagnifyingGlassIcon,
	PaperClipIcon,
} from "@heroicons/react/24/outline";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { classNames, get_entity_id, get_group_id, get_resource_id, mapIndexed } from "~/utils/helpers";
import { Menu, Transition } from "@headlessui/react";
import { create } from "zustand";
import {
	equals,
	head,
	identity,
	ifElse,
	init,
	isEmpty,
	last,
	length,
	map,
	pipe,
	prop,
	sortBy,
	split,
	tail,
	uniqBy,
} from "ramda";
import { get, mod } from "shades";
import { v4 as uuidv4 } from "uuid";
import { get_collection, get_collection_listener, get_count, get_doc, set_doc, update_doc } from "~/utils/firebase";
import moment from "moment";
import avatars from "~/data/avatars";
import axios from "axios";
import { redirect } from "@remix-run/node";

const useMessageStore = create((set) => ({
	message: "",
	set_message: (path, value) => set((state) => pipe(mod(...path)(() => value))(state)),
}));

const useChatStore = create((set) => ({
	messages: [],
	set_chat_state: (path, value) => set((state) => pipe(mod(...path)(() => value))(state)),
}));

const useChatUIStore = create((set) => ({
	ui: {
		members_panel_open: true,
	},
	set_state: (path, value) => set((state) => pipe(mod(...path)(() => value))(state)),
}));

const useEntityStore = create((set) => ({
	entity: {},
	set_state: (path, value) => set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const loader = async ({ request }) => {
	let { pathname } = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(pathname);
	let chat_id = get_resource_id(pathname);
	let chat_state_id = `${entity_id}${group_id}`;

	await update_doc(["chat_state", chat_state_id], {
		current_chat_id: chat_id,
	});

	let messages = await get_collection({
		path: ["messages"],
		queries: [
			{
				param: "chat_id",
				predicate: "==",
				value: chat_id,
			},
		],
	});

	messages = pipe(sortBy(prop("created_at")))(messages);

	let channel = await get_doc(["chats", chat_id]);

	let members_queries = [
		{
			param: "group_id",
			predicate: "==",
			value: group_id,
		},
	];

	let members = await get_collection({
		path: ["roles"],
		queries: members_queries,
	});

	return { entity_id, messages, chat_id, channel, members };
};

const MessageActions = () => {
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white text-sm font-semibold text-gray-900 ">
					<EllipsisHorizontalIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
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
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
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
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
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
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
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
											active ? "bg-gray-100 text-gray-900" : "text-gray-700",
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

const Message = ({ message }) => {
	let avatar = avatars(message.user.email, { size: 35 });

	let message_text = pipe(get("message"), split("\n"), ifElse(pipe(last, equals("")), init, identity))(message);

	return (
		<div className="flex flex-row w-full py-3">
			<div className="flex flex-col w-[50px] pt-1">
				{/* <img
					className="inline-block h-8 w-8 rounded-full"
					src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				/> */}
				<div dangerouslySetInnerHTML={{ __html: avatar }} />
			</div>
			<div className="text-sm flex flex-col flex-1 space-y-1">
				<div className="font-semibold">{message.user.name}</div>
				<div className="flex flex-col text-gray-500 space-y-2">
					<div className="bg-gray-100 w-fit rounded-3xl px-4 py-2">
						{pipe(
							mapIndexed((text, index) =>
								text == "" ? <br key={index}></br> : <div key={index}>{text}</div>
							)
						)(message_text)}
					</div>
				</div>
			</div>
			<div className="flex flex-row w-[100px] text-xs  justify-end space-x-3 text-gray-600">
				<div>{moment(message.created_at).format("h:mm A")}</div>
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

const MessageTextArea = () => {
	let { pathname } = useLocation();
	let { entity_id } = useLoaderData();
	let group_id = get_group_id(pathname);
	let [entity, set_entity] = useState({});
	let chat_id = get_resource_id(pathname);
	let text_area_ref = useRef(null);
	let [num_of_rows, set_num_of_rows] = useState(1);
	let { message, set_message } = useMessageStore();

	let get_set_entity = async () => {
		let entity_response = await axios.request({
			method: "GET",
			url: `/entity/api/identity`,
		});

		let { data: entity_data = {} } = entity_response;
		let { id = undefined } = entity_data;

		if (id) {
			set_entity(entity_data);
		}
	};

	useEffect(() => {
		get_set_entity({ entity_id });
	}, []);

	const onKeyDown = async (event) => {
		var key = event.keyCode;
		if (key === 13 && event.shiftKey) {
			if (num_of_rows <= 10) {
				set_num_of_rows(num_of_rows + 1);
			}
		}

		if (key === 13 && !event.shiftKey) {
			let { first_name, last_name, id, email } = entity;
			let name = `${first_name} ${last_name}`;

			let message_id = uuidv4();

			let payload = {
				message_id,
				message,
				chat_id,
				user: {
					id,
					name,
					email,
				},
				created_at: new Date().toISOString(),
			};

			set_doc(["messages", message_id], payload);

			let messages_queries = [
				{
					param: "chat_id",
					predicate: "==",
					value: chat_id,
				},
			];

			let messages_count = await get_count({
				path: ["messages"],
				queries: messages_queries,
			});

			// console.log("messages_count____");
			// console.log(messages_count);

			await set_doc(["channel_state", chat_id], {
				num_of_messages: messages_count,
				group_id,
				chat_id,
			});

			await set_doc(["entity_channel_state", chat_id + entity_id], {
				num_of_messages: messages_count,
				entity_id,
				chat_id,
				group_id,
			});

			set_message(["message"], "");
		}

		if (key === 8) {
			let text_area_value = event.target.value;
			var lines = text_area_value.split(/\r|\r\n|\n/);
			set_num_of_rows(lines.length);
		}
	};

	useEffect(() => {
		if (message === "") {
			set_num_of_rows(1);
		}
	}, [message]);

	return (
		<textarea
			ref={text_area_ref}
			rows={num_of_rows}
			className="outline-none w-full text-gray-600 resize-none scrollbar-none text-sm pb-[2px]"
			onKeyUp={onKeyDown}
			placeholder="Write a message..."
			onChange={(e) => set_message(["message"], e.target.value)}
			value={message}
		></textarea>
	);
};

const MemberActionsDropdown = ({ member }) => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let navigate = useNavigate();

	let get_entity = async () => {
		let entity_response = await axios.request({
			method: "GET",
			url: `/entity/api/identity`,
		});

		let { data: entity_data = {} } = entity_response;
		return entity_data;
	};

	const onDirectMessage = async () => {
		// console.log("onDirectMessage");
		// console.log(member);
		let entity = await get_entity();
		// console.log("entity");
		// console.log(entity);

		// check if a direct message chat already exists and if it does, redirect to it

		let direct_messages_queries = [
			{
				param: member.entity_id,
				predicate: "==",
				value: 1,
			},
			{
				param: entity.id,
				predicate: "==",
				value: 1,
			},
		];

		// console.log("direct_messages_queries");
		// console.log(direct_messages_queries);

		let direct_messages = await get_collection({
			path: ["chats"],
			queries: direct_messages_queries,
		});

		// console.log("direct_messages");
		// console.log(direct_messages);

		if (direct_messages.length > 0) {
			let chat = pipe(head)(direct_messages);
			// console.log("chat");
			// console.log(chat);

			navigate(`/chat/id/resource/e/${entity_id}/g/${group_id}/f/${chat.id}`);
		}

		if (direct_messages.length == 0) {
			let direct_message_chat_id = uuidv4();

			let payload = {
				[member.entity_id]: 1,
				[entity.id]: 1,
				group_id,
				id: direct_message_chat_id,
				type: "direct_message",
				members: [
					{
						email: member.email,
						entity_id: member.entity_id,
						first_name: member.first_name,
						last_name: member.last_name,
					},
					{
						email: entity.email,
						entity_id: entity.id,
						first_name: entity.first_name,
						last_name: entity.last_name,
					},
				],
			};

			// console.log("dm_payload");
			// console.log(payload);

			await set_doc(["chats", direct_message_chat_id], payload);
		}

		// if it doesn't exist, create a new direct message chat and redirect to it
	};

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ">
					<EllipsisHorizontalIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
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
								<div
									onClick={onDirectMessage}
									className={classNames(
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									Direct message
								</div>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

const Member = ({ member }) => {
	let avatar = avatars(member.email, { size: 35 });

	return (
		<div className="flex flex-row text-sm items-center justify-between border-b cursor-pointer">
			<div className="flex flex-row flex-1 space-x-3 items-center px-2 py-3">
				<div>
					<div dangerouslySetInnerHTML={{ __html: avatar }} />
				</div>
				<div>
					<div className="font-semibold">
						{member.first_name} {member.last_name}
					</div>
					<div className="text-xs text-gray-400">{member.email}</div>
				</div>
			</div>
			<div className="flex flex-col w-[50px]">
				<MemberActionsDropdown member={member} />
			</div>
		</div>
	);
};

const NewMessageInput = () => {
	return (
		<div className="flex flex-row w-full h-full border p-2 rounded">
			<div className="flex flex-row flex-1 h-full items-end space-x-5 ">
				<div>
					<PaperClipIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
				</div>
				<div className="flex flex-col w-full">
					<MessageTextArea />
				</div>
			</div>
			<div className="flex flex-row  h-full">
				<div className="flex flex-col justify-end h-full -mt-0.5 items-center w-full ">
					<FaceSmileIcon className="h-6 w-6 text-gray-400 cursor-pointer " />
				</div>
			</div>
		</div>
	);
};

const Messages = () => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	const { messages: server_messages } = useLoaderData();
	const set_chat_state = useChatStore((state) => state.set_chat_state);
	let [new_message_queue, set_new_message_queue] = useState({});
	const messages = useChatStore((state) => state.messages);
	const messagesEndRef = useRef(null);
	let chat_id = get_resource_id(pathname);
	let [is_listening_to_messages, set_is_listening_to_messages] = useState(false);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		set_chat_state(["messages"], []);
	}, []);

	useEffect(() => {
		set_chat_state(["messages"], uniqBy(prop("message_id"), [...messages, new_message_queue]));
	}, [new_message_queue]);

	const update_entity_chat_message_count = async () => {
		// console.log("update_entity_chat_message_count");
		let messages_queries = [
			{
				param: "chat_id",
				predicate: "==",
				value: chat_id,
			},
		];

		let messages_count = await get_count({
			path: ["messages"],
			queries: messages_queries,
		});

		// console.log("messages_count_____");
		// console.log(messages_count);

		await set_doc(["entity_channel_state", chat_id + entity_id], {
			num_of_messages: messages_count,
			entity_id,
			chat_id,
			group_id,
		});
	};

	useEffect(() => {
		if (!isEmpty(messages)) {
			update_entity_chat_message_count();
		}
	}, [messages]);

	useEffect(() => {
		let messages_queries = [
			{
				param: "chat_id",
				predicate: "==",
				value: chat_id,
			},
		];

		if (messages.length > 0 && is_listening_to_messages === false) {
			set_is_listening_to_messages(true);
			let last_message = pipe(last)(messages);

			let orderBy = [{ field: "created_at", direction: "desc" }];

			get_collection_listener(
				{
					path: ["messages"],
					queries: messages_queries,
					cursors: [
						{
							type: "startAfter",
							value: last_message.message_id,
						},
					],
					orderBy,
					limit: [1],
				},
				(snapshot) => {
					return pipe(
						map((change) => {
							if (change.type === "added") {
								let message = change.doc.data();

								set_new_message_queue(message);
							}
						})
					)(snapshot.docChanges());
				}
			);
		}
	}, [messages, is_listening_to_messages]);

	useEffect(() => {
		if (server_messages.length > 0) {
			set_chat_state(["messages"], server_messages);
		}
	}, [server_messages]);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	return (
		<div className="flex flex-col w-full h-full overflow-hidden py-3 justify-end">
			<div className="overflow-y-scroll overflow-x-hidden scrollbar-none">
				{pipe(map((message) => <Message key={message.message_id} message={message} />))(messages)}
				<div ref={messagesEndRef}></div>
			</div>
		</div>
	);
};

const ChannelWelcomeMessage = () => {
	let { channel } = useLoaderData();
	return (
		<div className="flex flex-col h-full justify-end absolute bottom-[20px]">
			<div className="flex flex-col gap-y-2">
				<div className="flex flex-col bg-gray-400 rounded-full p-3 w-fit">
					<HashtagIcon className="h-8 w-8 text-white" />
				</div>
				<div className="flex flex-col text-2xl font-semibold">
					<div>Welcome to #{channel.title}!</div>
				</div>
				<div className="flex flex-col text-gray-600">
					<div>This is the start of the {channel.title} channel.</div>
				</div>
			</div>
		</div>
	);
};

const MembersPanel = () => {
	let { members = [] } = useLoaderData();
	let set_state = useChatUIStore((state) => state.set_state);

	const onCloseMemberPanel = () => {
		set_state(["ui", "members_panel_open"], false);
	};

	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-row w-full border-b p-3 text-sm justify-between items-center">
				<div>Members</div>
				<div
					className=" text-gray-600 h-6 w-6 flex flex-col items-center justify-center pb-[2px] cursor-pointer"
					onClick={onCloseMemberPanel}
				>
					<ChevronRightIcon className="h-4 w-4 text-gray-400" />
				</div>
			</div>
			<div className="flex flex-col w-full">
				{pipe(map((member) => <Member key={member.entity_id} member={member} />))(members)}
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
	);
};

const ClosedMembersPanel = () => {
	let set_state = useChatUIStore((state) => state.set_state);

	const onOpenMemberPanel = () => {
		set_state(["ui", "members_panel_open"], true);
	};

	return (
		<div className="flex flex-col w-full items-center pt-5 cursor-pointer h-[50px]" onClick={onOpenMemberPanel}>
			<ChevronLeftIcon className="h-4 w-4 text-gray-400" />
		</div>
	);
};

export default function Chat() {
	let { channel } = useLoaderData();
	const messages = useChatStore((state) => state.messages);
	let chat_ui = useChatUIStore((state) => state.ui);

	return (
		<div className="flex flex-col flex-1 h-full w-full overflow-hidden">
			<div className="flex flex-row w-full justify-between items-center px-5 py-2 border-b bg-white">
				<div className="flex flex-row items-center space-x-5 pb-1">
					<div>
						<img
							className="inline-block h-10 w-10 rounded-full"
							src="https://www.massmoments.org/assets/images/9/05_07.3_1958-cabd01ba.jpg"
						/>
					</div>
					<div className="flex flex-col justify-center space-y-1 h-full">
						<div className="font-semibold">#{channel.title}</div>
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
			<div className="flex flex-row h-full overflow-hidden">
				<div className="flex flex-col flex-1 justify-between bg-white">
					<div className="flex flex-col bg-white px-5 overflow-hidden h-full relative">
						{messages.length == 0 && <ChannelWelcomeMessage />}
						<Messages />
					</div>

					<div className="flex flex-col w-full bg-white px-3 pb-3">
						<NewMessageInput />
					</div>
				</div>

				{channel.type == "channel" && (
					<div
						className="flex flex-col bg-white border-l"
						style={{ width: chat_ui.members_panel_open ? 300 : 60 }}
					>
						{!chat_ui.members_panel_open && <ClosedMembersPanel />}
						{chat_ui.members_panel_open && <MembersPanel />}
					</div>
				)}
			</div>
		</div>
	);
}
