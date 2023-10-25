import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import {
	classNames,
	currency,
	get_entity_id,
	get_group_id,
	use_client_search_params,
	use_search_params,
} from "~/utils/helpers";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import "chart.js/auto";
import { ArrowDownCircleIcon, ArrowUpCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { pipe, values, sum, mapObjIndexed, join, isEmpty, map } from "ramda";
import { get, mod } from "shades";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { is_authorized_f } from "~/api/auth";
import CashflowChart from "~/components/CashflowChart";
import axios from "axios";
import { useCashflowStore } from "~/stores/useCashflowStore";
import { useEffect } from "react";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import PersonalReport from "~/api/client/PersonalReport";
import { forkJoin, lastValueFrom, map as rxmap } from "rxjs";
import BusinessReport from "~/api/client/BusinessReport";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const loader = async ({ request }) => {
	let { origin } = new URL(request.url);
	let { income: income_start_month = 12 } = use_search_params(request);
	let group_id = get_group_id(request.url);
	let entity_id = await get_session_entity_id(request);

	let cashflow_api_response = await axios({
		method: "get",
		url: `${origin}/financial/api/cashflow/resource/e/${entity_id}/g/${group_id}?income=${income_start_month}`,
	});

	// return { financials: {} };

	// if (true) {
	// 	return redirect(`/financial/accounts/resource/e/${entity_id}/g/${group_id}`);
	// }

	let { data: financials = {} } = cashflow_api_response;

	let personal_report = new PersonalReport(group_id);
	let business_report = new BusinessReport(group_id);

	let personal_report_payload = personal_report.scores.fold;
	let business_report_payload = business_report.experian_score.dnb_score.experian_years_on_file.fold;

	let reports = await lastValueFrom(
		forkJoin({
			personal: personal_report_payload,
			business: business_report_payload,
		}).pipe(
			rxmap(({ personal, business }) => {
				return {
					years_on_file: { name: "Years in business", value: business.experian_years_on_file },
					scores: {
						personal: {
							name: "Personal Credit",
							id: "personalcredit",
							value: {
								experian: personal.scores.experian_personal_score,
								equifax: personal.scores.equifax_personal_score,
								transunion: personal.scores.transunion_personal_score,
							},
						},
						business: {
							name: "Business Credit",
							id: "businesscredit",
							value: {
								experian: business.experian_score,
								dnb: business.dnb_score,
							},
						},
					},
				};
			})
		)
	);

	// console.log("personal_scores_____");
	// console.log(reports);

	let { error = false } = financials;

	// console.log("financials");
	// console.log(financials);

	if (error == "no credentials") {
		console.log("no credentials");
		return redirect(`/financial/accounts/resource/e/${entity_id}/g/${group_id}`);
	}

	if (error == "no accounts") {
		console.log("no accounts");
		return redirect(`/financial/accounts/resource/e/${entity_id}/g/${group_id}`);
	}

	// console.log("financials");
	// console.log(financials);

	return { financials, reports };
};

const ActivityFeed = () => {
	let { financials } = useLoaderData();
	let { recent_activity = [] } = financials;

	return (
		<>
			<ul role="list" className="space-y-3 scrollbar-none">
				{recent_activity.map((activityItem, activityItemIdx) => (
					<li key={activityItemIdx} className="relative flex gap-x-4">
						<div
							className={classNames(
								activityItemIdx === recent_activity.length - 1 ? "h-6" : "-bottom-6",
								"absolute left-0 top-0 flex w-6 justify-center"
							)}
						>
							<div className="w-px bg-gray-200" />
						</div>

						<>
							<div
								className={`rounded-full h-8 w-8 flex flex-col items-center justify-center z-10 -ml-1 ${
									activityItem.type == "expense" ? "bg-gray-100" : "bg-blue-100"
								}`}
							>
								{activityItem.type === "expense" && (
									<ArrowDownCircleIcon className="h-5 w-5 text-gray-500 " />
								)}

								{activityItem.type === "revenue" && (
									<ArrowUpCircleIcon className="h-5 w-5 text-blue-500 " />
								)}
							</div>

							<div className="flex-auto rounded p-2 px-3 ">
								<div className="flex flex-row w-full justify-between text-xs h-full">
									<div className="space-y-1 flex flex-col h-full justify-between">
										<div className="font-medium">{activityItem.name}</div>
										<div className="text-gray-400">{activityItem.date}</div>
									</div>
									<div className="flex flex-col items-end space-y-2 ">
										<div
											className={`flex flex-row justify-center items-center text-[14px] font-light space-x-1  ${
												activityItem.type == "expense"
													? "text-gray-600 bg-gray-100 px-3 py-1 rounded"
													: "text-blue-600 bg-blue-100 px-3 py-1 rounded"
											}`}
										>
											{activityItem.type === "expense" && <div>-</div>}
											{activityItem.type === "revenue" && <div>+</div>}
											<div>{currency.format(Math.abs(activityItem.amount))}</div>
										</div>
										<div className="text-gray-400">
											{Number(activityItem.balance).toLocaleString("en-US", {
												style: "currency",
												currency: "USD",
											})}
										</div>
									</div>
								</div>
							</div>
						</>
					</li>
				))}
			</ul>
		</>
	);
};

export const options = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		// title: {
		// 	display: true,
		// 	text: "Chart.js Bar Chart - Stacked",
		// },

		legend: {
			display: false,
		},
		title: {
			display: false,
			// text: "Chart.js Line Chart",
		},
	},
	responsive: true,
	scales: {
		x: {
			stacked: true,
			grid: {
				display: false,
			},
			// barPercentage: 0.1,
			// barThickness: 2,
			// barPercentage: 0.2,
		},
		y: {
			stacked: true,
			beginAtZero: true,
			// grid: {
			// 	display: false,
			// },
		},
	},
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
	labels,
	datasets: [
		{
			label: "Dataset 1",
			data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
			backgroundColor: "rgb(13,98,254)",
			stack: "Stack 0",
			barThickness: 30,
		},
		{
			label: "Dataset 2",
			data: labels.map(() => faker.number.int({ min: -1000, max: 0 })),
			backgroundColor: "rgb(234,238,241)",
			stack: "Stack 0",
			barThickness: 30,
		},
	],
};

