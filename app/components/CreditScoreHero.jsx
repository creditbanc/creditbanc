import CreditScoreDoughnut from "~/components/CreditScoreDoughnut";

const Single = () => {
	return (
		<div className="flex flex-col items-center -mt-[70px] sm:hidden">
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
		<div className="hidden sm:flex sm:flex-row sm:justify-around">
			<div className="mx-1"></div>
			<CreditScoreDoughnut
				bureau={"Experian"}
				scoreClassNames="sm:text-3xl md:text-5xl lg:text-6xl"
				bureauTitleClassNames="sm:text-base sm:text-l"
			/>
			<div className="mx-4"></div>
			<CreditScoreDoughnut
				bureau={"Equifax"}
				scoreClassNames="sm:text-3xl md:text-5xl lg:text-6xl"
				bureauTitleClassNames="sm:text-base sm:text-l"
			/>
			<div className="mx-4"></div>
			<CreditScoreDoughnut
				bureau={"Transunion"}
				scoreClassNames="sm:text-3xl md:text-5xl lg:text-6xl"
				bureauTitleClassNames="sm:text-base sm:text-l"
			/>
			<div className="mx-1"></div>
		</div>
	);
};

export default function CreditScoreHero() {
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

			<Single />
			<Triple />
		</div>
	);
}
