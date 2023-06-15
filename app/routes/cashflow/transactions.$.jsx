import { useLoaderData } from "@remix-run/react";
import { pipe, map, head, sortBy, prop, reverse, curry, last } from "ramda";
import { get_collection } from "~/utils/firebase";
import {
	inspect,
	truncate,
	currency,
	mapIndexed,
	sample,
} from "~/utils/helpers";
import { create } from "zustand";
import { filter, get, mod } from "shades";
import moment from "moment";

const useTransactionsStore = create((set) => ({
	transaction: null,
	set_state: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

let total_for_period = curry((start_date, end_date, transactions) => {
	let filtered_transactions = pipe(
		filter(({ date }) => date >= start_date && date <= end_date)
	)(transactions);

	let income = 0;
	let expense = 0;

	filtered_transactions.forEach(({ amount }) => {
		if (amount > 0) {
			income += amount;
		} else {
			expense += amount;
		}
	});

	return { income, expense };
});

let date_x_time_ago = (time_range, time_period) => {
	return moment().subtract(time_period, time_range).format("YYYY-MM-DD");
};

export const loader = async ({ request }) => {
	// let queries = [{ param: "amount", predicate: "<", value: 12 }];
	let transactions = await get_collection({
		path: ["transactions"],
	});

	transactions = pipe(sortBy(prop("date")), reverse)(transactions);

	let last_transaction_date = pipe(last, get("date"))(transactions);
	let difference = moment().diff(last_transaction_date, "days");

	let totals = {
		"1d": total_for_period(
			date_x_time_ago(1, "days"),
			date_x_time_ago(0, "days"),
			transactions
		),
		"1w": total_for_period(
			date_x_time_ago(7, "days"),
			date_x_time_ago(0, "days"),
			transactions
		),
		"1m": total_for_period(
			date_x_time_ago(1, "months"),
			date_x_time_ago(0, "days"),
			transactions
		),
		"3m": total_for_period(
			date_x_time_ago(3, "months"),
			date_x_time_ago(0, "days"),
			transactions
		),
		"1y": total_for_period(
			date_x_time_ago(1, "years"),
			date_x_time_ago(0, "days"),
			transactions
		),
		all: total_for_period(
			date_x_time_ago(difference, "days"),
			date_x_time_ago(0, "days"),
			transactions
		),
	};

	return { transactions, totals };
};

let category_styles = [
	{
		bg_color: "bg-red-100",
		text_color: "text-red-500",
		border_color: "border-red-500",
	},
	{
		bg_color: "bg-blue-100",
		text_color: "text-blue-500",
		border_color: "border-blue-500",
	},
	{
		bg_color: "bg-purple-100",
		text_color: "text-purple-500",
		border_color: "border-purple-500",
	},
	{
		bg_color: "bg-green-100",
		text_color: "text-green-500",
		border_color: "border-green-500",
	},
	{
		bg_color: "bg-orange-100",
		text_color: "text-orange-500",
		border_color: "border-orange-500",
	},
];

let Category = ({ category }) => {
	let { bg_color, text_color, border_color } = sample(category_styles);

	return (
		<div
			className={`flex flex-col rounded-full w-[60px] overflow-hidden h-[25px] border -ml-[20px] first-of-type:ml-0 justify-center ${bg_color} ${text_color} ${border_color}`}
		>
			<div className={`flex flex-col w-[50px] px-2 overflow-hidden`}>
				<div className={`w-[300px]`}>{category}</div>
			</div>
		</div>
	);
};

const TransactionsTable = () => {
	let { transactions } = useLoaderData();
	let set_state = useTransactionsStore((state) => state.set_state);

	const onSelectTransaction = (transaction_id) => {
		let transaction = pipe(filter({ transaction_id }), head)(transactions);
		set_state(["transaction"], transaction);
	};

	return (
		<div className="flex flex-col ">
			<div className="flex flex-col w-full">
				{pipe(
					mapIndexed((transaction, transaction_idx) => (
						<div
							className="flex flex-row items-center py-3 border-b text-sm cursor-pointer hover:bg-gray-50 text-gray-500"
							key={transaction_idx}
							onClick={() =>
								onSelectTransaction(transaction.transaction_id)
							}
						>
							<div className="flex flex-col w-[175px]">
								{truncate(15, transaction.name)}
							</div>
							<div className="flex flex-col w-[100px]">
								{currency.format(transaction.amount)}
							</div>
							<div className="flex flex-row w-[250px]">
								{pipe(
									mapIndexed((category, category_idx) => (
										<Category
											category={category}
											key={category_idx}
										/>
									))
								)(transaction.category)}
							</div>
							<div className="flex flex-col">
								{transaction.date}
							</div>
						</div>
					))
				)(transactions)}
			</div>
		</div>
	);
};

const TransactionDetails = () => {
	const transaction = useTransactionsStore((state) => state.transaction);

	if (!transaction) {
		return (
			<div className="flex flex-col w-full border p-3 rounded-lg bg-white">
				<div className="flex flex-col w-full items-center justify-center text-gray-400">
					No Transaction Selected
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full border rounded-lg bg-white">
			<div className="p-3">
				<div className="flex flex-row justify-between items-center text-2xl">
					<div className="flex flex-row items-center">
						<div className="flex flex-col rounded-full w-[40px] h-[40px] items-center justify-center bg-red-100 mr-[10px] text-red-500">
							{Array.from(transaction.name)[0].toUpperCase()}
						</div>
						<div className="text-xl">{transaction.name}</div>
					</div>
					<div>{currency.format(transaction.amount)}</div>
				</div>
				<div className="flex flex-col my-5">
					<div className="flex flex-row text-sm ">
						<div className="flex flex-col w-1/2 space-y-2">
							<div className="text-gray-400">ACCOUNT</div>
							<div>
								<div>American Express</div>
							</div>
						</div>
						<div className="flex flex-col w-1/2 space-y-2">
							<div className="text-gray-400">CATEGORY</div>
							<div className="flex flex-row">
								{pipe(
									mapIndexed((category, category_idx) => (
										<Category
											category={category}
											key={category_idx}
										/>
									))
								)(transaction.category)}
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col text-sm my-1 space-y-1">
					<div className="text-gray-400">Transaction date</div>
					<div>{transaction.date}</div>
				</div>
			</div>
			<div className="border-t"></div>
			<div className="flex flex-col text-sm my-3 space-y-2 px-3">
				<div className="text-gray-400">Notes</div>
				<div>
					<textarea
						rows={3}
						className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						defaultValue={""}
					/>
				</div>
			</div>
		</div>
	);
};

const TransactionsHeaderStats = () => {
	let { totals } = useLoaderData();

	return (
		<div className="flex flex-col mb-[30px] mt-5">
			<div className="flex flex-row">
				<div className="flex flex-col w-1/2 space-y-1.5">
					<div className="text-sm text-gray-400">Income</div>
					<div className="text-3xl">
						{pipe(get("all", "income"), currency.format)(totals)}
					</div>
				</div>
				<div className="flex flex-col w-1/2 space-y-1.5">
					<div className="text-sm text-gray-400">Expenses</div>
					<div className="text-3xl ">
						{pipe(get("all", "expense"), currency.format)(totals)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Transactions() {
	return (
		<div className="flex flex-col w-full p-5 overflow-hidden">
			<div className="flex flex-row w-full overflow-hidden">
				<div className="flex flex-col w-[70%] overflow-y-scroll scrollbar-none bg-white px-5 pb-5 rounded">
					<div className="border-b border-gray-200 pb-3 flex flex-row justify-between my-3">
						<div>
							<h3 className="mt-2 text-base font-semibold leading-6 text-gray-900">
								Transactions
							</h3>
						</div>
					</div>
					<TransactionsHeaderStats />
					<div className="transactions_table_header flex flex-row py-3 border-b text-sm sticky top-0 bg-white text-gray-500">
						<div className="flex flex-col w-[175px]">Merchant</div>
						<div className="flex flex-col w-[100px]">Amount</div>
						<div className="flex flex-col w-[250px]">Category</div>
						{/* 
							<div className="flex flex-col w-[185px]">
								Account
							</div>
						*/}
						<div className="flex flex-col">Date</div>
					</div>
					<TransactionsTable />
				</div>
				<div className="flex flex-col w-[30%] ml-5">
					<TransactionDetails />
				</div>
			</div>
		</div>
	);
}
