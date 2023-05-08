import {
	HandThumbUpIcon,
	ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

const Derogatories = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Derogatories
				</h3>
			</div>
			<div className="border-t border-gray-200 p-5 space-y-5">
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
				<div className="flex flex-row w-full">
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Tax Liens</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div>0</div>
					</div>
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Judgements</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div>0</div>
					</div>
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Lawsuits</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div>0</div>
					</div>
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Derogatory Collateral</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div>0</div>
					</div>
				</div>
			</div>
		</div>
	);
};

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

export default function Container() {
	return (
		<div className="flex flex-col w-full space-y-5">
			<div>
				<Derogatories />
			</div>
			<div>
				<ExplanationCard />
			</div>
		</div>
	);
}
