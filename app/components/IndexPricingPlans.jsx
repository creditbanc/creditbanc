import { Link } from "@remix-run/react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export const Plans = ({ plans }) => {
	return (
		<div className="mx-auto max-w-7xl px-6 lg:px-8 -mt-[40px]">
			<div className="flex flex-row w-full justify-center">
				{plans.map((tier, tierIdx) => (
					<div
						key={tier.id}
						className={classNames(
							"flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10",
							tier.mostPopular ? "lg:z-10 lg:rounded-b-none lg:rounded-3xl" : "lg:mt-8 lg:rounded-none",
							tierIdx === 0 ? "lg:rounded-l-3xl" : "",
							tierIdx === plans.length - 1 ? "lg:rounded-r-3xl" : ""
						)}
					>
						<div>
							<div className="flex justify-between gap-x-4">
								<h3
									id={tier.id}
									className={classNames(
										tier.mostPopular ? "text-[#55CF9E]" : "text-gray-900",
										"text-lg font-semibold"
									)}
								>
									{tier.name}
								</h3>
								{tier.mostPopular ? (
									<div className="w-[175px]">
										<div className="rounded-full bg-indigo-300/10 text-xs font-semibold text-[#55CF9E] flex flex-row items-center justify-center mt-2 py-1">
											Most popular
										</div>
									</div>
								) : null}
							</div>
							<p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
							<p className="mt-6 flex items-baseline gap-x-1">
								<span className="text-4xl font-bold tracking-tight text-gray-900">
									{tier.priceMonthly}
								</span>
								<span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
							</p>
							<ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
								{tier.features.map((feature) => (
									<li key={feature} className="flex gap-x-3">
										{feature.included && (
											<CheckIcon
												className="h-6 w-5 flex-none text-[#55CF9E]"
												aria-hidden="true"
											/>
										)}

										{!feature.included && (
											<XMarkIcon className="h-6 w-5 flex-none text-red-500" aria-hidden="true" />
										)}
										{feature.text}
									</li>
								))}
							</ul>
						</div>
						<Link
							to={tier.href}
							aria-describedby={tier.id}
							className={classNames(
								tier.mostPopular
									? "bg-[#55CF9E] text-white shadow-sm hover:bg-[#55CF9E]"
									: "text-[#55CF9E] ring-1 ring-inset ring-[#55CF9E] hover:ring-[#55CF9E]",
								"mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							)}
						>
							Pull Report
						</Link>
					</div>
				))}
			</div>
		</div>
	);
};
