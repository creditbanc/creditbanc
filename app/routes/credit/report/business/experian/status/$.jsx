import { useLoaderData } from "@remix-run/react";
import { currency, get_group_id, mapIndexed, get, store } from "~/utils/helpers";
import { is, map, pipe } from "ramda";
import { plans } from "~/data/plans";
import AccountCard from "~/components/AccountCard";
import DoughnutChart from "~/components/DoughnutChart";
import { lastValueFrom } from "rxjs";
import { fold } from "~/utils/operators";
import BusinessReport from "~/api/client/BusinessReport";
import { use_cache } from "~/components/CacheLink";
import { useEffect } from "react";
import { on_success } from "../../success";
import { is_authorized } from "../../authorized";
import { redirect } from "@remix-run/node";
import { Disclosure } from "@headlessui/react";
import { MinusCircleIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const log_route = `credit.report.business.experian.status`;

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const loader = async ({ request }) => {
	// if (!(await is_authorized(request))) return redirect("/home");
	let url = new URL(request.url);
	let group_id = get_group_id(url.pathname);
	let report = new BusinessReport(group_id);
	let payload = report.experian_trade_payment_totals.report_sha.experian_trade_lines.fold;
	let response = await lastValueFrom(payload.pipe(fold(on_success(request), on_error)));
	return response;
};

const PaymentStatus = () => {
	let { experian_trade_payment_totals: trade_payment_totals, plan_id, report_plan_id = "builder" } = useLoaderData();
	let { trade_lines: trade_lines_payment_totals } = trade_payment_totals;

	// let plan = pipe(get(plan_id, "business", "experian"))(plans);
	let plan = pipe(get("builder", "business", "experian"))(plans);

	let trade_count = trade_lines_payment_totals?.tradelineCount || 0;
	let delinquent_count = trade_lines_payment_totals?.dbt30 || 0;
	let delinquent_ratio = (delinquent_count / trade_count) * 100;
	delinquent_ratio = isNaN(delinquent_ratio) ? 0 : delinquent_ratio;
	let doughnut_dataset = delinquent_ratio > 100 ? [100, 0] : [delinquent_ratio, 100 - delinquent_ratio];

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Payment Status</h3>

				{/* {report_plan_id == "essential" && (
					<Link to={"/plans"} className="font-semibold text-blue-600 underline">
						Upgrade
					</Link>
				)} */}
			</div>
			<div className="border-t border-gray-200 gap-y-8 p-6">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-1/2">
						<DoughnutChart dataset={doughnut_dataset}>
							<div className="absolute w-full h-full flex flex-col items-center justify-center text-5xl font-semibold">
								{delinquent_ratio.toFixed(0)}%
							</div>
						</DoughnutChart>
					</div>
					<div className="flex flex-col w-1/2 gap-y-5">
						<div className="flex flex-col gap-y-1">
							<div>Active Accounts</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							{plan.trade_lines_payment_totals && <div className="font-semibold">{trade_count}</div>}

							{!plan.trade_lines_payment_totals && <div className="font-semibold">Upgrade</div>}
						</div>

						<div className="flex flex-col gap-y-1">
							<div>Delinquent Accounts</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							{plan.trade_lines_payment_totals && <div className="font-semibold">{delinquent_count}</div>}

							{!plan.trade_lines_payment_totals && <div className="font-semibold">Upgrade</div>}
						</div>

						<div className="flex flex-col gap-y-1">
							<div>Balance of all accounts</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							{plan.trade_lines_payment_totals && (
								<div className="font-semibold">
									{currency.format(trade_lines_payment_totals?.totalAccountBalance?.amount || 0)}
								</div>
							)}

							{!plan.trade_lines_payment_totals && <div className="font-semibold">Upgrade</div>}
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
					Why is Payment Status Important? Let us explain.
				</h3>
			</div>
			<div className="border-t border-gray-200 gap-y-8 p-6">
				<div className="flex flex-col w-full">
					Paying on time isn't just good manners, it's good for your credit report - especially for your
					business credit. While there's a 30-day window before a late payment appears on your personal credit
					report, your business credit is less forgiving. In fact, late payments can show up on your business
					credit report the very next day. And we all know how lenders feel about late payments.
				</div>
			</div>
		</div>
	);
};

