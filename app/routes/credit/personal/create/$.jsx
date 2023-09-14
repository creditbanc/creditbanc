import {
	to_resource_pathname,
	get_group_id,
	inspect,
	search_params,
	is_applicant_p,
} from "~/utils/helpers";
import { json } from "@remix-run/node";
import { create } from "~/utils/personal_credit_report.server";
import axios from "axios";
import { is, isEmpty, pipe } from "ramda";
import { redirect } from "react-router";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { getSession } from "~/sessions/personal_credit_report_session";
import { UsaStates } from "usa-states";
import random from "random-name";
import { sample } from "~/utils/helpers";
import { ParseSSN, RandomSSN } from "ssn";
import { get, all, mod } from "shades";
import { report_url, get_credit_report, is_sandbox } from "~/data/array";
const cities = require("all-the-cities");
import { prisma } from "~/utils/prisma.server";
import { v4 as uuidv4 } from "uuid";
import { get_doc, set_doc, update_doc } from "~/utils/firebase";

const credit_user = (user) => {
	if (is_sandbox) {
		let first_name = random.first();
		let last_name = random.last();
		let usStates = new UsaStates();
		let statesAbbreviation = usStates.arrayOf("abbreviations");
		let state = sample(statesAbbreviation);
		let randomSSN = new RandomSSN();
		let ssn = randomSSN.value().toString();
		let city = pipe(
			get(all, "name"),
			sample
		)(cities.filter((city) => city.country === "US"));

		let payload = {
			first_name,
			last_name,
			ssn,
			dob: "1980-01-01",
			street: "123 Main St",
			city,
			state,
			zip: "12345",
		};

		return payload;
	}

	if (!is_sandbox) {
		let {
			address,
			firstName: first_name,
			lastName: last_name,
			ssn,
			dob,
		} = user;

		let { street, city, state, zip } = address;

		let payload = {
			street,
			city,
			state,
			zip,
			first_name,
			last_name,
			ssn,
			dob,
		};

		return payload;
	}
};

export const loader = async ({ request }) => {
	let {
		group_id,
		clientKey,
		userToken,
		authToken,
		displayToken,
		reportKey,
		productCode,
		applicant,
		entity_id,
		// plan_id,
	} = search_params(request);

	let is_applicant = is_applicant_p(applicant);

	if (!is_applicant) {
		console.log("not_applicant");
		entity_id = await get_session_entity_id(request);

		let entity = await get_doc(["entity", entity_id]);

		plan_id = entity.plan_id;
	}

	let session = await getSession(request.headers.get("Cookie"));
	let { street, city, state, zip, first_name, last_name, ssn, dob } =
		credit_user(JSON.parse(session.data.personal_credit_report));

	let credit_report_request = credit_user(
		JSON.parse(session.data.personal_credit_report)
	);

	let report_id = uuidv4();
	// let report_id = "d316f6cc-8ee7-4037-a2f7-7272b59e5466";

	// console.log("report_id____");
	// console.log(report_id);

	let data = await get_credit_report(reportKey, displayToken);

	console.log("report________");
	console.log(data);

	// return;

	// let { data } = await get_doc([
	// 	"credit_reports",
	// 	"6481ff02f5d66ca522957d9f",
	// ]);

	let credit_report_payload = {
		first_name,
		last_name,
		street,
		city,
		state,
		zip,
		ssn,
		dob,
		request: credit_report_request,
		entity_id,
		group_id,
		plan_id,
		clientKey,
		userToken,
		authToken,
		displayToken,
		reportKey,
		productCode,
		data,
		id: report_id,
		type: "personal_credit_report",
	};

	console.log("report_____");
	console.log(credit_report_payload);
	return null;

	console.log("credit_report_payload");
	console.log(credit_report_payload);

	return null;

	await create(credit_report_payload);

	await set_doc(
		["onboard", entity_id],
		{
			personal_credit_report: {
				id: "personal_credit_report",
				completed: true,
			},
			entity_id,
			group_id,
		},
		true
	);

	if (is_applicant) {
		return redirect(`/credit/thankyou`);
	} else {
		return redirect(
			`/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}`
		);
	}
};
