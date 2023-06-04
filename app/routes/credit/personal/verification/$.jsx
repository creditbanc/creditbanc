import CreditNav from "~/components/CreditNav";
import { isEmpty, join, equals, tryCatch } from "ramda";
import axios from "axios";
import { useLoaderData, useFetcher, useLocation } from "@remix-run/react";
import { useSearchParams } from "react-router-dom";

import { create } from "zustand";
import { pipe, always } from "ramda";
import { all, filter, get, mod } from "shades";
import { useEffect } from "react";
import { json, redirect } from "@remix-run/node";
import { get_search_params_obj, inspect, mapIndexed } from "~/utils/helpers";
import { get_user_id } from "~/utils/auth.server";
import {
	appKey,
	authenticate_url,
	new_credit_report,
	authenticate_user,
	is_sandbox,
	array_url,
} from "~/data/array";
import { prisma } from "~/utils/prisma.server";

const useVerificationQuestionsStore = create((set) => ({
	answers: {},
	questions: [],
	clearAnswers: () => set((state) => pipe(mod("answers")(() => ({})))(state)),
	setAnswer: (question_id, answer_id) =>
		set((state) =>
			pipe(mod("answers", question_id)(() => answer_id))(state)
		),
	setQuestions: (questions) =>
		set((state) => pipe(mod("questions")(() => questions))(state)),
}));

export const action = async ({ request }) => {
	const form = await request.formData();
	const payload = JSON.parse(form.get("payload"));
	let { clientKey, authToken, userToken } = payload;
	let url = new URL(request.url);
	let search = new URLSearchParams(url.search);
	let group_id = search.get("group_id");
	let rogue = search.get("rogue") == "true" ? true : false;
	let plan_id = search.get("plan_id");
	let entity_id = search.get("entity_id");

	console.log("rogue__?");
	console.log(rogue);

	if (!rogue) {
		let entity_id = await get_user_id(request);
		let entity = await prisma.entity.findUnique({
			where: { id: entity_id },
			select: {
				plan_id: true,
			},
		});

		plan_id = entity.plan_id;
	}

	let productCode =
		plan_id == "essential" ? "exp1bScore" : "credmo3bReportScore";

	let report_payload = {
		clientKey,
		productCode,
		userToken,
	};

	let { displayToken, reportKey, error } = await new_credit_report(
		report_payload
	);

	let params = [
		`displayToken=${displayToken}`,
		`reportKey=${reportKey}`,
		`group_id=${group_id}`,
		`clientKey=${clientKey}`,
		`userToken=${userToken}`,
		`authToken=${authToken}`,
		`productCode=${productCode}`,
		`rogue=${rogue}`,
	];

	let rogue_params = [
		`displayToken=${displayToken}`,
		`reportKey=${reportKey}`,
		`clientKey=${clientKey}`,
		`userToken=${userToken}`,
		`authToken=${authToken}`,
		`productCode=${productCode}`,
		`entity_id=${entity_id}`,
		`group_id=${group_id}`,
		`plan_id=${plan_id}`,
		`rogue=${rogue}`,
	];

	let search_params = rogue ? rogue_params.join("&") : params.join("&");

	if (displayToken && reportKey) {
		return redirect(`/credit/personal/create?${search_params}`);
	}
};

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
	// let { clientKey } = useLoaderData();
	let location = useLocation();
	let [searchParams] = useSearchParams();
	let search_params = get_search_params_obj(searchParams.toString());
	let { clientKey, authToken } = search_params;

	// console.log("searchParams");
	// console.log(search_params);

	useEffect(() => {
		window.addEventListener("array-event", function arrayEvent(arrayEvent) {
			const {
				tagName, // the name of the Component that emitted the event
				event, // the name of the user's action
				metadata = {}, // Component-specific data
			} = arrayEvent.detail;

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
		<div className="flex flex-col w-full">
			<CreditNav />

			<div className="flex flex-col w-full  max-w-2xl mx-auto">
				<Heading />
			</div>
			<div className="-mt-[30px] sm:-mt-[80px]">
				<array-authentication-kba
					apiUrl={array_url}
					appKey={appKey}
					sandbox={is_sandbox}
					userId={clientKey}
					showResultPages="true"
					tui={true}
					exp={is_sandbox ? false : true}
					efx={is_sandbox ? false : true}
				></array-authentication-kba>
			</div>
		</div>
	);
}
