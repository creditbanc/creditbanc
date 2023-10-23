import {
	curry,
	head,
	identity,
	pickAll,
	pipe,
	prop,
	uniqBy,
	values,
	map,
	not,
	reverse,
	pick,
	sortBy,
	take,
	last,
	flatten,
	sum,
	multiply,
	zip,
	takeLast,
	sort,
	descend,
	ascend,
	length,
	isEmpty,
} from "ramda";
import { set_doc, get_doc, get_collection } from "~/utils/firebase";
import { forkJoin, from, merge, of as rxof, throwError, zip as rxzip } from "rxjs";
import {
	map as rxmap,
	concatMap,
	catchError,
	reduce as rxreduce,
	filter as rxfilter,
	tap,
	toArray,
	withLatestFrom,
} from "rxjs/operators";
import { currency_precise, get, inspect, jsreduce, currency } from "~/utils/helpers";
import { all, filter, mod } from "shades";
import Plaid from "./plaid";
import moment from "moment";

const merge_with_current = curry((current, data) => {
	return current.pipe(
		rxmap((response) => {
			return { ...response, ...data };
		})
	);
});

const catch_with_default = curry((default_value, fn_name, error) => {
	console.log(`api.client.Entity.error.${fn_name}`);
	console.log(error);
	console.log(default_value);
	return rxof(default_value);
});

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

const transactions_by_date = curry((start_date, end_date, transactions) => {
	return pipe(filter({ date: (date) => date > start_date && date < end_date }))(transactions);
});

const transactions_by_month = curry((year, month, transactions) => {
	let days_in_month = moment(`${moment().year()}-${month}`, "YYYY-MM").daysInMonth();

	return pipe(
		filter({
			date: (date) =>
				date > moment(`${year}-${month}-01`, "YYYY-MM-DD").format("YYYY-MM-DD") &&
				date < moment(`${year}-${month}-${days_in_month}`, "YYYY-MM-DD").format("YYYY-MM-DD"),
		})
	)(transactions);
});

const with_daily_balance = curry((account_balance, transactions) => {
	console.log("with_daily_balance");
	// console.log(account_balance);
	// console.log(transactions);

	if (isEmpty(transactions)) return transactions;

	return pipe(
		jsreduce((curr, next, index) => {
			if (index === 1) {
				curr.balance = account_balance;
				next.balance = curr.balance + curr.amount;

				let payload = [curr, next];

				return payload;
			}

			let last_transaction = last(curr);

			next.balance = last_transaction.balance + last_transaction.amount;

			let payload = [...curr, next];

			return payload;
		})
	)(transactions);
});

const start_date_of_months = (start_date, end_date) => {
	let months = [];
	start_date = moment(start_date);
	end_date = moment(end_date);

	while (start_date < end_date) {
		months = [...months, start_date.startOf("month").format("YYYY-MM-DD")];

		start_date.add(1, "month");
	}

	return months;
};

const percentage_change = (prev, curr) => {
	let change = ((curr - prev) / prev) * 100;
	return isNaN(change) ? 0 : change;
};

const change_type = (change) => {
	if (change === 0) return "no change";
	return change > 0 ? "increase" : "decrease";
};

const average = (arr) => {
	return sum(arr) / arr.length;
};

export default class Finance {
	constructor(entity_id, group_id, months = 12) {
		this.entity_id = entity_id;
		this.group_id = group_id;
		this.months = months;

		this.response = rxof({});
	}

	set_transaction = async (transaction) => {
		console.log("set_transaction");

		let { entity_id, group_id } = this;
		await set_doc(["transactions", transaction.transaction_id], { ...transaction, entity_id, group_id });
		return transaction;
	};

	set_transactions = async ({ transactions }) => {
		console.log("set_transactions");

		await Promise.all(pipe(map(this.set_transaction))(transactions));
		return transactions;
	};

	set_account = async (account) => {
		console.log("set_account");

		let { entity_id, group_id } = this;
		await set_doc(["plaid_accounts", account.account_id], { ...account, entity_id, group_id });
		return account;
	};

	set_accounts = async ({ accounts }) => {
		console.log("set_accounts");

		await Promise.all(pipe(map(this.set_account))(accounts));
		return accounts;
	};

	get _transactions_() {
		let { entity_id, group_id } = this;
		let transactions_queries = [
			{
				param: "group_id",
				predicate: "==",
				value: group_id,
			},
		];

		let orderBy = [{ field: "date", direction: "desc" }, { field: "transaction_id" }];

		let transactions = get_collection({
			path: ["transactions"],
			queries: transactions_queries,
			orderBy,
			// cursors: trim([start_cursor]),
			// limit,
		});

		return from(transactions);
	}

