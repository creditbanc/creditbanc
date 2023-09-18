import axios from "axios";
const LENDFLOW_BEARER = process.env.LENDFLOW;
import { plan_product_requests } from "~/data/plan_product_requests";
import { pipe, always, identity, tryCatch, curry, applySpec } from "ramda";
import { get } from "shades";
import Entity from "~/api/internal/entity";
import { set_doc } from "./firebase";
import { data } from "autoprefixer";
import { inspect } from "./helpers";

const anyfy = (fn: any): any => fn;

const falsyTryCatch = curry((successFn, errorFn, data) => {
	let result = tryCatch(successFn, errorFn)(data);
	if (!result) return errorFn(data);
	return result;
});

interface LendflowReport {
	commercial_data?: {
		experian?: {
			trades?: {
				tradePaymentTotals?: any;
			};
			intelliscore?: {
				commercialScore?: {
					score?: any;
				};
			};
		};
	};
	[key: string]: any;
}

interface Application {
	group_id: string;
	entity_id: string;
	plan_id: string;
	application_id: string;
	type: string;
	id: string;
}

interface ApplicationForm {
	business_start_date: "string";
	basic_info: {
		first_name: "string";
		last_name: "string";
		email_address: "string";
		telephone: "string";
		doing_business_as: "string";
	};
	business_address: {
		address_line: "string";
		address_line_2: "string";
		city: "string";
		state: "string";
		country: "string";
		zip: "string";
	};
	business_entity: "string";
	business_legal_name: "string";
	employee_identification_number: "string";
	terms_of_service: boolean;
	requested_products: string[];
}

export class LendflowInternal {
	constructor(public report: LendflowReport) {}

	business_info = () => {
		const lens_path = [
			"commercial_data",
			"experian",
			"business_match",
			"response",
			0,
		];

		const spec = applySpec({
			name: pipe(get("businessName")),
			phone: pipe(get("phone")),
			address: pipe(get("address")),
		});

		return falsyTryCatch(
			pipe(get(...lens_path), spec),
			always({})
		)(this.report);
	};

	experian_score = () => {
		const lens_path = [
			"commercial_data",
			"experian",
			"intelliscore",
			"commercialScore",
			"score",
		];
		return falsyTryCatch(pipe(get(...lens_path)), always(0))(this.report);
	};

	experian_risk_class = () => {
		const lens_path = [
			"commercial_data",
			"experian",
			"intelliscore",
			"commercialScore",
			"riskClass",
		];
		return falsyTryCatch(pipe(get(...lens_path)), always({}))(this.report);
	};

	experian_trade_summary = () => {
		const lens_path = [
			"commercial_data",
			"experian",
			"trades",
			"tradePaymentSummary",
		];
		return falsyTryCatch(pipe(get(...lens_path)), always({}))(this.report);
	};

	experian_trade_payment_totals = () => {
		const lens_path = [
			"commercial_data",
			"experian",
			"trades",
			"tradePaymentTotals",
		];

		const spec = applySpec({
			trade_lines: pipe(get("tradelines")),
			combined_trade_lines: pipe(get("combinedTradelines")),
			additional_trade_lines: pipe(get("additionalTradelines")),
			newly_reported_trade_lines: pipe(get("newlyReportedTradelines")),
			continuously_reported_trade_lines: pipe(
				get("continuouslyReportedTradelines")
			),
		});

		return falsyTryCatch(
			pipe(get(...lens_path), spec),
			always({})
		)(this.report);
	};

	experian_trade_lines = () => {
		const lens_path = [
			"commercial_data",
			"experian",
			"trades",
			"tradePaymentExperiences",
		];

		return falsyTryCatch(
			pipe(get(...lens_path), (trades) => [
				...trades.tradeAdditional,
				...trades.tradeNewAndContinuous,
			]),
			always([])
		)(this.report);
	};

	experian_sic_codes = () => {
		let lens_path = ["commercial_data", "experian", "facts", "sicCodes"];
		return falsyTryCatch(pipe(get(...lens_path)), always({}))(this.report);
	};

	experian_years_on_file = () => {
		let lens_path = ["commercial_data", "experian", "facts", "yearsOnFile"];
		return falsyTryCatch(pipe(get(...lens_path)), always(0))(this.report);
	};

	experian_employee_size = () => {
		let lens_path = [
			"commercial_data",
			"experian",
			"facts",
			"employeeSize",
		];
		return falsyTryCatch(pipe(get(...lens_path)), always(0))(this.report);
	};

	experian_naics_codes = () => {
		let lens_path = ["commercial_data", "experian", "facts", "naicsCodes"];
		return falsyTryCatch(pipe(get(...lens_path)), always({}))(this.report);
	};

	experian_sales_revenue = () => {
		let lens_path = [
			"commercial_data",
			"experian",
			"facts",
			"salesRevenue",
		];
		return falsyTryCatch(pipe(get(...lens_path)), always({}))(this.report);
	};

