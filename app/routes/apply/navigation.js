export const navigation = [
	{
		id: "lp",
		next: ({ entity_id, group_id }) => `/apply/financing_needs/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "financing_needs",
		next: ({ entity_id, group_id }) => `/apply/info/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/lp/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "info",
		next: ({ entity_id, group_id }) => `/apply/inception_date/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/financing_needs/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "inception_date",
		next: ({ entity_id, group_id }) => `/apply/industry/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/info/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "industry",
		next: ({ entity_id, group_id }) => `/apply/entity/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/inception_date/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "entity",
		next: ({ entity_id, group_id }) => `/apply/address/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/industry/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "address",
		next: ({ entity_id, group_id }) => `/apply/employees/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/entity/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "employees",
		next: ({ entity_id, group_id }) => `/apply/annual_revenue/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/entity/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "annual_revenue",
		next: ({ entity_id, group_id }) => `/apply/owners/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/employees/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "owners",
		next: ({ entity_id, group_id }) => `/home/resource/e/${entity_id}/g/${group_id}`,
		back: ({ entity_id, group_id }) => `/apply/annual_revenue/resource/e/${entity_id}/g/${group_id}`,
	},
];
