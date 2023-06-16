import { Link } from "@remix-run/react";
import { map, pipe } from "ramda";
import { INDUSTRY } from "~/data/tax";
import { mapIndexed } from "~/utils/helpers";

export default function Industries() {
	return (
		<div className="isolate bg-gray-900 w-full flex flex-col absolute top-0 bottom-0">
			<div className="px-6 pt-6 lg:px-8 mb-[30px]">
				<nav
					className="flex items-center justify-between"
					aria-label="Global"
				>
					<div className="flex lg:flex-1">
						<a href="#" className="-m-1.5 p-1.5">
							<img
								className="h-8"
								src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
								alt=""
							/>
						</a>
					</div>
				</nav>
			</div>
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<h1 className="text-4xl font-bold tracking-tight text-white">
						R&D Tax Credit Calculator
					</h1>
					<p className="mt-6 text-lg leading-8 text-gray-300">
						What is your primary industry?
					</p>
				</div>
			</div>
			<div className="w-full flex flex-col items-center mt-[50px] bg-gray-900 pb-[20px]">
				<div className="calculator_container w-[400px] sm:w-[500px] flex flex-col px-[10px] sm:px-0">
					<div className="flex flex-col max-h-[400px] overflow-scroll">
						<ul role="list" className="-mb-8 px-3">
							{pipe(
								mapIndexed((industry, industry_index) => (
									<div
										className="flex flex-row text-white items-center space-x-3 text-xl cursor-pointer py-2"
										key={industry_index}
									>
										<div className="flex flex-col">
											<input
												type="radio"
												className="h-4 w-4 bg-transparent border-gray-300 text-indigo-600 focus:ring-indigo-600"
											/>
										</div>
										<div className="flex flex-col">
											{industry.title}
										</div>
									</div>
								))
							)(INDUSTRY)}
						</ul>
					</div>
					<div className="mt-10 flex flex-col items-center sm:justify-center sm:flex-row gap-x-6 gap-y-6">
						<Link
							to={`/calculators/tax`}
							className="rounded-full bg-indigo-500 text-base font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 w-[420px] text-center h-[50px]"
						>
							<div className="h-[50px] flex flex-col items-center justify-center">
								Back
							</div>
						</Link>
						<Link
							to="#"
							className="rounded-full bg-indigo-500 text-base font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 w-[420px] text-center h-[50px]"
						>
							<div className="h-[50px] flex flex-col items-center justify-center">
								Next
							</div>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
