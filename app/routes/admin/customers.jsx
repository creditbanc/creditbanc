import { useLoaderData, Link } from "@remix-run/react";
import Nav from "~/components/CreditNav";
import { pipe, map, length } from "ramda";
import moment from "moment";
import { mapIndexed } from "~/utils/helpers";
var stripe = require("stripe");

export const loader = async () => {
	stripe = stripe(process.env.STRIPE);
	const customers_response = await stripe.customers.list({
		limit: 500,
	});

	let { data: customers } = customers_response;
	return { customers };
};

const SectionHeading = () => {
	return (
		<div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
			<h3 className="text-base font-semibold leading-6 text-gray-900">
				Customers
			</h3>
		</div>
	);
};

const CustomerTableHeader = () => {
	return (
		<div className="flex flex-row w-full border-b py-1 text-sm font-semibold">
			<div className="flex flex-col w-1/3">ID</div>
			<div className="flex flex-col w-[100px]">Balance</div>
			<div className="flex flex-col w-[100px]">Created</div>
		</div>
	);
};

const CustomerTable = () => {
	let { customers } = useLoaderData();
	return (
		<div className="flex flex-col mt-3">
			<CustomerTableHeader />
			<div className="flex flex-col">
				{pipe(
					mapIndexed((customer, idx) => (
						<div
							className="flex flex-row border-b py-2 text-sm"
							key={idx}
						>
							<div className="flex flex-col w-1/3">
								<Link
									to={`/admin/customers/${customer.metadata.entity_id}`}
								>
									{customer.metadata.entity_id}
								</Link>
							</div>
							<div className="flex flex-col w-[100px]">
								{customer.balance}
							</div>
							<div className="flex flex-col w-[100px]">
								{moment().format("MM-DD-YYYY")}
							</div>
						</div>
					))
				)(customers)}
			</div>
		</div>
	);
};

export default function Customers() {
	let { customers } = useLoaderData();
	return (
		<div className="flex flex-col w-full h-full">
			<div className="flex flex-col w-full border-b">
				<Nav />
			</div>
			<div className="flex flex-col w-full p-8">
				<SectionHeading />
				<CustomerTable />
				<div className="flex flex-col text-sm mt-3">
					<div className="flex flex-row">
						<div>{length(customers)} results</div>
					</div>
				</div>
			</div>
		</div>
	);
}
