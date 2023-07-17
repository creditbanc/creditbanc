import { Fragment, useEffect, useRef, useState } from "react";
import {
	EllipsisHorizontalIcon,
	FaceSmileIcon,
	MagnifyingGlassIcon,
	PaperClipIcon,
} from "@heroicons/react/24/outline";
import { useLoaderData } from "@remix-run/react";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import {
	classNames,
	get_group_id,
	get_resource_id,
	mapIndexed,
} from "~/utils/helpers";
import { Menu, Transition } from "@headlessui/react";
import { create } from "zustand";
import {
	equals,
	identity,
	ifElse,
	init,
	last,
	map,
	pipe,
	prop,
	sortBy,
	split,
	tail,
} from "ramda";
import { get, mod } from "shades";
import { v4 as uuidv4 } from "uuid";
import { get_collection, get_doc, set_doc, update_doc } from "~/utils/firebase";
import moment from "moment";

const useMessageStore = create((set) => ({
	message: "",
	set_message: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

const useChatStore = create((set) => ({
	messages: [],
	set_chat_state: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(request.url);
	let chat_id = get_resource_id(request.url);
	let chat_state_id = `${entity_id}${group_id}`;
	console.log("url______");

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

	// console.log("messages");
	// console.log(messages);

	let channel = await get_doc(["chats", chat_id]);

	return { entity_id, messages, chat_id, channel };
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

const Message = ({ message }) => {
	let message_text = pipe(
		get("message"),
		split("\n"),
		ifElse(pipe(last, equals("")), init, identity)
	)(message);

	return (
		<div className="flex flex-row w-full py-3">
			<div className="flex flex-col w-[50px] pt-1">
				<img
					className="inline-block h-8 w-8 rounded-full"
					src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				/>
			</div>
			<div className="text-sm flex flex-col flex-1 space-y-1">
				<div className="font-semibold">{message.user.name}</div>
				<div className="flex flex-col text-gray-500 space-y-2">
					<div className="bg-gray-100 w-fit rounded-3xl px-4 py-2">
						{pipe(
							mapIndexed((text, index) =>
								text == "" ? (
									<br key={index}></br>
								) : (
									<div key={index}>{text}</div>
								)
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
	let { chat_id } = useLoaderData();
	let text_area_ref = useRef(null);
	let [num_of_rows, set_num_of_rows] = useState(1);
	let { message, set_message } = useMessageStore();
	let set_chat_state = useChatStore((state) => state.set_chat_state);
	let messages = useChatStore((state) => state.messages);

	const onKeyDown = async (event) => {
		var key = event.keyCode;
		if (key === 13 && event.shiftKey) {
			if (num_of_rows <= 10) {
				set_num_of_rows(num_of_rows + 1);
			}
		}

		if (key === 13 && !event.shiftKey) {
			// console.log("submit now");
			// console.log(message);

			let message_id = uuidv4();

			let payload = {
				message_id,
				message,
				chat_id,
				user: {
					id: "6461f488df5523110dece1ea",
					name: "Talan Rosser",
				},
				created_at: new Date().toISOString(),
			};

			set_doc(["messages", message_id], payload);

			set_message(["message"], "");

			set_chat_state(["messages"], [...messages, payload]);
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
	const { messages: server_messages } = useLoaderData();
	const set_chat_state = useChatStore((state) => state.set_chat_state);
	const messages = useChatStore((state) => state.messages);
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		set_chat_state(["messages"], []);
	}, []);

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
				{pipe(
					map((message) => (
						<Message key={message.message_id} message={message} />
					))
				)(messages)}
				<div ref={messagesEndRef}></div>
			</div>
		</div>
	);
};

export default function Chat() {
	let { channel } = useLoaderData();

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
					<div className="flex flex-col bg-white px-5 overflow-hidden h-full">
						<Messages />
					</div>

					<div className="flex flex-col w-full bg-white px-3 pb-3">
						<NewMessageInput />
					</div>
				</div>
				{/* <div className="flex flex-col w-[300px] bg-white border-l">
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
				</div> */}
			</div>
		</div>
	);
}
