import CreditNav from "~/components/CreditNav";
import SimpleNav from "~/components/SimpleNav";
import { isEmpty, join, equals, tryCatch, is, has } from "ramda";
import axios from "axios";
import { useLoaderData, useFetcher, useLocation } from "@remix-run/react";
import { useSearchParams } from "react-router-dom";

import { create } from "zustand";
import { pipe, always } from "ramda";
import { all, filter, get, mod } from "shades";
import { useEffect } from "react";
import { json, redirect } from "@remix-run/node";
import {
	get_search_params_obj,
	inspect,
	mapIndexed,
	form_params,
	search_params,
	is_applicant_p,
} from "~/utils/helpers";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { appKey, new_credit_report, is_sandbox } from "~/data/array";
import { get_doc } from "~/utils/firebase";
import { getSession } from "~/sessions/personal_credit_report_session";
import { credit_user } from "~/api/client/array";
import { v4 as uuidv4 } from "uuid";
import { create as new_personal_credit_report } from "~/utils/personal_credit_report.server";

export const action = async ({ request }) => {
	let { origin } = new URL(request.url);
	let { payload: form } = await form_params(request);
	let { clientKey, authToken, userToken } = JSON.parse(form);
	let { group_id, applicant, plan_id, entity_id } = search_params(request);
	let is_applicant = is_applicant_p(applicant);

	if (!is_applicant) {
		let entity_id = await get_session_entity_id(request);

		let entity = await get_doc(["entity", entity_id]);

		plan_id = entity.plan_id;
	}

	let productCode =
		plan_id == "essential" ? "exp1bScore" : "credmo3bReportScore";

	let report_payload = {
		clientKey,
		productCode,
		userToken,
	};

	console.log("report_payload");
	console.log(report_payload);

	let { displayToken, reportKey, error } = await new_credit_report(
		report_payload
	);

	let { data: credit_report_api_response } = await axios({
		method: "get",
		url: `${origin}/credit/personal/api/report?reportKey=${reportKey}&displayToken=${displayToken}`,
	});

	console.log("credit_report_api_response");
	console.log(credit_report_api_response);
	if (has("CREDIT_RESPONSE")) {
		let entity_id = await get_session_entity_id(request);
		console.log("joy_________");

		let session = await getSession(request.headers.get("Cookie"));
		let { street, city, state, zip, first_name, last_name, ssn, dob } =
			credit_user(JSON.parse(session.data.personal_credit_report));

		let credit_report_request = credit_user(
			JSON.parse(session.data.personal_credit_report)
		);

		let report_id = uuidv4();

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
			data: credit_report_api_response,
			id: report_id,
			type: "personal_credit_report",
		};

		console.log("credit_report_payload");
		console.log(credit_report_payload);

		// await new_personal_credit_report(credit_report_payload);

		// return redirect(
		// 	`/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}`
		// );
	}

	let params = [
		`displayToken=${displayToken}`,
		`reportKey=${reportKey}`,
		`group_id=${group_id}`,
		`clientKey=${clientKey}`,
		`userToken=${userToken}`,
		`authToken=${authToken}`,
		`productCode=${productCode}`,
	];

	let applicant_params = [
		`displayToken=${displayToken}`,
		`reportKey=${reportKey}`,
		`clientKey=${clientKey}`,
		`userToken=${userToken}`,
		`authToken=${authToken}`,
		`productCode=${productCode}`,
		`entity_id=${entity_id}`,
		`group_id=${group_id}`,
		`plan_id=${plan_id}`,
		`applicant=${applicant}`,
	];

	let redirect_search_params = is_applicant
		? applicant_params.join("&")
		: params.join("&");

	return null;

	if (displayToken && reportKey) {
		return null;
		return redirect(`/credit/personal/create?${redirect_search_params}`);
	} else {
		if (is_sandbox) {
			return redirect(
				`/credit/personal/create?${redirect_search_params}`
			);
		}
	}
};

// export const loader = async ({ request }) => {
// 	let reportKey = `2415b741-c062-4574-82ba-fc1015bf3984`;
// 	let displayToken = `32C2FC0C-CAD8-47C8-AA18-1D1CDD419FA9`;

// 	return redirect(
// 		`/credit/personal/api/report?reportKey=${reportKey}&displayToken=${displayToken}`
// 	);
// };

const Heading = () => {
	return (
		<div className="bg-transparent">
			<div className="mx-auto max-w-7xl py-4 pb-6 px-2">
				<div className="text-center">
					<p className="mt-1 text-3xl font-bold tracking-tight text-[#55CF9E]">
						Almost there; We just need to make sure you’re a real
						person.
					</p>
					<p className="text-lg font-semibold text-[#202536] mt-3">
						No hard feelings?
					</p>
				</div>
			</div>
		</div>
	);
};

export default function Verification() {
	const fetcher = useFetcher();
	let [searchParams] = useSearchParams();
	let search_params = get_search_params_obj(searchParams.toString());
	let { clientKey, authToken } = search_params;

	useEffect(() => {
		window.addEventListener("array-event", function arrayEvent(arrayEvent) {
			const { tagName, event, metadata = {} } = arrayEvent.detail;

			let userToken = tryCatch(
				pipe(get("user-token")),
				always(null)
			)(metadata);

			if (userToken) {
				let payload = JSON.stringify({
					clientKey,
					authToken,
					userToken,
				});

				fetcher.submit({ payload }, { method: "POST" });
			}
		});
	}, []);

	return (
		<div className="flex flex-col w-full overflow-y-scroll">
			<SimpleNav />

			<div className="flex flex-col w-full  max-w-2xl mx-auto">
				<Heading />
			</div>
			<div className="-mt-[30px] sm:-mt-[80px]">
				{is_sandbox && (
					<array-authentication-kba
						appKey={appKey}
						sandbox="true"
						userId={clientKey}
						showResultPages="true"
					></array-authentication-kba>
				)}

				{!is_sandbox && (
					<array-authentication-kba
						appKey={appKey}
						userId={clientKey}
						showResultPages="true"
						tui={true}
						exp={true}
						efx={true}
					></array-authentication-kba>
				)}
			</div>
		</div>
	);
}
