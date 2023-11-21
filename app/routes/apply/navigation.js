export const navigation = [
	{
		id: "lp",
		step: "lp",
		next: ({ entity_id, group_id }) => `/apply/financing_needs/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "financing_needs",
		step: "financing_needs",
		next: ({ entity_id, group_id }) => `/apply/info/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/lp/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "info",
		step: "info",
		next: ({ entity_id, group_id }) => `/apply/inception_date/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/financing_needs/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "inception_date",
		step: "inception_date",
		next: ({ entity_id, group_id }) => `/apply/industry/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/info/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "industry",
		step: "industry",
		next: ({ entity_id, group_id }) => `/apply/entity/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/inception_date/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "entity",
		step: "entity",
		next: ({ entity_id, group_id }) => `/apply/address/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/industry/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "address",
		step: "address",
		next: ({ entity_id, group_id }) => `/apply/annual_revenue/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/entity/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "annual_revenue",
		step: "annual_revenue",
		next: ({ entity_id, group_id }) => `/apply/owners/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/address/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "owners",
		step: "owners",
		next: ({ entity_id, group_id }) => `/apply/liens/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/annual_revenue/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "loans",
		step: "loans",
		next: ({ entity_id, group_id }) => `/apply/liens/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/owners/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "liens",
		step: "liens",
		next: ({ entity_id, group_id }) => `/apply/tax_return/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/loans/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "tax_return",
		step: "complete",
		next: ({ entity_id, group_id }) => `/home/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/liens/resource/e/${entity_id}/g/${group_id}`,
	},
	// {
	// 	id: "employees",
	// 	step: "employees",
	// 	next: ({ entity_id, group_id }) => `/apply/owners/resource/e/${entity_id}/g/${group_id}`,
	// 	back: ({ entity_id, group_id }) => `/apply/annual_revenue/resource/e/${entity_id}/g/${group_id}`,
	// },
];
