import useStore from "./store";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { classNames, currency, form_params, get, get_entity_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { head, pipe } from "ramda";
import { StarIcon } from "@heroicons/react/20/solid";
import { Link, useLocation, useSubmit } from "@remix-run/react";
import { create_user_session, signup } from "~/utils/auth.server";
import { concatMap, from, lastValueFrom, map as rxmap, tap } from "rxjs";
import { set_doc, update_doc } from "~/utils/firebase";
import { redirect } from "@remix-run/node";
import { navigation } from "./navigation";
import { filter } from "shades";
import axios from "axios";

const update_onboarding = async ({ entity_id, group_id, step }) => {
	return set_doc(["onboarding", group_id], { step, entity_id, group_id }, true);
};

export const action = async ({ request }) => {
	let url = new URL(request.url);
	let { origin } = url;
	let params = await form_params(request);

	console.log("lp.action_____");
	console.log(params);

	let { email, first_name, last_name } = params;

	let step = pipe(filter({ id: "lp" }), head, get("step"))(navigation);

	const save_to_db = async ({ entity_id, group_id }) =>
		set_doc(["application", entity_id], { ...params, entity_id, group_id, step });

	let signup_payload = {
		email,
		first_name,
		last_name,
		default_password: true,
	};

	let response = from(signup(signup_payload)).pipe(
		concatMap(({ entity_id, group_id }) =>
			from(save_to_db({ entity_id, group_id })).pipe(rxmap(() => ({ entity_id, group_id })))
		)
	);

	let { entity_id, group_id } = await lastValueFrom(response);

	console.log("lp.entity_id");
	console.log(entity_id);
	console.log("lp.group_id");
	console.log(group_id);

	// let form_payload = {
	// 	email,
	// 	entity_id,
	// 	group_id,
	// };

	// var formdata = new FormData();
	// formdata.append("payload", JSON.stringify(form_payload));

	// let post_url = `${origin}/emails/welcome`;

	// let config = {
	// 	method: "post",
	// 	maxBodyLength: Infinity,
	// 	data: formdata,
	// 	headers: { "Content-Type": "multipart/form-data" },
	// 	url: post_url,
	// };

	// let email_response = await axios(config);
	await update_onboarding({ entity_id, group_id, step });

	let next = pipe(filter({ id: "lp" }), head, get("next"))(navigation);
	return create_user_session(entity_id, next({ entity_id, group_id }));
};

const Header = () => {
	return (
		<div className="flex flex-col w-full bg-[#2C81AB] items-center text-white">
			<div className="flex flex-col w-[1100px] items-center my-10 mb-20 gap-y-5 text-center">
				<div className="flex flex-col text-3xl">
					The best financing. The best bank loan. One fast and simple application.
				</div>
				<div className="flex flex-col text-xl">
					Our online lending network matches you with the best bank or lending partner to meet your business
					needs. See if you pre-qualify for up to $500,000 in 5 minutes. No impact to your credit score
				</div>
			</div>
		</div>
	);
};

const loans = [
	{
		name: "SBA Loan",
		id: "sba",
		description:
			"The gold standard in business lending. Variable interest rates, longest terms, and lowest monthly payments.",
		price: "Loans up to: $500,000",
	},
	{
		name: "Term Loan",
		id: "term",
		description: "Fixed interest rates and shorter repayment terms. Faster funding and less documentation.",
		price: "Loans up to: $350,000",
	},
	{
		name: "Line of Credit",
		id: "loc",
		description:
			"The capital you need when you need it. Connect a bank account for fast funding in as little as 2 business days.",
		price: "Loans up to: $150,000",
	},
];

const LoansList = () => {
	const [selected, setSelected] = useState(loans[0]);
	const { set_props } = useStore((state) => state);

	return (
		<RadioGroup value={selected} onChange={setSelected}>
			<RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
			<div className="space-y-4">
				{pipe(
					mapIndexed((plan, index) => (
						<RadioGroup.Option
							key={index}
							value={plan}
							className={({ active }) =>
								classNames(
									active ? "border-[#56cf9e] ring-2 ring-[#56cf9e]" : "border-gray-300",
									"relative block cursor-pointer rounded border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between"
								)
							}
							onClick={() => set_props({ loan_type: plan.id })}
						>
							{({ active, checked }) => (
								<>
									<span className="flex items-center">
										<span className="flex flex-col text-sm gap-y-2">
											<RadioGroup.Label as="span" className="font-medium text-gray-900">
												{plan.name}
											</RadioGroup.Label>
											<RadioGroup.Description as="span" className="text-gray-500 ">
												<span className="block sm:inline">{plan.description}</span>
											</RadioGroup.Description>
										</span>
									</span>
									<RadioGroup.Description
										as="span"
										className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
									>
										<span className="font-medium text-gray-900 text-base">{plan.price}</span>
									</RadioGroup.Description>
									<span
										className={classNames(
											active ? "border" : "border-2",
											checked ? "border-[#56cf9e]" : "border-transparent",
											"pointer-events-none absolute -inset-px rounded"
										)}
										aria-hidden="true"
									/>
								</>
							)}
						</RadioGroup.Option>
					))
				)(loans)}
			</div>
		</RadioGroup>
	);
};

const SectionHeading = ({ headline, subheadline }) => {
	return (
		<div className="flex flex-col text-center gap-y-2 my-7">
			<div className="text-gray-800 font-semibold">{headline}</div>
			<div className="text-gray-600">{subheadline}</div>
		</div>
	);
};

const LoanAmountSlider = () => {
	const { loan_amount, set_props } = useStore((state) => state);

	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-col w-full items-center my-5">
				<div className="flex flex-col text-3xl font-semibold text-[#56CF9E]">
					{currency.format(loan_amount)}
				</div>
			</div>
			<div className="flex flex-col w-full">
				<input
					min="30000"
					max="500000"
					type="range"
					value={loan_amount}
					onChange={(e) => set_props({ loan_amount: e.target.value })}
					className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
				/>
			</div>
			<div className="flex flex-row justify-between my-4 text-gray-600">
				<div>{currency.format(30000)}</div>
				<div>{currency.format(500000)}</div>
			</div>
		</div>
	);
};

