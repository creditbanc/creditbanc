import { ClipboardIcon } from "@heroicons/react/24/outline";
import { FactorBar } from "~/components/FactorBar";
import { useReportPageLayoutStore } from "~/stores/useReportPageLayoutStore";

const InfoCard = () => {
	return (
		<div className="flex flex-col h-fit bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<ClipboardIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-xl font-medium leading-6 text-gray-900">
						How Do Inquiries Affect My Credit Score?
					</h3>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col text-lg py-2 text-gray-700 font-semibold">
					<p>
						10% of your credit score is based on number of Inquiries
					</p>
				</div>

				<FactorBar index={4} />

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Inquiries refer to the number of times lenders or
						creditors have accessed your report to evaluate your
						creditworthiness. Too many of these on your credit
						report in a short period of time, and lenders might see
						you as a high-risk borrower; this could mean lower
						limits, higher interest rates, or flat-out denials.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						It’s important to note that not all inquiries are
						created equal. Any time you apply for a new line of
						credit or loan, the creditor will make a hard inquiry -
						and those are the ones that can negatively impact your
						credit score. Soft inquiries (checking your credit
						through monitoring services like Credit Banc or an
						“account review” by current creditors) do not affect
						your score. It’s the hard inquiries you want to keep an
						eye on.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700 text-sm">
					<p>
						Before you go: While inquiries remain on your credit
						report for two years, they only directly impact your
						credit score for one. Have a little patience, and
						they’ll be out of your hair (and score) in no time.
					</p>
				</div>
			</div>
		</div>
	);
};

export default function Inquiries() {
	let { coordinates } = useReportPageLayoutStore();
	return (
		<div
			className={`flex flex-col w-full h-full scrollbar-none py-5 ${
				coordinates.top < 145 ? "overflow-scroll" : "overflow-hidden"
			}`}
		>
			<InfoCard />
		</div>
	);
}
