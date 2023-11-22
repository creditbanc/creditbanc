import { store } from "~/utils/helpers";

export default store({
	loan_type: "sba",
	loan_amount: 270000,
	first_name: "",
	last_name: "",
	email: "",
	phone: "",
	timeline: { amount: 14, type: "days" },
	time_in_business: { min: 0, max: 6, type: "months" },
	business_start_date: { day: 1, month: 1, year: 2023 },
	industry: "Administrative and Business Services",
	business_address: {
		street: "",
		city: "",
		state: "",
		zip: "",
	},
	business_entity: "Sole Proprietorship",
	employees: {
		min: 0,
		max: 0,
	},
	revenue: {
		min: 0,
		max: 0,
	},
	owners: {},
	legal_name: "",
	dba: "",
	ein: "",
	liens: {
		value: false,
		payment_plan: false,
		amount: 0,
	},
	loans: {
		value: false,
		number_of_loans: 0,
		amount: 0,
	},
	last_tax_return_year: "2022",
});
