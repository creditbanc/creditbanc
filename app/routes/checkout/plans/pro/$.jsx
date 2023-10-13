import { CheckIcon } from "@heroicons/react/20/solid";
import { useSubmit } from "@remix-run/react";
import { get_session_entity_id } from "~/utils/auth.server";
import { head, pipe } from "ramda";
import { filter } from "shades";
import { redirect } from "@remix-run/node";
import { plans } from "~/data/upgrade_plans";
import { form_params as form_params_f, store } from "~/utils/helpers";
import Stripe from "~/api/client/Stripe";
import Subscription from "~/api/client/Subscription";
import StripeForm, { use_stripe_store } from "~/components/StripeForm";

export const action = async ({ request }) => {
	console.log("action____");
	let referer = request.headers.get("Referer");
	let plan = { plan_id: "pro", plan_name: "pro" };
	let entity_id = await get_session_entity_id(request);
	let card = await form_params_f(request);

	let stripe = new Stripe(entity_id);
	let stripe_customer = await stripe.create_customer(card);
	let { id: stripe_customer_id } = stripe_customer;
	let price_id = "price_1O0nG9JlRXkfyebs8cGvUIgN";
	let stripe_subscription = await stripe.subscribe_customer(price_id, stripe_customer_id);
	let { id: stripe_subscription_id } = stripe_subscription;

	if (stripe_subscription_id) {
		let _subscription_ = new Subscription(entity_id);
		let subscription = await _subscription_.create({ plan, stripe_customer_id, stripe_subscription_id });
		return redirect("/home");
	}

	return redirect(referer);
};

export default function Checkout() {
	let plan_id = "pro";
	let plan = pipe(filter({ id: plan_id }), head)(plans);
	let card = use_stripe_store((state) => state.card);

	const submit = useSubmit();

	const onSubmit = (event) => {
		console.log("onSubmit");
		event.preventDefault();

		submit(card, {
			method: "post",
			action: `/checkout/plans/${plan_id}` + window.location.search,
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

				<StripeForm onSubmit={onSubmit} plan_id={plan_id} />
			</main>
		</div>
	);
}
