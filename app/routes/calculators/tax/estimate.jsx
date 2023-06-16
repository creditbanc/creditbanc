import { Link } from "@remix-run/react";
import { map, pipe } from "ramda";

import { mapIndexed } from "~/utils/helpers";

export default function Estimate() {
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
						YOUR ESTIMATED TAX CREDIT:
					</p>
				</div>
			</div>
			<div className="w-full flex flex-col items-center mt-[50px] bg-gray-900 pb-[20px]">
				<div className="calculator_container w-[400px] sm:w-[500px] flex flex-col px-[10px] sm:px-0">
					<div className="flex flex-col max-h-[400px] ">
						<div className="flex flex-scroll w-full justify-center space-x-10 bg-white border rounded p-16 text-4xl font-semibold">
							<div>$8.1k</div>
							<div>to</div>
							<div>$8.1k</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
