import { pipe } from "ramda";
import { get } from "shades";
import { useLoaderData, useSubmit, useParams } from "@remix-run/react";
import Nav from "~/components/CreditNav";
import { inspect } from "~/utils/helpers";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { get_user_id } from "~/utils/auth.server";
var stripe = require("stripe");

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export const loader = async ({ params }) => {
	stripe = stripe(process.env.STRIPE);

	let { entity_id } = params;

	console.log("params");
	console.log(params);

	const subscriptions_response = await stripe.subscriptions.search({
		query: `metadata["entity_id"]: "${entity_id}"`,
	});

	let subscriptions = pipe(get("data"))(subscriptions_response);

	console.log("subscriptions");
	inspect(subscriptions);

	return { subscriptions };
};

export const action = async ({ request }) => {
	console.log("update_subscription");
	stripe = stripe(process.env.STRIPE);
	let entity_id = await get_user_id(request);
	var form = await request.formData();
	const price_id = form.get("price_id");
	const subscription_id = form.get("subscription_id");

	const subscription = await stripe.subscriptions.retrieve(subscription_id);

	stripe.subscriptions.update(subscription.id, {
		cancel_at_period_end: false,
		proration_behavior: "create_prorations",
		items: [
			{
				id: subscription.items.data[0].id,
				price: price_id,
			},
		],
	});
};

