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
				<ExplanationCard />
			</div>
		</div>
	);
}
