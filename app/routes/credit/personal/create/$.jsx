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
import { get_user_id } from "~/utils/auth.server";
import { getSession } from "~/sessions/personal_credit_report_session";
import { UsaStates } from "usa-states";
import random from "random-name";
import { sample } from "~/utils/helpers";
import { ParseSSN, RandomSSN } from "ssn";
import { get, all } from "shades";
import { report_url, get_credit_report, is_sandbox } from "~/data/array";
const cities = require("all-the-cities");
import { prisma } from "~/utils/prisma.server";

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
		plan_id,
	} = search_params(request);

	let is_applicant = is_applicant_p(applicant);

	if (!is_applicant) {
		console.log("not_applicant");
		entity_id = await get_user_id(request);

		let entity = await prisma.entity.findUnique({
			where: { id: entity_id },
			select: {
				plan_id: true,
			},
		});

		plan_id = entity.plan_id;
	}

	let session = await getSession(request.headers.get("Cookie"));
	let { street, city, state, zip, first_name, last_name, ssn, dob } =
		credit_user(JSON.parse(session.data.personal_credit_report));

	let report = await get_credit_report(reportKey, displayToken);

	let credit_report_payload = {
		first_name,
		last_name,
		street,
		city,
		state,
		zip,
		ssn,
		dob,
		entity_id,
		group_id,
		plan_id,
		clientKey,
		userToken,
		authToken,
		displayToken,
		reportKey,
		productCode,
		data: report,
	};

	// console.log("credit_report_payload");
	// console.log(credit_report_payload);

	// return null;

	let { file } = await create(credit_report_payload);

	if (is_applicant) {
		return redirect(`/credit/thankyou`);
	} else {
		return redirect(
			`/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}/f/${file.id}`
		);
	}
};
