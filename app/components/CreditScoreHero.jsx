import { useEffect, useState, useRef } from "react";
import CreditScoreDoughnut from "~/components/CreditScoreDoughnut";
import { useLayoutStore } from "~/stores/useLayoutStore";
import { Carousel } from "antd";

const Single = ({ experian, equifax, transunion }) => {
	const [index, setIndex] = useState(0);
	const [score, setScore] = useState("");
	const ref = useRef(null);

	useEffect(() => {
		if (index == 0) {
			setScore(experian);
		}

		if (index == 1) {
			setScore(equifax);
		}

		if (index == 2) {
			setScore(transunion);
		}
	}, [index]);

	const go_to = (index) => {
		ref.current.goTo(index);
		setIndex(index);
	};
	return (
		<div className="flex flex-col items-center -mt-[70px] mb-[20px]">
			<div className="flex flex-col w-full my-[10px] mx-[50px]">
				<Carousel
					ref={ref}
					dots={false}
					className="flex flex-col w-full"
				>
					<div>
						<CreditScoreDoughnut
							bureau={"Equifax"}
							classNames={index == 0 ? "visible" : "hidden"}
							scoreClassNames="text-6xl"
							bureauTitleClassNames="text-1xl"
							score={score}
						/>
					</div>
					<div>
						<CreditScoreDoughnut
							bureau={"Experian"}
							classNames={index == 1 ? "visible" : "hidden"}
							scoreClassNames="text-6xl"
							bureauTitleClassNames="text-1xl"
							score={score}
						/>
					</div>
					<div>
						<CreditScoreDoughnut
							bureau={"Dun & Bradstreet"}
							classNames={index == 2 ? "visible" : "hidden"}
							scoreClassNames="text-6xl"
							bureauTitleClassNames="text-1xl"
							score={score}
						/>
					</div>
				</Carousel>

				<div className="flex flex-row w-full justify-around mt-[30px] z-[1]">
					<span
						className={`inline-flex items-center rounded-full px-4 py-0.5 text-xs font-medium cursor-pointer ${
							index === 0
								? "bg-green-100 text-green-800"
								: "bg-gray-100 text-gray-800"
						}`}
						onClick={() => go_to(0)}
					>
						{index === 0 && (
							<svg
								className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400"
								fill="currentColor"
								viewBox="0 0 8 8"
							>
								<circle cx={4} cy={4} r={3} />
							</svg>
						)}
						Equifax
					</span>

					<span
						className={`inline-flex items-center rounded-full px-4 py-0.5 text-xs font-medium cursor-pointer ${
							index === 1
								? "bg-green-100 text-green-800"
								: "bg-gray-100 text-gray-800"
						}`}
						onClick={() => go_to(1)}
					>
						{index === 1 && (
							<svg
								className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400"
								fill="currentColor"
								viewBox="0 0 8 8"
							>
								<circle cx={4} cy={4} r={3} />
							</svg>
						)}
						Experian
					</span>

					<span
						className={`inline-flex items-center rounded-full bg-gray-100 px-4 py-0.5 text-xs cursor-pointer font-medium text-gray-800 ${
							index === 2
								? "bg-green-100 text-green-800"
								: "bg-gray-100 text-gray-800"
						}`}
						onClick={() => go_to(2)}
					>
						{index === 2 && (
							<svg
								className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400"
								fill="currentColor"
								viewBox="0 0 8 8"
							>
								<circle cx={4} cy={4} r={3} />
							</svg>
						)}
						D&B
					</span>
				</div>
			</div>
		</div>
	);
};

const Triple = ({ experian, equifax, transunion }) => {
	return (
		<div className="sm:flex sm:flex-row sm:justify-around">
			<CreditScoreDoughnut
				bureau={"Experian"}
				scoreClassNames="sm:text-3xl md:text-4xl lg:text-5xl"
				bureauTitleClassNames="sm:text-base sm:text-l"
				score={experian}
			/>
			<div className="mx-4"></div>
			<CreditScoreDoughnut
				bureau={"Equifax"}
				scoreClassNames="sm:text-3xl md:text-4xl lg:text-5xl"
				bureauTitleClassNames="sm:text-base sm:text-l"
				score={equifax}
			/>
			<div className="mx-4"></div>
			<CreditScoreDoughnut
				bureau={"Transunion"}
				scoreClassNames="sm:text-3xl md:text-4xl lg:text-5xl"
				bureauTitleClassNames="sm:text-base sm:text-l"
				score={transunion}
			/>
		</div>
	);
};

export default function CreditScoreHero({ experian, equifax, transunion }) {
	let content_width = useLayoutStore((state) => state.content_width);
	let [isMobile, setIsMobile] = useState(true);

	useEffect(() => {
		if (content_width > 640) {
			setIsMobile(false);
		} else {
			setIsMobile(true);
		}
	}, [content_width]);

	return (
		<div className="overflow-hidden">
			{isMobile ? (
				<Single
					experian={experian}
					equifax={equifax}
					transunion={transunion}
				/>
			) : (
				<Triple
					experian={experian}
					equifax={equifax}
					transunion={transunion}
				/>
			)}
		</div>
	);
}
