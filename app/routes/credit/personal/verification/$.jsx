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
	let entity_id = await get_user_id(request);
	const form = await request.formData();
	const payload = JSON.parse(form.get("payload"));
	let { clientKey, authToken, userToken } = payload;
	let url = new URL(request.url);
	let search = new URLSearchParams(url.search);
	let group_id = search.get("group_id");

	let { plan_id } = await prisma.entity.findUnique({
		where: { id: entity_id },
		select: {
			plan_id: true,
		},
	});

	let auth_payload = {
		appKey,
		clientKey,
		authToken,
		userToken,
	};

	console.log("auth_payload");
	console.log(auth_payload);

	let productCode =
		plan_id == "essential" ? "exp1bScore" : "credmo3bReportScore";

	// let productCode = "exp1bScore";

	let report_payload = {
		clientKey,
		productCode,
		userToken,
	};

	let { displayToken, reportKey, error } = await new_credit_report(
		report_payload
	);

	console.log("displayToken", displayToken);
	console.log("reportKey", reportKey);

	if (displayToken && reportKey) {
		return redirect(
			`/credit/personal/create?displayToken=${displayToken}&reportKey=${reportKey}&group_id=${group_id}&clientKey=${clientKey}&userToken=${userToken}&authToken=${authToken}&productCode=${productCode}`
		);
	}
	// if (userToken) {
	// } else {
	// 	return json({ error });
	// }
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

	// useEffect(() => {
	// 	setQuestions(questions.questions || []);
	// }, [questions]);

	return (
		<div className="flex flex-col w-full">
			<CreditNav />
			{/* <CreditHeroGradient /> */}
			<div className="flex flex-col w-full  max-w-2xl mx-auto">
				<Heading />
				{/* <Form /> */}
			</div>
			<div className="-mt-[30px] sm:-mt-[80px]">
				<array-authentication-kba
					appKey={appKey}
					sandbox={is_sandbox}
					userId={clientKey}
					showResultPages="true"
					tui={true}
					exp={true}
					efx={true}
				></array-authentication-kba>
			</div>
		</div>
	);
}
