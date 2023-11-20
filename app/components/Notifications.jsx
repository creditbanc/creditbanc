import { ChatBubbleLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { head, pipe } from "ramda";
import { filter, get } from "shades";

const VaultUpload = ({ notification }) => {
	return (
		<li
			key={notification?.id}
			className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap"
		>
			<div>
				<p className="text-sm font-semibold leading-6 text-gray-900">
					<div className="hover:underline">New file uploaded</div>
				</p>
				<div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
					<p>
						<a href={notification?.author?.href} className="hover:underline">
							Leslie Alexander
						</a>
					</p>
					<svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
						<circle cx={1} cy={1} r={1} />
					</svg>
					<p>
						{/* 2d ago */}
						<time dateTime={notification?.dateTime}>{notification?.date}</time>
					</p>
				</div>
			</div>
			<dl className="flex w-full flex-none justify-between gap-x-8 sm:w-auto">
				<div className="flex -space-x-0.5">
					<dt className="sr-only">Commenters</dt>
					{notification?.commenters?.map((commenter) => (
						<dd key={commenter?.id}>
							<img
								className="h-6 w-6 rounded-full bg-gray-50 ring-2 ring-white"
								src={commenter?.imageUrl}
								alt={commenter?.name}
							/>
						</dd>
					))}
				</div>
				<div className="flex cursor-pointer">
					<div>
						<ChevronRightIcon className="h-5 w-5 text-gray-400" />
					</div>

					<dd className="text-sm leading-6 text-gray-900">{notification?.totalComments}</dd>
				</div>
			</dl>
		</li>
	);
};

export const notifications_map = [
	{
		resource: "vault",
		id: "upload",
		component: VaultUpload,
	},
];

export default function Notification({ notification }) {
	let Component = pipe(
		filter({
			resource: notification.resource,
			id: notification.id,
		}),
		head,
		get("component")
	)(notifications_map);

	return (
		<div>
			<Component notification={notification} />
		</div>
	);
}
