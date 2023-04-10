import {
	UserIcon,
	ListBulletIcon,
	ClockIcon,
	BeakerIcon,
	BookOpenIcon,
	ChartPieIcon,
	ClipboardIcon,
	ScaleIcon,
	TrophyIcon,
	Bars3Icon,
} from "@heroicons/react/24/outline";

const PersonalInfoCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
				<div className="flex flex-col w-[25px] mr-3">
					<ClipboardIcon />
				</div>
				<div className="flex flex-col">
					<h3 className="text-lg font-medium leading-6 text-gray-900">
						Why are Inquiries Important?
					</h3>
				</div>
			</div>
			<div className="border-t border-gray-200 px-6 py-2">
				<div className="flex flex-col text-xl py-2 text-gray-700 font-semibold">
					<p>
						10% of your credit score is based on number of Inquiries
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700">
					<p>
						Inquiries account for 10% of your overall credit score.
						Generally, inquiries are listed on your credit report
						for 2 years. However, they only directly impact your
						credit score for 1 year.
					</p>
				</div>

				<div className="flex flex-col py-2 text-gray-700">
					<p>
						There are two types of inquiries - soft inquiries and
						hard inquiries. Soft inquiries are a result of you
						checking your own credit through credit monitoring
						services such as Nav as well as “account review”
						inquiries by any of your current creditors. These
						inquiries do not impact your score. Hard inquiries are
						inquiries associated with a firm offer of credit. Any
						time you apply for a loan the creditor will inquire into
						your credit and cause a hard inquiry. Too many hard
						inquiries can negatively impact your credit score.
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
