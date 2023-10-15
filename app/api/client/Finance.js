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
} from "ramda";
import { set_doc, get_doc, get_collection } from "~/utils/firebase";
import { forkJoin, from, merge, of as rxof, throwError, zip } from "rxjs";
import { map as rxmap, concatMap, catchError, reduce as rxreduce, filter as rxfilter, tap } from "rxjs/operators";
import { get, inspect, jsreduce } from "~/utils/helpers";
import { mod, all } from "shades";
import Plaid from "./plaid";

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

let with_daily_balance = curry((account_balance, transactions) => {
	console.log("with_daily_balance");
	console.log(account_balance);
	console.log(transactions);

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

export default class Finance {
	constructor(entity_id, group_id) {
		this.entity_id = entity_id;
		this.group_id = group_id;

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

	recent_activty = (num_of_transactions = 20) => {
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
			tap(() => console.log("___recent_activty____")),
			tap(inspect),
			rxmap((recent_activty) => ({ recent_activty })),
			catchError(catch_with_default({ recent_activty: [] }, "recent_activty")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	};

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
