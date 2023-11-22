import { store } from "~/utils/helpers";

export default store({
	loan_type: "sba",
	loan_amount: 270000,
	first_name: "",
	last_name: "",
	email: "",
	phone: "",
	timeline: { amount: 14, type: "days" },
	business_start_date: { day: undefined, month: undefined, year: undefined },
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
	revenue: 300000,
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
	signature_base_64_img: "",
	signed_date: "",
});