	get transactions() {
		this.response = this._transactions_.pipe(
			rxmap((transactions) => ({ transactions })),
			catchError(catch_with_default({ transactions: "" }, "transactions")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	recent_activity = (num_of_transactions = 20) => {
		let plaid = new Plaid(this.group_id);
		let current_balance = plaid.current_balance;

		this.response = this._transactions_.pipe(
			rxmap(
				pipe(
					sortBy(get("date")),
					reverse,
					take(num_of_transactions),
					mod(all)(pipe(pick(["name", "date", "amount"]), with_transaction_type))
				)
			),
			concatMap((transactions) =>
				forkJoin({
					transactions: rxof(transactions),
					current_balance,
				})
			),
			rxmap(({ transactions, current_balance }) => with_daily_balance(current_balance, transactions)),
			// tap(() => console.log("___recent_activity____")),
			// tap(inspect),
			rxmap((recent_activity) => ({ recent_activity })),
			catchError(catch_with_default({ recent_activity: [] }, "recent_activity")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	};

	_expenses_(transactions = null) {
		if (!transactions) {
			return this._transactions_.pipe(concatMap(identity), rxfilter(is_expense), toArray());
		} else {
			return rxof(transactions).pipe(concatMap(identity), rxfilter(is_expense), toArray());
		}
	}

	_revenues_(transactions = null) {
		if (!transactions) {
			return this._transactions_.pipe(concatMap(identity), rxfilter(is_revenue), toArray());
		} else {
			return rxof(transactions).pipe(concatMap(identity), rxfilter(is_revenue), toArray());
		}
	}

	_monthly_transactions_() {
		let start_date = moment().subtract(this.months, "months").format("YYYY-MM-DD");
		let end_date = moment().format("YYYY-MM-DD");

		return this._transactions_
			.pipe(rxmap(transactions_by_date(start_date, end_date)))
			.pipe(
				concatMap((transactions) =>
					rxof(
						pipe(
							map((date) =>
								transactions_by_month(moment(date).year(), moment(date).month() + 1, transactions)
							)
						)(start_date_of_months(start_date, end_date))
					)
				)
			);
	}

	get monthly_transactions() {
		this.response = this._monthly_transactions_().pipe(
			rxmap((monthly_transactions) => ({ monthly_transactions })),
			catchError(catch_with_default({ monthly_transactions: [] }, "monthly_transactions")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	_monthly_expenses_() {
		return this._monthly_transactions_(this.months).pipe(
			concatMap(identity),
			concatMap(this._expenses_),
			rxmap(pipe(mod(all)(pick(["amount"])))),
			rxmap(pipe(map(values), flatten, sum, multiply(-1))),
			toArray()
		);
	}

	get monthly_expenses() {
		this.response = this._monthly_expenses_().pipe(
			rxmap((monthly_expenses) => ({ monthly_expenses })),
			catchError(catch_with_default({ monthly_expenses: [] }, "monthly_expenses")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	_monthly_revenues_() {
		return this._monthly_transactions_(this.months).pipe(
			concatMap(identity),
			concatMap(this._revenues_),
			rxmap(pipe(mod(all)(pick(["amount"])))),
			rxmap(pipe(map(values), flatten, sum, Math.abs)),
			toArray()
		);
	}

	get monthly_revenues() {
		this.response = this._monthly_revenues_().pipe(
			rxmap((monthly_revenues) => ({ monthly_revenues })),
			catchError(catch_with_default({ monthly_revenues: [] }, "monthly_revenues")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	_monthly_incomes_() {
		return rxzip(this._monthly_revenues_(this.months), this._monthly_expenses_(this.months)).pipe(
			rxmap((transactions) =>
				pipe(
					zip,
					map(([revenues, expenses]) => revenues + expenses)
				)(...transactions)
			)
		);
	}

	get monthly_incomes() {
		this.response = this._monthly_incomes_().pipe(
			rxmap((monthly_incomes) => ({ monthly_incomes })),
			catchError(catch_with_default({ monthly_incomes: [] }, "monthly_incomes")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get incomes_change() {
		this.response = this._monthly_incomes_(this.months).pipe(
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
			),
			rxmap((incomes_change) => ({ incomes_change })),
			catchError(catch_with_default({ incomes_change: {} }, "incomes_change")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get expenses_change() {
		this.response = this._monthly_expenses_(this.months).pipe(
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
			),
			rxmap((expenses_change) => ({ expenses_change })),
			catchError(catch_with_default({ expenses_change: {} }, "expenses_change")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get revenues_change() {
		this.response = this._monthly_revenues_(this.months).pipe(
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
			),
			rxmap((revenues_change) => ({ revenues_change })),
			catchError(catch_with_default({ revenues_change: {} }, "revenues_change")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get highest_income() {
		this.response = this._monthly_incomes_(this.months).pipe(
			rxmap(
				pipe(takeLast(6), sort(descend(identity)), take(2), ([curr, prev]) => {
					let change = percentage_change(prev, curr);

					return {
						name: "Highest net income in last 6 months",
						stat: currency_precise(2).format(curr.toFixed(2)),
						previousStat: prev.toFixed(2),
						change: `${change.toFixed(2)}%`,
						changeType: change_type(change),
					};
				})
			),
			rxmap((highest_income) => ({ highest_income })),
			catchError(catch_with_default({ highest_income: {} }, "highest_income")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get highest_expense() {
		this.response = this._monthly_expenses_(this.months).pipe(
			rxmap(
				pipe(takeLast(6), sort(ascend(identity)), take(2), ([curr, prev]) => {
					let change = percentage_change(prev, curr);

					return {
						name: "Highest spending in last 6 months",
						stat: currency_precise(2).format(curr.toFixed(2)),
						previousStat: prev.toFixed(2),
						change: `${change.toFixed(2)}%`,
						changeType: change_type(change),
					};
				})
			),
			rxmap((highest_expense) => ({ highest_expense })),
			catchError(catch_with_default({ highest_expense: {} }, "highest_expense")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get highest_revenue() {
		this.response = this._monthly_revenues_(this.months).pipe(
			rxmap(
				pipe(takeLast(6), sort(descend(identity)), take(2), ([curr, prev]) => {
					let change = percentage_change(prev, curr);

					return {
						name: "Highest revenue in last 6 months",
						stat: currency_precise(2).format(curr.toFixed(2)),
						previousStat: prev.toFixed(2),
						change: `${change.toFixed(2)}%`,
						changeType: change_type(change),
					};
				})
			),
			rxmap((highest_revenue) => ({ highest_revenue })),
			catchError(catch_with_default({ highest_revenue: {} }, "highest_revenue")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get average_daily_balance() {
		let start_date = moment().subtract(this.months, "months").format("YYYY-MM-DD");
		let end_date = moment().format("YYYY-MM-DD");

		let plaid = new Plaid(this.group_id);
		let current_balance = plaid.current_balance;

		this.response = this._transactions_.pipe(
			rxmap(
				pipe(
					transactions_by_date(start_date, end_date),
					sortBy(get("date")),
					reverse,
					mod(all)(pipe(pick(["amount"])))
				)
			),
			concatMap((transactions) =>
				forkJoin({
					transactions: rxof(transactions),
					current_balance,
				})
			),
			rxmap(({ transactions, current_balance }) => with_daily_balance(current_balance, transactions)),
			rxmap(
				pipe(get(all, "balance"), average, (value) => {
					return {
						name: "Average daily balance",
						value: currency.format(value),
						change: "+54.02%",
						changeType: "negative",
					};
				})
			),
			rxmap((average_daily_balance) => ({ average_daily_balance })),
			catchError(catch_with_default({ average_daily_balance: {} }, "average_daily_balance")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get num_of_negative_balance_days() {
		let start_date = moment().subtract(this.months, "months").format("YYYY-MM-DD");
		let end_date = moment().format("YYYY-MM-DD");

		let plaid = new Plaid(this.group_id);
		let current_balance = plaid.current_balance;

		this.response = this._transactions_.pipe(
			rxmap(
				pipe(
					transactions_by_date(start_date, end_date),
					sortBy(get("date")),
					reverse,
					mod(all)(pipe(pick(["amount"])))
				)
			),
			concatMap((transactions) =>
				forkJoin({
					transactions: rxof(transactions),
					current_balance,
				})
			),
			rxmap(({ transactions, current_balance }) => with_daily_balance(current_balance, transactions)),
			rxmap(
				pipe(
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
			),
			rxmap((num_of_negative_balance_days) => ({ num_of_negative_balance_days })),
			catchError(catch_with_default({ num_of_negative_balance_days: {} }, "num_of_negative_balance_days")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get annual_revenue() {
		let start_date = moment().subtract(this.months, "months").format("YYYY-MM-DD");
		let end_date = moment().format("YYYY-MM-DD");

		this.response = this._transactions_.pipe(
			rxmap(
				pipe(
					transactions_by_date(start_date, end_date),
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
			),
			rxmap((annual_revenue) => ({ annual_revenue })),
			catchError(catch_with_default({ annual_revenue: {} }, "annual_revenue")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get has_plaid_credentials() {
		let plaid = new Plaid(this.group_id);
		return plaid.has_credentials;
	}

	get plaid_accounts() {
		let accounts_queries = [
			{
				param: "group_id",
				predicate: "==",
				value: this.group_id,
			},
		];

		let accounts = get_collection({
			path: ["plaid_accounts"],
			queries: accounts_queries,
		});

		return from(accounts).pipe(rxmap((accounts) => ({ accounts })));
	}

	get fold() {
		return this.response.pipe(
			catchError((error) => {
				console.log("api.client.Entity.fold.error");
				console.log(error);
				return rxof({});
			})
		);
	}
}
