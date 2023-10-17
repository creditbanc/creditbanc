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
	let plan = { plan_id: "builder", plan_name: "builder" };
	let entity_id = await get_session_entity_id(request);
	let form = await form_params_f(request);
	let { card, coupon_code } = form;
	card = JSON.parse(card);

	// card = {
	// 	name: "test",
	// 	number: "4242424242424242",
	// 	exp_month: "12",
	// 	exp_year: "2025",
	// 	cvc: "123",
	// };

	// live prices
	let trial_price_id = "price_1O29RkJlRXkfyebso7Dk5ndd";
	let price_id = "price_1O29RkJlRXkfyebsdxMrbZB4";

	// test prices
	// let trial_price_id = "price_1O28UEJlRXkfyebs3eCEsreO";
	// let price_id = "price_1O0erpJlRXkfyebsoSSVfo7E";

	let stripe = new Stripe(entity_id);
	let stripe_customer = await stripe.create_customer(card);
	let { id: stripe_customer_id } = stripe_customer;

	let stripe_subscription;
	if (coupon_code == "sag") {
		stripe_subscription = await stripe.subscribe_trial_customer(trial_price_id, price_id, stripe_customer_id);
	} else {
		stripe_subscription = await stripe.subscribe_customer(price_id, stripe_customer_id);
	}

	let { id: stripe_subscription_id } = stripe_subscription;

	if (stripe_subscription_id) {
		let _subscription_ = new Subscription(entity_id);
		let subscription = await _subscription_.create({ plan, stripe_customer_id, stripe_subscription_id });

		return redirect("/home");
	}

	return redirect(referer);
};

export default function Checkout() {
	let plan_id = "builder";
	let plan = pipe(filter({ id: plan_id }), head)(plans);
	let card = use_stripe_store((state) => state.card);
	let coupon_code = use_stripe_store((state) => state.coupon_code);

	const submit = useSubmit();

	const onSubmit = (event) => {
		console.log("onSubmit");
		event.preventDefault();

		submit(
			{ card: JSON.stringify(card), coupon_code },
			{
				method: "post",
				action: `/checkout/plans/${plan_id}` + window.location.search,
			}
		);
	};

	return (
		<div className="flex flex-col w-full h-full bg-white">
			<main className="relative flex flex-row w-full h-full">
				<div className="flex flex-col flex-1 justify-center">
					<StripeForm onSubmit={onSubmit} plan_id={plan_id} />
				</div>

				<div className="flex flex-col h-full w-[40%] bg-gray-50 pt-16">
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
				</div>
			</main>
		</div>
	);
}
