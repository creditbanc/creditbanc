export const plans = {};

plans.essential = {
	personal: {
		experian: {
			score: true,
			trade_lines: false,
			factors: false,
		},
		equifax: {
			score: true,
			trade_lines: false,
			factors: false,
		},
		transunion: {
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
			score: true,
			trade_lines: false,
			factors: false,
		},
		equifax: {
			score: true,
			trade_lines: false,
			factors: false,
		},
		transunion: {
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
