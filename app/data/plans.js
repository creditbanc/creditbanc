export const plans = {};

plans.essential = {
	personal: {
		experian: {
			authorized: true,
			score: true,
			trade_lines: false,
			factors: false,
		},
		equifax: {
			authorized: false,
			score: true,
			trade_lines: false,
			factors: false,
		},
		transunion: {
			authorized: false,
			score: true,
			trade_lines: false,
			factors: false,
		},
	},
	business: {
		experian: {
			score: true,
			risk_class: false,
			business: false,
			trade_summary: false,
			trade_lines_payment_totals: false,
			trade_lines: false,
			derogatories: false,
			trends: false,
			years_on_file: false,
			employee_size: false,
			sic_code: false,
			naics_code: false,
			sales_revenue: false,
			years_on_file: false,
			employee_size: false,
			sic_code: false,
			naics_code: false,
			sales_revenue: false,
			factors: false,
		},
		dnb: {
			score: true,
			trade_lines: false,
			factors: false,
		},
	},
};

plans.builder = {
	personal: {
		experian: {
			authorized: true,
			score: true,
			trade_lines: false,
			factors: false,
		},
		equifax: {
			authorized: true,
			score: true,
			trade_lines: false,
			factors: false,
		},
		transunion: {
			authorized: true,
			score: true,
			trade_lines: false,
			factors: false,
		},
	},
	business: {
		experian: {
			score: true,
			risk_class: true,
			business: true,
			trade_summary: true,
			trade_lines_payment_totals: true,
			trade_lines: true,
			derogatories: true,
			trends: true,
			years_on_file: true,
			employee_size: true,
			sic_code: true,
			naics_code: true,
			sales_revenue: true,
			years_on_file: true,
			employee_size: true,
			sic_code: true,
			naics_code: true,
			sales_revenue: true,
			factors: true,
		},
		dnb: {
			score: true,
			trade_lines: false,
			factors: false,
		},
	},
};
