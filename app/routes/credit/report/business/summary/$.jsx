import { fb_data } from "~/data/lendflow";
import { identity, pipe, splitEvery, values, mapObjIndexed } from "ramda";
import { get, map } from "shades";
import { capitalize, mapIndexed, currency } from "~/utils/helpers";

const data = fb_data;

let summary_data = [
	{
		key: "Current Dbt",
		value: pipe(
			get(
				"data",
				"commercial_data",
				"experian",
				"trades",
				"tradePaymentSummary",
				"currentDbt"
			)
		)(data),
	},
	{
		key: "All Tradeline Count",
		value: pipe(
			get(
				"data",
				"commercial_data",
				"experian",
				"trades",
				"tradePaymentSummary",
				"allTradelineCount"
			)
		)(data),
	},
	{
		key: "Median Credit Amount Extended",
		value: pipe(
			get(
				"data",
				"commercial_data",
				"experian",
				"trades",
				"tradePaymentSummary",
				"medianCreditAmountExtended"
			)
		)(data),
	},
	{
		key: "Monthly Average Dbt",
		value: pipe(
			get(
				"data",
				"commercial_data",
				"experian",
				"trades",
				"tradePaymentSummary",
				"monthlyAverageDbt"
			)
		)(data),
	},
	{
		key: "All Tradeline Balance",
		value: pipe(
			get(
				"data",
				"commercial_data",
				"experian",
				"trades",
				"tradePaymentSummary",
				"allTradelineBalance"
			)
		)(data),
	},
	{
		key: "Single High Credit",
		value: pipe(
			get(
				"data",
				"commercial_data",
				"experian",
				"trades",
				"tradePaymentSummary",
				"singleHighCredit"
			)
		)(data),
	},
	{
		key: "Highest Dbt 6 Months",
		value: pipe(
			get(
				"data",
				"commercial_data",
				"experian",
				"trades",
				"tradePaymentSummary",
				"highestDbt6Months"
			)
		)(data),
	},
	{
		key: "Current Tradeline Count",
		value: pipe(
			get(
				"data",
				"commercial_data",
				"experian",
				"trades",
				"tradePaymentSummary",
				"currentTradelineCount"
			)
		)(data),
	},
	{
		key: "Highest Dbt 5 Quarters",
		value: pipe(
			get(
				"data",
				"commercial_data",
				"experian",
				"trades",
				"tradePaymentSummary",
				"highestDbt5Quarters"
			)
		)(data),
	},
	{
		key: "Current Account Balance",
		value: pipe(
			get(
				"data",
				"commercial_data",
				"experian",
				"trades",
				"tradePaymentSummary",
				"currentAccountBalance"
			)
		)(data),
	},
];

let tradeAdditional = pipe(
	get(
		"data",
		"commercial_data",
		"experian",
		"trades",
		"tradePaymentExperiences",
		"tradeAdditional"
	),
	map((trade) => ({
		account_balance_amount: trade.accountBalance.amount,
		business_category: trade.businessCategory,
		recent_high_credit_amount: trade.recentHighCredit.amount,
		current_percentage: trade.currentPercentage,
		customer_dispute_indicator: trade.customerDisputeIndicator,
	}))
)(data);

let tradeNewAndContinuous = pipe(
	get(
		"data",
		"commercial_data",
		"experian",
		"trades",
		"tradePaymentExperiences",
		"tradeNewAndContinuous"
	),
	map((trade) => ({
		account_balance_amount: trade.accountBalance.amount,
		business_category: trade.businessCategory,
		recent_high_credit_amount: trade.recentHighCredit.amount,
		current_percentage: trade.currentPercentage,
		customer_dispute_indicator: trade.customerDisputeIndicator,
	}))
)(data);

let tradelines = pipe(
	get(
		"data",
		"commercial_data",
		"experian",
		"trades",
		"tradePaymentTotals",
		"tradelines"
	),
	(value) => [
		{ label: "Current Dbt", value: value.currentDbt ?? 0 },
		{
			label: "Current Percentage",
			value: value.currentPercentage + "%" ?? 0 + "%",
		},
		{
			label: "Total Account Balance",
			value: currency.format(value.totalAccountBalance.amount) ?? 0,
		},
		{
			label: "Total High Credit Amount",
			value: currency.format(value.totalHighCreditAmount.amount) ?? 0,
		},
	]
)(data);

