import { store } from "~/utils/helpers";
export default store({
	loan_type: "sba",
	loan_amount: 270000,
	first_name: "",
	last_name: "",
	email: "",
	timeline: { amount: 14, type: "days" },
	time_in_business: { amount: 2, type: "years" },
});
