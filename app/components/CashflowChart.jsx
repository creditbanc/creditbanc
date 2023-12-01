import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import { classNames, currency, use_client_search_params } from "~/utils/helpers";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import "chart.js/auto";
import { pipe, values, sum, mapObjIndexed, join, isEmpty } from "ramda";
import { mod } from "shades";
import { Link, useLocation } from "@remix-run/react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
				backgroundColor: "rgb(86, 207, 158)",
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

const IncomeStats = ({ loader = {} }) => {
	let financials = loader.data || {};
	let { highest_income = 0, incomes_change = 0, average_income = 0 } = financials;

	let income_stats_data = [highest_income, incomes_change, average_income];

	return (
		<div className="flex flex-row lg:flex-col w-full justify-between bg-white lg:divide-y rounded px-5 lg:px-0 gap-x-5 mb-5">
			{income_stats_data.map((item, index) => (
				<div
					key={index}
					className="py-5 px-3 border rounded w-[50%] flex flex-col items-center lg:border-none lg:w-full gap-y-3"
				>
					<div className="text-sm font-normal text-gray-900 self-start border-b pb-3 w-full">{item.name}</div>
					<div className="mt-1 flex flex-row justify-between w-full">
						<div className="flex flex-col items-baseline text-xl font-semibold text-[#56cf9e]">
							{item.stat}
							{item?.previousStat && (
								<span className="ml-2 text-sm font-medium text-gray-500 w-full">
									from {item.previousStat}
								</span>
							)}
						</div>

						{/* <div
							className={classNames(
								item.changeType === "increase"
									? "bg-green-100 text-green-800"
									: "bg-red-100 text-red-800",
								"flex flex-row overflow-hidden h-[25px] items-center rounded-full px-2.5 py-0.5 text-xs font-medium md:mt-2 lg:mt-0"
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

export default function CashflowChart({ loader = {} }) {
	let { search, pathname } = useLocation();
	let financials = loader.data || {};

	let { monthly_expenses = [], monthly_revenues = [], monthly_incomes = [], month_labels = [] } = financials;

	let net_income = sum(monthly_incomes);

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
			<div className="px-5 pt-5 text-base font-semibold leading-6 text-gray-900">Cashflow</div>
			<div className="flex flex-col w-full border-t my-3"></div>
			<div className="px-3">
				<div className="flex flex-row w-full">
					<div className="flex flex-row justify-between w-[30%]">
						<div className="flex flex-col mb-3 space-y-2 my-2">
							<div className="text-gray-700">Net income</div>
							<div className="text-4xl">{currency.format(net_income)}</div>
						</div>
					</div>
					<div className="flex flex-col flex-1 justify-start">
						<div className="flex flex-row justify-center gap-x-5 py-6 text-sm">
							<Link
								className={`flex flex-col  px-3 rounded-full cursor-pointer ${
									income == 1 ? "bg-[#56cf9e] text-white" : "hover:bg-gray-100 text-gray-600"
								}`}
								to={use_chart_date_link("income", 1)}
							>
								30D
							</Link>
							<Link
								className={`flex flex-col  px-3 rounded-full cursor-pointer ${
									income == 3 ? "bg-[#56cf9e] text-white" : "hover:bg-gray-100 text-gray-600"
								}`}
								to={use_chart_date_link("income", 3)}
							>
								3M
							</Link>
							<Link
								className={`flex flex-col  px-3 rounded-full cursor-pointer ${
									income == 6 ? "bg-[#56cf9e] text-white" : "hover:bg-gray-100 text-gray-600"
								}`}
								to={use_chart_date_link("income", 6)}
							>
								6M
							</Link>
							<Link
								className={`flex flex-col  px-3 rounded-full cursor-pointer ${
									income == 12 ? "bg-[#56cf9e] text-white" : "hover:bg-gray-100 text-gray-600"
								}`}
								to={use_chart_date_link("income", 12)}
							>
								12M
							</Link>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col-reverse lg:flex-row w-full overflow-hidden">
				<div className="lg:flex lg:flex-col w-full lg:w-[30%]">
					<div className="flex flex-col h-full justify-center">
						<div className="pb-3 px-5 lg:px-3">
							<h3 className="text-base font-semibold leading-6 text-gray-900">How you’re doing</h3>
						</div>
						<IncomeStats loader={loader} />
					</div>
				</div>
				<div className="flex flex-col lg:flex-1 h-[350px] p-3 overflow-hidden">
					<Bar
						options={options}
						data={income_chart_data(month_labels, monthly_revenues, monthly_expenses, monthly_incomes)}
					/>
				</div>
			</div>
		</div>
	);
}
