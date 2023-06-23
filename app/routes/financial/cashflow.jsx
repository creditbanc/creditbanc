import { Fragment, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import {
	FaceFrownIcon,
	FaceSmileIcon,
	FireIcon,
	HandThumbUpIcon,
	HeartIcon,
	PaperClipIcon,
	XMarkIcon,
	ArrowDownIcon,
	ArrowUpIcon,
} from "@heroicons/react/20/solid";
import { Listbox, Transition } from "@headlessui/react";
import { classNames, currency } from "~/utils/helpers";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import "chart.js/auto";
import {
	ArrowDownCircleIcon,
	ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const activity = [
	{
		id: 1,
		merchant_name: "Starbucks",
		date: "03-16-2023",
		amount: "59.00",
		type: "expense",
	},
	{
		id: 2,
		merchant_name: "Chase",
		amount: "1000",
		date: "02-20-2022",
		type: "revenue",
	},
	{
		id: 1,
		merchant_name: "Starbucks",
		date: "03-16-2023",
		amount: "59.00",
		type: "expense",
	},
	{
		id: 2,
		merchant_name: "Chase",
		amount: "1000",
		date: "02-20-2022",
		type: "revenue",
	},
	{
		id: 1,
		merchant_name: "Starbucks",
		date: "03-16-2023",
		amount: "59.00",
		type: "expense",
	},
	{
		id: 1,
		merchant_name: "Starbucks",
		date: "03-16-2023",
		amount: "59.00",
		type: "expense",
	},
	{
		id: 1,
		merchant_name: "Starbucks",
		date: "03-16-2023",
		amount: "59.00",
		type: "expense",
	},
	{
		id: 2,
		merchant_name: "Chase",
		amount: "1000",
		date: "02-20-2022",
		type: "revenue",
	},
	{
		id: 1,
		merchant_name: "Starbucks",
		date: "03-16-2023",
		amount: "59.00",
		type: "expense",
	},
	{
		id: 2,
		merchant_name: "Chase",
		amount: "1000",
		date: "02-20-2022",
		type: "revenue",
	},
	{
		id: 1,
		merchant_name: "Starbucks",
		date: "03-16-2023",
		amount: "59.00",
		type: "expense",
	},
	{
		id: 1,
		merchant_name: "Starbucks",
		date: "03-16-2023",
		amount: "59.00",
		type: "expense",
	},
];

const ActivityFeed = () => {
	return (
		<>
			<ul role="list" className="space-y-3 scrollbar-none">
				{activity.map((activityItem, activityItemIdx) => (
					<li key={activityItem.id} className="relative flex gap-x-4">
						<div
							className={classNames(
								activityItemIdx === activity.length - 1
									? "h-6"
									: "-bottom-6",
								"absolute left-0 top-0 flex w-6 justify-center"
							)}
						>
							<div className="w-px bg-gray-200" />
						</div>

						<>
							<div
								className={`rounded-full h-8 w-8 flex flex-col items-center justify-center z-10 -ml-1 ${
									activityItem.type == "expense"
										? "bg-gray-100"
										: "bg-blue-100"
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
										<div className="font-medium">
											{activityItem.merchant_name}
										</div>
										<div className="text-gray-400">
											{activityItem.date}
										</div>
									</div>
									<div className="flex flex-col items-end space-y-2 ">
										<div
											className={`flex flex-row justify-center items-center text-[14px] font-light space-x-1  ${
												activityItem.type == "expense"
													? "text-gray-600 bg-gray-100 px-3 py-1 rounded"
													: "text-blue-600 bg-blue-100 px-3 py-1 rounded"
											}`}
										>
											{activityItem.type ===
												"expense" && <div>-</div>}
											{activityItem.type ===
												"revenue" && <div>+</div>}
											<div>
												{currency.format(
													activityItem.amount
												)}
											</div>
										</div>
										<div className="text-gray-400">
											$45,000
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

export const revenue_data = {
	labels,
	datasets: [
		{
			label: "Dataset 1",
			data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
			backgroundColor: "rgb(13,98,254)",
			// stack: "Stack 0",
			barThickness: 30,
		},
		// {
		// 	label: "Dataset 2",
		// 	data: labels.map(() =>
		// 		faker.datatype.number({ min: -1000, max: 0 })
		// 	),
		// 	backgroundColor: "rgb(234,238,241)",
		// 	stack: "Stack 0",
		// 	barThickness: 30,
		// },
	],
};

export const expenses_data = {
	labels,
	datasets: [
		// {
		// 	label: "Dataset 1",
		// 	data: labels.map(() =>
		// 		faker.datatype.number({ min: 0, max: 1000 })
		// 	),
		// 	backgroundColor: "rgb(13,98,254)",
		// 	stack: "Stack 0",
		// 	barThickness: 30,
		// },
		{
			label: "Dataset 2",
			data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
			backgroundColor: "rgb(234,238,241)",
			// stack: "Stack 0",
			barThickness: 30,
		},
	],
};

const CashflowChart = () => {
	return (
		<div className="flex flex-col w-full h-full">
			<div className="px-5 pt-5 text-base font-semibold leading-6 text-gray-900">
				Cashflow
			</div>
			<div className="flex flex-col w-full border-t my-3"></div>
			<div className="px-3">
				<div className="flex flex-row w-full">
					<div className="flex flex-row justify-between w-[30%]">
						<div className="flex flex-col mb-7 space-y-2 my-2">
							<div className="text-gray-700">
								Net income in June
							</div>
							<div className="text-4xl">
								{currency.format(5144707.08)}
							</div>
						</div>
					</div>
					<div className="flex flex-col flex-1 justify-end">
						<div className="flex flex-row justify-center gap-x-5 py-6 text-sm">
							<div className="flex flex-col hover:bg-gray-100 text-gray-600 px-3 rounded-full cursor-pointer">
								30D
							</div>
							<div className="flex flex-col hover:bg-gray-100 text-gray-600 px-3 rounded-full cursor-pointer">
								3M
							</div>
							<div className="flex flex-col hover:bg-gray-100 text-gray-600 px-3 rounded-full cursor-pointer">
								6M
							</div>
							<div className="flex flex-col bg-blue-600 text-white px-3 rounded-full cursor-pointer">
								12M
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-row w-full">
				<div className="flex flex-col w-[30%]">
					<div className="pb-3 px-3">
						<h3 className="text-base font-semibold leading-6 text-gray-900">
							How you’re doing in June
						</h3>
					</div>
					<IncomeStats />
				</div>
				<div className="flex flex-col flex-1 h-[350px] p-3 overflow-hidden">
					<Bar options={options} data={data} />
				</div>
			</div>
		</div>
	);
};

const stats_data = {
	expenses: [
		{
			name: "Month over month spending change",
			stat: "71,897",
			previousStat: "70,946",
			change: "12%",
			changeType: "increase",
		},
		{
			name: "Highest spending in last 6 months",
			stat: "58.16%",
			previousStat: "56.14%",
			change: "2.02%",
			changeType: "increase",
		},
	],
	revenue: [
		{
			name: "Month over month revenue change",
			stat: "71,897",
			previousStat: "70,946",
			change: "12%",
			changeType: "increase",
		},
		{
			name: "Highest revenue in last 6 months",
			stat: "58.16%",
			previousStat: "56.14%",
			change: "2.02%",
			changeType: "increase",
		},
	],
};

const income_stats_data = [
	{
		name: "Projected monthly net income",
		stat: "71,897",
		previousStat: "70,946",
		change: "12%",
		changeType: "increase",
	},
	{
		name: "Month over month net income change",
		stat: "58.16%",
		previousStat: "56.14%",
		change: "2.02%",
		changeType: "increase",
	},
	{
		name: "Highest net income in last 6 months",
		stat: "58.16%",
		previousStat: "56.14%",
		change: "2.02%",
		changeType: "increase",
	},
];

const IncomeStats = () => {
	return (
		<div className="bg-white divide-y rounded">
			{income_stats_data.map((item) => (
				<div key={item.name} className="py-5 px-3">
					<div className="text-sm font-normal text-gray-900">
						{item.name}
					</div>
					<div className="mt-1 flex items-baseline justify-between md:block lg:flex">
						<div className="flex items-baseline text-xl font-semibold text-blue-600">
							{item.stat}
							<span className="ml-2 text-sm font-medium text-gray-500">
								from {item.previousStat}
							</span>
						</div>

						<div
							className={classNames(
								item.changeType === "increase"
									? "bg-green-100 text-green-800"
									: "bg-red-100 text-red-800",
								"inline-flex items-baseline rounded-full px-2.5 py-0.5 text-xs font-medium md:mt-2 lg:mt-0"
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
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

const HealthStats = ({ type = "revenue" }) => {
	let stats = stats_data[type];
	return (
		<div className="bg-white divide-y rounded">
			{stats.map((item) => (
				<div key={item.name} className="px-4 py-3 sm:p-6">
					<div className="text-sm font-normal text-gray-900">
						{item.name}
					</div>
					<div className="mt-1 flex items-baseline justify-between md:block lg:flex">
						<div className="flex items-baseline text-xl font-semibold text-blue-600">
							{item.stat}
							<span className="ml-2 text-sm font-medium text-gray-500">
								from {item.previousStat}
							</span>
						</div>

						<div
							className={classNames(
								item.changeType === "increase"
									? "bg-green-100 text-green-800"
									: "bg-red-100 text-red-800",
								"inline-flex items-baseline rounded-full px-2.5 py-0.5 text-xs font-medium md:mt-2 lg:mt-0"
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
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

const RevenueChart = () => {
	return (
		<div className="flex flex-col w-full h-full">
			<div className="px-5 pt-5 text-base font-semibold leading-6 text-gray-900">
				Revenue
			</div>
			<div className="flex flex-col w-full border-t my-3"></div>

			<div className="flex flex-row justify-between px-5">
				<div className="flex flex-col mb-3 space-y-2 my-2">
					<div className="text-gray-700">Total revenue in June</div>
					<div className="text-3xl">
						{currency.format(5144707.08)}
					</div>
				</div>
			</div>

			<div className="flex flex-col w-full h-[250px] p-3 overflow-hidden">
				<Bar options={options} data={revenue_data} />
			</div>

			<div className="flex flex-row justify-center gap-x-5 py-6 text-sm">
				<div className="flex flex-col hover:bg-gray-100 text-gray-600 px-3 rounded-full cursor-pointer">
					30D
				</div>
				<div className="flex flex-col hover:bg-gray-100 text-gray-600 px-3 rounded-full cursor-pointer">
					3M
				</div>
				<div className="flex flex-col hover:bg-gray-100 text-gray-600 px-3 rounded-full cursor-pointer">
					6M
				</div>
				<div className="flex flex-col bg-blue-600 text-white px-3 rounded-full cursor-pointer">
					12M
				</div>
			</div>

			<div>
				<div className="border-b border-gray-200 pb-3 px-5">
					<h3 className="text-base font-semibold leading-6 text-gray-900">
						How you’re doing in June
					</h3>
				</div>
				<HealthStats type={"revenue"} />
			</div>
		</div>
	);
};

const ExpensesChart = () => {
	return (
		<div className="flex flex-col w-full h-full">
			<div className="px-5 pt-5 text-base font-semibold leading-6 text-gray-900">
				Expenses
			</div>
			<div className="flex flex-col w-full border-t my-3"></div>

			<div className="flex flex-row justify-between px-5">
				<div className="flex flex-col mb-3 space-y-2 my-2">
					<div className="text-gray-700">Total spending in June</div>
					<div className="text-3xl">
						{currency.format(5144707.08)}
					</div>
				</div>
			</div>

			<div className="flex flex-col w-full h-[250px] p-3 overflow-hidden">
				<Bar options={options} data={expenses_data} />
			</div>

			<div className="flex flex-row justify-center gap-x-5 py-6 text-sm">
				<div className="flex flex-col hover:bg-gray-100 text-gray-600 px-3 rounded-full cursor-pointer">
					30D
				</div>
				<div className="flex flex-col hover:bg-gray-100 text-gray-600 px-3 rounded-full cursor-pointer">
					3M
				</div>
				<div className="flex flex-col hover:bg-gray-100 text-gray-600 px-3 rounded-full cursor-pointer">
					6M
				</div>
				<div className="flex flex-col bg-blue-600 text-white px-3 rounded-full cursor-pointer">
					12M
				</div>
			</div>

			<div>
				<div className="border-b border-gray-200 pb-3 px-5">
					<h3 className="text-base font-semibold leading-6 text-gray-900">
						How you’re doing in June
					</h3>
				</div>
				<HealthStats type={"expenses"} />
			</div>
		</div>
	);
};

const stats = [
	{
		name: "Lender-recognized annual revenue",
		value: "$2,198,805.00",
		change: "+4.75%",
		changeType: "positive",
	},
	{
		name: "Average daily balance",
		value: "$12,787.00",
		change: "+54.02%",
		changeType: "negative",
	},
	{
		name: "Number of negative balance days",
		value: "0",
		change: "-1.39%",
		changeType: "positive",
	},
	{
		name: "Personal credit utilization percentage",
		value: "3%",
		change: "+10.18%",
		changeType: "negative",
	},
	{
		name: "Time in business",
		value: "7 years",
		change: "-1.39%",
		changeType: "positive",
	},
	{
		name: "Personal credit",
		value: "780",
		change: "+10.18%",
		changeType: "negative",
	},
];

const Stats = () => {
	return (
		<div className="flex flex-wrap w-full rounded-lg gap-x-3 gap-y-3 justify-between">
			{stats.map((stat) => (
				<div
					key={stat.name}
					className="flex flex-col w-full md:w-[48%] lg:w-[32%] justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 border rounded-lg"
				>
					<div className="text-sm font-medium leading-6 text-gray-500">
						{stat.name}
					</div>
					<div
						className={classNames(
							stat.changeType === "negative"
								? "text-rose-600"
								: "text-gray-700",
							"text-xs font-medium"
						)}
					>
						{stat.change}
					</div>
					<div className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
						{stat.value}
					</div>
				</div>
			))}
		</div>
	);
};

const FinancialHealthEvaluationHeading = () => {
	return (
		<div className="flex flex-col">
			<h3 className="text-base font-semibold leading-6 text-gray-900">
				Financial Health Evaluation
			</h3>
			<p className="mt-1 text-sm text-gray-500">
				The 6 key data points lenders may review in their evaluation of
				your business:
			</p>
		</div>
	);
};

export default function Cashflow() {
	return (
		<div className="flex flex-col w-full h-full overflow-hidden">
			<div className="flex flex-row h-full w-full p-5 space-x-5 ">
				<div className="flex flex-col h-full w-[70%] rounded  gap-y-5 overflow-scroll scrollbar-none">
					<div className="flex flex-col w-full max-h-[600px] bg-white rounded">
						<CashflowChart />
					</div>
					<div className="flex flex-row w-full gap-x-5 h-full">
						<div className="flex flex-col w-1/2 bg-white h-full rounded">
							<RevenueChart />
						</div>
						<div className="flex flex-col w-1/2 bg-white h-full rounded">
							<ExpensesChart />
						</div>
					</div>
					<div className="flex flex-col w-full bg-white rounded ">
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
				<div className="flex flex-col w-[30%] rounded border">
					<div className="flex flex-col w-full h-full rounded bg-white">
						<div className="flex flex-row py-4 px-5 justify-between w-full items-center">
							<div>Recent transactions</div>
							<div className="text-blue-500 text-sm cursor-pointer">
								See all
							</div>
						</div>
						<div className="flex flex-col w-full border-t"></div>
						<div className="flex flex-col p-5 overflow-scroll scrollbar-none">
							<ActivityFeed />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
