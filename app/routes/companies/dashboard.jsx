import { FolderIcon } from "@heroicons/react/20/solid";
import {
	EllipsisHorizontalIcon,
	EllipsisVerticalIcon,
	LinkIcon,
} from "@heroicons/react/24/outline";

const Account = ({ account }) => {
	return (
		<div className="flex flex-col min-w-full md:min-w-[47%] lg:min-w-[31%] xl:min-w-[23%]  h-[200px] bg-gray-50 p-5 justify-between rounded-lg shadow-sm border cursor-pointer">
			<div className="flex flex-row justify-between items-center">
				<div>
					<FolderIcon className="w-[40px] h-[40px] text-blue-600" />
				</div>
				<div className="flex flex-col cursor-pointer bg-white p-1 rounded-full border">
					<EllipsisHorizontalIcon className="w-4 h-4 text-gray-400" />
				</div>
			</div>
			<div className="flex flex-col">
				<div className="font-semibold text-gray-600">Credit Banc</div>
			</div>
			<div className="flex flex-col">
				<div className="flex flex-row justify-between items-center">
					<div class="flex -space-x-2 overflow-hidden">
						<img
							class="inline-block h-8 w-8 rounded-full ring-2 ring-white"
							src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
							alt=""
						/>
						<img
							class="inline-block h-8 w-8 rounded-full ring-2 ring-white"
							src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
							alt=""
						/>
						<img
							class="inline-block h-8 w-8 rounded-full ring-2 ring-white"
							src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
							alt=""
						/>
						<img
							class="inline-block h-8 w-8 rounded-full ring-2 ring-white"
							src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
							alt=""
						/>
					</div>
					<div>
						<div>
							<LinkIcon className="w-5 h-5 text-blue-500" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Companies() {
	return (
		<div className="flex flex-row w-full h-full p-5 overflow-hiddens space-x-3">
			<div className="flex flex-col w-[70%] h-full bg-white rounded p-5">
				<div className="border-b border-gray-200 pb-3 flex flex-row justify-between mb-3">
					<div>
						<h3 className="mt-2 text-base font-semibold leading-6 text-gray-900">
							Companies
						</h3>
					</div>
					<div></div>
				</div>

				<div className="flex flex-col w-full">
					<div className="flex flex-row w-full items-center flex-wrap gap-y-10 justify-between xl:justify-start xl:gap-x-5">
						<Account />
						<Account />
						<Account />
						<Account />
						<Account />
						<Account />
					</div>
				</div>
			</div>
			<div className="flex flex-col w-[30%] ">
				<div className="flex flex-col bg-white border rounded"></div>
			</div>
		</div>
	);
}
