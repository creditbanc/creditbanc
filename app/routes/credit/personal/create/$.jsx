import { to_resource_pathname, get_group_id, inspect } from "~/utils/helpers";
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
import { report_url, get_credit_report } from "~/data/array";
const cities = require("all-the-cities");
import { prisma } from "~/utils/prisma.server";

export const loader = async ({ request }) => {
	console.log("create_personal_credit_report");
	let entity_id = await get_user_id(request);
	let { url } = request;
	let url_object = new URL(url);
	let search = new URLSearchParams(url_object.search);
	let group_id = search.get("group_id");
	let clientKey = search.get("clientKey");
	let userToken = search.get("userToken");
	let authToken = search.get("authToken");
	let displayToken = search.get("displayToken");
	let reportKey = search.get("reportKey");
	let productCode = search.get("productCode");

	let session = await getSession(request.headers.get("Cookie"));

	let { plan_id } = await prisma.entity.findUnique({
		where: { id: entity_id },
		select: {
			plan_id: true,
		},
	});

	let entity_personal_data = JSON.parse(session.data.personal_credit_report);
	// console.log("entity_personal_data");
	// console.log(entity_personal_data);

	// let { address, firstName, lastName, ssn, dob } = entity_personal_data;
	let { address, dob } = entity_personal_data;
	// let { street, city, state, zip } = address;
	let { street, zip } = address;

	let first_name = random.first();
	let last_name = random.last();
	var usStates = new UsaStates();
	var statesAbbreviation = usStates.arrayOf("abbreviations");
	var state = sample(statesAbbreviation);
	let randomSSN = new RandomSSN();
	let ssn = randomSSN.value().toString();

	let city = pipe(
		get(all, "name"),
		sample
	)(cities.filter((city) => city.country === "US"));

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
	};

	let { file } = await create({
		...credit_report_payload,
		entity_id,
		group_id,
		data: report,
		plan_id,
		clientKey,
		userToken,
		authToken,
		displayToken,
		reportKey,
		productCode,
	});

	return redirect(
		`/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}/f/${file.id}`
	);
};
