import axios from "axios";
const LENDFLOW_BEARER = process.env.LENDFLOW;
import { plan_product_requests } from "~/data/plan_product_requests";
import { pipe } from "ramda";
import { get } from "shades";
import Entity from "~/api/internal/entity";
import { set_doc } from "./firebase";

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
		let request = this.new_application_request_creator(plan_id, form);
		return request;
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
