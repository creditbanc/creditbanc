import { Fragment } from "react";
import {
	ChevronRightIcon,
	ChevronUpIcon,
	CheckIcon,
} from "@heroicons/react/20/solid";
import { Popover, Transition } from "@headlessui/react";
const cb_logo = "/images/logos/cb_logo_3.png";
import { Link, useSubmit } from "@remix-run/react";
import { get_user_id } from "~/utils/auth.server";
import { hasPath, head, length, pipe } from "ramda";
import { filter, get, has } from "shades";
import { prisma } from "~/utils/prisma.server";
import { redirect } from "@remix-run/node";
import { plans } from "~/data/upgrade_plans";
var stripe = require("stripe");

const steps = [
	{ name: "Billing Information", href: "#", status: "current" },
	{ name: "Confirmation", href: "#", status: "upcoming" },
];

// let features = [
// 	"Full business & personal credit reports",
// 	"Actionable cash flow insights & alerts",
// 	"1-on-1s with credit & lending specialists",
// 	"Identity restoration services",
// 	"$1M Identity theft protection",
// 	"Lost wallet replacement",
// 	"Follow up to 5 businesses’ credit reports",
// 	"Simple quarterly billing option",
// 	"Tradeline reporting for business credit support",
// ];

export const action = async ({ request }) => {
	console.log("action");
	stripe = stripe(process.env.STRIPE);
	let entity_id = await get_user_id(request);
	var form = await request.formData();

	const email = form.get("email");
	const password = form.get("password");

	const customer_search_response = await stripe.customers.search({
		query: `metadata["entity_id"]: "${entity_id}"`,
	});

	let has_customer = pipe(has({ data: (data) => length(data) > 0 }))(
		customer_search_response
	);

	console.log("has_customer");
	console.log(has_customer);

	const create_token = async () => {
		const token = await stripe.tokens.create({
			card: {
				number: "4242424242424242",
				exp_month: 5,
				exp_year: 2024,
				cvc: "314",
			},
		});

		return token;
	};

	const create_customer = async (entity_id) => {
		let token = await create_token();
		let { id: token_id } = token;

		const customer = await stripe.customers.create({
			name: entity_id,
			metadata: {
				entity_id,
			},
			source: token_id,
		});

		return customer;
	};

	const subscribe_customer = async (customer_id) => {
		const subscription = await stripe.subscriptions.create({
			customer: customer_id,
			items: [{ price: "price_1N5wxGJlRXkfyebs5BWgNLZU" }],
			metadata: {
				entity_id,
				customer_id,
			},
		});
		return subscription;
	};

	if (has_customer) {
		let customer = pipe(get("data", 0))(customer_search_response);
		let { id: customer_id } = customer;
		let subscription = await subscribe_customer(customer_id);

		// console.log("subscription");
		// console.log(subscription);

		await prisma.entity.update({
			where: {
				id: entity_id,
			},
			data: {
				plan_id: "builder",
			},
		});

		return redirect("/home");
	}

	let customer = await create_customer(entity_id);
	let { id: customer_id } = customer;
	let subscription = await subscribe_customer(customer_id);

	await prisma.entity.update({
		where: {
			id: entity_id,
		},
		data: {
			plan_id: "builder",
			stripe_customer_id: customer_id,
			stripe_subscription_id: subscription.id,
		},
	});

	return redirect("/home");

	console.log("subscription");
	console.log(subscription);
};

