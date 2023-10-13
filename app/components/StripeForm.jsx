import { head, pipe } from "ramda";
import { filter } from "shades";
import { plans } from "~/data/index_plans";
import { store } from "~/utils/helpers";

export const use_stripe_store = store({
	card: {
		name: "",
		number: "",
		exp_month: "",
		exp_year: "",
		cvc: "",
	},
});

export default function StripeForm({ onSubmit, plan_id }) {
	let plan = pipe(filter({ id: plan_id }), head)(plans);
	let card = use_stripe_store((state) => state.card);
	let set_card = use_stripe_store((state) => state.set_path);

	return (
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
								<label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
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
								<label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
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
						Continue
					</button>
				</div>
			</div>
		</form>
	);
}