function ActionsDropwdown({ subscription }) {
	const submit = useSubmit();
	const { entity_id } = useParams();
	let { id: subscription_id } = subscription;

	console.log("entity_id");
	console.log(entity_id);

	const onUpdateSubscription = (price_id) => {
		console.log("onUpdateSubscription");

		submit(
			{ price_id, subscription_id },
			{
				method: "post",
				action: `/admin/customers/${entity_id}`,
			}
		);
	};

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
					Options
					<ChevronDownIcon
						className="-mr-1 h-5 w-5 text-gray-400"
						aria-hidden="true"
					/>
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<a
									href="#"
									className={classNames(
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									Update to Banc Essentials
								</a>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<div
									onClick={() =>
										onUpdateSubscription(
											"price_1N61DjJlRXkfyebsWDaUadR0"
										)
									}
									className={classNames(
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
										"block px-4 py-2 text-sm cursor-pointer"
									)}
								>
									Update to Banc Builder
								</div>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<a
									onClick={() =>
										onUpdateSubscription(
											"price_1N5wxGJlRXkfyebs5BWgNLZU"
										)
									}
									className={classNames(
										active
											? "bg-gray-100 text-gray-900"
											: "text-gray-700",
										"block px-4 py-2 text-sm cursor-pointer"
									)}
								>
									Update to Banc Pro
								</a>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}

const SubscriptionCard = ({ subscription }) => {
	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-row justify-between border-b pb-2 mb-3">
				<div className="flex flex-row items-end space-x-1">
					<div className="font-semibold text-xl">9834098204982</div>
					<div>on</div>
					<div>Credit Banc Pro</div>
					<div className="flex flex-col self-start pl-3">
						<div className="flex flex-col bg-green-200 text-green-600 px-2 py-.5 rounded-sm text-xs ">
							Active
						</div>
					</div>
				</div>
				<div>
					<ActionsDropwdown subscription={subscription} />
				</div>
			</div>

			<div className="flex flex-col space-y-10">
				<div className="flex flex-col w-full ">
					<div className="flex flex-row w-full space-x-5 text-sm">
						<div className="flex flex-col space-y-1 border-r pr-5">
							<div className=" text-gray-400">Started</div>
							<div>May 9</div>
						</div>
						<div className="flex flex-col space-y-1">
							<div className=" text-gray-400">Next invoice</div>
							<div>$85.00 on Jun 9</div>
						</div>
					</div>
				</div>

				<div className="flex flex-col w-full ">
					<div className="font-semibold text-xl flex flex-col w-full border-b pb-2 mb-3">
						Subscription details
					</div>
					<div className="flex flex-col text-sm space-y-2">
						<div className="flex flex-row ">
							<div className="flex flex-col w-[150px] text-gray-400">
								Customer
							</div>
							<div>1</div>
						</div>
						<div className="flex flex-row ">
							<div className="flex flex-col w-[150px] text-gray-400">
								Created
							</div>
							<div>1</div>
						</div>
						<div className="flex flex-row ">
							<div className="flex flex-col w-[150px] text-gray-400">
								Current period
							</div>
							<div>1</div>
						</div>
						<div className="flex flex-row ">
							<div className="flex flex-col w-[150px] text-gray-400">
								ID
							</div>
							<div>1</div>
						</div>
					</div>
				</div>

				<div className="flex flex-col w-full">
					<div className="font-semibold text-xl flex flex-col w-full border-b pb-2 mb-3">
						Pricing
					</div>
					<div className="flex flex-col text-sm space-y-2">
						<div className="flex flex-row ">
							<div className="flex flex-col w-[150px] text-gray-400">
								Customer
							</div>
							<div>1</div>
						</div>
						<div className="flex flex-row ">
							<div className="flex flex-col w-[150px] text-gray-400">
								Created
							</div>
							<div>1</div>
						</div>
					</div>
				</div>

				<div className="flex flex-col w-full">
					<div className="flex flex-col w-full border-b pb-2 mb-3 space-y-1">
						<div className="font-semibold text-xl">
							Upcoming invoice
						</div>
						<div className="text-sm text-gray-600">
							This is a preview of the invoice that will be billed
							on Jun 9. It may change if the subscription is
							updated.
						</div>
					</div>
					<div className="flex flex-col text-sm space-y-2">
						<div className="flex flex-row w-full border-b pb-2">
							<div className="flex flex-row w-2/3">
								<div>Description</div>
							</div>
							<div className="flex flex-row w-1/3 justify-end">
								<div className="flex flex-col w-1/3">QTY</div>
								<div className="flex flex-col w-1/3">
									Unit price
								</div>
								<div className="flex flex-col w-1/3">
									Amount
								</div>
							</div>
						</div>
						<div className="flex flex-row w-full space-x-1">
							<div>JUN 9</div>
							<div>-</div>
							<div>JUL 9, 2023</div>
						</div>
						<div className="flex flex-row w-full ">
							<div className="flex flex-col w-2/3">
								<div>Credit Banc Pro</div>
							</div>
							<div className="flex flex-row w-1/3 justify-end">
								<div className="flex flex-col w-1/3">1</div>
								<div className="flex flex-col w-1/3">
									$85.00
								</div>
								<div className="flex flex-col w-1/3">
									$85.00
								</div>
							</div>
						</div>
						<div className="flex flex-row w-full">
							<div className="flex flex-col w-2/3">
								<div></div>
							</div>
							<div className="flex flex-row w-1/3 justify-end">
								<div className="flex flex-col w-1/3"></div>
								<div className="flex flex-col w-1/3">
									Subtotal
								</div>
								<div className="flex flex-col w-1/3">
									$85.00
								</div>
							</div>
						</div>
						<div className="flex flex-row w-full">
							<div className="flex flex-col w-2/3">
								<div></div>
							</div>
							<div className="flex flex-row w-1/3 justify-end">
								<div className="flex flex-col w-1/3"></div>
								<div className="flex flex-col w-1/3">Total</div>
								<div className="flex flex-col w-1/3">
									$85.00
								</div>
							</div>
						</div>
						<div className="flex flex-row w-full">
							<div className="flex flex-col w-2/3">
								<div></div>
							</div>
							<div className="flex flex-row w-1/3 justify-end">
								<div className="flex flex-col w-1/3"></div>
								<div className="flex flex-col w-1/3">
									Amount due
								</div>
								<div className="flex flex-col w-1/3">
									$85.00
								</div>
							</div>
						</div>
						<div className="flex flex-col w-full border-b py-1"></div>
					</div>
				</div>

				<div className="flex flex-col w-full">
					<div className="flex flex-col w-full border-b pb-2 mb-3">
						<div className="font-semibold text-xl ">Invoices</div>
					</div>
					<div className="flex flex-col text-sm space-y-2">
						<div className="flex flex-row w-full border-b pb-2">
							<div className="flex flex-row w-2/3">
								<div className="flex flex-col w-1/4">
									Amount
								</div>
								<div className="flex flex-col  w-1/4">
									Invoice number
								</div>
								<div className="flex flex-col  w-1/4">
									Customer
								</div>
							</div>
							<div className="flex flex-row w-1/3 justify-end">
								<div className="flex flex-col w-1/3">Due</div>
								<div className="flex flex-col w-1/3">
									Created
								</div>
							</div>
						</div>

						<div className="flex flex-row w-full ">
							<div className="flex flex-row w-2/3">
								<div className="flex flex-col  w-1/4">
									$85.00
								</div>
								<div className="flex flex-col  w-1/4">
									77380492830948
								</div>
								<div className="flex flex-col  w-1/4">-</div>
							</div>
							<div className="flex flex-row w-1/3 justify-end">
								<div className="flex flex-col w-1/3">-</div>
								<div className="flex flex-col w-1/3">
									May 9, 5:10 PM
								</div>
							</div>
						</div>

						<div className="flex flex-col w-full border-b py-1"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Customer() {
	let { subscriptions } = useLoaderData();
	return (
		<div className="flex flex-col w-full h-full">
			<div className="flex flex-col w-full border-b">
				<Nav />
			</div>
			<div className="flex flex-col p-8">
				<SubscriptionCard subscription={subscriptions[0]} />
			</div>
		</div>
	);
}
