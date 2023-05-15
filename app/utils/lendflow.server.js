import axios from "axios";
let LENDFLOW_BEARER = process.env.LENDFLOW;

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
