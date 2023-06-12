const Heading = () => {
	return (
		<div className="border-b border-gray-200 pb-5">
			<div className="flex flex-row justify-between items-end">
				<div className="flex flex-col">
					<h3 className="text-base font-semibold leading-6 text-gray-900">
						Recents
					</h3>
				</div>
				<div className="flex flex-col">
					<button
						type="button"
						className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Upload
					</button>
				</div>
			</div>
		</div>
	);
};

const RecentTagsFilter = () => {
	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-row w-full items-center text-sm space-x-3 py-5">
				<div className="text-gray-400">Show</div>
				<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer">
					Form 1040
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer">
					Form 1099
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer">
					Form W-2
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer">
					2022
				</div>
				<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer">
					2023
				</div>
			</div>
		</div>
	);
};

export default function Files() {
	return (
		<div className="flex flex-col w-full h-full p-5">
			<div className="flex flex-row w-full border rounded h-full">
				<div className="flex flex-col w-[250px] border-r">1</div>
				<div className="flex flex-col flex-1 p-5">
					<Heading />
					<RecentTagsFilter />
				</div>
			</div>
		</div>
	);
}