const loan_stats = [
	{ id: 1, name: "MONTHLY PAYMENT", value: "2727", type: "currency" },
	{ id: 2, name: "LOAN TERM", value: "10 Years" },
	{ id: 3, name: "INTEREST RATE", value: "11.25%" },
	{ id: 4, name: "APR WITH FEES", value: "11.58%" },
];

const LoanStats = () => {
	return (
		<div className="flex flex-row overflow-hidden rounded text-center divide-x-[3px] divide-white">
			{pipe(
				mapIndexed((stat, index) => (
					<div key={index} className="flex flex-col gap-y-2 w-1/4 bg-slate-50 py-5">
						<div className="text-sm text-gray-600">{stat.name}</div>
						<div className="text-xl font-semibold text-[#56CF9E]">
							{stat.type === "currency" ? currency.format(stat.value) : stat.value}
						</div>
					</div>
				))
			)(loan_stats)}
		</div>
	);
};

const PersonalInfoForm = () => {
	const { set_props, first_name, last_name, email, phone } = useStore((state) => state);

	return (
		<form>
			<div className="flex flex-col gap-y-5">
				<div className="flex flex-col w-full">
					<label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
						First name
					</label>
					<div className="mt-2">
						<input
							value={first_name}
							type="text"
							name="first-name"
							id="first-name"
							autoComplete="given-name"
							className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
							onChange={(e) => set_props({ first_name: e.target.value })}
						/>
					</div>
				</div>

				<div className="flex flex-col w-full">
					<label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
						Last name
					</label>
					<div className="mt-2">
						<input
							value={last_name}
							type="text"
							name="last-name"
							id="last-name"
							autoComplete="family-name"
							className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
							onChange={(e) => set_props({ last_name: e.target.value })}
						/>
					</div>
				</div>

				<div className="flex flex-col w-full">
					<label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
						Email address
					</label>
					<div className="mt-2">
						<input
							value={email}
							id="email"
							name="email"
							type="email"
							autoComplete="email"
							className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
							onChange={(e) => set_props({ email: e.target.value })}
						/>
					</div>
				</div>

				<div className="flex flex-col w-full">
					<label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
						Phone number
					</label>
					<div className="mt-2">
						<input
							value={phone}
							id="phone"
							name="phone"
							type="phone"
							autoComplete="phone"
							className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
							onChange={(e) => set_props({ phone: e.target.value })}
						/>
					</div>
				</div>
			</div>
		</form>
	);
};

