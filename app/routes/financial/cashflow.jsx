import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";

import {
	classNames,
	currency,
	inspect,
	jsreduce,
	use_client_search_params,
	use_search_params,
} from "~/utils/helpers";
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
import { get_collection, get_doc, set_doc } from "~/utils/firebase";
import {
	defaultTo,
	head,
	identity,
	not,
	pipe,
	curry,
	map,
	last,
	pick,
	values,
	sum,
	flatten,
	zip,
	multiply,
	mapObjIndexed,
	join,
	sortBy,
	reverse,
	take,
} from "ramda";
import { all, filter, get, mod, reduce } from "shades";
import { redirect } from "@remix-run/node";
import {
	concatMap,
	flatMap,
	from,
	mergeMap,
	of,
	filter as rxfilter,
	switchMap,
	toArray,
	map as rxmap,
	lastValueFrom,
	withLatestFrom,
} from "rxjs";
import moment from "moment";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { get_balances } from "~/api/plaid.server";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const get_permissions = async (entity_id, group_id) => {
	// check if entity is the owner/creator of the resource

	// if entity is not the owner get the config_id of the role
	let role_response = await get_collection({
		path: ["roles"],
		queries: [
			{ param: "entity_id", predicate: "==", value: entity_id },
			{ param: "group_id", predicate: "==", value: group_id },
		],
	});

	let role = pipe(head, defaultTo({}))(role_response);

	if (role.config_id) {
		let config_response = await get_doc(["role_configs", role.config_id]);

		return config_response;
	}

	// if there is no role config id then get the default config for the group
};

const validate_permission = (permission_id, action, permissions) => {
	let has_permission = pipe(
		filter({ id: permission_id }),
		head,
		get(action)
	)(permissions);

	return has_permission;
};

export const loader = async ({ request }) => {
	console.log("cashflow_loader");
	let { income: income_start_month = 12 } = use_search_params(request);

	const config_id = "db88508c-b4ea-4dee-8d60-43c5a847c172";
	let group_id = "1";
	let entity_id = "1";
	let role_id = group_id + entity_id;

	let test_role = {
		entity_id,
		group_id,
		config_id,
		role_id,
	};

	// set_doc(["roles", role_id], test_role);

	// let role = await get_permissions(entity_id, group_id);

	// console.log("role");
	// console.log(role);

	// let { permissions } = role;

	// console.log("permissions");
	// console.log(permissions);

	// let has_permission = validate_permission("cashflow", "read", permissions);

	// console.log("has_permission");
	// console.log(has_permission);

	// if (!has_permission) {
	// 	return redirect("/");
	// }

	// if (has_permission) {
	// 	return null;
	// }

	let balances = await get_balances();

	let account_balance = pipe(head, get("balances", "available"))(balances);

	// console.log("account_balance");
	// console.log(account_balance);

	let transactions = await get_collection({ path: ["transactions"] });

	const is_expense = (transaction) => {
		return transaction.amount >= 0;
	};

	const is_revenue = pipe(is_expense, not);

	const with_transaction_type = (transaction) => {
		return {
			...transaction,
			type: is_expense(transaction) ? "expense" : "revenue",
		};
	};

	let $transactions = of(transactions);

	// let plaid_num_inverse = (num) => {
	// 	return num * -1;
	// };

	let $recent_activity = $transactions.pipe(
		concatMap(identity),
		rxmap(pipe(pick(["name", "date", "amount"]), with_transaction_type)),
		toArray(),
		rxmap(
			pipe(
				sortBy(get("date")),
				reverse,
				take(20),
				jsreduce((curr, next, index) => {
					if (index === 1) {
						curr.balance = account_balance;
						next.balance = curr.balance + curr.amount;

						let payload = [curr, next];

						return payload;
					}

					let last_transaction = last(curr);

					next.balance =
						last_transaction.balance + last_transaction.amount;

					let payload = [...curr, next];

					return payload;
				})
			)
		)
	);

	let $expenses = (transactions) =>
		of(transactions).pipe(
			concatMap(identity),
			rxfilter(is_expense),
			toArray()
		);

	let $revenues = (transactions) =>
		of(transactions).pipe(
			concatMap(identity),
			rxfilter(is_revenue),
			toArray()
		);

	let transactions_by_date = curry((start_date, end_date, transactions) => {
		return pipe(
			filter({ date: (date) => date > start_date && date < end_date })
		)(transactions);
	});

	let transactions_by_month = curry((year, month, transactions) => {
		let days_in_month = moment(`${moment().year()}-${month}`).daysInMonth();

		return pipe(
			filter({
				date: (date) =>
					date > moment(`${year}-${month}-1`).format("YYYY-MM-DD") &&
					date <
						moment(`${year}-${month}-${days_in_month}`).format(
							"YYYY-MM-DD"
						),
			})
		)(transactions);
	});

	let start_date = moment()
		.subtract(income_start_month, "months")
		.format("YYYY-MM-DD");

	let end_date = moment().format("YYYY-MM-DD");

	let num_of_months = (end_date, start_date) => {
		let months = moment(end_date).diff(moment(start_date), "months", true);
		return months % 1 == 0 ? months : Math.floor(months) + 1;
	};

	let start_date_of_months = (start_date, end_date) => {
		let months = [];
		start_date = moment(start_date);
		end_date = moment(end_date);

		while (start_date < end_date) {
			months = [
				...months,
				start_date.startOf("month").format("YYYY-MM-DD"),
			];

			start_date.add(1, "month");
		}

		return months;
	};

	let $monthly_transactions = $transactions
		.pipe(rxmap(transactions_by_date(start_date, end_date)))
		.pipe(
			concatMap((transactions) =>
				of(
					pipe(
						map((date) =>
							transactions_by_month(
								moment(date).year(),
								moment(date).month() + 1,
								transactions
							)
						)
					)(start_date_of_months(start_date, end_date))
				)
			)
		);

	let $monthly_revenues = $monthly_transactions.pipe(
		concatMap(identity),
		concatMap($revenues),
		rxmap(pipe(mod(all)(pick(["amount"])))),
		rxmap(pipe(map(values), flatten, sum, Math.abs)),
		toArray()
	);

	let $monthly_expenses = $monthly_transactions.pipe(
		concatMap(identity),
		concatMap($expenses),
		rxmap(pipe(mod(all)(pick(["amount"])))),
		rxmap(pipe(map(values), flatten, sum, multiply(-1))),
		toArray()
	);

	let $monthly_incomes = from($monthly_revenues).pipe(
		withLatestFrom($monthly_expenses),
		rxmap((transactions) =>
			pipe(
				zip,
				map(([revenues, expenses]) => revenues + expenses)
			)(...transactions)
		)
	);

	let monthly_expenses = await lastValueFrom($monthly_expenses);
	let monthly_revenues = await lastValueFrom($monthly_revenues);
	let monthly_incomes = await lastValueFrom($monthly_incomes);
	let recent_activity = await lastValueFrom($recent_activity);

	let payload = {
		recent_activity,
		monthly_expenses,
		monthly_revenues,
		monthly_incomes,
		month_labels: pipe(map((date) => moment(date).format("MMM")))(
			start_date_of_months(start_date, end_date)
		),
	};

	// console.log("payload");
	// console.log(payload);

	return payload;
};

