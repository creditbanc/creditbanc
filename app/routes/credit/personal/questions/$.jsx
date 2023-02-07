import CreditNav from "~/components/CreditNav";
import CreditHeroGradient from "~/components/CreditHeroGradient";
import { map, addIndex } from "ramda";
import axios from "axios";
import { useLoaderData } from "@remix-run/react";
import { create } from "zustand";
import { pipe } from "ramda";
import { mod } from "shades";

let mapIndexed = addIndex(map);

const useVerificationQuestionsStore = create((set) => ({
	questions: [],
	setQuestions: (questions) =>
		set((state) => pipe(mod("questions")(() => questions))(state)),
}));

export const loader = async ({ request }) => {
	const url = new URL(request.url);
	let clientKey = url.searchParams.get("clientKey");
	let appKey = "F5C7226A-4F96-43BF-B748-09278FFE0E36";

	var config = {
		method: "get",
		url: `https://array.io/api/authenticate/v2?appKey=${appKey}&clientKey=${clientKey}&provider1=tui&provider2=efx&provider3=exp`,
		headers: {},
	};

	let response = await axios(config);
	console.log("loader_response");
	console.log(response.data);

	return response.data;
};

const Form = () => {
	const questions = useVerificationQuestionsStore((state) => state.questions);
	console.log("questions", questions);

	return (
		<form className="space-y-8">
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

export default function PersonalCreditReportQuestions() {
	const { questions } = useLoaderData();
	const setQuestions = useVerificationQuestionsStore(
		(state) => state.setQuestions
	);

	setQuestions(questions || []);

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
