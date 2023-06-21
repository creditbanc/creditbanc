import { Link, useLoaderData } from "@remix-run/react";
import { head, last, map, pipe } from "ramda";
import { currency, mapIndexed } from "~/utils/helpers";
import { tax_credit_cookie } from "~/sessions/tax_credit_cookie";
import { useEffect, useState } from "react";
import { redirect } from "@remix-run/node";
import { form_params } from "~/utils/helpers";
import { calculateTaxPerYear, STATES, INDUSTRY } from "~/data/tax";
import { filter, get } from "shades";
const cb_logo_3 = "/images/logos/cb_logo_3.png";

export const loader = async ({ request }) => {
	let cookies = request.headers.get("Cookie");
	let tax_credit = await tax_credit_cookie.parse(cookies);

	let { expenses, state_id, industry_id } = tax_credit;

	// console.log("expenses");
	// console.log(expenses);

	let expenses_payload = {};
	pipe(map((expense) => (expenses_payload[expense.year] = expense.amount)))(
		JSON.parse(expenses)
	);

	let payload = {
		expenses: expenses_payload,
		states: pipe(filter({ id: state_id }))(STATES),
		industry: pipe(filter({ id: industry_id }), head)(INDUSTRY),
	};

	let estimate_response = calculateTaxPerYear(
		payload.expenses,
		payload.states,
		payload.industry
	);

	let range = pipe(
		get("finalTax"),
		map((value) => parseFloat(value.replace(/,/g, "")))
	)(estimate_response);

	return range;
};

export default function Estimate() {
	let { rangeStartMinus, rangeEndMinus } = useLoaderData();
	return (
		<div className="isolate bg-gray-900 w-full flex flex-col absolute top-0 bottom-0">
			<div className="px-6 pt-6 lg:px-8 mb-[30px]">
				<nav
					className="flex items-center justify-between"
					aria-label="Global"
				>
					<div className="flex lg:flex-1">
						<Link to={"/"} className="-m-1.5 p-1.5">
							<img className="h-6" src={cb_logo_3} alt="" />
						</Link>
					</div>
				</nav>
			</div>
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<h1 className="text-4xl font-bold tracking-tight text-white">
						R&D Tax Credit Calculator
					</h1>
					<p className="mt-6 text-lg leading-8 text-gray-300">
						YOUR ESTIMATED TAX CREDIT:
					</p>
				</div>
			</div>
			<div className="w-full flex flex-col items-center mt-[50px] bg-gray-900 pb-[20px]">
				<div className="calculator_container w-[400px] sm:w-[500px] flex flex-col px-[10px] sm:px-0">
					<div className="flex flex-col max-h-[400px] ">
						<div className="flex flex-scroll w-full justify-center space-x-10 border rounded p-16 text-4xl font-semibold bg-transparent text-white">
							<div>{currency.format(rangeStartMinus)}</div>
							<div>to</div>
							<div>{currency.format(rangeEndMinus)}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
