import { ScaleIcon } from "@heroicons/react/24/outline";
import { useReportPageLayoutStore } from "~/stores/useReportPageLayoutStore";

const InfoCard = () => {
	return (
		<div className="flex flex-col h-fit bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<ScaleIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						Is My Debt to Income Ratio That Important?
					</h3>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						In a word, yes. Your debt-to-income ratio is an
						indicator of your overall financial well-being.
						Basically, it represents how much of your income goes
						towards paying off debts. The higher that ratio, the
						more it appears you’ve overextended yourself
						financially. In addition to your credit report and
						credit score, this ratio is one of the primary factors
						lenders consider when determining your creditworthiness.
					</p>
				</div>
			</div>
		</div>
	);
};

export default function DebtVsIncome() {
	let { coordinates } = useReportPageLayoutStore();
	return (
		<div className={`flex flex-col w-full h-full py-5 `}>
			<InfoCard />
		</div>
	);
}
