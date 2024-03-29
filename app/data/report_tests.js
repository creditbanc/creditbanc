import { pipe, hasPath } from "ramda";

export const experian_tests = {
	has_score: pipe(
		hasPath([
			"data",
			"commercial_data",
			"experian",
			"intelliscore",
			"commercialScore",
			"score",
		])
	),

	has_risk: pipe(
		hasPath([
			"data",
			"commercial_data",
			"experian",
			"intelliscore",
			"commercialScore",
			"riskClass",
		])
	),

	has_business: pipe(
		hasPath([
			"data",
			"commercial_data",
			"experian",
			"business_match",
			"response",
			0,
		])
	),

	has_trade_summary: pipe(
		hasPath([
			"data",
			"commercial_data",
			"experian",
			"trades",
			"tradePaymentSummary",
		])
	),

	has_trade_payment_totals: pipe(
		hasPath([
			"data",
			"commercial_data",
			"experian",
			"trades",
			"tradePaymentTotals",
		])
	),

	has_trade_lines: pipe(
		hasPath([
			"data",
			"commercial_data",
			"experian",
			"trades",
			"tradePaymentExperiences",
		])
	),

	has_derogatories: pipe(
		hasPath(["data", "commercial_data", "experian", "legal_collections"])
	),

	has_payment_trends: pipe(
		hasPath([
			"data",
			"commercial_data",
			"experian",
			"trades",
			"tradePaymentTrends",
			"monthlyTrends",
		])
	),

	has_company_info: pipe(
		hasPath(["data", "commercial_data", "experian", "facts"])
	),

	has_factors: pipe(hasPath(["data", "commercial_data", "experian", "fsr"])),
};

export const report_tests = {
	essential: {
		experian: [experian_tests.has_score],
	},
	builder: {
		experian: [
			experian_tests.has_score,
			experian_tests.has_risk,
			experian_tests.has_business,
			experian_tests.has_trade_summary,
			experian_tests.has_trade_payment_totals,
			experian_tests.has_trade_lines,
			experian_tests.has_derogatories,
			experian_tests.has_payment_trends,
			experian_tests.has_company_info,
			experian_tests.has_factors,
		],
	},
};
