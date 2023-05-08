import CreditNav from "~/components/CreditNav";
import { plans } from "~/data/upgrade_plans";
import { Link } from "@remix-run/react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { Plans as SubscriptionPlans } from "~/components/UpdatePricingPlans";

const frequencies = [
	{ value: "monthly", label: "Monthly", priceSuffix: "/month" },
	{ value: "annually", label: "Annually", priceSuffix: "/year" },
];

export default function Plans() {
	return (
		<div className="flex flex-col h-full">
			<div className="border-b">
				<CreditNav />
			</div>
			<div className="flex flex-col py-10">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-4xl text-center">
						<h2 className="text-base font-semibold leading-7 text-indigo-600">
							Plans
						</h2>
						<p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
							Pricing plans for teams of&nbsp;all&nbsp;sizes
						</p>
					</div>
					<p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
						Choose an affordable plan that’s packed with the best
						features for engaging your audience, creating customer
						loyalty, and driving sales.
					</p>
					<div>
						<SubscriptionPlans plans={plans} />
					</div>
				</div>
			</div>
		</div>
	);
}
