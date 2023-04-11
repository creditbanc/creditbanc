import { TrophyIcon } from "@heroicons/react/24/outline";

const PersonalInfoCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<TrophyIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						Why are Score Factors Important?
					</h3>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Score factors or "Reason Codes" are as many as 5
						statements that are on your credit report explaining why
						your credit score wasn't higher. Score factors are
						populated by the scoring model being used to determine
						your credit score. The numbers preceding each reason
						code or score factor are numeric identifiers; sometimes
						they appear with the text and sometimes they don't.
						Score factors are listed in the order of impact on your
						credit score with the factor that has the greatest
						impact listed first.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Even if you have excellent credit scores your credit
						report will still list 4 to 5 score factors. This is
						because lenders are required by law to provide a
						consumer with a disclosure notice if their credit report
						data is used in the review of a loan application and the
						application is either denied or the application is
						approved but with less than the best terms offer. This
						required disclosure includes your credit score and the
						score factors explaining why your score isn't higher.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Reason codes or score factors are very helpful as a
						roadmap to score improvement. They paint a very clear
						picture of the top reason why your score isn't higher,
						so you can take steps to improve over time.
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
