import axios from "axios";

export const get_lendflow_report = async (application_id) => {
	let options = {
		method: "get",
		maxBodyLength: Infinity,
		url: `https://api.lendflow.com/api/int/applications/${application_id}/commercial_data`,
		headers: {
			Authorization: "Bearer ItLqFE9UpAFDlCFQ7cNUBWW7iQN9cms0",
		},
		data: {},
	};

	try {
		let response = await axios(options);
		return response?.data;
	} catch (error) {
		console.log("error");
		console.log(error.response.data);
		return json({ error: error.message }, { status: 500 });
	}
};