const ActivityFeed = () => {
	let { recent_activity = [] } = useLoaderData();

	return (
		<>
			<ul role="list" className="space-y-3 scrollbar-none">
				{recent_activity.map((activityItem, activityItemIdx) => (
					<li key={activityItemIdx} className="relative flex gap-x-4">
						<div
							className={classNames(
								activityItemIdx === recent_activity.length - 1
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
											{activityItem.name}
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
													Math.abs(
														activityItem.amount
													)
												)}
											</div>
										</div>
										<div className="text-gray-400">
											{Number(
												activityItem.balance
											).toLocaleString("en-US", {
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

const CashflowChart = () => {
	let { monthly_expenses, monthly_revenues, monthly_incomes, month_labels } =
		useLoaderData();
	let { search, pathname } = useLocation();

	let net_income = sum(monthly_incomes);

	let {
		income = 12,
		expenses = 12,
		revenues = 12,
	} = use_client_search_params(search);

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
			<div className="px-5 pt-5 text-base font-semibold leading-6 text-gray-900">
				Cashflow
			</div>
			<div className="flex flex-col w-full border-t my-3"></div>
			<div className="px-3">
				<div className="flex flex-row w-full">
					<div className="flex flex-row justify-between w-[30%]">
						<div className="flex flex-col mb-7 space-y-2 my-2">
							<div className="text-gray-700">Net income</div>
							<div className="text-4xl">
								{currency.format(net_income)}
							</div>
						</div>
					</div>
					<div className="flex flex-col flex-1 justify-end">
						<div className="flex flex-row justify-center gap-x-5 py-6 text-sm">
							<Link
								className={`flex flex-col  px-3 rounded-full cursor-pointer ${
									income == 1
										? "bg-blue-600 text-white"
										: "hover:bg-gray-100 text-gray-600"
								}`}
								to={use_chart_date_link("income", 1)}
							>
								30D
							</Link>
							<Link
								className={`flex flex-col  px-3 rounded-full cursor-pointer ${
									income == 3
										? "bg-blue-600 text-white"
										: "hover:bg-gray-100 text-gray-600"
								}`}
								to={use_chart_date_link("income", 3)}
							>
								3M
							</Link>
							<Link
								className={`flex flex-col  px-3 rounded-full cursor-pointer ${
									income == 6
										? "bg-blue-600 text-white"
										: "hover:bg-gray-100 text-gray-600"
								}`}
								to={use_chart_date_link("income", 6)}
							>
								6M
							</Link>
							<Link
								className={`flex flex-col  px-3 rounded-full cursor-pointer ${
									income == 12
										? "bg-blue-600 text-white"
										: "hover:bg-gray-100 text-gray-600"
								}`}
								to={use_chart_date_link("income", 12)}
							>
								12M
							</Link>
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
					<Bar
						options={options}
						data={income_chart_data(
							month_labels,
							monthly_revenues,
							monthly_expenses,
							monthly_incomes
						)}
					/>
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
	let { monthly_revenues, month_labels } = useLoaderData();
	let { search, pathname } = useLocation();

	let total_revenue = sum(monthly_revenues);

	let {
		income = 12,
		expenses = 12,
		revenues = 12,
	} = use_client_search_params(search);

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
			<div className="px-5 pt-5 text-base font-semibold leading-6 text-gray-900">
				Revenue
			</div>
			<div className="flex flex-col w-full border-t my-3"></div>

			<div className="flex flex-row justify-between px-5">
				<div className="flex flex-col mb-3 space-y-2 my-2">
					<div className="text-gray-700">Total revenue</div>
					<div className="text-3xl">
						{currency.format(total_revenue)}
					</div>
				</div>
			</div>

			<div className="flex flex-col w-full h-[250px] p-3 overflow-hidden">
				<Bar
					options={options}
					data={revenue_data(month_labels, monthly_revenues)}
				/>
			</div>

			<div className="flex flex-row justify-center gap-x-5 py-6 text-sm">
				<Link
					className={`flex flex-col  px-3 rounded-full cursor-pointer ${
						income == 1
							? "bg-blue-600 text-white"
							: "hover:bg-gray-100 text-gray-600"
					}`}
					to={use_chart_date_link("income", 1)}
				>
					30D
				</Link>
				<Link
					className={`flex flex-col  px-3 rounded-full cursor-pointer ${
						income == 3
							? "bg-blue-600 text-white"
							: "hover:bg-gray-100 text-gray-600"
					}`}
					to={use_chart_date_link("income", 3)}
				>
					3M
				</Link>
				<Link
					className={`flex flex-col  px-3 rounded-full cursor-pointer ${
						income == 6
							? "bg-blue-600 text-white"
							: "hover:bg-gray-100 text-gray-600"
					}`}
					to={use_chart_date_link("income", 6)}
				>
					6M
				</Link>
				<Link
					className={`flex flex-col  px-3 rounded-full cursor-pointer ${
						income == 12
							? "bg-blue-600 text-white"
							: "hover:bg-gray-100 text-gray-600"
					}`}
					to={use_chart_date_link("income", 12)}
				>
					12M
				</Link>
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
	let { monthly_expenses, month_labels } = useLoaderData();
	let { search, pathname } = useLocation();

	let total_expenses = sum(monthly_expenses);

	let {
		income = 12,
		expenses = 12,
		revenues = 12,
	} = use_client_search_params(search);

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
			<div className="px-5 pt-5 text-base font-semibold leading-6 text-gray-900">
				Expenses
			</div>
			<div className="flex flex-col w-full border-t my-3"></div>

			<div className="flex flex-row justify-between px-5">
				<div className="flex flex-col mb-3 space-y-2 my-2">
					<div className="text-gray-700">Total spending</div>
					<div className="text-3xl">
						{currency.format(total_expenses)}
					</div>
				</div>
			</div>

			<div className="flex flex-col w-full h-[250px] p-3 overflow-hidden">
				<Bar
					options={options}
					data={expenses_data(month_labels, monthly_expenses)}
				/>
			</div>

			<div className="flex flex-row justify-center gap-x-5 py-6 text-sm">
				<Link
					className={`flex flex-col  px-3 rounded-full cursor-pointer ${
						income == 1
							? "bg-blue-600 text-white"
							: "hover:bg-gray-100 text-gray-600"
					}`}
					to={use_chart_date_link("income", 1)}
				>
					30D
				</Link>
				<Link
					className={`flex flex-col  px-3 rounded-full cursor-pointer ${
						income == 3
							? "bg-blue-600 text-white"
							: "hover:bg-gray-100 text-gray-600"
					}`}
					to={use_chart_date_link("income", 3)}
				>
					3M
				</Link>
				<Link
					className={`flex flex-col  px-3 rounded-full cursor-pointer ${
						income == 6
							? "bg-blue-600 text-white"
							: "hover:bg-gray-100 text-gray-600"
					}`}
					to={use_chart_date_link("income", 6)}
				>
					6M
				</Link>
				<Link
					className={`flex flex-col  px-3 rounded-full cursor-pointer ${
						income == 12
							? "bg-blue-600 text-white"
							: "hover:bg-gray-100 text-gray-600"
					}`}
					to={use_chart_date_link("income", 12)}
				>
					12M
				</Link>
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
				<div className="flex flex-col h-full w-[70%] rounded  gap-y-5 overflow-y-scroll scrollbar-none">
					<div className="flex flex-col w-full max-h-[600px] bg-white rounded">
						<CashflowChart />
					</div>
					<div className="flex flex-row w-full h-full">
						<div className="flex flex-col w-1/2 h-full ">
							<div className="mr-[10px] bg-white rounded">
								<RevenueChart />
							</div>
						</div>
						<div className="flex flex-col w-1/2 h-full rounded">
							<div className="ml-[10px] bg-white rounded">
								<ExpensesChart />
							</div>
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