let combinedTradelines = pipe(
	get(
		"data",
		"commercial_data",
		"experian",
		"trades",
		"tradePaymentTotals",
		"combinedTradelines"
	),
	(value) => [
		{ label: "Current Dbt", value: value.currentDbt ?? 0 },
		{
			label: "Current Percentage",
			value: value.currentPercentage + "%" ?? 0 + "%",
		},
		{
			label: "Total Account Balance",
			value: currency.format(value.totalAccountBalance.amount) ?? 0,
		},
		{
			label: "Total High Credit Amount",
			value: currency.format(value.totalHighCreditAmount.amount) ?? 0,
		},
	]
)(data);

let additionalTradelines = pipe(
	get(
		"data",
		"commercial_data",
		"experian",
		"trades",
		"tradePaymentTotals",
		"additionalTradelines"
	),
	(value) => [
		{ label: "Current Dbt", value: value.currentDbt ?? 0 },
		{
			label: "Current Percentage",
			value: value.currentPercentage + "%" ?? 0 + "%",
		},
		{
			label: "Total Account Balance",
			value: currency.format(value.totalAccountBalance.amount) ?? 0,
		},
		{
			label: "Total High Credit Amount",
			value: currency.format(value.totalHighCreditAmount.amount) ?? 0,
		},
	]
)(data);

let newlyReportedTradelines = pipe(
	get(
		"data",
		"commercial_data",
		"experian",
		"trades",
		"tradePaymentTotals",
		"newlyReportedTradelines"
	),
	(value) => [
		{ label: "Current Dbt", value: value.currentDbt ?? 0 },
		{
			label: "Current Percentage",
			value: value.currentPercentage + "%" ?? 0 + "%",
		},
		{
			label: "Total Account Balance",
			value: currency.format(value.totalAccountBalance.amount) ?? 0,
		},
		{
			label: "Total High Credit Amount",
			value: currency.format(value.totalHighCreditAmount.amount) ?? 0,
		},
	]
)(data);

let continuouslyReportedTradelines = pipe(
	get(
		"data",
		"commercial_data",
		"experian",
		"trades",
		"tradePaymentTotals",
		"continuouslyReportedTradelines"
	),
	(value) => [
		{ label: "Current Dbt", value: value.currentDbt ?? 0 },
		{
			label: "Current Percentage",
			value: value.currentPercentage + "%" ?? 0 + "%",
		},
		{
			label: "Total Account Balance",
			value: currency.format(value.totalAccountBalance.amount) ?? 0,
		},
		{
			label: "Total High Credit Amount",
			value: currency.format(value.totalHighCreditAmount.amount) ?? 0,
		},
	]
)(data);

const PersonalInfoCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border my-4">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Trade Summary
				</h3>
				{/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
					Below is your personal information as it appears in your
					credit file. This information includes your legal name,
					current and previous addresses, employment information and
					other details.
				</p> */}
			</div>
			<div className="border-t border-gray-200 px-4 py-1 divide-y">
				{pipe(
					splitEvery(1),
					mapIndexed((row, row_index) => (
						<div
							key={row_index}
							className="flex flex-row items-center text-gray-600"
						>
							{mapIndexed((column, column_index) => (
								<div
									className="flex flex-col px-2 text-sm w-full my-3"
									key={column_index}
								>
									<div className="flex flex-row justify-between">
										<div className="font-semibold">
											{column.key}
										</div>
										<div className="flex flex-col items-start">
											{column.value}
										</div>
									</div>
								</div>
							))(row)}
						</div>
					))
				)(summary_data)}
			</div>
		</div>
	);
};

const TradeAdditional = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border my-4">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Trade Additional
				</h3>
				{/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
					Below is your personal information as it appears in your
					credit file. This information includes your legal name,
					current and previous addresses, employment information and
					other details.
				</p> */}
			</div>
			<div className="border-t border-gray-200 px-4 py-1 divide-y">
				{pipe(
					map(values),
					// splitEvery(1),
					mapIndexed((row, row_index) => (
						<div
							key={row_index}
							className="flex flex-row items-center text-gray-600"
						>
							{mapIndexed((column, column_index) => (
								<div
									className="flex flex-col px-2 text-sm w-full my-3"
									key={column_index}
								>
									<div className="flex flex-row justify-between">
										{capitalize(column.toString())}
									</div>
								</div>
							))(row)}
						</div>
					))
				)(tradeAdditional)}
			</div>
		</div>
	);
};

