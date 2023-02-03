import { useState } from "react";
import {
	CheckIcon,
	HandThumbUpIcon,
	UserIcon,
} from "@heroicons/react/20/solid";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
	{ name: "Product", href: "#" },
	{ name: "Features", href: "#" },
	{ name: "Marketplace", href: "#" },
	{ name: "Company", href: "#" },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function TaxCalculator() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	let [expenses, setExpenses] = useState([
		{ year: 2019, amount: 0 },
		{ year: 2020, amount: 0 },
		{ year: 2021, amount: 0 },
		{ year: 2022, amount: 0 },
		{ year: 2023, amount: 0 },
	]);

	return (
		<div className="isolate bg-gray-900 w-full h-full">
			<div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-scroll blur-3xl sm:top-[-20rem]">
				<svg
					className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
					viewBox="0 0 1155 678"
				>
					<path
						fill="url(#f4773080-2a16-4ab4-9fd7-579fec69a4f7)"
						fillOpacity=".2"
						d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
					/>
					<defs>
						<linearGradient
							id="f4773080-2a16-4ab4-9fd7-579fec69a4f7"
							x1="1155.49"
							x2="-78.208"
							y1=".177"
							y2="474.645"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#9089FC" />
							<stop offset={1} stopColor="#FF80B5" />
						</linearGradient>
					</defs>
				</svg>
			</div>
			<div className="px-6 pt-6 lg:px-8">
				<nav
					className="flex items-center justify-between"
					aria-label="Global"
				>
					<div className="flex lg:flex-1">
						<a href="#" className="-m-1.5 p-1.5">
							<span className="sr-only">Your Company</span>
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
					<h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
						R&D Tax Credit Calculator
					</h1>
					<p className="mt-6 text-lg leading-8 text-gray-300">
						Discover how much you can claim in R&D tax credits for
						expenditures on the development of new software,
						technology, products and processes.
					</p>
				</div>
			</div>
			<div className="w-full flex flex-col items-center mt-[100px]">
				<div className="calculator_container w-[500px] flex flex-col">
					<div className="flow-root">
						<ul role="list" className="-mb-8">
							{expenses.map((event, eventIdx) => (
								<li key={event.year}>
									<div className="relative pb-8">
										{eventIdx !== expenses.length - 1 ? (
											<span
												className="absolute top-4 left-[58px] -ml-px h-full w-0.5 bg-white mt-[2px]"
												aria-hidden="true"
											/>
										) : null}
										<div className="relative flex space-x-3">
											<div className="flex flex-row items-center">
												<div className="w-[50px] font-bold text-white">
													{event.year}
												</div>
												<span
													className={classNames(
														"bg-white h-4 w-4 rounded-full flex items-center justify-center"
													)}
												></span>
											</div>
											<div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
												<input
													type="number"
													name="expense"
													className="block w-full rounded-full border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center"
													placeholder="Total yearly expenses"
												/>
											</div>
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
					<div className="mt-10 flex justify-end gap-x-6">
						<a
							href="#"
							className="rounded-full bg-indigo-500 text-base font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 w-[420px] text-center h-[50px]"
						>
							<div className="h-[50px] flex flex-col items-center justify-center">
								Next
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
