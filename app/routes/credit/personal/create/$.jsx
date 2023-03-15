import { to_resource_pathname, get_group_id } from "~/utils/helpers";
import { json } from "@remix-run/node";
import { create } from "~/utils/personal_credit_report.server";
import axios from "axios";
import { isEmpty, pipe } from "ramda";
import { redirect } from "react-router";
import { get_user_id } from "~/utils/auth.server";
import { getSession } from "~/sessions/personal_credit_report_session";
import { UsaStates } from "usa-states";
import random from "random-name";
import { sample } from "~/utils/helpers";
import { ParseSSN, RandomSSN } from "ssn";
import { get, all } from "shades";
const cities = require("all-the-cities");

export const loader = async ({ request }) => {
	console.log("create_personal_credit_report");
	let entity_id = await get_user_id(request);
	let { url } = request;
	let url_object = new URL(url);
	let search = new URLSearchParams(url_object.search);
	let group_id = search.get("group_id");
	let session = await getSession(request.headers.get("Cookie"));
	let entity_personal_data = JSON.parse(
		session.get("personal_credit_report")
	);

	// let { address, firstName, lastName, ssn, dob } = entity_personal_data;
	// let { street, city, state, zip } = address;

	let first_name = random.first();
	let last_name = random.last();

	var usStates = new UsaStates();
	var statesAbbreviation = usStates.arrayOf("abbreviations");
	var state = sample(statesAbbreviation);

	let randomSSN = new RandomSSN();
	let ssn = randomSSN.value().toString();

	console.log("cities");
	let city = pipe(
		get(all, "name"),
		sample
	)(cities.filter((city) => city.country === "US"));
	console.log("city");
	console.log(city);

	let credit_report_payload = {
		first_name,
		last_name,
		// street,
		city,
		state,
		// zip,
		ssn,
	};

	console.log("session");
	console.log(credit_report_payload);

	// return null;

	// console.log("group_id");
	// console.log(group_id);

	// console.log("entity_id");
	// console.log(entity_id);

	let displayToken = search.get("displayToken");
	let reportKey = search.get("reportKey");

	// console.log("displayToken");
	// console.log(displayToken);

	// console.log("reportKey");
	// console.log(reportKey);

	// return null;

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

	// let report = await get_credit_report(reportKey, displayToken);

	// return null;

	let { file } = await create({ group_id, ...credit_report_payload });

	// let { file } = report;
	// console.log("report");
	// console.log(report);

	return redirect(
		`/credit/personal/report/personal/resource/e/${entity_id}/g/${group_id}/f/${file.id}`
	);
};
