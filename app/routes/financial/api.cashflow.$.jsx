import {
	currency,
	currency_precise,
	get_entity_id,
	get_group_id,
	jsreduce,
	use_search_params,
} from "~/utils/helpers";

import { get_collection } from "~/utils/firebase";
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
	sortBy,
	reverse,
	take,
	takeLast,
	ascend,
	sort,
	descend,
	length,
} from "ramda";
import { all, filter, get, mod } from "shades";
import {
	concatMap,
	from,
	of,
	filter as rxfilter,
	toArray,
	map as rxmap,
	lastValueFrom,
	withLatestFrom,
} from "rxjs";
import moment from "moment";

import { get_balances } from "~/api/plaid.server";
import axios from "axios";

export const loader = async ({ request }) => {
	let { origin } = new URL(request.url);
	let { income: income_start_month = 12 } = use_search_params(request);
	let entity_id = get_entity_id(request.url);
	let group_id = get_group_id(request.url);

	let { data: accounts } = await axios({
		method: "get",
		url: `${origin}/financial/api/accounts/resource/e/${entity_id}/g/${group_id}`,
	});

	let account_balance = pipe(
		get(all, "balances", "available"),
		sum
	)(accounts);

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

	let orderBy = [
		{ field: "date", direction: "desc" },
		{ field: "transaction_id" },
	];

	transactions_queries = [
		{
			param: "group_id",
			predicate: "==",
			value: group_id,
		},
	];

	let transactions = await get_collection({
		path: ["transactions"],
		queries: transactions_queries,
		orderBy,
		// cursors: trim([start_cursor]),
		// limit,
	});

	let $transactions = of(transactions);

	let with_daily_balance = curry((ending_balance, transactions) => {
		return pipe(
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
		)(transactions);
	});

	let $recent_activity = $transactions.pipe(
		rxmap(
			pipe(
				sortBy(get("date")),
				reverse,
				take(20),
				mod(all)(
					pipe(
						pick(["name", "date", "amount"]),
						with_transaction_type
					)
				),
				with_daily_balance(account_balance)
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
		let days_in_month = moment(
			`${moment().year()}-${month}`,
			"YYYY-MM"
		).daysInMonth();

		return pipe(
			filter({
				date: (date) =>
					date >
						moment(`${year}-${month}-01`, "YYYY-MM-DD").format(
							"YYYY-MM-DD"
						) &&
					date <
						moment(
							`${year}-${month}-${days_in_month}`,
							"YYYY-MM-DD"
						).format("YYYY-MM-DD"),
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

	let average = (arr) => {
		return sum(arr) / arr.length;
	};

	let $average_daily_balance = $transactions.pipe(
		rxmap(
			pipe(
				transactions_by_date(start_date, end_date),
				sortBy(get("date")),
				reverse,
				mod(all)(pipe(pick(["amount"]))),
				with_daily_balance(account_balance),
				get(all, "balance"),
				average,
				(value) => {
					return {
						name: "Average daily balance",
						value: currency.format(value),
						change: "+54.02%",
						changeType: "negative",
					};
				}
			)
		)
	);

	let $num_of_negative_balance_days = $transactions.pipe(
		rxmap(
			pipe(
				transactions_by_date(start_date, end_date),
				sortBy(get("date")),
				reverse,
				mod(all)(pipe(pick(["amount"]))),
				with_daily_balance(account_balance),
				get(all, "balance"),
				filter((balance) => balance < 0),
				length,
				(value) => {
					return {
						name: "Number of negative balance days",
						value,
						change: "-1.39%",
						changeType: "positive",
					};
				}
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

	let $annual_revenue = $transactions.pipe(
		rxmap(
			pipe(
				transactions_by_date(
					moment().subtract(12, "months").format("YYYY-MM-DD"),
					end_date
				),
				filter(is_revenue),
				get(all, "amount"),
				sum,
				Math.abs,
				(value) => {
					return {
						name: "Lender-recognized annual revenue",
						value: currency.format(value),
						change: "+4.75%",
						changeType: "positive",
					};
				}
			)
		)
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

	const percentage_change = (prev, curr) => {
		let change = ((curr - prev) / prev) * 100;
		return isNaN(change) ? 0 : change;
	};

	const change_type = (change) => {
		if (change === 0) return "no change";
		return change > 0 ? "increase" : "decrease";
	};

	const $incomes_change = $monthly_incomes.pipe(
		rxmap(
			pipe(takeLast(2), ([prev, curr]) => {
				let change = percentage_change(prev, curr);

				return {
					name: "Month over month net income change",
					stat: currency_precise(2).format(curr.toFixed(2)),
					previousStat: prev.toFixed(2),
					change: `${change.toFixed(2)}%`,
					changeType: change_type(change),
				};
			})
		)
	);

	const $expenses_change = $monthly_expenses.pipe(
		rxmap(
			pipe(takeLast(2), ([prev, curr]) => {
				let change = percentage_change(prev, curr);

				return {
					name: "Month over month spending change",
					stat: currency_precise(2).format(curr.toFixed(2)),
					previousStat: prev.toFixed(2),
					change: `${change.toFixed(2)}%`,
					changeType: change_type(change),
				};
			})
		)
	);

	const $revenues_change = $monthly_revenues.pipe(
		rxmap(
			pipe(takeLast(2), ([prev, curr]) => {
				let change = percentage_change(prev, curr);

				return {
					name: "Month over month revenue change",
					stat: currency_precise(2).format(curr.toFixed(2)),
					previousStat: prev.toFixed(2),
					change: `${change.toFixed(2)}%`,
					changeType: change_type(change),
				};
			})
		)
	);

	const $highest_income = $monthly_incomes.pipe(
		rxmap(
			pipe(
				takeLast(6),
				sort(descend(identity)),
				take(2),
				([curr, prev]) => {
					let change = percentage_change(prev, curr);

					return {
						name: "Highest net income in last 6 months",
						stat: currency_precise(2).format(curr.toFixed(2)),
						previousStat: prev.toFixed(2),
						change: `${change.toFixed(2)}%`,
						changeType: change_type(change),
					};
				}
			)
		)
	);

	const $highest_expense = $monthly_expenses.pipe(
		rxmap(
			pipe(
				takeLast(6),
				sort(ascend(identity)),
				take(2),
				([curr, prev]) => {
					let change = percentage_change(prev, curr);

					return {
						name: "Highest spending in last 6 months",
						stat: currency_precise(2).format(curr.toFixed(2)),
						previousStat: prev.toFixed(2),
						change: `${change.toFixed(2)}%`,
						changeType: change_type(change),
					};
				}
			)
		)
	);

	const $highest_revenue = $monthly_revenues.pipe(
		rxmap(
			pipe(
				takeLast(6),
				sort(descend(identity)),
				take(2),
				([curr, prev]) => {
					let change = percentage_change(prev, curr);

					return {
						name: "Highest revenue in last 6 months",
						stat: currency_precise(2).format(curr.toFixed(2)),
						previousStat: prev.toFixed(2),
						change: `${change.toFixed(2)}%`,
						changeType: change_type(change),
					};
				}
			)
		)
	);

	let monthly_expenses = await lastValueFrom($monthly_expenses);
	let monthly_revenues = await lastValueFrom($monthly_revenues);
	let monthly_incomes = await lastValueFrom($monthly_incomes);
	let recent_activity = await lastValueFrom($recent_activity);
	let incomes_change = await lastValueFrom($incomes_change);
	let expenses_change = await lastValueFrom($expenses_change);
	let revenues_change = await lastValueFrom($revenues_change);
	let highest_income = await lastValueFrom($highest_income);
	let highest_expense = await lastValueFrom($highest_expense);
	let highest_revenue = await lastValueFrom($highest_revenue);
	let average_daily_balance = await lastValueFrom($average_daily_balance);
	let num_of_negative_balance_days = await lastValueFrom(
		$num_of_negative_balance_days
	);
	let annual_revenue = await lastValueFrom($annual_revenue);

	let payload = {
		annual_revenue,
		num_of_negative_balance_days,
		average_daily_balance,
		stats_data: {
			revenues: [highest_revenue, revenues_change],
			expenses: [highest_expense, expenses_change],
		},
		highest_income,
		incomes_change,
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
