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

export default function Transactions() {
	let { transactions } = useLoaderData();

	return (
		<div className="flex flex-col w-full p-10">
			<div className="flex flex-row w-full">
				<div className="flex flex-col w-[70%]">
					<div className="flex flex-col">
						<div className="transactions_table_header flex flex-row pb-3 mb-3 border-b">
							<div className="flex flex-col w-[175px]">
								Merchant
							</div>
							<div className="flex flex-col w-[100px]">
								Amount
							</div>
							<div className="flex flex-col w-[250px]">
								Category
							</div>
							{/* <div className="flex flex-col w-[185px]">
								Account
							</div> */}
							<div className="flex flex-col">Date</div>
						</div>
						{pipe(
							mapIndexed((transaction, transaction_idx) => (
								<div
									className="flex flex-row py-3 border-b text-sm"
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
											mapIndexed(
												(category, category_idx) => (
													<Category
														category={category}
														key={category_idx}
													/>
												)
											)
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
				<div>a</div>
			</div>
		</div>
	);
}
