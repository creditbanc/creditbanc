import useStore from "./store";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { classNames, currency, mapIndexed } from "~/utils/helpers";
import { pipe } from "ramda";
import { StarIcon } from "@heroicons/react/20/solid";

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
		description:
			"The gold standard in business lending. Variable interest rates, longest terms, and lowest monthly payments.",
		price: "Loans up to: $500,000",
	},
	{
		name: "Term Loan",
		description: "Fixed interest rates and shorter repayment terms. Faster funding and less documentation.",
		price: "Loans up to: $350,000",
	},
	{
		name: "Line of Credit",
		description:
			"The capital you need when you need it. Connect a bank account for fast funding in as little as 2 business days.",
		price: "Loans up to: $150,000",
	},
];

const LoansList = () => {
	const [selected, setSelected] = useState(loans[0]);

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
									active ? "border-blue-600 ring-2 ring-blue-600" : "border-gray-300",
									"relative block cursor-pointer rounded border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between"
								)
							}
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
											checked ? "border-blue-600" : "border-transparent",
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
		<div className="flex flex-col text-center gap-y-3 my-7">
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
	return (
		<form>
			<div className="flex flex-col gap-y-5">
				<div className="flex flex-col w-full">
					<label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
						First name
					</label>
					<div className="mt-2">
						<input
							type="text"
							name="first-name"
							id="first-name"
							autoComplete="given-name"
							className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div className="flex flex-col w-full">
					<label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
						Last name
					</label>
					<div className="mt-2">
						<input
							type="text"
							name="last-name"
							id="last-name"
							autoComplete="family-name"
							className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div className="flex flex-col w-full">
					<label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
						Email address
					</label>
					<div className="mt-2">
						<input
							id="email"
							name="email"
							type="email"
							autoComplete="email"
							className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
				<div className="flex gap-x-1 text-blue-600">
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
	return (
		<div className="flex flex-col items-center w-full h-full overflow-y-scroll pb-10">
			<Header />
			<div className="flex flex-row w-[1100px] gap-x-5">
				<div className="flex flex-col w-[70%] -mt-[30px] gap-y-6">
					<div className="flex flex-col bg-white p-5 pb-7 shadow rounded border">
						<SectionHeading
							headline={`Step 1: Which type of financing do you prefer?`}
							subheadline={`With CreditBanc, one application is all you need to pre-qualify. Choose the financing
								you prefer, or let us recommend the best fit for your business.`}
						/>

						<LoansList />
					</div>
					<div className="flex flex-col bg-white p-5 pb-0 shadow rounded border">
						<SectionHeading
							headline={`Step 2: How much do you want to borrow?`}
							subheadline={`Use the slider to select your loan amount or enter an amount in the text field.`}
						/>

						<LoanAmountSlider />
						<div className="my-5">
							<LoanStats />
						</div>
					</div>
					<div className="flex flex-col bg-white p-5 shadow rounded border">
						<SectionHeading headline={`Step 3: Tell us a bit about you`} />
						<PersonalInfoForm />
					</div>
					<div className="flex flex-col w-full items-center">
						<div className="flex flex-col bg-blue-600 py-3 px-4 rounded-full text-white w-[400px] items-center cursor-pointer">
							Continue to pre-qualify
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