	experian_factors = () => {
		let lens_path = ["commercial_data", "experian"];
		return falsyTryCatch(
			pipe(get(...lens_path), (experian) => [
				...experian.intelliscore.commercialScoreFactors,
				...experian.fsr.fsrScoreFactors,
			]),
			always([])
		)(this.report);
	};

	experian_derogatories = () => {
		let lens_path = ["commercial_data", "experian", "legal_collections"];
		return falsyTryCatch(
			pipe(
				get(...lens_path),
				({ legalFilingsCollectionsSummary, legalFilingsSummary }) => ({
					legalFilingsCollectionsSummary,
					legalFilingsSummary,
				})
			),
			always({})
		)(this.report);
	};

	experian_payment_trends = () => {
		let lens_path = [
			"commercial_data",
			"experian",
			"trades",
			"tradePaymentTrends",
			"monthlyTrends",
		];
		return falsyTryCatch(pipe(get(...lens_path)), always([]))(this.report);
	};

	dnb_score = () => {
		let lens_path = [
			"commercial_data",
			"dnb",
			"pi_l3",
			"organization",
			"businessTrading",
			0,
			"summary",
			0,
			"paydexScore",
		];
		return falsyTryCatch(pipe(get(...lens_path)), always(0))(this.report);
	};

	dnb_delinquency_score = () => {
		let lens_path = [
			"commercial_data",
			"dnb",
			"fi_l2",
			"organization",
			"dnbAssessment",
			"delinquencyScore",
			"classScoreDescription",
		];
		return falsyTryCatch(pipe(get(...lens_path)), always(""))(this.report);
	};

	dnb_total_balance_high = () => {
		let lens_path = [
			"commercial_data",
			"dnb",
			"pi_l3",
			"organization",
			"businessTrading",
			0,
			"summary",
			0,
			"totalExperiencesAmount",
		];
		return falsyTryCatch(pipe(get(...lens_path)), always(0))(this.report);
	};

	dnb_duns_number = () => {
		let lens_path = [
			"commercial_data",
			"dnb",
			"fi_l2",
			"organization",
			"duns",
		];
		return falsyTryCatch(pipe(get(...lens_path)), always(0))(this.report);
	};

	dnb_payment_status = () => {
		let lens_path = [
			"commercial_data",
			"dnb",
			"pi_l3",
			"organization",
			"businessTrading",
			0,
			"summary",
			0,
		];

		const spec = applySpec({
			maximumOwedAmount: pipe(get("maximumOwedAmount")),
			totalPastDueAmount: pipe(get("totalPastDueAmount")),
			maximumPastDueAmount: pipe(get("maximumPastDueAmount")),
			slowExperiencesCount: pipe(get("slowExperiencesCount")),
			negativePaymentsCount: pipe(get("negativePaymentsCount")),
			paymentBehaviorResult: pipe(get("paymentBehaviorResult")),
			badDebtExperiencesCount: pipe(get("badDebtExperiencesCount")),
			maximumHighCreditAmount: pipe(get("maximumHighCreditAmount")),
			badDebtExperiencesAmount: pipe(get("badDebtExperiencesAmount")),
			negativeExperiencesAmount: pipe(get("negativeExperiencesAmount")),
			slowExperiencesPercentage: pipe(get("slowExperiencesPercentage")),
			slowOrNegativePaymentsCount: pipe(
				get("slowOrNegativePaymentsCount")
			),
			unfavorableExperiencesCount: pipe(
				get("unfavorableExperiencesCount")
			),
			badDebtExperiencesPercentage: pipe(
				get("badDebtExperiencesPercentage")
			),
			unfavorableExperiencesAmount: pipe(
				get("unfavorableExperiencesAmount")
			),
			negativeExperiencesPercentage: pipe(
				get("negativeExperiencesPercentage")
			),
			slowAndNegativeExperiencesAmount: pipe(
				get("slowAndNegativeExperiencesAmount")
			),
			slowOrNegativePaymentsPercentage: pipe(
				get("slowOrNegativePaymentsPercentage")
			),
			unfavorableExperiencesPercentage: pipe(
				get("unfavorableExperiencesPercentage")
			),
			slowExperiencesHighestCreditAmount: pipe(
				get("slowExperiencesHighestCreditAmount")
			),
		});
		return falsyTryCatch(
			pipe(get(...lens_path), spec),
			always({})
		)(this.report);
	};