const Testimonial = () => {
	return (
		<section className="bg-white px-5">
			<figure className="mx-auto max-w-2xl">
				<div className="flex gap-x-1 text-[#56cf9e]">
					<StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
					<StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
					<StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
					<StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
					<StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
				</div>
				<blockquote className="mt-5 font-semibold tracking-tight text-gray-900 leading-6">
					<p>
						“Qui dolor enim consectetur do et non ex amet culpa sint in ea non dolore. Enim minim magna anim
						id minim eu cillum sunt dolore aliquip.”
					</p>
				</blockquote>
				<figcaption className="mt-5 flex items-center gap-x-6">
					<img
						className="h-12 w-12 rounded-full bg-gray-50"
						src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80"
						alt=""
					/>
					<div className="text-sm leading-6">
						<div className="font-semibold text-gray-900">Judith Black</div>
						<div className="mt-0.5 text-gray-600">CEO of Workcation</div>
					</div>
				</figcaption>
			</figure>
		</section>
	);
};

export default function Container() {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	const submit = useSubmit();
	let { loan_type, loan_amount, first_name, last_name, email, phone } = useStore((state) => state);

	const onSubmit = () => {
		console.log("onSubmit");
		let payload = {
			loan_type,
			loan_amount,
			email,
			first_name,
			last_name,
			phone,
		};

		// console.log("payload");
		// console.log(payload);

		submit(payload, { action: `/apply/lp/resource/e/${entity_id}/g/${group_id}`, method: "post" });
	};

	return (
		<div className="flex flex-col items-center w-full h-full overflow-y-scroll pb-10">
			<Header />
			<div className="flex flex-row w-[1100px] gap-x-5">
				<div className="flex flex-col w-[70%] -mt-[30px] gap-y-6">
					<div className="flex flex-col bg-white p-5 shadow rounded border">
						<SectionHeading
							headline={`Step 1: Tell us a bit about you`}
							subheadline={
								<div>
									<div>With CreditBanc, one application is all you need to pre-qualify.</div>
									<div>
										Choose the financing you prefer, or let us recommend the best fit for your
										business.
									</div>
								</div>
							}
						/>
						<PersonalInfoForm />
					</div>
					<div className="flex flex-col bg-white p-5 pb-0 shadow rounded border">
						<SectionHeading
							headline={`Step 2: How much do you want to borrow?`}
							subheadline={`Use the slider to select your loan amount or enter an amount in the text field.`}
						/>
						<LoanAmountSlider />
					</div>
					<div className="flex flex-col bg-white p-5 pb-7 shadow rounded border">
						<SectionHeading headline={`Step 3: Which type of financing do you prefer?`} />
						<LoansList />
					</div>
					<div className="flex flex-col w-full items-center gap-y-4">
						<div
							// to={`/apply/financing_needs/resource/e/${entity_id}/g/${group_id}`}
							className="flex flex-col bg-[#56cf9e] py-3 px-4 rounded-full text-white w-[400px] items-center cursor-pointer"
							onClick={onSubmit}
						>
							Continue to pre-qualify
						</div>
						<div className="flex flex-row w-full justify-center items-center text-sm gap-x-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								className="w-4 h-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
								/>
							</svg>

							<div>Only takes 5 minutes and doesn’t impact your credit score</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-[30%]">
					<div className="flex flex-col w-full gap-y-10 my-10">
						<div className="flex flex-col">
							<Testimonial />
						</div>
						<div className="flex flex-col">
							<Testimonial />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
