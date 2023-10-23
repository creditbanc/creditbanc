import { get_group_id, use_search_params } from "~/utils/helpers";
import { pipe, map, isEmpty, last } from "ramda";
import { from, lastValueFrom, tap } from "rxjs";
import { concatMap, map as rxmap } from "rxjs/operators";
import moment from "moment";
import axios from "axios";
import { get_session_entity_id } from "~/utils/auth.server";
import Plaid from "~/api/client/plaid";
import Finance from "~/api/client/Finance";

export const loader = async ({ request }) => {
	console.log("cashflow_loader");

	let { origin } = new URL(request.url);
	let { income: income_start_month = 12 } = use_search_params(request);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(request.url);

	let plaid = new Plaid(group_id);
	// return { error: "no credentials" };
	// let current_balance = plaid.current_balance;
	// let transactions = await plaid.transactions();
	let finance = new Finance(entity_id, group_id);
	let has_credentials = await lastValueFrom(finance.has_plaid_credentials);

	if (!has_credentials) {
		return { error: "no credentials" };
	}

	let { data: accounts = [] } = await axios({
		method: "get",
		url: `${origin}/financial/api/accounts/resource/e/${entity_id}/g/${group_id}`,
	});

	// console.log("accounts______");
	// console.log(accounts);

	if (isEmpty(accounts)) {
		return { error: "no accounts" };
	}

	// transactions.pipe(
	// 	tap(() => console.log("transactions______")),
	// 	tap(console.log)
	// 	// concatMap(({ transactions }) => {
	// 	// 	return from(finance.set_transactions({ transactions }));
	// 	// }),
	// );
	// // .subscribe();

	// let start_date = moment().subtract(income_start_month, "months").format("YYYY-MM-DD");
	// let end_date = moment().format("YYYY-MM-DD");

	// let start_date_of_months = (start_date, end_date) => {
	// 	let months = [];
	// 	start_date = moment(start_date);
	// 	end_date = moment(end_date);

	// 	while (start_date < end_date) {
	// 		months = [...months, start_date.startOf("month").format("YYYY-MM-DD")];

	// 		start_date.add(1, "month");
	// 	}

	// 	return months;
	// };

	// let response =
	// 	finance.average_daily_balance.monthly_expenses.monthly_revenues.monthly_transactions.monthly_incomes.recent_activity()
	// 		.incomes_change.expenses_change.revenues_change.highest_income.highest_expense.highest_revenue
	// 		.num_of_negative_balance_days.annual_revenue.fold;

	// let data = response.pipe(
	// 	// tap(() => console.log("plaid_res")),
	// 	// tap(console.log),
	// 	rxmap((response) => ({
	// 		...response,
	// 		stats_data: {
	// 			revenues: [response.highest_revenue, response.revenues_change],
	// 			expenses: [response.highest_expense, response.expenses_change],
	// 		},
	// 		month_labels: pipe(map((date) => moment(date).format("MMM")))(start_date_of_months(start_date, end_date)),
	// 	}))
	// );

	// return lastValueFrom(data);
};
