import { useLoaderData } from "@remix-run/react";
import { pipe, map, head, sortBy, prop } from "ramda";
import { get_collection } from "~/utils/firebase";
import {
	inspect,
	truncate,
	currency,
	mapIndexed,
	sample,
} from "~/utils/helpers";

export const loader = async ({ request }) => {
	// let queries = [{ param: "amount", predicate: "<", value: 12 }];
	let transactions = await get_collection({
		path: ["transactions"],
	});

	transactions = pipe(sortBy(prop("date")))(transactions);

	// console.log("transactions");
	// console.log(head(transactions));

	return { transactions };
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

const TransactionsTable = ({ transactions }) => {
	return (
		<div className="flex flex-col pr-5 overflow-hidden">
			<div className="transactions_table_header flex flex-row pb-3 border-b text-sm">
				<div className="flex flex-col w-[175px]">Merchant</div>
				<div className="flex flex-col w-[100px]">Amount</div>
				<div className="flex flex-col w-[250px]">Category</div>
				{/* <div className="flex flex-col w-[185px]">
				Account
			</div> */}
				<div className="flex flex-col">Date</div>
			</div>
			<div className="flex flex-col w-full overflow-y-scroll">
				{pipe(
					mapIndexed((transaction, transaction_idx) => (
						<div
							className="flex flex-row items-center py-3 border-b text-sm cursor-pointer hover:bg-gray-50 text-gray-500"
							key={transaction_idx}
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

export default function Transactions() {
	let { transactions } = useLoaderData();

	return (
		<div className="flex flex-col w-full p-5 overflow-hidden">
			<div className="flex flex-row w-full overflow-hidden">
				<div className="flex flex-col w-[70%]">
					<TransactionsTable transactions={transactions} />
				</div>
				<div className="flex flex-col w-[30%]">
					<div className="flex flex-col w-full border p-3 rounded-lg mt-[25px]">
						<div className="flex flex-row justify-between items-center text-2xl">
							<div className="flex flex-row items-center">
								<div className="flex flex-col rounded-full w-[40px] h-[40px] items-center justify-center bg-red-100 mr-[10px] text-red-500">
									P
								</div>
								<div className="text-xl">Phone Bill</div>
							</div>
							<div>{currency.format(80)}</div>
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
									<div className="text-gray-400">
										CATEGORY
									</div>
									<div className="flex flex-row">
										<Category category="Phone Bill" />
										<Category category="Mobile" />
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col text-sm my-1 space-y-1">
							<div className="text-gray-400">
								Transaction date
							</div>
							<div>June 10, 2023</div>
						</div>
						<div className="flex flex-col text-sm my-1 space-y-1">
							<div className="text-gray-400">Location</div>
							<div>345 Spear St, San Francisco 94105</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
