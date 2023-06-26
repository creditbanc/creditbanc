import { Outlet, useLoaderData } from "@remix-run/react";
import SimpleNavSignedIn from "~/components/SimpleNavSignedIn";
import { get_user_id } from "~/utils/auth.server";

export const loader = async ({ request }) => {
	let entity_id = get_user_id(request);

	return { entity_id };
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

				<div className="flex flex-col flex-1 h-full">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
