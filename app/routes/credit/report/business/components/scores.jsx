import { useEffect, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

let score_color = (score) => {
	if (score < 10) {
		return "#ef4444";
	}

	if (score >= 10 && score < 25) {
		return "#fb923c";
	}

	if (score >= 25 && score < 50) {
		return "#fde047";
	}

	if (score >= 50 && score < 75) {
		return "#16a34a";
	}

	if (score >= 75) {
		return "#15803d";
	}

	return "#15803d";
};

const ScoreLinearRangeGraph = ({ score = 0 }) => {
	let height = 10;

	return (
		<div className="flex flex-col w-full relative">
			<div className="flex flex-col w-full relative justify-center">
				<div className={`flex flex-col w-full relative rounded overflow-hidden`} style={{ height }}>
					<div className={`flex flex-col absolute w-full bg-green-700`} style={{ height }}></div>
					<div className={`flex flex-col absolute w-[75%] bg-green-600`} style={{ height }}></div>
					<div className={`flex flex-col absolute w-[50%] bg-yellow-300`} style={{ height }}></div>
					<div className={`flex flex-col absolute w-[25%] bg-orange-400`} style={{ height }}></div>
					<div className={`flex flex-col absolute w-[10%] bg-red-500`} style={{ height }}></div>
				</div>
				<div
					className={`flex flex-col absolute w-[20px] h-[20px] rounded-full border-[3px] border-white shadow`}
					style={{ left: `calc(${score}% - 15px)`, backgroundColor: score_color(score) }}
				></div>
			</div>
			<div className="felx flex-col w-full relative text-xs mt-2 -ml-2">
				<div className={`flex flex-col absolute left-[0%]`}>0</div>
				<div className={`flex flex-col absolute left-[10%]`}>10</div>
				<div className={`flex flex-col absolute left-[25%]`}>25</div>
				<div className={`flex flex-col absolute left-[50%]`}>50</div>
				<div className={`flex flex-col absolute left-[75%]`}>75</div>
				<div className={`flex flex-col absolute left-[100%]`}>100</div>
			</div>
		</div>
	);
};

const ScoreRangeGraph = ({ score, bureau = "" }) => {
	const [moreInfoIsVisible, setMoreInfoIsVisible] = useState(false);

	var BureauLogo = ({ bureau }) => {
		if (bureau == "experian") {
			return (
				<img
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Experian_logo.svg/1280px-Experian_logo.svg.png"
					className="flex flex-col max-h-[30px] max-w-fit"
				/>
			);
		}

		if (bureau == "dnb") {
			return (
				<img
					src="https://consent.trustarc.com/v2/asset/23:19:56.535ialy6v_DB_WORDMARK_Pantone.png"
					className="flex flex-col max-h-[30px] max-w-fit"
				/>
			);
		}
	};

	const DNBScoreRange = () => {
		return (
			<div className="flex flex-col w-full text-xs rounded overflow-hidden p-5 border shadow-sm">
				<div className="flex flex-col text-lg mb-2">Paydex score</div>
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-[30%] gap-y-1">
						<div className="flex flex-col items-center justify-center h-[40px] bg-green-600 font-semibold">
							100
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] bg-green-600 font-semibold">
							90
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] bg-green-600 font-semibold">
							80
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] bg-yellow-300 font-semibold">
							70
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] bg-yellow-300 font-semibold">
							60
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] bg-yellow-300 font-semibold">
							50
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] bg-red-500 font-semibold">
							40
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] bg-red-500 font-semibold">
							30
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] bg-red-500 font-semibold">
							20
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] bg-red-500 font-semibold">
							1 - 19
						</div>
					</div>
					<div className="flex flex-col flex-1 gap-y-1">
						<div className="flex flex-col items-center justify-center h-[40px] w-full">
							<div className="flex flex-col h-[1px] w-full bg-gray-200"></div>
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] w-full">
							<div className="flex flex-col h-[1px] w-full bg-gray-200"></div>
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] w-full">
							<div className="flex flex-col h-[1px] w-full bg-gray-200"></div>
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] w-full">
							<div className="flex flex-col h-[1px] w-full  bg-gray-200"></div>
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] w-full">
							<div className="flex flex-col h-[1px] w-full  bg-gray-200"></div>
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] w-full">
							<div className="flex flex-col h-[1px] w-full  bg-gray-200"></div>
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] w-full">
							<div className="flex flex-col h-[1px] w-full  bg-gray-200"></div>
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] w-full">
							<div className="flex flex-col h-[1px] w-full  bg-gray-200"></div>
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] w-full">
							<div className="flex flex-col h-[1px] w-full  bg-gray-200"></div>
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] w-full">
							<div className="flex flex-col h-[1px] w-full  bg-gray-200"></div>
						</div>
					</div>
					<div className="flex flex-col w-[50%] gap-y-1">
						<div className="flex flex-col items-center justify-center h-[40px] border rounded">
							30 days sooner than terms
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] border rounded">
							20 days sooner than terms
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] border rounded">
							Payment comes on terms
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] border rounded">
							15 days beyond terms
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] border rounded">
							22 days beyond terms
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] border rounded">
							30 days beyond terms
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] border rounded">
							60 days beyond terms
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] border rounded">
							90 days beyond terms
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] border rounded">
							120 days beyond terms
						</div>
						<div className="flex flex-col items-center justify-center h-[40px] border rounded">
							120+ days beyond terms
						</div>
					</div>
				</div>
				<div className="flex flex-col text-lg my-2">Paydex range</div>
				<div className="flex flex-row">
					<div className="flex flex-col w-1/3 items-center h-[40px]">
						<div className="flex flex-col bg-red-500 w-[100%] h-[80%] items-center justify-center">
							0 - 49
						</div>
					</div>
					<div className="flex flex-col w-1/3 items-center h-[40px]">
						<div className="flex flex-col bg-yellow-300 w-[100%] h-[80%] items-center justify-center">
							50 - 79
						</div>
					</div>
					<div className="flex flex-col w-1/3 items-center h-[40px]">
						<div className="flex flex-col bg-green-600 w-[100%] h-[80%] items-center justify-center">
							80 - 100
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="flex flex-col w-full gap-y-2">
			<div className="flex flex-row w-full mb-3 justify-between relative">
				<div>
					<BureauLogo bureau={bureau} />
				</div>
				<div
					onMouseEnter={() => setMoreInfoIsVisible(true)}
					onMouseLeave={() => setMoreInfoIsVisible(false)}
					className="absolute right-0 flex flex-row w-full justify-end z-10"
				>
					{moreInfoIsVisible && (
						<div className="flex flex-col flex-1 max-w-[400px] items-end bg-white -mt-[100px]">
							<DNBScoreRange />
						</div>
					)}
					<div className="flex flex-col w-[40px] items-end">
						<InformationCircleIcon className="h-5 w-5 text-gray-400 cursor-pointer" />
					</div>
				</div>
			</div>
			<div className="flex flex-row justify-between items-end mb-3 font-semibold">
				<div className="text-5xl">{score}</div>
				<div className={`text-2xl`} style={{ color: score_color(score) }}>
					Low risk
				</div>
			</div>
			<div>
				<ScoreLinearRangeGraph score={score} />
			</div>
		</div>
	);
};

export default function Scores({ experian_business_score = 0, dnb_business_score = 0 }) {
	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-row w-full justify-between gap-x-[100px] px-[10px]">
				<div className="flex flex-col w-[50%] ">
					<ScoreRangeGraph score={experian_business_score} bureau="experian" />
				</div>
				<div className="flex flex-col w-[50%]">
					<ScoreRangeGraph score={dnb_business_score} bureau="dnb" />
				</div>
			</div>
		</div>
	);
}
