import { TrophyIcon } from "@heroicons/react/24/outline";

const InfoCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<TrophyIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						What Exactly are Score Factors?
					</h3>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Score factors, also called “Reason Codes,” are
						statements on your credit report explaining why your
						credit score wasn’t higher. They include things like
						late payments, high credit card balances, or too many
						credit inquiries - and are listed in order of impact,
						starting with the factor that has the most significant
						impact first.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Even with excellent credit, you’ll still see 4-5 score
						factors. This is because whenever your credit report
						data is reviewed for a loan application (those hard
						inquiries we mentioned earlier), lenders are legally
						required to provide consumers (you) with a disclosure
						notice. You’ll receive this notice regardless of whether
						they denied your application - or it was approved, but
						with less than the best terms offered.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Don’t sleep on this! If you want to improve your credit
						score, pay attention to your Score Factors! They explain
						why your score isn’t higher - and will help you take the
						steps necessary to improve it over time.
					</p>
				</div>
			</div>
		</div>
	);
};

export default function Factors() {
	return (
		<div className="flex flex-col w-full">
			<InfoCard />
		</div>
	);
}