const TradeLine = ({ trade_line }) => {
	let is_current = trade_line.dbt30 === 0 && trade_line.dbt60 === 0 && trade_line.dbt90 == 0;

	return (
		<div className="flex flex-col items-start w-full text-sm">
			<Disclosure defaultOpen={true}>
				<Disclosure.Button className="flex flex-row w-full h-[80px] bg-white border rounded">
					<div className="flex flex-col w-[5px] bg-green-500 h-full rounded-l"></div>
					<div className="flex flex-row w-full px-5 justify-between items-center h-full">
						<div className="flex flex-col items-start gap-y-1">
							<div className="flex flex-col font-semibold">{trade_line?.businessCategory}</div>
							<div className="flex flex-row gap-x-1">
								<div className="flex flex-col">Reported:</div>
								<div className="flex flex-col">{trade_line?.dateReported}</div>
							</div>
						</div>
						<div className="flex flex-row gap-x-5 items-center">
							<div className="flex flex-col items-end gap-y-1">
								<div className="flex flex-col font-semibold">
									{currency.format(trade_line?.accountBalance?.amount)}
								</div>
								<div>
									{is_current && <div className="flex flex-col text-green-500">In good standing</div>}
									{!is_current && <div className="flex flex-col text-red-500">Past due</div>}
								</div>
							</div>
							<div className="flex flex-col">
								<MinusCircleIcon className="w-4 h-4 stroke-slate-400" />
							</div>
						</div>
					</div>
				</Disclosure.Button>
				<Disclosure.Panel className="flex flex-col w-full text-gray-500">
					<div className="flex flex-row w-full gap-x-5 bg-white border -mt-2 rounded-b px-6 py-2 text-xs">
						<div className="flex flex-col w-[50%]">
							<div className="flex flex-col w-full py-3">
								<div className="flex flex-col w-full gap-y-2">
									<div className="flex flex-col font-semibold text-black">Overview</div>
									<div className="flex flex-col w-full h-[20px] relative">
										<div className="absolute flex flex-col w-full bg-gray-100 h-full rounded"></div>
										<div className="absolute flex flex-col w-[30%] bg-green-300 h-full rounded"></div>
									</div>
									<div className="flex flex-row justify-between my-1">
										<div className="flex flex-row gap-x-1">
											<div>Balance:</div>
											<div>{currency.format(trade_line?.accountBalance?.amount)}</div>
										</div>
										<div className="flex flex-row gap-x-1">
											<div>Highest balance:</div>
											<div>{currency.format(trade_line?.recentHighCredit?.amount)}</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col w-[50%]">
							<div className="flex flex-col w-full divide-y">
								<div className="flex flex-row justify-between w-full py-3">
									<div className="font-semibold text-black">Account details</div>
								</div>
								<div className="flex flex-row justify-between w-full py-3">
									<div className="">Account Balance</div>
									<div className="text-black font-semibold">
										{currency.format(trade_line?.accountBalance?.amount)}
									</div>
								</div>
								<div className="flex flex-row justify-between w-full py-3">
									<div className="">High Credit</div>
									<div className="text-black font-semibold">
										{currency.format(trade_line?.recentHighCredit?.amount)}
									</div>
								</div>
								<div className="flex flex-row justify-between w-full py-3">
									<div className="">Current Payment Status</div>
									<div className="text-black font-semibold">{trade_line?.currentPercentage}%</div>
								</div>
								<div className="flex flex-row justify-between w-full py-3">
									<div className="">Date Reported</div>
									<div className="text-black font-semibold">{trade_line?.dateReported}</div>
								</div>
								<div className="flex flex-row justify-between w-full py-3">
									<div className="">Date Of Last Activity</div>
									<div className="text-black font-semibold">{trade_line?.dateLastActivity}</div>
								</div>
								<div className="flex flex-row justify-between w-full py-3">
									<div className="">Term</div>
									<div className="text-black font-semibold">{trade_line?.terms}</div>
								</div>
							</div>
							<div className="flex flex-col w-full divide-y">
								<div className="flex flex-row justify-between w-full py-3">
									<div className="font-semibold text-black">Creditor category information</div>
								</div>
								<div className="flex flex-row justify-between w-full py-3">
									<div className="">{trade_line?.businessCategory}</div>
								</div>
							</div>
						</div>
					</div>
				</Disclosure.Panel>
			</Disclosure>
		</div>
	);
};

