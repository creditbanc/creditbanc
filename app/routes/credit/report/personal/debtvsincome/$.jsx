import { ScaleIcon } from "@heroicons/react/24/outline";

const PersonalInfoCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<ScaleIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						How Important is Your Debt to Income Ratio?
					</h3>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						A primary indicator of your financial well-being is your
						debt-to-income ratio. It’s exactly what it sounds like:
						the amount of debt you have compared to your income. In
						addition to your credit report and credit score, it’s
						one of the primary factors that lenders take into
						account when looking at your creditworthiness.
						Debt-to-income is NOT a factor in determining your
						credit score because your income is not reported to
						credit bureaus and is therefore not included in any
						credit score analysis.
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
