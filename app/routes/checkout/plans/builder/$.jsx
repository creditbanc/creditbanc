import { Fragment } from "react";
import { ChevronRightIcon, ChevronUpIcon, CheckIcon } from "@heroicons/react/20/solid";
import { Popover, Transition } from "@headlessui/react";
const cb_logo = "/images/logos/cb_logo_3.png";
import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import { get_user_id, get_user, get_entity, get_session_entity_id } from "~/utils/auth.server";
import { hasPath, head, keys, length, pipe } from "ramda";
import { cons, filter, get, has } from "shades";
import { prisma } from "~/utils/prisma.server";
import { redirect } from "@remix-run/node";
import { plans } from "~/data/upgrade_plans";
import { update_doc } from "~/utils/firebase";
import { form_params as form_params_f, store } from "~/utils/helpers";
// var stripe = require("stripe");
// import Stripe from "stripe";
import Stripe from "~/api/client/Stripe";
import Subscription from "~/api/client/Subscription";

const steps = [
	{ name: "Billing Information", href: "#", status: "current" },
	{ name: "Confirmation", href: "#", status: "upcoming" },
];

let use_stripe_store = store({
	card: {
		name: "",
		number: "",
		exp_month: "",
		exp_year: "",
		cvc: "",
	},
});

export const action = async ({ request }) => {
	console.log("action____");
	let referer = request.headers.get("Referer");
	let plan = { plan_id: "builder", plan_name: "builder" };
	let entity_id = await get_session_entity_id(request);
	let card = await form_params_f(request);

	let stripe = new Stripe(entity_id);
	let stripe_customer = await stripe.create_customer(card);
	let { id: stripe_customer_id } = stripe_customer;
	let stripe_subscription = await stripe.subscribe_customer(stripe_customer_id);
	let { id: stripe_subscription_id } = stripe_subscription;

	if (stripe_subscription_id) {
		let _subscription_ = new Subscription(entity_id);
		let subscription = await _subscription_.create({ plan, stripe_customer_id, stripe_subscription_id });
		return redirect("/home");
	}

	return redirect(referer);
};

export const loader = async ({ request }) => {
	let entity = await get_entity(request);

	// console.log("entity");
	// console.log(entity);

	let { stripe_subscription_id } = entity;

	return { stripe_subscription_id };
};

export default function Checkout() {
	let { stripe_subscription_id } = useLoaderData();
	let plan = pipe(filter({ id: "builder" }), head)(plans);
	let card = use_stripe_store((state) => state.card);
	let set_card = use_stripe_store((state) => state.set_path);

	const submit = useSubmit();

	const onSubmit = (event) => {
		console.log("onSubmit");
		event.preventDefault();

		submit(card, {
			method: "post",
			action: "/checkout/plans/builder" + window.location.search,
		});
	};

	return (
		<div className="bg-white">
			<div className="fixed left-0 top-0 hidden h-full w-1/2 bg-white lg:block" aria-hidden="true" />
			<div className="fixed right-0 top-0 hidden h-full w-1/2 bg-gray-50 lg:block" aria-hidden="true" />

			<main className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
				<h1 className="sr-only">Order information</h1>

				<section
					aria-labelledby="summary-heading"
					className="bg-gray-50 px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
				>
					<div className="mx-auto max-w-lg lg:max-w-none">
						<h2 id="summary-heading" className="text-lg font-medium text-gray-900">
							Order summary
						</h2>

						<div className="flex flex-col space-y-5 my-5">
							{plan.features.map((feature, idx) => (
								<div className="flex flex-row w-full" key={idx}>
									<div className="w-[20px] mr-[15px] text-green-500">
										<CheckIcon />
									</div>
									<div>{feature.text}</div>
								</div>
							))}
						</div>
					</div>
				</section>

				<form className="px-4 pb-36 pt-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16">
					<div className="mx-auto max-w-lg lg:max-w-none">
						<section aria-labelledby="payment-heading" className="">
							<div className="flex flex-row justify-between">
								<h2 id="payment-heading" className="text-lg font-medium text-gray-900">
									Payment details
								</h2>

								<div className="flex flex-row space-x-1">
									<div>Plan:</div>
									<div>{plan.name}</div>
								</div>
							</div>

							<div className="mt-6 flex flex-col gap-x-4 w-full gap-y-6">
								<div className="flex flex-col w-full">
									<label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700">
										Name on card
									</label>
									<div className="mt-1">
										<input
											type="text"
											id="name-on-card"
											name="name-on-card"
											autoComplete="cc-name"
											className="block w-full rounded-md h-[35px] border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
											value={card.name}
											onChange={(e) => set_card(["card", "name"], e.target.value)}
										/>
									</div>
								</div>

								<div className="flex flex-col w-full">
									<label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
										Card number
									</label>
									<div className="mt-1">
										<input
											type="text"
											id="card-number"
											name="card-number"
											autoComplete="cc-number"
											className="block w-full rounded-md h-[35px] border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
											value={card.number}
											onChange={(e) => set_card(["card", "number"], e.target.value)}
										/>
									</div>
								</div>

								<div className="flex flex-row w-full gap-x-3">
									<div className="flex flex-col w-1/3">
										<label
											htmlFor="expiration-date"
											className="block text-sm font-medium text-gray-700"
										>
											Exp month (MM)
										</label>
										<div className="mt-1">
											<input
												type="text"
												name="expiration-date"
												id="expiration-date"
												autoComplete="cc-exp"
												className="block w-full rounded-md h-[35px] border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
												value={card.exp_month}
												onChange={(e) => set_card(["card", "exp_month"], e.target.value)}
											/>
										</div>
									</div>

									<div className="flex flex-col w-1/3">
										<label
											htmlFor="expiration-date"
											className="block text-sm font-medium text-gray-700"
										>
											Exp year (YY)
										</label>
										<div className="mt-1">
											<input
												type="text"
												name="expiration-date"
												id="expiration-date"
												autoComplete="cc-exp"
												className="block w-full rounded-md h-[35px] border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
												value={card.exp_year}
												onChange={(e) => set_card(["card", "exp_year"], e.target.value)}
											/>
										</div>
									</div>

									<div className="flex flex-col w-1/3">
										<label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
											CVC
										</label>
										<div className="mt-1">
											<input
												type="text"
												name="cvc"
												id="cvc"
												autoComplete="csc"
												className="block w-full rounded-md h-[35px] border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
												value={card.cvc}
												onChange={(e) => set_card(["card", "cvc"], e.target.value)}
											/>
										</div>
									</div>
								</div>
							</div>
						</section>

						<div className="flex flex-col w-full border-t border-gray-200 mt-10 pt-2">
							<div className="flex flex-row w-full justify-between font-semibold">
								<div>Total</div>
								<div>{plan.price.monthly}</div>
							</div>
						</div>
						<div className="border-gray-200 pt-6 w-full" onClick={onSubmit}>
							<button
								type="submit"
								className="flex flex-col w-full items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last"
							>
								{stripe_subscription_id ? "Change Plan" : "Continue"}
							</button>
						</div>
					</div>
				</form>
			</main>
		</div>
	);
}