export default function Checkout() {
	let plan = pipe(filter({ id: "builder" }), head)(plans);

	const submit = useSubmit();

	const onSubmit = (event) => {
		console.log("onSubmit");
		event.preventDefault();
		let form = event.currentTarget;
		submit(
			{},
			{
				method: "post",
				action: "/checkout/plans/builder" + window.location.search,
			}
		);
	};

	return (
		<div className="bg-white">
			<div
				className="fixed left-0 top-0 hidden h-full w-1/2 bg-white lg:block"
				aria-hidden="true"
			/>
			<div
				className="fixed right-0 top-0 hidden h-full w-1/2 bg-gray-50 lg:block"
				aria-hidden="true"
			/>

			<header className="relative border-b border-gray-200 bg-white text-sm font-medium text-gray-700">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					<div className="relative flex justify-end sm:justify-center">
						<Link to="/" className="absolute left-0 top-1/2 -mt-4">
							<span className="sr-only">Credit Banc</span>
							<img
								src={cb_logo}
								alt=""
								className="hidden sm:block h-5 w-auto"
							/>
						</Link>
						<nav aria-label="Progress" className="hidden sm:block ">
							<ol role="list" className="flex space-x-4">
								{steps.map((step, stepIdx) => (
									<li
										key={step.name}
										className="flex items-center"
									>
										{step.status === "current" ? (
											<a
												href={step.href}
												aria-current="page"
												className="text-indigo-600"
											>
												{step.name}
											</a>
										) : (
											<a href={step.href}>{step.name}</a>
										)}

										{stepIdx !== steps.length - 1 ? (
											<ChevronRightIcon
												className="ml-4 h-5 w-5 text-gray-300"
												aria-hidden="true"
											/>
										) : null}
									</li>
								))}
							</ol>
						</nav>
						<p className="sm:hidden">Step 2 of 4</p>
					</div>
				</div>
			</header>

			<main className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
				<h1 className="sr-only">Order information</h1>

				<section
					aria-labelledby="summary-heading"
					className="bg-gray-50 px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
				>
					<div className="mx-auto max-w-lg lg:max-w-none">
						<h2
							id="summary-heading"
							className="text-lg font-medium text-gray-900"
						>
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

						{/* <dl className="hidden space-y-6  border-gray-200 pt-6 text-sm font-medium text-gray-900 lg:block">
							<div className="flex items-center justify-between border-t border-gray-200 pt-6">
								<dt className="text-base">Total</dt>
								<dd className="text-base">
									{plan.price.monthly}
								</dd>
							</div>
						</dl>

						<div className="fixed inset-x-0 bottom-0 flex flex-col-reverse text-sm font-medium text-gray-900 lg:hidden">
							<div className="relative z-10 border-t border-gray-200 bg-white px-4 sm:px-6">
								<div className="mx-auto max-w-lg">
									<div className="flex w-full items-center py-6 font-medium">
										<span className="mr-auto text-base">
											Total
										</span>
										<span className="mr-2 text-base">
											{plan.price.yearly}
										</span>
									</div>
								</div>
							</div>
						</div> */}
					</div>
				</section>

				<form className="px-4 pb-36 pt-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16">
					<div className="mx-auto max-w-lg lg:max-w-none">
						<section aria-labelledby="payment-heading" className="">
							<div className="flex flex-row justify-between">
								<h2
									id="payment-heading"
									className="text-lg font-medium text-gray-900"
								>
									Payment details
								</h2>

								<div className="flex flex-row space-x-1">
									<div>Plan:</div>
									<div>{plan.name}</div>
								</div>
							</div>

							<div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
								<div className="col-span-3 sm:col-span-4">
									<label
										htmlFor="name-on-card"
										className="block text-sm font-medium text-gray-700"
									>
										Name on card
									</label>
									<div className="mt-1">
										<input
											type="text"
											id="name-on-card"
											name="name-on-card"
											autoComplete="cc-name"
											className="block w-full rounded-md h-[35px] border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										/>
									</div>
								</div>

								<div className="col-span-3 sm:col-span-4">
									<label
										htmlFor="card-number"
										className="block text-sm font-medium text-gray-700"
									>
										Card number
									</label>
									<div className="mt-1">
										<input
											type="text"
											id="card-number"
											name="card-number"
											autoComplete="cc-number"
											className="block w-full rounded-md h-[35px] border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										/>
									</div>
								</div>

								<div className="col-span-2 sm:col-span-3">
									<label
										htmlFor="expiration-date"
										className="block text-sm font-medium text-gray-700"
									>
										Expiration date (MM/YY)
									</label>
									<div className="mt-1">
										<input
											type="text"
											name="expiration-date"
											id="expiration-date"
											autoComplete="cc-exp"
											className="block w-full rounded-md h-[35px] border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor="cvc"
										className="block text-sm font-medium text-gray-700"
									>
										CVC
									</label>
									<div className="mt-1">
										<input
											type="text"
											name="cvc"
											id="cvc"
											autoComplete="csc"
											className="block w-full rounded-md h-[35px] border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										/>
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
						<div
							className="border-gray-200 pt-6 w-full"
							onClick={onSubmit}
						>
							<button
								type="submit"
								className="flex flex-col w-full items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last"
							>
								Change Plan
							</button>
						</div>
					</div>
				</form>
			</main>
		</div>
	);
}