export const income_chart_data = (labels, revenues, expenses, incomes) => {
	return {
		labels,
		datasets: [
			{
				label: "Income",
				data: incomes,
				borderColor: "#000",
				backgroundColor: "#000",
				borderWidth: 1,
				type: "line",
				order: 0,
			},
			{
				label: "Revenues",
				data: revenues,
				backgroundColor: "rgb(13,98,254)",
				stack: "Stack 0",
				barThickness: 30,
				order: 1,
			},
			{
				label: "Expenses",
				data: expenses,
				backgroundColor: "rgb(234,238,241)",
				stack: "Stack 0",
				barThickness: 30,
				order: 1,
			},
		],
	};
};

export const revenue_data = (labels, revenues) => {
	return {
		labels,
		datasets: [
			{
				label: "Revenues",
				data: revenues,
				backgroundColor: "rgb(13,98,254)",
				barThickness: 30,
			},
		],
	};
};

export const expenses_data = (labels, expenses) => {
	return {
		labels,
		datasets: [
			{
				label: "Expenses",
				data: expenses,
				backgroundColor: "rgb(234,238,241)",
				barThickness: 30,
			},
		],
	};
};

const HealthStats = ({ type = "revenue" }) => {
	let { financials } = useLoaderData();
	let { stats_data = {} } = financials;
	let stats = stats_data[type] ?? [];

	if (isEmpty(stats)) {
		return <div></div>;
	}

	return (
		<div className="bg-white divide-y rounded">
			<div className="border-b border-gray-200 pb-3 px-5">
				<h3 className="text-base font-semibold leading-6 text-gray-900">How you’re doing</h3>
			</div>

			{stats.map((item) => (
				<div key={item.name} className="px-4 py-3 sm:p-6">
					<div className="text-sm font-normal text-gray-900">{item.name}</div>
					<div className="mt-1 flex flex-row justify-between">
						<div className="flex items-baseline text-xl font-semibold text-blue-600">
							{item.stat}
							<span className="ml-2 text-sm font-medium text-gray-500">from {item.previousStat}</span>
						</div>

						{/* <div
							className={classNames(
								item.changeType === "increase"
									? "bg-green-100 text-green-800"
									: "bg-red-100 text-red-800",
								"flex flex-row items-center h-[25px] rounded-full px-2.5 py-0.5 text-xs font-medium md:mt-2 lg:mt-0"
							)}
						>
							{item.changeType === "increase" ? (
								<ArrowUpIcon
									className="-ml-1 mr-0.5 h-4 w-4 flex-shrink-0 self-center text-green-500"
									aria-hidden="true"
								/>
							) : (
								<ArrowDownIcon
									className="-ml-1 mr-0.5 h-4 w-4 flex-shrink-0 self-center text-red-500"
									aria-hidden="true"
								/>
							)}

							{item.change}
						</div> */}
					</div>
				</div>
			))}
		</div>
	);
};

