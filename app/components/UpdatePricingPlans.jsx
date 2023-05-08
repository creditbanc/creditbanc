import { useState } from "react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

const frequencies = [
	{ value: "monthly", label: "Monthly", priceSuffix: "/month" },
	{ value: "annually", label: "Annually", priceSuffix: "/year" },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export const Plans = ({ plans }) => {
	const [frequency, setFrequency] = useState(frequencies[0]);

	return (
		<div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
			{plans.map((tier) => (
				<div
					key={tier.id}
					className={classNames(
						tier.mostPopular
							? "ring-2 ring-indigo-600"
							: "ring-1 ring-gray-200",
						"rounded-3xl p-8 xl:p-10"
					)}
				>
					<div className="flex items-center justify-between gap-x-4">
						<h3
							id={tier.id}
							className={classNames(
								tier.mostPopular
									? "text-indigo-600"
									: "text-gray-900",
								"text-lg font-semibold leading-8"
							)}
						>
							{tier.name}
						</h3>
						{tier.mostPopular ? (
							<p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
								Most popular
							</p>
						) : null}
					</div>
					<p className="mt-4 text-sm leading-6 text-gray-600">
						{tier.description}
					</p>
					<p className="mt-6 flex items-baseline gap-x-1">
						<span className="text-4xl font-bold tracking-tight text-gray-900">
							{tier.price[frequency.value]}
						</span>
						<span className="text-sm font-semibold leading-6 text-gray-600">
							{frequency.priceSuffix}
						</span>
					</p>
					<a
						href={tier.href}
						aria-describedby={tier.id}
						className={classNames(
							tier.mostPopular
								? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
								: "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300",
							"mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						)}
					>
						Upgrade
					</a>
					<ul
						role="list"
						className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10"
					>
						{tier.features.map((feature) => (
							<li key={feature} className="flex gap-x-3">
								{feature.included && (
									<CheckIcon
										className="h-6 w-5 flex-none text-[#55CF9E]"
										aria-hidden="true"
									/>
								)}

								{!feature.included && (
									<XMarkIcon
										className="h-6 w-5 flex-none text-red-500"
										aria-hidden="true"
									/>
								)}
								{feature.text}
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};
