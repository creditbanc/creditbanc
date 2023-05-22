import CreditNav from "~/components/CreditNav";
import CreditHeroGradient from "~/components/CreditHeroGradient";
import { map, addIndex, isEmpty, includes, values, join } from "ramda";
import axios from "axios";
import { useLoaderData, useFetcher, useLocation } from "@remix-run/react";
import { create } from "zustand";
import { pipe } from "ramda";
import { all, filter, get, mod } from "shades";
import { useEffect } from "react";
import { json, redirect } from "@remix-run/node";
import { get_group_id, inspect } from "~/utils/helpers";
import { get_user_id } from "~/utils/auth.server";
import { appKey } from "~/data/array";

let auth_url = "https://sandbox.array.io/api/authenticate/v2";
// let auth_url = 'https://array.io/api/authenticate/v2'

let report_url = "https://sandbox.array.io/api/report/v2";
// let report_url = 'https://array.io/api/report/v2'

let mapIndexed = addIndex(map);

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
	let { clientKey, authToken, answers } = payload;
	let url = new URL(request.url);
	let search = new URLSearchParams(url.search);
	let group_id = search.get("group_id");

	const options = {
		method: "POST",
		url: auth_url,
		headers: {
			accept: "application/json",
			"content-type": "application/json",
		},
		data: {
			appKey,
			clientKey,
			authToken,
			answers,
		},
	};

	let response = await axios(options);

	let { userToken = null } = response.data;

	if (userToken) {
		var data = JSON.stringify({
			clientKey,
			productCode: "credmo3bReportScore",
		});

		var display_token_options = {
			method: "post",
			maxBodyLength: Infinity,
			url: report_url,
			headers: {
				"x-credmo-user-token": userToken,
				"Content-Type": "application/json",
			},
			data,
		};

		let response = await axios(display_token_options);
		let { displayToken = null, reportKey = null } = response.data;

		if (displayToken && reportKey) {
			return redirect(
				`/credit/personal/create?displayToken=${displayToken}&reportKey=${reportKey}&group_id=${group_id}`
			);
		}
	} else {
		return json({ ...response.data });
	}
};

export const loader = async ({ request }) => {
	const url = new URL(request.url);
	let clientKey = url.searchParams.get("clientKey");

	let providers = ["tui", "efx", "exp"];

	let providers_string = pipe(
		mapIndexed((provider, index) => `provider${index + 1}=${provider}`),
		join("&")
	)(providers);

	// console.log("providers_string");
	// console.log(providers_string);

	var options = {
		method: "get",
		maxBodyLength: Infinity,
		url: `${auth_url}?appKey=${appKey}&clientKey=${clientKey}&${providers_string}`,
		headers: {},
	};

	let response = await axios(options);
	// console.log("response.data");
	// inspect(response.data);
	return response.data;
};

const Form = () => {
	const fetcher = useFetcher();
	const questions = useVerificationQuestionsStore((state) => state.questions);
	// console.log("questions");
	// console.log(questions);
	const answers = useVerificationQuestionsStore((state) => state.answers);
	const setAnswer = useVerificationQuestionsStore((state) => state.setAnswer);
	const clearAnswers = useVerificationQuestionsStore(
		(state) => state.clearAnswers
	);
	const setQuestions = useVerificationQuestionsStore(
		(state) => state.setQuestions
	);

	useEffect(() => {
		clearAnswers();
	}, [questions]);

	useEffect(() => {
		if (fetcher.type === "done" && fetcher.data.questions) {
			let { questions = [], provider } = fetcher.data;
			if (!isEmpty(questions)) {
				console.log("provider", provider);

				if (provider === "efx") {
					let answers = pipe(
						get(
							all,
							"answers",
							all,
							filter({ correctAnswer: true })
						)
					)(questions);
					console.log("answers", answers);
				} else {
					setQuestions(questions);
				}
			}
		}
	}, [fetcher]);

	const onSubmit = (e) => {
		// console.log("onSubmit");
		e.preventDefault();
		let url = new URL(window.location);
		let clientKey = url.searchParams.get("clientKey");
		let authToken = url.searchParams.get("authToken");

		let payload = JSON.stringify({
			clientKey,
			authToken,
			answers,
		});

		fetcher.submit({ payload }, { method: "POST" });

		// console.log("answers", answers);
		// console.log("clientKey", clientKey);
		// console.log("authToken", authToken);
		// console.log("response", test);
	};

	return (
		<form className="space-y-8" onSubmit={onSubmit}>
			<div className="flex flex-col">
				{mapIndexed(
					(question, questionIndex) => (
						<fieldset
							className="flex flex-col my-3"
							key={questionIndex}
						>
							<div className="flex flex-row w-full">
								<div className="bg-gray-200 w-[21px] h-[20px] flex flex-col rounded-full mr-[10px] mt-[5px] items-center justify-center text-xs text-gray-500">
									{questionIndex + 1}
								</div>
								<div className="text-base text-black flex flex-col w-full">
									{question.text}
								</div>
							</div>
							<div className="mt-4 space-y-4 px-7">
								{mapIndexed(
									(answer, answerIndex) => (
										<div
											className="flex items-center"
											key={answerIndex}
										>
											<input
												id={questionIndex}
												name={questionIndex}
												type="radio"
												className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
												checked={includes(
													answer.id,
													values(answers)
												)}
												onChange={() =>
													setAnswer(
														question.id,
														answer.id
													)
												}
											/>
											<label
												htmlFor={questionIndex}
												className="ml-3 block text-sm text-gray-700"
											>
												{answer.text}
											</label>
										</div>
									),
									question.answers
								)}
							</div>
						</fieldset>
					),
					questions
				)}
			</div>
			<div className="flex flex-row w-full justify-end pt-2">
				<button
					type="button"
					className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Cancel
				</button>
				<button
					type="submit"
					className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-[#55CF9E] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#55CF9E] focus:outline-none focus:ring-2 focus:ring-[#55CF9E] focus:ring-offset-2"
				>
					Next
				</button>
			</div>
		</form>
	);
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
	let location = useLocation();

	const questions = useLoaderData();
	const setQuestions = useVerificationQuestionsStore(
		(state) => state.setQuestions
	);

	useEffect(() => {
		setQuestions(questions.questions || []);
	}, [questions]);

	return (
		<div className="flex flex-col w-full">
			<CreditNav />
			{/* <CreditHeroGradient /> */}
			<div className="flex flex-col w-full p-[20px] max-w-2xl mx-auto">
				<Heading />
				<Form />
			</div>
		</div>
	);
}