const RevenueChart = () => {
	let { financials } = useLoaderData();
	let { monthly_revenues = [], month_labels = [] } = financials;
	let { search, pathname } = useLocation();

	let total_revenue = sum(monthly_revenues);

	let { income = 12, expenses = 12, revenues = 12 } = use_client_search_params(search);

	let use_chart_date_link = (key, value) => {
		let search_params = { income, expenses, revenues };
		let search = pipe(
			mod(key)(() => value),
			mapObjIndexed((value, key) => `${key}=${value}`),
			values,
			join("&")
		)(search_params);

		return `${pathname}?${search}`;
	};

	return (
		<div className="flex flex-col w-full h-full">
			<div className="px-5 pt-5 text-base font-semibold leading-6 text-gray-900">Revenue</div>
			<div className="flex flex-col w-full border-t my-3"></div>

			<div className="flex flex-row justify-between px-5">
				<div className="flex flex-col mb-3 space-y-2 my-2">
					<div className="text-gray-700">Total revenue</div>
					<div className="text-3xl">{currency.format(total_revenue)}</div>
				</div>
			</div>

			<div className="flex flex-col w-full h-[250px] p-3 overflow-hidden">
				<Bar options={options} data={revenue_data(month_labels, monthly_revenues)} />
			</div>

			<div className="flex flex-row justify-center gap-x-5 py-6 text-sm">
				<Link
					className={`flex flex-col  px-3 rounded-full cursor-pointer ${
						income == 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-600"
					}`}
					to={use_chart_date_link("income", 1)}
				>
					30D
				</Link>
				<Link
					className={`flex flex-col  px-3 rounded-full cursor-pointer ${
						income == 3 ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-600"
					}`}
					to={use_chart_date_link("income", 3)}
				>
					3M
				</Link>
				<Link
					className={`flex flex-col  px-3 rounded-full cursor-pointer ${
						income == 6 ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-600"
					}`}
					to={use_chart_date_link("income", 6)}
				>
					6M
				</Link>
				<Link
					className={`flex flex-col  px-3 rounded-full cursor-pointer ${
						income == 12 ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-600"
					}`}
					to={use_chart_date_link("income", 12)}
				>
					12M
				</Link>
			</div>

			<div>
				<HealthStats type={"revenues"} />
			</div>
		</div>
	);
};

