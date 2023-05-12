export const plan = {};

plan.essential = {
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

plan.builder = {
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
			risk_class: true,
			business: true,
			trade_summary: true,
		},
		dnb: {
			score: true,
			trade_lines: false,
			factors: false,
		},
	},
};
