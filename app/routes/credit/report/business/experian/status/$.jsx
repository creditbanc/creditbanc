import { useLoaderData } from "@remix-run/react";
import { currency, get_group_id, mapIndexed, get } from "~/utils/helpers";
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
import { MinusCircleIcon } from "@heroicons/react/24/outline";

const log_route = `credit.report.business.experian.status`;

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const loader = async ({ request }) => {
	if (!(await is_authorized(request))) return redirect("/home");
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
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-1/2">
						<DoughnutChart dataset={doughnut_dataset}>
							<div className="absolute w-full h-full flex flex-col items-center justify-center text-5xl font-semibold">
								{delinquent_ratio.toFixed(0)}%
							</div>
						</DoughnutChart>
					</div>
					<div className="flex flex-col w-1/2 space-y-5">
						<div className="flex flex-col space-y-1">
							<div>Active Accounts</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							{plan.trade_lines_payment_totals && <div className="font-semibold">{trade_count}</div>}

							{!plan.trade_lines_payment_totals && <div className="font-semibold">Upgrade</div>}
						</div>

						<div className="flex flex-col space-y-1">
							<div>Delinquent Accounts</div>
							<div className="flex flex-col h-[1px] bg-gray-200 w-[90%]"></div>
							{plan.trade_lines_payment_totals && <div className="font-semibold">{delinquent_count}</div>}

							{!plan.trade_lines_payment_totals && <div className="font-semibold">Upgrade</div>}
						</div>

						<div className="flex flex-col space-y-1">
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
			<div className="border-t border-gray-200 space-y-8 p-6">
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
					<div className="flex flex-col w-[5px] bg-green-500 h-full"></div>
					<div className="flex flex-row w-full px-5 justify-between items-center h-full">
						<div className="flex flex-col items-start gap-y-1">
							<div className="flex flex-col font-semibold">{trade_line?.businessCategory}</div>
							<div className="flex flex-row space-x-1">
								<div className="flex flex-col">Reported:</div>
								<div className="flex flex-col">{trade_line?.dateReported}</div>
							</div>
						</div>
						<div className="flex flex-row space-x-5 items-center">
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
		<div className="flex flex-col items-start space-y-2 w-full">
			{pipe(map((trade_line) => <TradeLine trade_line={trade_line} />))(experian_trade_lines)}
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
		<div className="flex flex-col w-full space-y-5">
			<div>
				<PaymentStatus />
			</div>
			<div>
				<ExplanationCard />
			</div>

			<div className="flex flex-col w-full">
				<TradeLines />
			</div>

			<div className="flex flex-col space-y-4">
				{pipe(
					mapIndexed((trade_line, idx) => (
						<AccountCard trade_line={trade_line} key={idx} plan_id={report_plan_id} />
					))
				)(trade_lines)}
			</div>
		</div>
	);
}
