export const plan_product_requests = {};
plan_product_requests.experian = {};
plan_product_requests.dnb = {};

plan_product_requests.experian.essential = ["experian_intelliscore"];

plan_product_requests.experian.builder = [
	"experian_intelliscore",
	"experian_business_match",
	"experian_trades",
	"experian_business_facts",
	// "experian_fsr",
	"experian_legal_collections",
];

plan_product_requests.experian.pro = [
	"experian_intelliscore",
	"experian_business_match",
	"experian_trades",
	"experian_business_facts",
	// "experian_fsr",
	"experian_legal_collections",
];

plan_product_requests.dnb.essential = ["dnb_pi_l3"];

plan_product_requests.dnb.builder = ["dnb_pi_l3", "dnb_ci_l2"];

plan_product_requests.dnb.pro = ["dnb_pi_l3", "dnb_ci_l2"];