const ExpensesChart = () => {
	let { financials } = useLoaderData();
	let { monthly_expenses = [], month_labels = [] } = financials;
	let { search, pathname } = useLocation();

	let total_expenses = sum(monthly_expenses);

	let { income = 12, expenses = 12, revenues = 12 } = use_client_search_params(search);

	let use_chart_date_link = (key, value) => {
		let search_params = { income, expenses, revenues };
		let search = pipe(
			mod(key)(() => value),
			mapObjIndexed((value, key) => `${key}=${value}`),
			values,
			join("&")
		)(search_params);

		return `${pathname}?${search}`;
	};

	return (
		<div className="flex flex-col w-full h-full">
			<div className="px-5 pt-5 text-base font-semibold leading-6 text-gray-900">Expenses</div>
			<div className="flex flex-col w-full border-t my-3"></div>

			<div className="flex flex-row justify-between px-5">
				<div className="flex flex-col mb-3 space-y-2 my-2">
					<div className="text-gray-700">Total spending</div>
					<div className="text-3xl">{currency.format(total_expenses)}</div>
				</div>
			</div>

			<div className="flex flex-col w-full h-[250px] p-3 overflow-hidden">
				<Bar options={options} data={expenses_data(month_labels, monthly_expenses)} />
			</div>

			<div className="flex flex-row justify-center gap-x-5 py-6 text-sm">
				<Link
					className={`flex flex-col  px-3 rounded-full cursor-pointer ${
						income == 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-600"
					}`}
					to={use_chart_date_link("income", 1)}
				>
					30D
				</Link>
				<Link
					className={`flex flex-col  px-3 rounded-full cursor-pointer ${
						income == 3 ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-600"
					}`}
					to={use_chart_date_link("income", 3)}
				>
					3M
				</Link>
				<Link
					className={`flex flex-col  px-3 rounded-full cursor-pointer ${
						income == 6 ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-600"
					}`}
					to={use_chart_date_link("income", 6)}
				>
					6M
				</Link>
				<Link
					className={`flex flex-col  px-3 rounded-full cursor-pointer ${
						income == 12 ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-600"
					}`}
					to={use_chart_date_link("income", 12)}
				>
					12M
				</Link>
			</div>

			<div>
				<HealthStats type={"expenses"} />
			</div>
		</div>
	);
};

