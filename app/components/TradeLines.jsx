import { pipe, flatten, uniq, reject, isEmpty, head, split, take, curry, tryCatch, always } from "ramda";
import { all, get, filter } from "shades";
import { mapIndexed, currency } from "~/utils/helpers";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import { TradeLineApi } from "~/data/array";

let month_mapping = {
	1: "Jan",
	2: "Feb",
	3: "Mar",
	4: "Apr",
	5: "May",
	6: "Jun",
	7: "Jul",
	8: "Aug",
	9: "Sep",
	10: "Oct",
	11: "Nov",
	12: "Dec",
};

const stats = [
	{
		name: "% of account limit used",
		stat: "$2,490",
		previousStat: "$5,000",
		change: "12%",
		changeType: "decrease",
	},
	{
		name: "Avg. Open Rate",
		stat: "58.16%",
		previousStat: "56.14%",
		change: "2.02%",
		changeType: "increase",
	},
	{
		name: "Avg. Click Rate",
		stat: "24.57%",
		previousStat: "28.62%",
		change: "4.05%",
		changeType: "decrease",
	},
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const Stat = () => {
	let item = stats[0];
	return (
		<div key={item.name} className="text-xs sm:text-sm flex flex-col">
			<div className="font-normal text-gray-900">{item.name}</div>
			<div className="flex flex-col sm:flex-row justify-between items-end">
				<div className="flex flex-row font-semibold text-[#55CF9E] sm:mr-2 my-2 sm:my-0">
					{item.stat}
					<p className="ml-1 font-medium text-gray-500">of</p>
					<p className="ml-1 font-medium text-gray-500">{item.previousStat}</p>
				</div>

				<div
					className={classNames(
						item.changeType === "increase" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
						"flex flex-row rounded-full px-2.5 py-0.5 font-medium md:mt-2 lg:mt-0 "
					)}
				>
					<ArrowDownIcon
						className="-ml-1 mr-0.5 h-3 w-3 flex-shrink-0 self-center text-red-500"
						aria-hidden="true"
					/>

					{item.change}
				</div>
			</div>
		</div>
	);
};

const PaymentPattern = ({ pattern }) => {
	if (!pattern?.value) return null;

	return (
		<>
			{pipe((value) => {
				let start_month = pipe(split("-"), get(1), Number)(value["@_StartDate"]);

				return (
					<>
						{pipe(
							take(12),
							mapIndexed((value, index) => {
								let raw_month_number = start_month - index;
								let month_number = raw_month_number < 1 ? raw_month_number + 12 : raw_month_number;

								let month_border_classname = value == "C" ? "border-green-200" : "border-red-300";

								return (
									<div
										className={`flex flex-col items-center justify-center flex-grow border-t border-b ${month_border_classname} first-of-type:border-l-rounded last-of-type:rounded-r first-of-type:rounded-l border-r first-of-type:border-l`}
										key={index}
									>
										<div
											className={`flex flex-col items-center justify-center w-full border-b py-1 ${month_border_classname}`}
										>
											{month_mapping[month_number]}
										</div>
										<div className="flex flex-col items-center justify-center py-1">{value}</div>
									</div>
								);
							})
						)(value["@_Data"])}
					</>
				);
			})(pattern.value)}
		</>
	);
};

const TradeLine = ({ trade_line = {}, type = "basic", experian = false, equifax = false, transunion = false }) => {
	return (
		<div className="overflow-hidden bg-white border rounded-lg">
			<div className="px-4 py-5 flex flex-row justify-between">
				<div className="flex flex-col">
					<p className="text-base sm:text-xl font-medium leading-6 text-gray-900">
						{pipe(
							flatten,
							reject(isEmpty),
							uniq,
							head
						)([
							pipe(get("original_creditor", all, "value"))(trade_line),
							pipe(get("creditor", all, "value", "@_Name"))(trade_line),
						])}
					</p>
					<p className="mt-1 max-w-2xl text-sm text-gray-500">
						#
						{pipe(
							get("id"),
							filter((id) => id.source == "Equifax" || id.source == "TransUnion"),
							get(all, "value"),
							head
						)(trade_line)}
					</p>
				</div>
				{type == "usage" && (
					<div className="flex flex-col">
						<Stat />
					</div>
				)}
			</div>
			<div className="border-t border-gray-200 px-4 py-3">
				<div className="hidden sm:flex sm:flex-row sm:py-2">
					<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0"></div>
					<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
						<div className="w-[100px] sm:w-[120px]">
							<div className="font-bold">Transunion</div>
						</div>
						<div className="w-[100px] sm:w-[120px]">
							<div className="font-bold">Equifax</div>
						</div>
						<div className="w-[100px] sm:w-[120px]">
							<div className="font-bold">Experian</div>
						</div>
					</div>
				</div>
				<div className="divide-y divide-gray-200">
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Account type
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Transunion</div>
									<div>{TradeLineApi.account_type("TransUnion")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Equifax</div>
									<div>{TradeLineApi.account_type("Equifax")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Experian</div>
									<div>{TradeLineApi.account_type("Experian")(trade_line)}</div>
								</div>
							</>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Account status
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Transunion</div>
									<div>{TradeLineApi.account_status("TransUnion")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Equifax</div>
									<div>{TradeLineApi.account_status("Equifax")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Experian</div>
									<div>{TradeLineApi.account_status("Experian")(trade_line)}</div>
								</div>
							</>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Monthly payment
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Transunion</div>
									<div>{TradeLineApi.payment_amount("TransUnion")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Equifax</div>
									<div>{TradeLineApi.payment_amount("Equifax")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Experian</div>
									<div>{TradeLineApi.payment_amount("Experian")(trade_line)}</div>
								</div>
							</>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Date opened
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Transunion</div>
									<div>{TradeLineApi.opened_date("TransUnion")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Equifax</div>
									<div>{TradeLineApi.opened_date("Equifax")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Experian</div>
									<div>{TradeLineApi.opened_date("Experian")(trade_line)}</div>
								</div>
							</>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Balance
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Transunion</div>
									<div>{TradeLineApi.unpaid_balance("TransUnion")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Equifax</div>
									<div>{TradeLineApi.unpaid_balance("Equifax")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Experian</div>
									<div>{TradeLineApi.unpaid_balance("Experian")(trade_line)}</div>
								</div>
							</>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							No of months (terms)
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Transunion</div>
									<div>{TradeLineApi.terms("Transunion")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Equifax</div>
									<div>{TradeLineApi.terms("Equifax")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Experian</div>
									<div>{TradeLineApi.terms("Experian")(trade_line)}</div>
								</div>
							</>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							High credit
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Transunion</div>
									<div>{TradeLineApi.credit_limit("Transunion")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Equifax</div>
									<div>{TradeLineApi.credit_limit("Equifax")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Experian</div>
									<div>{TradeLineApi.credit_limit("Experian")(trade_line)}</div>
								</div>
							</>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Past due
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Transunion</div>
									<div>{TradeLineApi.past_due_amount("Transunion")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Equifax</div>
									<div>{TradeLineApi.past_due_amount("Equifax")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Experian</div>
									<div>{TradeLineApi.past_due_amount("Experian")(trade_line)}</div>
								</div>
							</>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Payment status
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Transunion</div>
									<div>{TradeLineApi.current_rating("Transunion")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Equifax</div>
									<div>{TradeLineApi.current_rating("Equifax")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Experian</div>
									<div>{TradeLineApi.current_rating("Experian")(trade_line)}</div>
								</div>
							</>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Last reported
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Transunion</div>
									<div>{TradeLineApi.account_reported_date("Transunion")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Equifax</div>
									<div>{TradeLineApi.account_reported_date("Equifax")(trade_line)}</div>
								</div>
								<div className="w-[100px] sm:w-[120px]">
									<div className=" text-gray-500 text-xs sm:hidden">Experian</div>
									<div>{TradeLineApi.account_reported_date("Experian")(trade_line)}</div>
								</div>
							</>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center sm:justify-start w-[150px] mb-1 sm:mb-0">
							Payment history
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<div className="w-full flex flex-row justify-between text-xs sm:text-sm">
								{pipe(TradeLineApi.payment_pattern("Experian"), (pattern) => (
									<PaymentPattern pattern={pattern} />
								))(trade_line)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const Accounts = ({
	trade_lines = [],
	type = "basic",
	experian = false,
	equifax = false,
	transunion = false,
}) => {
	return (
		<div className="flex flex-col">
			{mapIndexed(
				(trade_line, tl_index) => (
					<div className="my-2" key={tl_index}>
						<TradeLine
							trade_line={trade_line}
							type={type}
							experian={experian}
							equifax={equifax}
							transunion={transunion}
						/>
					</div>
				),
				trade_lines
			)}
		</div>
	);
};
