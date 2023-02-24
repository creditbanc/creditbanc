import { to_resource_pathname, get_group_id } from "~/utils/helpers";
import { json } from "@remix-run/node";
import { create } from "~/utils/personal_credit_report.server";
import axios from "axios";
import { isEmpty } from "ramda";
import { redirect } from "react-router";

export const loader = async ({ request }) => {
	console.log("create_personal_credit_report");
	// console.log(request);
	let { url } = request;
	// console.log(url);
	let url_object = new URL(url);
	let search = new URLSearchParams(url_object.search);

	let displayToken = search.get("displayToken");
	let reportKey = search.get("reportKey");

	// console.log("displayToken");
	// console.log(displayToken);

	// console.log("reportKey");
	// console.log(reportKey);

	let get_credit_report = async (reportKey, displayToken) => {
		console.log("get_credit_report");
		var options = {
			method: "get",
			maxBodyLength: Infinity,
			url: `https://sandbox.array.io/api/report/v2?reportKey=${reportKey}&displayToken=${displayToken}`,
			headers: {
				"Content-Type": "application/json",
			},
		};

		let response = await axios(options);

		if (response?.data?.CREDIT_RESPONSE) {
			// return new Promise((resolve, reject) => {
			// 	resolve({ test: "hi" });
			// });
			return response.data;
		} else {
			let retry = async () => {
				return new Promise((resolve, reject) => {
					setTimeout(async () => {
						let response = await get_credit_report(
							reportKey,
							displayToken
						);
						resolve(response);
					}, 200);
				});
			};
			let response = await retry();

			return response;
		}
	};

	let report = await get_credit_report(reportKey, displayToken);

	return redirect(
		`/credit/personal/report/personal/resource/e/63d36a3df3bf7bbe44677ac8/g/63d36a5cf3bf7bbe44677acd/f/63ef03683b0eab22e6c20a3b`
	);

	return new Response(JSON.stringify({ any: "thing" }), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
		},
	});
};