	dnb_credit_utilization = () => {
		let lens_path = [
			"commercial_data",
			"dnb",
			"pi_l3",
			"organization",
			"businessTrading",
			0,
			"summary",
			0,
		];

		const spec = applySpec({
			averageHighCreditAmount: pipe(get("averageHighCreditAmount")),
			maximumHighCreditAmount: pipe(get("maximumHighCreditAmount")),
			highCreditExperiencesCount: pipe(get("highCreditExperiencesCount")),
			satisfactoryExperiencesCount: pipe(
				get("satisfactoryExperiencesCount")
			),
			satisfactoryExperiencesAmount: pipe(
				get("satisfactoryExperiencesAmount")
			),
			satisfactoryExperiencesPercentage: pipe(
				get("satisfactoryExperiencesPercentage")
			),
			slowExperiencesHighestCreditAmount: pipe(
				get("slowExperiencesHighestCreditAmount")
			),
		});

		return falsyTryCatch(
			pipe(get(...lens_path), spec),
			always({})
		)(this.report);
	};

	dnb_payment_trends = () => {
		let lens_path = [
			"commercial_data",
			"dnb",
			"pi_l3",
			"organization",
			"businessTrading",
			0,
			"summary",
			0,
		];

		const spec = applySpec({
			badDebtExperiencesCount: pipe(get("badDebtExperiencesCount")),
			totalPastDueExperiencesCount: pipe(
				get("totalPastDueExperiencesCount")
			),
		});

		return falsyTryCatch(
			pipe(get(...lens_path), spec),
			always({})
		)(this.report);
	};

	dnb_company_info = () => {
		let lens_path = ["commercial_data", "dnb", "ci_l2", "organization"];

		const spec = applySpec({
			duns: pipe(get("duns")),
			legalForm: pipe(get("legalForm")),
			startDate: pipe(get("startDate")),
			telephone: pipe(get("telephone")),
			activities: pipe(get("activities")),
			financials: pipe(get("financials")),
			primaryName: pipe(get("primaryName")),
			primaryAddress: pipe(get("primaryAddress")),
			registeredName: pipe(get("registeredName")),
			websiteAddress: pipe(get("websiteAddress")),
			tradeStyleNames: pipe(get("tradeStyleNames")),
			incorporatedDate: pipe(get("incorporatedDate")),
			numberOfEmployees: pipe(get("numberOfEmployees")),
		});

		return falsyTryCatch(
			pipe(get(...lens_path), spec),
			always({})
		)(this.report);
	};

	static save_application = async (
		data: Application
	): Promise<Application> => {
		let { application_id } = data;
		await set_doc(["credit_reports", application_id], data);
		return data;
	};
}

export class LendflowExternal {
	static plan_request_products = (plan_id) => {
		let experian_requested_products = pipe(get(plan_id))(
			plan_product_requests.experian
		);

		let dnb_requested_products = pipe(get(plan_id))(
			plan_product_requests.dnb
		);

		let request_products = [
			...experian_requested_products,
			...dnb_requested_products,
		];

		return request_products;
	};

	static new_application_request_creator = (
		application_form: ApplicationForm
	) => {
		var options = {
			method: "post",
			maxBodyLength: Infinity,
			url: "https://api.lendflow.com/api/v1/applications/business_credit",
			headers: {
				Authorization: `Bearer ${LENDFLOW_BEARER}`,
				"Content-Type": "application/json",
			},
			data: application_form,
		};

		return options;
	};

	new_application = async (entity_id, form) => {
		let entity = new Entity(entity_id);
		let plan_id = await entity.plan_id();
		let request = LendflowExternal.new_application_request_creator(form);
		return request;
	};

	static get_lendflow_report = async (application_id: string) => {
		console.log("get_lendflow_report");
		console.log(application_id);

		let options = {
			method: "get",
			maxBodyLength: Infinity,
			url: `https://api.lendflow.com/api/int/applications/${application_id}/commercial_data`,
			headers: {
				Authorization: `Bearer ${LENDFLOW_BEARER}`,
			},
			"Content-Type": "application/json",
			data: {},
		};

		let response = await axios(options);
		// console.log("lendflow_response");
		// inspect(response.data.data);

		return response;
	};
}

export const get_lendflow_report = async (application_id) => {
	let options = {
		method: "get",
		maxBodyLength: Infinity,
		url: `https://api.lendflow.com/api/int/applications/${application_id}/commercial_data`,
		headers: {
			Authorization: `Bearer ${LENDFLOW_BEARER}`,
		},
		"Content-Type": "application/json",
		data: {},
	};

	try {
		let response = await axios(options);
		return response?.data;
	} catch (error) {
		console.log("error");
		console.log(error.response.data);
		return { error: error.message }, { status: 500 };
	}
};

export const update_lendflow_report = async (
	application_id,
	requested_products
) => {
	let options = {
		method: "put",
		maxBodyLength: Infinity,
		url: `https://api.lendflow.com/api/v1/applications/business_credit/${application_id}/enrich`,
		headers: {
			Authorization: `Bearer ${LENDFLOW_BEARER}`,
		},
		"Content-Type": "application/json",
		data: { requested_products },
	};

	try {
		let response = await axios(options);
		return response?.data;
	} catch (error) {
		console.log("error");
		console.log(error.response.data);
		return { error: error.message };
	}
};
