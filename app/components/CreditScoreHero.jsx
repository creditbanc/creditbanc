import { useEffect, useState } from "react";
import CreditScoreDoughnut from "~/components/CreditScoreDoughnut";
import { useLayoutStore } from "~/stores/useLayoutStore";
import useWindowSize from "~/hooks/useWindowSize";

const Single = () => {
	return (
		<div className="flex flex-col items-center -mt-[70px]">
			<div className="flex flex-col w-[80%]  my-[10px]">
				<CreditScoreDoughnut
					bureau={"Experian"}
					scoreClassNames="text-6xl"
					bureauTitleClassNames="text-1xl"
				/>
				<div className="flex flex-row w-full justify-around -mt-[30px] z-[1]">
					<span className="inline-flex items-center rounded-full bg-gray-100 px-4 py-0.5 text-xs font-medium text-gray-800 cursor-pointer">
						Equifax
					</span>

					<span className="inline-flex items-center rounded-full bg-green-100 px-4 py-0.5 text-xs font-medium text-green-800 cursor-pointer">
						<svg
							className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400"
							fill="currentColor"
							viewBox="0 0 8 8"
						>
							<circle cx={4} cy={4} r={3} />
						</svg>
						Experian
					</span>

					<span className="inline-flex items-center rounded-full bg-gray-100 px-4 py-0.5 text-xs font-medium text-gray-800 cursor-pointer">
						D&B
					</span>
				</div>
			</div>
		</div>
	);
};

const Triple = () => {
	return (
		<div className="sm:flex sm:flex-row sm:justify-around">
			<CreditScoreDoughnut
				bureau={"Experian"}
				scoreClassNames="sm:text-3xl md:text-4xl lg:text-5xl"
				bureauTitleClassNames="sm:text-base sm:text-l"
			/>
			<div className="mx-4"></div>
			<CreditScoreDoughnut
				bureau={"Equifax"}
				scoreClassNames="sm:text-3xl md:text-4xl lg:text-5xl"
				bureauTitleClassNames="sm:text-base sm:text-l"
			/>
			<div className="mx-4"></div>
			<CreditScoreDoughnut
				bureau={"Transunion"}
				scoreClassNames="sm:text-3xl md:text-4xl lg:text-5xl"
				bureauTitleClassNames="sm:text-base sm:text-l"
			/>
		</div>
	);
};

export default function CreditScoreHero() {
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
		<div>
			<div className="w-full">
				<h1 className="text-5xl font-bold tracking-tight text-center">
					Your personal credit report
				</h1>
				<p className="mt-6 text-lg leading-6 text-gray-600 text-center">
					View all three personal credit bureaus
				</p>
			</div>

			{isMobile ? <Single /> : <Triple />}
		</div>
	);
}
