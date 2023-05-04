import {
	HandThumbUpIcon,
	ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

const ExplanationCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					How is Payment Status Important?
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-col w-full">
					Payment status on commercial accounts is treated much
					differently than personal accounts. On the personal side, a
					consumer has 30 days after a payment is due to pay before a
					late payment can be reported on their credit. It's not the
					same with business credit. A creditor can report a late or
					slow payment the day after it's due. So if your business is
					only 1 day late making a payment, it can be reported as late
					or slow on your business credit. The more promptly you make
					your payments, the better your business credit score can be.
				</div>
			</div>
		</div>
	);
};

const AccountCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Packaging
				</h3>
			</div>
			<div className="border-t border-gray-200 p-5 pt-1">
				<div className="flex flex-row space-x-3 px-2 py-2 bg-green-100 rounded my-3">
					<div className="flex flex-col h-full justify-center w-[20px] mt-[2px]">
						<HandThumbUpIcon />
					</div>
					<div>This account is current</div>
				</div>
				<div className="flex flex-col w-full [&>*:nth-child(odd)]:bg-gray-50 border rounded">
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							First Credit Account
						</div>
						<div>N/A</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							First Credit Account
						</div>
						<div>N/A</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							First Credit Account
						</div>
						<div>N/A</div>
					</div>
				</div>
				<div className="flex flex-col w-full my-4">
					<div className="flex flex-col w-full space-y-2 mb-5">
						<div className="font-semibold">Payment History</div>
						<div className="flex flex-col h-[1px] bg-gray-200"></div>
						<div className="pt-3">
							This is the history of how many of your payments
							within this account were made within the terms and
							how many were not.
						</div>
					</div>
					<div className="flex flex-row w-full">
						<div className="flex flex-col items-center w-1/4 space-y-1">
							<div>High credit</div>
							<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
							<div className="font-semibold">$0</div>
						</div>
						<div className="flex flex-col items-center w-1/4 space-y-1">
							<div>High credit</div>
							<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
							<div className="font-semibold">$0</div>
						</div>
						<div className="flex flex-col w-1/2 items-end space-y-1">
							<div className="flex flex-col items-center w-1/2">
								<div>High credit</div>
								<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
								<div className="font-semibold">$0</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const SummaryCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Summary
				</h3>
			</div>
			<div className="border-t border-gray-200 p-5">
				<div className="flex flex-col w-full [&>*:nth-child(odd)]:bg-gray-50 border rounded">
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							First Credit Account
						</div>
						<div>N/A</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							First Credit Account
						</div>
						<div>N/A</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">
							First Credit Account
						</div>
						<div>N/A</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	return (
		<div className="flex flex-col w-full space-y-5">
			<div>
				<SummaryCard />
			</div>
			<div>
				<ExplanationCard />
			</div>
			<div>
				<AccountCard />
			</div>
		</div>
	);
}
