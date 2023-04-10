import {
	pipe,
	map,
	flatten,
	uniq,
	reject,
	isEmpty,
	head,
	split,
	take,
} from "ramda";
import { all, get, filter } from "shades";
import { mapIndexed, currency, get_file_id } from "~/utils/helpers";
import { TradeLine as Tradeline } from "~/data/array";
import { useLoaderData } from "@remix-run/react";
import { get_doc as get_credit_report } from "~/utils/personal_credit_report.server";
import { BookOpenIcon } from "@heroicons/react/24/outline";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let pathname = url.pathname;
	let report_id = get_file_id(pathname);

	let credit_report = await get_credit_report({
		resource_id: report_id,
	});

	let trade_lines = pipe(
		map(Tradeline),
		map((tl) => tl.values())
	)(credit_report.trade_lines);

	return trade_lines;
};

const Heading = () => {
	return (
		<div>
			<h3 className="text-lg font-medium leading-6 text-gray-900">
				Accounts
			</h3>
			<p className="mt-2 max-w-4xl text-sm text-gray-500">
				Workcation is a property rental website. Etiam ullamcorper massa
				viverra consequat, consectetur id nulla tempus. Fringilla
				egestas justo massa purus sagittis malesuada.
			</p>
		</div>
	);
};

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

const TradeLine = ({ trade_line }) => {
	return (
		<div className="overflow-hidden bg-white border rounded-lg">
			<div className="px-4 py-5">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					{pipe(
						flatten,
						reject(isEmpty),
						uniq,
						head
					)([
						pipe(get("original_creditor", all, "value"))(
							trade_line
						),
						pipe(get("creditor", all, "value", "@_Name"))(
							trade_line
						),
					])}
				</h3>
				<p className="mt-1 max-w-2xl text-sm text-gray-500">
					#
					{pipe(
						get("id"),
						filter(
							(id) =>
								id.source == "Equifax" ||
								id.source == "TransUnion"
						),
						get(all, "value"),
						head
					)(trade_line)}
				</p>
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
							{pipe(get("account_type"), (value) => (
								<>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Transunion
										</div>
										<div>
											{pipe(
												filter({
													source: "TransUnion",
												}),
												head,
												get("value")
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Equifax
										</div>
										<div>
											{pipe(
												filter({
													source: "Equifax",
												}),
												head,
												get("value")
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Experian
										</div>
										<div>
											{pipe(
												filter({
													source: "Experian",
												}),
												head,
												get("value")
											)(value)}
										</div>
									</div>
								</>
							))(trade_line)}
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Account status
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							{pipe(get("status"), (value) => (
								<>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Transunion
										</div>
										<div>
											{pipe(
												filter({
													source: "TransUnion",
												}),
												head,
												get("value")
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Equifax
										</div>
										<div>
											{pipe(
												filter({
													source: "Equifax",
												}),
												head,
												get("value")
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Experian
										</div>
										<div>
											{pipe(
												filter({
													source: "Experian",
												}),
												head,
												get("value")
											)(value)}
										</div>
									</div>
								</>
							))(trade_line)}
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Monthly payment
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							{pipe(get("payment_amount"), (value) => (
								<>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Transunion
										</div>
										<div>
											{pipe(
												filter({
													source: "TransUnion",
												}),
												head,
												get("value"),
												currency.format
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Equifax
										</div>
										<div>
											{pipe(
												filter({
													source: "Equifax",
												}),
												head,
												get("value"),
												currency.format
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Experian
										</div>
										<div>
											{pipe(
												filter({
													source: "Experian",
												}),
												head,
												get("value"),
												currency.format
											)(value)}
										</div>
									</div>
								</>
							))(trade_line)}
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Date opened
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							{pipe(get("opened_date"), (value) => (
								<>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Transunion
										</div>
										<div>
											{pipe(
												filter({
													source: "TransUnion",
												}),
												head,
												get("value")
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Equifax
										</div>
										<div>
											{pipe(
												filter({
													source: "Equifax",
												}),
												head,
												get("value")
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Experian
										</div>
										<div>
											{pipe(
												filter({
													source: "Experian",
												}),
												head,
												get("value")
											)(value)}
										</div>
									</div>
								</>
							))(trade_line)}
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Balance
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							{pipe(get("unpaid_balance"), (value) => (
								<>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Transunion
										</div>
										<div>
											{pipe(
												filter({
													source: "TransUnion",
												}),
												head,
												get("value"),
												currency.format
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Equifax
										</div>
										<div>
											{pipe(
												filter({
													source: "Equifax",
												}),
												head,
												get("value"),
												currency.format
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Experian
										</div>
										<div>
											{pipe(
												filter({
													source: "Experian",
												}),
												head,
												get("value"),
												currency.format
											)(value)}
										</div>
									</div>
								</>
							))(trade_line)}
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							No of months (terms)
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							{pipe(get("terms"), (value) => (
								<>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Transunion
										</div>
										<div>
											{pipe(
												filter({
													source: "TransUnion",
												}),
												head,
												get("value")
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Equifax
										</div>
										<div>
											{pipe(
												filter({
													source: "Equifax",
												}),
												head,
												get("value")
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Experian
										</div>
										<div>
											{pipe(
												filter({
													source: "Experian",
												}),
												head,
												get("value")
											)(value)}
										</div>
									</div>
								</>
							))(trade_line)}
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							High credit
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							{pipe(get("credit_limit"), (value) => (
								<>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Transunion
										</div>
										<div>
											{pipe(
												filter({
													source: "TransUnion",
												}),
												head,
												get("value"),
												currency.format
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Equifax
										</div>
										<div>
											{pipe(
												filter({
													source: "Equifax",
												}),
												head,
												get("value"),
												currency.format
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Experian
										</div>
										<div>
											{pipe(
												filter({
													source: "Experian",
												}),
												head,
												get("value"),
												currency.format
											)(value)}
										</div>
									</div>
								</>
							))(trade_line)}
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Past due
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							{pipe(get("past_due_amount"), (value) => (
								<>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Transunion
										</div>
										<div>
											{pipe(
												filter({
													source: "TransUnion",
												}),
												head,
												get("value"),
												currency.format
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Equifax
										</div>
										<div>
											{pipe(
												filter({
													source: "Equifax",
												}),
												head,
												get("value"),
												currency.format
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Experian
										</div>
										<div>
											{pipe(
												filter({
													source: "Experian",
												}),
												head,
												get("value"),
												currency.format
											)(value)}
										</div>
									</div>
								</>
							))(trade_line)}
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Payment status
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							{pipe(get("current_rating"), (value) => (
								<>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Transunion
										</div>
										<div>
											{pipe(
												filter({
													source: "TransUnion",
												}),
												head,
												get("value")
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Equifax
										</div>
										<div>
											{pipe(
												filter({
													source: "Equifax",
												}),
												head,
												get("value")
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Experian
										</div>
										<div>
											{pipe(
												filter({
													source: "Experian",
												}),
												head,
												get("value")
											)(value)}
										</div>
									</div>
								</>
							))(trade_line)}
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center w-[150px] mb-1 sm:mb-0">
							Last reported
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							{pipe(get("account_reported_date"), (value) => (
								<>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Transunion
										</div>
										<div>
											{pipe(
												filter({
													source: "TransUnion",
												}),
												head,
												get("value")
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Equifax
										</div>
										<div>
											{pipe(
												filter({
													source: "Equifax",
												}),
												head,
												get("value")
											)(value)}
										</div>
									</div>
									<div className="w-[100px] sm:w-[120px]">
										<div className=" text-gray-500 text-xs sm:hidden">
											Experian
										</div>
										<div>
											{pipe(
												filter({
													source: "Experian",
												}),
												head,
												get("value")
											)(value)}
										</div>
									</div>
								</>
							))(trade_line)}
						</div>
					</div>
					<div className="flex flex-col sm:flex-row py-2">
						<div className="text-sm font-medium text-black flex flex-col justify-center sm:justify-start w-[150px] mb-1 sm:mb-0">
							Payment history
						</div>
						<div className="text-sm text-gray-900 flex flex-row justify-between sm:justify-around sm:flex-grow">
							<div className="w-full flex flex-row justify-between text-xs sm:text-sm">
								{pipe(
									get("payment_pattern"),
									filter(
										(value) => value.source == "Experian"
									),
									head,
									(pattern) =>
										pipe((value) => {
											let start_month = pipe(
												split("-"),
												get(1),
												Number
											)(value["@_StartDate"]);

											return (
												<>
													{pipe(
														take(12),
														mapIndexed(
															(value, index) => {
																let raw_month_number =
																	start_month -
																	index;
																let month_number =
																	raw_month_number <
																	1
																		? raw_month_number +
																		  12
																		: raw_month_number;

																let month_border_classname =
																	value == "C"
																		? "border-green-200"
																		: "border-red-300";

																return (
																	<div
																		className={`flex flex-col items-center justify-center flex-grow border-t border-b ${month_border_classname} first-of-type:border-l-rounded last-of-type:rounded-r first-of-type:rounded-l border-r first-of-type:border-l`}
																		key={
																			index
																		}
																	>
																		<div
																			className={`flex flex-col items-center justify-center w-full border-b py-1 ${month_border_classname}`}
																		>
																			{
																				month_mapping[
																					month_number
																				]
																			}
																		</div>
																		<div className="flex flex-col items-center justify-center py-1">
																			{
																				value
																			}
																		</div>
																	</div>
																);
															}
														)
													)(value["@_Data"])}
												</>
											);
										})(pattern.value)
								)(trade_line)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Accounts() {
	let trade_lines = useLoaderData();

	return (
		<div className="flex flex-col w-full">
			<div className="overflow-hidden bg-white rounded-lg border">
				<div className="px-4 py-5 sm:px-6 flex flex-row items-center">
					<div className="flex flex-col w-[25px] mr-3">
						<BookOpenIcon />
					</div>
					<div className="flex flex-col">
						<h3 className="text-lg font-medium leading-6 text-gray-900">
							How Important is Your Payment History?
						</h3>
					</div>
				</div>
				<div className="border-t border-gray-200 px-6 py-2">
					<div className="flex flex-col text-xl py-2 text-gray-700 font-semibold">
						<p>
							35% of your credit score is based on Payment History
						</p>
					</div>

					<div className="flex flex-col py-2 text-gray-700">
						<p>
							Your payment history is one of the two most
							important factors in determining your credit score,
							accounting for 35% of your overall credit score. To
							make sure you earn all the credit score points
							possible, make sure to pay all your accounts on time
							and avoid collections, public records or other
							derogatory information.
						</p>
					</div>

					<div className="flex flex-col py-2 text-gray-700">
						<p>
							Because this is the most important credit score
							category you also have the most to lose. If any
							serious negative information is reported on your
							credit report you can expect your score to drop
							significantly. Most negative information can remain
							on your credit report for up to seven years so once
							you have negative information, it is a long road
							before you'll have good credit again.
						</p>
					</div>

					<div className="flex flex-col py-2 text-gray-700">
						<p>
							The good news is that the older the negative
							information, the less it hurts your score. Payment
							history is typically reported on your credit report
							for the last 24 months. This means late payments
							that occurred prior to the 24 month history may not
							show up on your credit report with any specificity.
						</p>
					</div>

					<div className="flex flex-col py-2 text-gray-700">
						<p>
							On your Nav report, any late payments are shown
							under the Payment History box on the left of each
							individual credit account.
						</p>
					</div>
				</div>
			</div>
			{mapIndexed(
				(trade_line, tl_index) => (
					<div className="my-2" key={tl_index}>
						<TradeLine trade_line={trade_line} />
					</div>
				),
				trade_lines
			)}
		</div>
	);
}
