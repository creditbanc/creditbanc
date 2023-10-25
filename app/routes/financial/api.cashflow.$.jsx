import { get_group_id, inspect, use_search_params } from "~/utils/helpers";
import { pipe, map, isEmpty, last } from "ramda";
import { from, lastValueFrom, tap } from "rxjs";
import { concatMap, map as rxmap } from "rxjs/operators";
import moment from "moment";
import axios from "axios";
import { get_session_entity_id } from "~/utils/auth.server";
import Plaid from "~/api/client/plaid";
import Finance from "~/api/client/Finance";
import { get } from "shades";

let start_date_of_months = (start_date, end_date) => {
	let months = [];
	start_date = moment(start_date);
	end_date = moment(end_date);

	while (start_date < end_date) {
		months = [...months, start_date.startOf("month").format("YYYY-MM-DD")];

		start_date.add(1, "month");
	}

	return months;
};

export const loader = async ({ request }) => {
	console.log("cashflow_loader");

	let { origin } = new URL(request.url);
	let { income: income_start_month = 12 } = use_search_params(request);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(request.url);

	let plaid = new Plaid(group_id);
	// return { error: "no credentials" };
	let plaid_accounts = await lastValueFrom(await plaid.accounts());
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

	let bank_accounts = pipe(get("accounts"), (accounts) => ({
		accounts: pipe(
			map((account) => ({
				name: account.name,
				official_name: account.official_name,
				subtype: account.subtype,
				balance: account.balances.current,
				mask: account.mask,
				id: account.account,
			}))
		)(accounts),
		total_balance: accounts.reduce((acc, { balances }) => acc + balances.current, 0),
	}))(plaid_accounts);

	// console.log("current_balance______");
	// console.log(current_balance);
	// inspect(plaid_accounts);

	if (isEmpty(accounts)) {
		return { error: "no accounts" };
	}

	let {
		data: { transactions = [] },
	} = await axios({
		method: "get",
		url: `${origin}/financial/api/transactions/resource/e/${entity_id}/g/${group_id}`,
	});

	// console.log("api.cashflow.transactions______");
	// console.log(transactions);

	let start_date = moment().subtract(income_start_month, "months").format("YYYY-MM-DD");
	let end_date = moment().format("YYYY-MM-DD");

	let response =
		finance.average_daily_balance.monthly_expenses.monthly_revenues.monthly_transactions.monthly_incomes.recent_activity()
			.incomes_change.expenses_change.revenues_change.highest_income.highest_expense.highest_revenue
			.num_of_negative_balance_days.annual_revenue.fold;

	let data = response.pipe(
		tap(() => console.log("plaid_res")),
		tap(console.log),

		rxmap((response) => ({
			...response,
			bank_accounts,
			stats_data: {
				revenues: [response.highest_revenue, response.revenues_change],
				expenses: [response.highest_expense, response.expenses_change],
			},
			month_labels: pipe(map((date) => moment(date).format("MMM")))(start_date_of_months(start_date, end_date)),
		}))
	);

	return lastValueFrom(data);
};
