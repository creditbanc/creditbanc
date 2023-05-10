import { pipe } from "ramda";
import { get } from "shades";
import { useLoaderData } from "@remix-run/react";
import Nav from "~/components/CreditNav";
import { inspect } from "~/utils/helpers";

var stripe = require("stripe");

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
				<div>Actions</div>
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
			<div className="flex flex-col p-5">
				<SubscriptionCard subscription={subscriptions[0]} />
			</div>
		</div>
	);
}
