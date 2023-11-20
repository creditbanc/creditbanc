import { store } from "~/utils/helpers";

export default store({
	loan_type: "sba",
	loan_amount: 270000,
	first_name: "",
	last_name: "",
	email: "",
	timeline: { amount: 14, type: "days" },
	time_in_business: { min: 0, max: 6, type: "months" },
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
	ein: "",
});
