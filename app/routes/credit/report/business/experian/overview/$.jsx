import {
	HandThumbUpIcon,
	ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { useLoaderData } from "@remix-run/react";
import { Lendflow } from "~/data/lendflow";
import { get_file_id, get_group_id, inspect } from "~/utils/helpers";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { plans } from "~/data/plans";
import { get, has } from "shades";
import { allPass, pipe, not, head } from "ramda";
import { report_tests } from "~/data/report_tests";
import { get_lendflow_report } from "~/utils/lendflow.server";
import { update_business_report } from "~/utils/business_credit_report.server";
import { get_collection, get_doc, set_doc } from "~/utils/firebase";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	// let file_id = get_file_id(url.pathname);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(url.pathname);

	let { plan_id } = await get_doc(["entity", entity_id]);

	let business_credit_report_queries = [
		{
			param: "group_id",
			predicate: "==",
			value: group_id,
		},
		{
			param: "type",
			predicate: "==",
			value: "business_credit_report",
		},
	];

	let report_response = await get_collection({
		path: ["credit_reports"],
		queries: business_credit_report_queries,
	});

	let report = pipe(head)(report_response);

	let is_owner = report.entity_id == entity_id;

	if (pipe(allPass(report_tests[plan_id]["experian"]), not)(report)) {
		let lendflow_report = await get_lendflow_report(report.application_id);
		report = await set_doc(["credit_reports", report.id], {
			...report,
			...lendflow_report,
		});
	}

	let score = Lendflow.experian.score(report);
	let risk_class = Lendflow.experian.risk_class(report);
	let business = Lendflow.business(report);
	let trade_summary = Lendflow.experian.trade_summary(report);
	let report_payload = { score, risk_class, business, trade_summary };
	return { ...report_payload, plan_id };
};

const ScoreCard = () => {
	let { score, risk_class, business, trade_summary } = useLoaderData();

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Intelliscore Plus
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-1/2">
						<div className="flex flex-col items-center justify-center h-full space-y-2">
							<div className="flex flex-col text-5xl">
								{score}
							</div>
							<div className="flex flex-col">
								{risk_class?.definition}
							</div>
						</div>
					</div>
					<div className="flex flex-col w-1/2 text-sm">
						<div className="flex flex-col mb-2 font-semibold">
							Experian Business Record shown for:
						</div>
						<div className="flex flex-col">
							<div>{business?.name}</div>
							<div>{business?.address?.street}</div>
							<div className="flex flex-row space-x-1">
								<div className="flex flex-col mr-1">
									{business?.address?.city},
								</div>
								<div>{business?.address?.state}</div>
								<div>{business?.address?.zip}</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full space-y-3">
					<div className="font-semibold">
						What Exactly is an Intelliscore?
					</div>
					<div>
						Your business's Intelliscore is like a crystal ball into
						your credit health. It takes into account your payment
						history, utilization, and even your trended data. And
						the higher the score, the better; lenders don't like to
						play risky business when it comes to their money.
					</div>
				</div>
			</div>
		</div>
	);
};

const PersonalInfoCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Personal Information
				</h3>
				<p className="mt-1 max-w-2xl text-sm text-gray-500">
					Below is your personal information as it appears in your
					credit file. This information includes your legal name,
					current and previous addresses, employment information and
					other details.
				</p>
			</div>
			<div className="border-t border-gray-200 px-4 py-1">
				<dl className="divide-y divide-gray-200">
					<div className="py-4 flex flex-col sm:flex-row sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500 w-[200px]">
							Name
						</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							Margot Foster
						</dd>
					</div>
					<div className="py-4 flex flex-col sm:flex-row sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500 w-[200px]">
							Aliases
						</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							Date of birth
						</dd>
					</div>
					<div className="py-4 flex flex-col sm:flex-row sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500 w-[200px]">
							Address
						</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							margotfoster@example.com
						</dd>
					</div>
					<div className="py-4 flex flex-col sm:flex-row sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500 w-[200px]">
							Employers
						</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							$120,000
						</dd>
					</div>
				</dl>
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

const DaysBeyondTerms = () => {
	let { trade_summary, plan_id } = useLoaderData();

	let plan = pipe(get(plan_id, "business", "experian"))(plans);

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Days Beyond Terms
				</h3>
			</div>
			<div className="border-t border-gray-200 p-5">
				<div className="flex flex-row w-full">
					<div className="flex flex-col items-center w-1/3 space-y-2">
						<div>Current DBT</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						{plan.trade_summary && (
							<div className="font-semibold">
								{trade_summary.currentDbt}
							</div>
						)}

						{!plan.trade_summary && (
							<div className="font-semibold">Upgrade</div>
						)}
					</div>
					<div className="flex flex-col items-center w-1/3 space-y-2">
						<div>Average DBT</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						{plan.trade_summary && (
							<div className="font-semibold">
								{trade_summary.monthlyAverageDbt}
							</div>
						)}

						{!plan.trade_summary && (
							<div className="font-semibold">Upgrade</div>
						)}
					</div>
					<div className="flex flex-col items-center w-1/3 space-y-2">
						<div>Highest DBT</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						{plan.trade_summary && (
							<div className="font-semibold">
								{trade_summary.highestDbt5Quarters}
							</div>
						)}

						{!plan.trade_summary && (
							<div className="font-semibold">Upgrade</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const PaymentStatus = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Payment Status
				</h3>
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-1/2">a</div>
					<div className="flex flex-col w-1/2 space-y-5">
						<div className="flex flex-col space-y-1">
							<div>Active Accounts</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							<div className="font-semibold">4</div>
						</div>

						<div className="flex flex-col space-y-1">
							<div>Active Accounts</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							<div className="font-semibold">4</div>
						</div>

						<div className="flex flex-col space-y-1">
							<div>Active Accounts</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							<div className="font-semibold">4</div>
						</div>
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

const ScoreFactors = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Here are the factors influencing your score
				</h3>
			</div>
			<div className="border-t border-gray-200 p-6">
				<div className="flex flex-col w-full space-y-6">
					<div className="flex flex-row items-center space-x-2">
						<div className="w-[20px]">
							<ChevronDoubleRightIcon />
						</div>
						<div>
							Pct of new commercial accts to total nbr of accts
						</div>
					</div>
					<div className="flex flex-row items-center space-x-2">
						<div className="w-[20px]">
							<ChevronDoubleRightIcon />
						</div>
						<div>
							Pct of new commercial accts to total nbr of accts
						</div>
					</div>
					<div className="flex flex-row items-center space-x-2">
						<div className="w-[20px]">
							<ChevronDoubleRightIcon />
						</div>
						<div>
							Pct of new commercial accts to total nbr of accts
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

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
						<div>Collections</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div>0</div>
					</div>
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Collections</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div>0</div>
					</div>
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Collections</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div>0</div>
					</div>
					<div className="flex flex-col items-center w-1/4 space-y-1">
						<div>Collections</div>
						<div className="flex flex-col w-[90%] h-[1px] bg-gray-200"></div>
						<div>0</div>
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
				<ScoreCard />
			</div>

			{/* <div>
				<DaysBeyondTerms />
			</div> */}
		</div>
	);
}
