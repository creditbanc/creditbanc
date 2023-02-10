import CreditNav from "~/components/CreditNav";
import CreditHeroGradient from "~/components/CreditHeroGradient";
import { map, addIndex, isEmpty, includes, values } from "ramda";
import axios from "axios";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { create } from "zustand";
import { pipe } from "ramda";
import { all, filter, get, mod } from "shades";
import { useEffect } from "react";
import { json, redirect } from "@remix-run/node";

let mapIndexed = addIndex(map);

const useVerificationQuestionsStore = create((set) => ({
	answers: {},
	questions: [],
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
	let appKey = "3F03D20E-5311-43D8-8A76-E4B5D77793BD";

	const options = {
		method: "POST",
		url: "https://sandbox.array.io/api/authenticate/v2",
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
		return redirect(`/credit/personal/personal?userToken=${userToken}`);
	} else {
		return json({ ...response.data });
	}
};

export const loader = async ({ request }) => {
	const url = new URL(request.url);
	let clientKey = url.searchParams.get("clientKey");
	const appKey = "F5C7226A-4F96-43BF-B748-09278FFE0E36";

	var options = {
		method: "get",
		maxBodyLength: Infinity,
		url: `https://array.io/api/authenticate/v2?appKey=${appKey}&clientKey=${clientKey}&provider1=tui&provider2=efx&provider3=exp`,
		headers: {},
	};

	let response = await axios(options);
	return response.data;
};

const Form = () => {
	const fetcher = useFetcher();
	const questions = useVerificationQuestionsStore((state) => state.questions);
	const answers = useVerificationQuestionsStore((state) => state.answers);
	const setAnswer = useVerificationQuestionsStore((state) => state.setAnswer);
	const setQuestions = useVerificationQuestionsStore(
		(state) => state.setQuestions
	);

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
					className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
					<p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
						Verification questions
					</p>
				</div>
			</div>
		</div>
	);
};

export default function Verification() {
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
			<CreditHeroGradient />
			<div className="flex flex-col w-full p-[20px] max-w-2xl mx-auto">
				<Heading />
				<Form />
			</div>
		</div>
	);
}
