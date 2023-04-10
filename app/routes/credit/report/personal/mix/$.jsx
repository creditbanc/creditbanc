import { ChartPieIcon } from "@heroicons/react/24/outline";

const PersonalInfoCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<ChartPieIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						How Important is Your Account Mix?
					</h3>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col text-xl py-2 text-gray-700 font-semibold">
					<p>10% of your credit score is based on your Account Mix</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700">
					<p>
						Account mix or credit diversity accounts for 10% of your
						overall credit score. Creditors like to see that you've
						had experience with different types of credit accounts.
						This category is simply measuring whether or not that's
						the case. To do well in this category you need to have a
						several different types of accounts, such as a credit
						card, department store card, and an installment loan
						(car loan, student loan, etc.).
					</p>
				</div>
			</div>
		</div>
	);
};

export default function Personal() {
	return (
		<div className="flex flex-col w-full">
			<PersonalInfoCard />
		</div>
	);
}