const TradeLines = () => {
	let loader_data = useLoaderData();
	let { experian_trade_lines = [] } = loader_data;

	return (
		<div className="flex flex-col items-start gap-y-2 w-full">
			{pipe(map((trade_line) => <TradeLine key={trade_line?.businessCategory} trade_line={trade_line} />))(
				experian_trade_lines
			)}
			<div className="flex flex-col w-full h-[30px] items-center cursor-pointer">
				<div className="flex flex-row w-full items-center justify-center h-full gap-x-3 bg-gray-100 rounded text-blue-500 text-xs font-semibold">
					<div>Show all tradelines</div>
					<div>
						<ChevronDownIcon className="h-4 w-4" />
					</div>
				</div>
			</div>
		</div>
	);
};

let use_container_store = store({ selected_component: "derogatories" });

const Derogatories = () => {
	return (
		<div className="flex flex-col w-full border bg-white rounded text-sm p-4">
			<div className="flex flex-row w-full justify-between items-center">
				<div className="flex flex-col text-xl font-semibold text-gray-800">Derogatory marks</div>
				<div className="flex flex-col">
					<div className="flex flex-col px-3 py-1.5 bg-gray-100 rounded">High impact</div>
				</div>
			</div>
			<div className="flex flex-row w-full my-5 gap-x-10">
				<div className="flex flex-col w-[50%] px-10 gap-y-8 justify-center">
					<div className="flex flex-col w-full items-center ">
						<div className="flex flex-col items-center gap-y-4">
							<div className="flex flex-col items-center justify-center rounded-full border-4 border-green-500 w-[100px] h-[100px]">
								<div className="flex flex-col text-4xl font-semibold text-green-500">0</div>
							</div>
							<div className="flex flex-col font-semibold">Derogatories</div>
						</div>
					</div>
					<div className="flex flex-row w-full justify-between gap-x-2">
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-red-800"></div>
							<div className="flex flex-col w-full items-center py-3">4+</div>
						</div>
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-red-500"></div>
							<div className="flex flex-col w-full items-center py-3">2 - 3</div>
						</div>
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-yellow-300"></div>
							<div className="flex flex-col w-full items-center py-3">1</div>
						</div>
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-green-500"></div>
							<div className="flex flex-col w-full items-center py-3">0</div>
						</div>
					</div>
					<div className="flex flex-row w-full gap-x-3">
						<div>
							<PencilSquareIcon className="h-5 w-5 text-green-500" />
						</div>
						<div>
							<div className="font-semibold">Pro tips</div>
							<div>Keep up the good work avoiding derogatory marks! Your score will thank you!</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-[50%] gap-y-4">
					<div className="flex flex-col w-full gap-y-2">
						<div className="flex flex-col text-lg font-semibold">All good here!</div>
						<div className="text-gray-500">
							Derogatory marks are good to avoid—they can stay on your report for 7-10 years.
						</div>
					</div>
					<div className="flex flex-col w-full gap-y-3">
						<div className="flex flex-col text-md font-semibold">If you have a collection</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">1.</div>
							<div className="text-gray-500">
								Debt collectors are responsible for providing proof for claims against you. Make sure to
								hold on to all documents that could help you in the case of a dispute.
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">2.</div>
							<div className="text-gray-500">
								Brush up on your rights. Did you know that debt collectors aren’t allowed to keep
								calling you?
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">3.</div>
							<div className="text-gray-500">
								Negotiate your debt if you can. Depending on its age, you could see some of it chopped
								off.
							</div>
						</div>
					</div>
					<div className="flex flex-col w-full gap-y-3">
						<div className="flex flex-col text-md font-semibold">If you have a public record</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">1.</div>
							<div className="text-gray-500">
								Unfortunately, events on the public record (bankruptcies, civil judgments, tax liens)
								are hard to remove from your reports.
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">2.</div>
							<div className="text-gray-500">
								Make sure all of the events that appear on your record are correct. Save all necessary
								documents you may need to authenticate your history.
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">3.</div>
							<div className="text-gray-500">
								Reach out to the people involved in past issues about the possibility of removing events
								from your record.
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const Legal = () => {
	return (
		<div className="flex flex-col w-full border bg-white rounded text-sm p-4">
			<div className="flex flex-row w-full justify-between items-center">
				<div className="flex flex-col text-xl font-semibold text-gray-800">Legal Filings</div>
				<div className="flex flex-col">
					<div className="flex flex-col px-3 py-1.5 bg-gray-100 rounded">High impact</div>
				</div>
			</div>
			<div className="flex flex-row w-full my-5 gap-x-10">
				<div className="flex flex-col w-[50%] px-10 gap-y-8 justify-center">
					<div className="flex flex-row w-full justify-center gap-x-12">
						<div className="flex flex-col items-center gap-y-4">
							<div className="flex flex-col items-center justify-center rounded-full border-4 border-green-500 w-[100px] h-[100px]">
								<div className="flex flex-col text-4xl font-semibold text-green-500">0</div>
							</div>
							<div className="flex flex-col font-semibold">Legal</div>
						</div>
						{/* <div className="flex flex-col items-center gap-y-4">
							<div className="flex flex-col items-center justify-center rounded-full border-4 border-green-500 w-[100px] h-[100px]">
								<div className="flex flex-col text-4xl font-semibold text-green-500">0</div>
							</div>
							<div className="flex flex-col font-semibold">Collections</div>
						</div> */}
					</div>
					<div className="flex flex-row w-full justify-between gap-x-2">
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-red-800"></div>
							<div className="flex flex-col w-full items-center py-3">4+</div>
						</div>
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-red-500"></div>
							<div className="flex flex-col w-full items-center py-3">2 - 3</div>
						</div>
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-yellow-300"></div>
							<div className="flex flex-col w-full items-center py-3">1</div>
						</div>
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-green-500"></div>
							<div className="flex flex-col w-full items-center py-3">0</div>
						</div>
					</div>
					<div className="flex flex-row w-full gap-x-3">
						<div>
							<PencilSquareIcon className="h-5 w-5 text-green-500" />
						</div>
						<div>
							<div className="font-semibold">Pro tips</div>
							<div>Keep up the good work avoiding derogatory marks! Your score will thank you!</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-[50%] gap-y-4">
					<div className="flex flex-col w-full gap-y-2">
						<div className="flex flex-col text-lg font-semibold">All good here!</div>
						<div className="text-gray-500">
							Derogatory marks are good to avoid—they can stay on your report for 7-10 years.
						</div>
					</div>
					<div className="flex flex-col w-full gap-y-3">
						<div className="flex flex-col text-md font-semibold">If you have a collection</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">1.</div>
							<div className="text-gray-500">
								Debt collectors are responsible for providing proof for claims against you. Make sure to
								hold on to all documents that could help you in the case of a dispute.
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">2.</div>
							<div className="text-gray-500">
								Brush up on your rights. Did you know that debt collectors aren’t allowed to keep
								calling you?
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">3.</div>
							<div className="text-gray-500">
								Negotiate your debt if you can. Depending on its age, you could see some of it chopped
								off.
							</div>
						</div>
					</div>
					<div className="flex flex-col w-full gap-y-3">
						<div className="flex flex-col text-md font-semibold">If you have a public record</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">1.</div>
							<div className="text-gray-500">
								Unfortunately, events on the public record (bankruptcies, civil judgments, tax liens)
								are hard to remove from your reports.
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">2.</div>
							<div className="text-gray-500">
								Make sure all of the events that appear on your record are correct. Save all necessary
								documents you may need to authenticate your history.
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">3.</div>
							<div className="text-gray-500">
								Reach out to the people involved in past issues about the possibility of removing events
								from your record.
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const Collections = () => {
	return (
		<div className="flex flex-col w-full border bg-white rounded text-sm p-4">
			<div className="flex flex-row w-full justify-between items-center">
				<div className="flex flex-col text-xl font-semibold text-gray-800">Collections</div>
				<div className="flex flex-col">
					<div className="flex flex-col px-3 py-1.5 bg-gray-100 rounded">High impact</div>
				</div>
			</div>
			<div className="flex flex-row w-full my-5 gap-x-10">
				<div className="flex flex-col w-[50%] px-10 gap-y-8 justify-center">
					<div className="flex flex-row w-full justify-center gap-x-12">
						<div className="flex flex-col items-center gap-y-4">
							<div className="flex flex-col items-center justify-center rounded-full border-4 border-green-500 w-[100px] h-[100px]">
								<div className="flex flex-col text-4xl font-semibold text-green-500">0</div>
							</div>
							<div className="flex flex-col font-semibold">Collections</div>
						</div>
					</div>
					<div className="flex flex-row w-full justify-between gap-x-2">
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-red-800"></div>
							<div className="flex flex-col w-full items-center py-3">4+</div>
						</div>
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-red-500"></div>
							<div className="flex flex-col w-full items-center py-3">2 - 3</div>
						</div>
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-yellow-300"></div>
							<div className="flex flex-col w-full items-center py-3">1</div>
						</div>
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-green-500"></div>
							<div className="flex flex-col w-full items-center py-3">0</div>
						</div>
					</div>
					<div className="flex flex-row w-full gap-x-3">
						<div>
							<PencilSquareIcon className="h-5 w-5 text-green-500" />
						</div>
						<div>
							<div className="font-semibold">Pro tips</div>
							<div>Keep up the good work avoiding derogatory marks! Your score will thank you!</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-[50%] gap-y-4">
					<div className="flex flex-col w-full gap-y-2">
						<div className="flex flex-col text-lg font-semibold">All good here!</div>
						<div className="text-gray-500">
							Derogatory marks are good to avoid—they can stay on your report for 7-10 years.
						</div>
					</div>
					<div className="flex flex-col w-full gap-y-3">
						<div className="flex flex-col text-md font-semibold">If you have a collection</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">1.</div>
							<div className="text-gray-500">
								Debt collectors are responsible for providing proof for claims against you. Make sure to
								hold on to all documents that could help you in the case of a dispute.
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">2.</div>
							<div className="text-gray-500">
								Brush up on your rights. Did you know that debt collectors aren’t allowed to keep
								calling you?
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">3.</div>
							<div className="text-gray-500">
								Negotiate your debt if you can. Depending on its age, you could see some of it chopped
								off.
							</div>
						</div>
					</div>
					<div className="flex flex-col w-full gap-y-3">
						<div className="flex flex-col text-md font-semibold">If you have a public record</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">1.</div>
							<div className="text-gray-500">
								Unfortunately, events on the public record (bankruptcies, civil judgments, tax liens)
								are hard to remove from your reports.
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">2.</div>
							<div className="text-gray-500">
								Make sure all of the events that appear on your record are correct. Save all necessary
								documents you may need to authenticate your history.
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">3.</div>
							<div className="text-gray-500">
								Reach out to the people involved in past issues about the possibility of removing events
								from your record.
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const Liens = () => {
	return (
		<div className="flex flex-col w-full border bg-white rounded text-sm p-4">
			<div className="flex flex-row w-full justify-between items-center">
				<div className="flex flex-col text-xl font-semibold text-gray-800">Liens</div>
				<div className="flex flex-col">
					<div className="flex flex-col px-3 py-1.5 bg-gray-100 rounded">High impact</div>
				</div>
			</div>
			<div className="flex flex-row w-full my-5 gap-x-10">
				<div className="flex flex-col w-[50%] px-10 gap-y-8 justify-center">
					<div className="flex flex-row w-full justify-center gap-x-12">
						<div className="flex flex-col items-center gap-y-4">
							<div className="flex flex-col items-center justify-center rounded-full border-4 border-green-500 w-[100px] h-[100px]">
								<div className="flex flex-col text-4xl font-semibold text-green-500">0</div>
							</div>
							<div className="flex flex-col font-semibold">Liens</div>
						</div>
					</div>
					<div className="flex flex-row w-full justify-between gap-x-2">
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-red-800"></div>
							<div className="flex flex-col w-full items-center py-3">4+</div>
						</div>
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-red-500"></div>
							<div className="flex flex-col w-full items-center py-3">2 - 3</div>
						</div>
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-yellow-300"></div>
							<div className="flex flex-col w-full items-center py-3">1</div>
						</div>
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-green-500"></div>
							<div className="flex flex-col w-full items-center py-3">0</div>
						</div>
					</div>
					<div className="flex flex-row w-full gap-x-3">
						<div>
							<PencilSquareIcon className="h-5 w-5 text-green-500" />
						</div>
						<div>
							<div className="font-semibold">Pro tips</div>
							<div>Keep up the good work avoiding derogatory marks! Your score will thank you!</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-[50%] gap-y-4">
					<div className="flex flex-col w-full gap-y-2">
						<div className="flex flex-col text-lg font-semibold">All good here!</div>
						<div className="text-gray-500">
							Derogatory marks are good to avoid—they can stay on your report for 7-10 years.
						</div>
					</div>
					<div className="flex flex-col w-full gap-y-3">
						<div className="flex flex-col text-md font-semibold">If you have a collection</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">1.</div>
							<div className="text-gray-500">
								Debt collectors are responsible for providing proof for claims against you. Make sure to
								hold on to all documents that could help you in the case of a dispute.
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">2.</div>
							<div className="text-gray-500">
								Brush up on your rights. Did you know that debt collectors aren’t allowed to keep
								calling you?
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">3.</div>
							<div className="text-gray-500">
								Negotiate your debt if you can. Depending on its age, you could see some of it chopped
								off.
							</div>
						</div>
					</div>
					<div className="flex flex-col w-full gap-y-3">
						<div className="flex flex-col text-md font-semibold">If you have a public record</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">1.</div>
							<div className="text-gray-500">
								Unfortunately, events on the public record (bankruptcies, civil judgments, tax liens)
								are hard to remove from your reports.
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">2.</div>
							<div className="text-gray-500">
								Make sure all of the events that appear on your record are correct. Save all necessary
								documents you may need to authenticate your history.
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">3.</div>
							<div className="text-gray-500">
								Reach out to the people involved in past issues about the possibility of removing events
								from your record.
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const Judgements = () => {
	return (
		<div className="flex flex-col w-full border bg-white rounded text-sm p-4">
			<div className="flex flex-row w-full justify-between items-center">
				<div className="flex flex-col text-xl font-semibold text-gray-800">Judgements</div>
				<div className="flex flex-col">
					<div className="flex flex-col px-3 py-1.5 bg-gray-100 rounded">High impact</div>
				</div>
			</div>
			<div className="flex flex-row w-full my-5 gap-x-10">
				<div className="flex flex-col w-[50%] px-10 gap-y-8 justify-center">
					<div className="flex flex-row w-full justify-center gap-x-12">
						<div className="flex flex-col items-center gap-y-4">
							<div className="flex flex-col items-center justify-center rounded-full border-4 border-green-500 w-[100px] h-[100px]">
								<div className="flex flex-col text-4xl font-semibold text-green-500">0</div>
							</div>
							<div className="flex flex-col font-semibold">Judgements</div>
						</div>
					</div>
					<div className="flex flex-row w-full justify-between gap-x-2">
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-red-800"></div>
							<div className="flex flex-col w-full items-center py-3">4+</div>
						</div>
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-red-500"></div>
							<div className="flex flex-col w-full items-center py-3">2 - 3</div>
						</div>
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-yellow-300"></div>
							<div className="flex flex-col w-full items-center py-3">1</div>
						</div>
						<div className="flex flex-col w-[25%]">
							<div className="flex flex-col h-[5px] bg-green-500"></div>
							<div className="flex flex-col w-full items-center py-3">0</div>
						</div>
					</div>
					<div className="flex flex-row w-full gap-x-3">
						<div>
							<PencilSquareIcon className="h-5 w-5 text-green-500" />
						</div>
						<div>
							<div className="font-semibold">Pro tips</div>
							<div>Keep up the good work avoiding derogatory marks! Your score will thank you!</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-[50%] gap-y-4">
					<div className="flex flex-col w-full gap-y-2">
						<div className="flex flex-col text-lg font-semibold">All good here!</div>
						<div className="text-gray-500">
							Derogatory marks are good to avoid—they can stay on your report for 7-10 years.
						</div>
					</div>
					<div className="flex flex-col w-full gap-y-3">
						<div className="flex flex-col text-md font-semibold">If you have a collection</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">1.</div>
							<div className="text-gray-500">
								Debt collectors are responsible for providing proof for claims against you. Make sure to
								hold on to all documents that could help you in the case of a dispute.
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">2.</div>
							<div className="text-gray-500">
								Brush up on your rights. Did you know that debt collectors aren’t allowed to keep
								calling you?
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">3.</div>
							<div className="text-gray-500">
								Negotiate your debt if you can. Depending on its age, you could see some of it chopped
								off.
							</div>
						</div>
					</div>
					<div className="flex flex-col w-full gap-y-3">
						<div className="flex flex-col text-md font-semibold">If you have a public record</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">1.</div>
							<div className="text-gray-500">
								Unfortunately, events on the public record (bankruptcies, civil judgments, tax liens)
								are hard to remove from your reports.
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">2.</div>
							<div className="text-gray-500">
								Make sure all of the events that appear on your record are correct. Save all necessary
								documents you may need to authenticate your history.
							</div>
						</div>
						<div className="flex flex-row w-full gap-x-3">
							<div className="font-semibold">3.</div>
							<div className="text-gray-500">
								Reach out to the people involved in past issues about the possibility of removing events
								from your record.
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const DerogatoriesContainer = () => {
	let { selected_component } = use_container_store((state) => state);
	let set_path = use_container_store((state) => state.set_path);

	const container_components = {
		derogatories: Derogatories,
		legal: Legal,
		collections: Collections,
		liens: Liens,
		judgements: Judgements,
	};

	let SelectedComponet = container_components[selected_component];

	const onSelectComponent = (component_name) => {
		set_path(["selected_component"], component_name);
	};

	let selected_styles = `bg-blue-100 rounded border-2 border-blue-500 bg-opacity-20`;
	let nav_base_styles = `flex flex-col cursor-pointer h-full justify-center px-5`;

	const Nav = () => {
		return (
			<div className="flex flex-row w-full border rounded bg-white h-[40px] items-center justify-between text-blue-600 text-sm font-semibold">
				<div
					className={`${nav_base_styles} ${selected_component == "derogatories" && selected_styles}`}
					onClick={() => onSelectComponent("derogatories")}
				>
					Derogatories
				</div>
				<div
					className={`${nav_base_styles} ${selected_component == "legal" && selected_styles}`}
					onClick={() => onSelectComponent("legal")}
				>
					Legal Filings
				</div>
				<div
					className={`${nav_base_styles} ${selected_component == "collections" && selected_styles}`}
					onClick={() => onSelectComponent("collections")}
				>
					Collections
				</div>
				<div
					className={`${nav_base_styles} ${selected_component == "liens" && selected_styles}`}
					onClick={() => onSelectComponent("liens")}
				>
					Liens
				</div>
				<div
					className={`${nav_base_styles} ${selected_component == "judgements" && selected_styles}`}
					onClick={() => onSelectComponent("judgements")}
				>
					Judgements
				</div>
			</div>
		);
	};

	return (
		<div>
			<Nav />
			<div className="flex flex-col w-full my-3">
				<SelectedComponet />
			</div>
		</div>
	);
};

const CreditUtilization = () => {
	let loader_data = useLoaderData();
	let { experian_trade_lines = [] } = loader_data;

	const TradeLine = ({ trade_line }) => {
		let is_current = trade_line.dbt30 === 0 && trade_line.dbt60 === 0 && trade_line.dbt90 == 0;
		let maybe_utilization_ratio = (trade_line?.accountBalance?.amount / trade_line?.recentHighCredit?.amount) * 100;
		let utilization_ratio = maybe_utilization_ratio ? maybe_utilization_ratio : 0;

		return (
			<div className="flex flex-row border-b bg-white last-of-type:border-b-0 rounded">
				<div className="flex flex-col w-[5px] bg-green-500"></div>
				<div className="flex flex-row w-full px-4 h-[60px]">
					<div className="flex flex-col  w-[20%] h-full justify-center">{trade_line?.businessCategory}</div>
					<div className="flex flex-col  w-[20%] h-full justify-center">
						{currency.format(trade_line?.accountBalance?.amount)}
					</div>
					<div className="flex flex-col  w-[20%] h-full justify-center">
						{currency.format(trade_line?.recentHighCredit?.amount)}
					</div>
					<div className="flex flex-col  w-[20%] h-full justify-center">{utilization_ratio.toFixed(2)}%</div>
					<div className="flex flex-col  w-[20%] h-full justify-center">
						{is_current && <div className="flex flex-col text-green-500 ">in good standing</div>}
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="flex flex-col w-full gap-y-4">
			<div className="flex flex-row w-full divide-x">
				<div className="flex flex-col w-1/3 items-center gap-y-2">
					<div className="text-3xl font-semibold">$307,617</div>
					<div className="text-sm">Total credit limit</div>
				</div>
				<div className="flex flex-col w-1/3 items-center gap-y-2">
					<div className="text-3xl font-semibold">$30,617</div>
					<div className="text-sm">Total current balance</div>
				</div>
				<div className="flex flex-col w-1/3 items-center gap-y-2">
					<div className="text-3xl font-semibold">14%</div>
					<div className="text-sm">Credit utilization ratio</div>
				</div>
			</div>
			<div className="text-sm my-3 rounded border">
				<div className="flex flex-row h-[40px] items-center border-b rounded bg-slate-50">
					<div className="flex flex-col w-[5px]"></div>
					<div className="flex flex-row h-full items-center px-4 w-full">
						<div className="flex flex-col w-[20%]">Account</div>
						<div className="flex flex-col w-[20%]">Balance</div>
						<div className="flex flex-col w-[20%]">Credit limit</div>
						<div className="flex flex-col w-[20%]">Usage</div>
						<div className="flex flex-col w-[20%]">Status</div>
					</div>
				</div>
				{pipe(map((trade_line) => <TradeLine key={trade_line?.businessCategory} trade_line={trade_line} />))(
					experian_trade_lines
				)}
			</div>
		</div>
	);
};

export default function Container() {
	let loader_data = useLoaderData();
	let {
		experian_trade_lines: trade_lines = [],
		plan_id,
		report_plan_id = "builder",
		cache_dependencies,
	} = loader_data;
	let use_cache_client = use_cache((state) => state.set_dependencies);

	useEffect(() => {
		if (cache_dependencies !== undefined) {
			use_cache_client({ path: `/credit/report/business/experian`, dependencies: cache_dependencies });
		}
	}, []);

	return (
		<div className="flex flex-col w-full gap-y-5">
			<div>
				<PaymentStatus />
			</div>
			<div>
				<ExplanationCard />
			</div>

			{/* <div className="flex flex-col w-full">
				<CreditUtilization />
			</div>

			<div className="flex flex-col w-full">
				<DerogatoriesContainer />
			</div>

			<div className="flex flex-col w-full">
				<TradeLines />
			</div> */}

			<div className="flex flex-col gap-y-4">
				{pipe(
					mapIndexed((trade_line, idx) => (
						<AccountCard trade_line={trade_line} key={idx} plan_id={report_plan_id} />
					))
				)(trade_lines)}
			</div>
		</div>
	);
}