const Stats = () => {
	let { financials = {}, reports } = useLoaderData();

	let {
		years_on_file = 0,
		scores: { personal, business },
	} = reports;

	console.log("reports_____");
	console.log(business);
	console.log(personal);

	let { annual_revenue = 0, average_daily_balance = 0, num_of_negative_balance_days = 0 } = financials;

	let stats = [
		annual_revenue,
		average_daily_balance,
		num_of_negative_balance_days,
		years_on_file,
		personal,
		business,
	];

	return (
		<div className="flex flex-wrap w-full rounded-lg gap-x-3 gap-y-3 justify-between">
			{stats.map((stat, index) => (
				<div
					key={index}
					className="flex flex-col w-full md:w-[48%] lg:w-[32%] gap-x-4 gap-y-2 bg-white px-4 py-4 border rounded-lg"
				>
					<div className="text-sm font-medium leading-6 text-gray-500">{stat.name}</div>
					<div
						className={classNames(
							stat.changeType === "negative" ? "text-rose-600" : "text-gray-700",
							"text-xs font-medium"
						)}
					>
						{stat.change}
					</div>
					{!stat.id && (
						<div className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
							{stat.value}
						</div>
					)}

					{stat.id === "personalcredit" && (
						<div className="w-full flex flex-col text-3xl text-gray-900 gap-y-3">
							<div className="flex flex-row justify-between text-lg">
								<div className="font-medium">Experian: </div>
								<div>{pipe(get("experian"))(stat.value)}</div>
							</div>
							<div className="flex flex-row justify-between text-lg">
								<div className="font-medium">Equifax: </div>
								<div>{pipe(get("equifax"))(stat.value)}</div>
							</div>
							<div className="flex flex-row justify-between text-lg">
								<div className="font-medium">Transunion: </div>
								<div>{pipe(get("transunion"))(stat.value)}</div>
							</div>
						</div>
					)}

					{stat.id === "businesscredit" && (
						<div className="w-full flex flex-col text-3xl text-gray-900 gap-y-3">
							<div className="flex flex-row justify-between text-lg">
								<div className="font-medium">Experian: </div>
								<div>{pipe(get("experian"))(stat.value)}</div>
							</div>
							<div className="flex flex-row justify-between text-lg">
								<div className="font-medium">D&B: </div>
								<div>{pipe(get("dnb"))(stat.value)}</div>
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

const FinancialHealthEvaluationHeading = () => {
	return (
		<div className="flex flex-col">
			<h3 className="text-base font-semibold leading-6 text-gray-900">Financial Health Evaluation</h3>
			<p className="mt-1 text-sm text-gray-500">
				The 6 key data points lenders may review in their evaluation of your business:
			</p>
		</div>
	);
};

const BankAccount = () => {
	let {
		financials: {
			bank_accounts: { accounts = [] },
		},
	} = useLoaderData();

	return (
		<div className="flex flex-col w-full bg-white rounded">
			<div className="flex flex-row justify-between items-center px-5 pt-5 text-base font-semibold leading-6 text-gray-900">
				<div>Bank Account</div>
				<div className="cursor-pointer">
					<Cog6ToothIcon className="h-5 w-5 text-gray-500" />
				</div>
			</div>
			<div className="flex flex-col w-full border-t mt-3">
				{pipe(
					map((account) => (
						<div className="flex flex-col px-5 py-3 gap-y-1" key={account.account}>
							<div className="flex flex-row justify-between">
								<div className="flex flex-row gap-x-2">
									<div className="flex flex-col font-semibold">{account?.name}</div>
									<div>({account?.mask})</div>
								</div>
								<div className="flex flex-col font-semibold">
									{currency.format(account?.balance || 0)}
								</div>
							</div>
							<div className="flex flex-row justify-between text-sm">
								<div className="flex flex-row gap-x-2">
									<div className="flex flex-col">{account?.official_name}</div>
								</div>
								<div className="flex flex-col">balance</div>
							</div>
						</div>
					))
				)(accounts)}
			</div>
		</div>
	);
};

export default function Cashflow() {
	let { financials = {} } = useLoaderData();
	let set_financials = useCashflowStore((state) => state.set_state);

	useEffect(() => {
		set_financials(["financials"], financials);
	}, []);

	return (
		<div className="flex flex-row h-full w-full space-x-5">
			<div className="flex flex-col h-full w-full lg:w-[70%] rounded  gap-y-5 overflow-y-scroll scrollbar-none overflow-x-hidden">
				<BankAccount />
				<div className="flex flex-col w-full max-h-[600px] bg-white rounded">
					<CashflowChart />
				</div>
				<div className="table lg:flex flex-col lg:flex-row w-full h-full space-y-5 lg:space-y-0 lg:space-x-5">
					<div className="flex flex-col w-full lg:w-1/2 h-full bg-white rounded">
						<RevenueChart />
					</div>
					<div className="flex flex-col w-full lg:w-1/2 h-full bg-white rounded">
						<ExpensesChart />
					</div>
				</div>
				<div className="lg:flex flex-col w-full h-full bg-white rounded">
					<div className="flex flex-col py-4 px-5">
						<FinancialHealthEvaluationHeading />
					</div>
					<div className="flex flex-col w-full border-t"></div>
					<div className="flex flex-col w-full p-3">
						<div className="flex flex-col w-full rounded-lg">
							<Stats />
						</div>
					</div>
				</div>
			</div>
			<div className="hidden lg:flex flex-col lg:w-[30%] rounded border">
				<div className="flex flex-col w-full h-full rounded bg-white">
					<div className="flex flex-row py-4 px-5 justify-between w-full items-center">
						<div>Recent transactions</div>
						<div className="text-blue-500 text-sm cursor-pointer">See all</div>
					</div>
					<div className="flex flex-col w-full border-t"></div>
					<div className="flex flex-col p-5 overflow-scroll scrollbar-none">
						<ActivityFeed />
					</div>
				</div>
			</div>
		</div>
	);
}