const TradeNewAndContinuous = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border my-4">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Trade New And Continuous
				</h3>
				{/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
					Below is your personal information as it appears in your
					credit file. This information includes your legal name,
					current and previous addresses, employment information and
					other details.
				</p> */}
			</div>
			<div className="border-t border-gray-200 px-4 py-1 divide-y">
				{pipe(
					map(values),
					// splitEvery(1),
					mapIndexed((row, row_index) => (
						<div
							key={row_index}
							className="flex flex-row items-center text-gray-600"
						>
							{mapIndexed((column, column_index) => (
								<div
									className="flex flex-col px-2 text-sm w-full my-3"
									key={column_index}
								>
									<div className="flex flex-row justify-between">
										{capitalize(column.toString())}
									</div>
								</div>
							))(row)}
						</div>
					))
				)(tradeNewAndContinuous)}
			</div>
		</div>
	);
};

const TradePaymentTotals = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border my-4">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Trade Payment Totals
				</h3>
				{/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
					Below is your personal information as it appears in your
					credit file. This information includes your legal name,
					current and previous addresses, employment information and
					other details.
				</p> */}
			</div>
			<div className="border-t border-gray-200 px-2 py-2">
				<div className="ml-2 mb-4">
					<h1>Trade Lines</h1>
				</div>
				<div className="flex flex-row justify-between my-2">
					{pipe(
						map((column) => (
							<div className="border w-1/4 mx-1 p-2 rounded">
								<div className="text-sm text-gray-500 mb-2">
									{column.label}
								</div>
								<div className="font-semibold">
									{column.value}
								</div>
							</div>
						))
					)(tradelines)}
				</div>
				<div className="ml-2 mb-4">
					<h1>Combined Trade Lines</h1>
				</div>
				<div className="flex flex-row justify-between my-2">
					{pipe(
						map((column) => (
							<div className="border w-1/4 mx-1 p-2 rounded">
								<div className="text-sm text-gray-500 mb-2">
									{column.label}
								</div>
								<div className="font-semibold">
									{column.value}
								</div>
							</div>
						))
					)(combinedTradelines)}
				</div>
				<div className="ml-2 mb-4">
					<h1>Additional Trade Lines</h1>
				</div>
				<div className="flex flex-row justify-between my-2">
					{pipe(
						map((column) => (
							<div className="border w-1/4 mx-1 p-2 rounded">
								<div className="text-sm text-gray-500 mb-2">
									{column.label}
								</div>
								<div className="font-semibold">
									{column.value}
								</div>
							</div>
						))
					)(additionalTradelines)}
				</div>
				<div className="ml-2 mb-4">
					<h1>Newly Reported Trade Lines</h1>
				</div>
				<div className="flex flex-row justify-between my-2">
					{pipe(
						map((column) => (
							<div className="border w-1/4 mx-1 p-2 rounded">
								<div className="text-sm text-gray-500 mb-2">
									{column.label}
								</div>
								<div className="font-semibold">
									{column.value}
								</div>
							</div>
						))
					)(newlyReportedTradelines)}
				</div>
				<div className="ml-2 mb-4">
					<h1>Continuously Reported Trade Lines</h1>
				</div>
				<div className="flex flex-row justify-between my-2">
					{pipe(
						map((column) => (
							<div className="border w-1/4 mx-1 p-2 rounded">
								<div className="text-sm text-gray-500 mb-2">
									{column.label}
								</div>
								<div className="font-semibold">
									{column.value}
								</div>
							</div>
						))
					)(continuouslyReportedTradelines)}
				</div>
			</div>
		</div>
	);
};

export default function Summary() {
	return (
		<div className="flex flex-col w-full">
			<PersonalInfoCard />
			<TradeAdditional />
			<TradeNewAndContinuous />
			<TradePaymentTotals />
		</div>
	);
}
