import { useState, useRef } from "react";
import { Dialog } from "@headlessui/react";
import {
	Bars3Icon,
	XMarkIcon,
	ArrowPathIcon,
	CloudArrowUpIcon,
	FingerPrintIcon,
	LockClosedIcon,
	ServerIcon,
	CheckIcon,
	MinusSmallIcon,
	PlusSmallIcon,
} from "@heroicons/react/24/outline";
import { Disclosure, RadioGroup } from "@headlessui/react";
import { Link, useTransition } from "@remix-run/react";
import { Carousel } from "antd";
import CreditScoreDoughnut from "~/components/CreditScoreDoughnut";
const shield_advisory_logo = "/images/logos/shield_advisory_group_logo.png";
const liquid_lunch_logo = "/images/logos/liquid_lunch_logo.jpg";
const the_weekly_logo = "/images/logos/the_weekly_logo.png";
const cb_logo_3 = "/images/logos/cb_logo_3.png";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const navigation = [
	{ name: "Pro", href: "/comingsoon" },
	{ name: "Small Business Lending", href: "/comingsoon" },
	{ name: "Tax Credits", href: "/comingsoon" },
	{ name: "Business Valuations", href: "/comingsoon" },
	{ name: "CB University", href: "/comingsoon" },
];

const footerNavigation = [
	{
		name: "Facebook",
		href: "#",
		icon: (props) => (
			<svg fill="currentColor" viewBox="0 0 24 24" {...props}>
				<path
					fillRule="evenodd"
					d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
	{
		name: "Instagram",
		href: "#",
		icon: (props) => (
			<svg fill="currentColor" viewBox="0 0 24 24" {...props}>
				<path
					fillRule="evenodd"
					d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
	{
		name: "Twitter",
		href: "#",
		icon: (props) => (
			<svg fill="currentColor" viewBox="0 0 24 24" {...props}>
				<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
			</svg>
		),
	},
	{
		name: "GitHub",
		href: "#",
		icon: (props) => (
			<svg fill="currentColor" viewBox="0 0 24 24" {...props}>
				<path
					fillRule="evenodd"
					d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
	{
		name: "YouTube",
		href: "#",
		icon: (props) => (
			<svg fill="currentColor" viewBox="0 0 24 24" {...props}>
				<path
					fillRule="evenodd"
					d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
];

function FooterTwo() {
	return (
		<footer className="bg-white border-t-[1px]">
			<div className="mx-auto max-w-7xl py-6 md:flex md:items-center md:justify-between px-6">
				<div className="flex justify-center space-x-6 md:order-2">
					{footerNavigation.map((item) => (
						<a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500">
							<span className="sr-only">{item.name}</span>
							<item.icon className="h-6 w-6" aria-hidden="true" />
						</a>
					))}
				</div>
				<div className="mt-8 md:order-1 md:mt-0">
					<p className="text-center text-xs leading-5 text-gray-500">
						&copy; 2023 Credit Banc, LLC. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}

const Single = () => {
	return (
		<div className="flex flex-col items-center">
			<CreditScoreDoughnut bureau={"Equifax"} scoreClassNames="text-6xl" bureauTitleClassNames="text-1xl">
				<div className="mt-[170px] font-bold text-5xl">750</div>
			</CreditScoreDoughnut>
		</div>
	);
};

const features = [
	{
		name: "Gain credit insights.",
		description:
			"View the same type of information that lenders see when requesting your credit. See who’s accessing your data and get tips on how to improve your financial health.",
	},
	{
		name: "View your score factors",
		description:
			"Your credit score is calculated from the information found in your credit report. See the positive and negative factors that impact your FICO® Score.",
	},
	{
		name: "Raise your credit scores instantly",
		description:
			"Get credit for your phone and utility bills by adding positive payments to your Experian credit file.",
	},
];

const features_two = [
	{
		name: "Push to deploy",
		description: "No Credit Card Required",
		href: "#",
		icon: CloudArrowUpIcon,
	},
	{
		name: "SSL certificates",
		description: "Free Experian Credit Report and FICO® Score",
		href: "#",
		icon: LockClosedIcon,
	},
	{
		name: "Simple queues",
		description: "Updates Every 30 Days on Sign In",
		href: "#",
		icon: ArrowPathIcon,
	},
	{
		name: "Simple queues",
		description: "Dispute online for free",
		href: "#",
		icon: ArrowPathIcon,
	},
];

function Features() {
	return (
		<div className="bg-white py-10">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl lg:mx-0">
					<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						Why get your Free Credit Banc Report?
					</h2>
				</div>
				<dl className="mx-auto mt-6 text-base lg:mx-0 lg:max-w-none flex flex-row flex-wrap">
					{features.map((feature) => (
						<div key={feature.name} className="flex flex-col w-full px-3 py-3">
							<dt className="font-semibold text-gray-900">{feature.name}</dt>
							<dd className="mt-1 text-gray-600">{feature.description}</dd>
						</div>
					))}
				</dl>
			</div>
		</div>
	);
}

const faqs = [
	{
		question: "Will checking my credit hurt my scores?",
		answer: "Not at all. In fact, you should regularly check your credit reports from TransUnion, Equifax and Experian to be sure there are no score-lowering errors or possible fraud. We make it easy to see monthly updates to your credit scores and review your reports from all three credit bureaus.",
	},
	{
		question: "Why do I need all three scores, when other companies only offer one or two?",
		answer: "Lenders don’t all use the same credit bureau to check your credit – and your credit scores may not all be the same. We provide your scores from TransUnion, Equifax and Experian so you know where you stand no matter which bureau lenders use!",
	},
	{
		question: "What if I see an error or fraud on my credit report?",
		answer: "File a dispute! Errors or fraud can lower your credit scores and cost you money. Our Dispute Center provides a step-by-step guide to help you navigate the process of filing a dispute with all three credit bureaus.",
	},
	{
		question: "How does credit monitoring work?",
		answer: "We monitor your credit report daily, and notify you with a credit alert when a change or suspicious activity is detected that could pose a threat to your credit scores or be a red flag for possible identity theft.",
	},
];

function FAQ() {
	return (
		<div className="bg-white my-20">
			<div className="mx-auto max-w-7xl px-6 lg:px-8 ">
				<div className="mx-auto w-full divide-y divide-gray-900/10">
					<h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900 text-center">
						Frequently asked questions
					</h2>
					<dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
						{faqs.map((faq) => (
							<Disclosure as="div" key={faq.question} className="pt-6">
								{({ open }) => (
									<>
										<dt>
											<Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
												<span className="text-base font-semibold leading-7">
													{faq.question}
												</span>
												<span className="ml-6 flex h-7 items-center">
													{open ? (
														<MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
													) : (
														<PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
													)}
												</span>
											</Disclosure.Button>
										</dt>
										<Disclosure.Panel as="dd" className="mt-2 pr-12">
											<p className="text-base leading-7 text-gray-600">{faq.answer}</p>
										</Disclosure.Panel>
									</>
								)}
							</Disclosure>
						))}
					</dl>
				</div>
			</div>
		</div>
	);
}

function BoxyFeatureSection() {
	return (
		<div className="bg-white my-20">
			<div className="overflow-hidden">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
						<div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
							<div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-0">
								<div className="relative">
									<img
										src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
										alt=""
										className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
									/>
									<div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
								</div>
							</div>
							<div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-16">
								<div className="relative">
									<img
										src="https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
										alt=""
										className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
									/>
									<div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
								</div>
								<div className="relative">
									<img
										src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=396&h=528&q=80"
										alt=""
										className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
									/>
									<div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
								</div>
							</div>
							<div className="w-44 flex-none space-y-8 pt-32 sm:pt-32">
								<div className="relative">
									<img
										src="https://images.unsplash.com/photo-1670272504528-790c24957dda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=left&w=400&h=528&q=80"
										alt=""
										className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
									/>
									<div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
								</div>
								<div className="relative">
									<img
										src="https://images.unsplash.com/photo-1670272505284-8faba1c31f7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
										alt=""
										className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
									/>
									<div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
								</div>
							</div>
						</div>

						<div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
							<Features />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function DiagonalFeatureSection() {
	return (
		<div className="bg-white">
			<div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-14">
				<div
					className="absolute inset-y-0 left-1/2 -z-10 -mr-96 w-[200%] origin-top-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96"
					aria-hidden="true"
				/>
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="w-full lg:mx-0 lg:max-w-none flex flex-row">
						<div className="flex flex-col w-1/3">
							<img
								src="https://images.unsplash.com/photo-1567532900872-f4e906cbf06a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80"
								alt=""
								className="mt-10 aspect-[6/5] w-full max-w-lg rounded-2xl object-cover "
							/>
						</div>
						<div className="flex flex-col px-10 w-2/3">
							<h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
								Quick and Easy Sign Up
							</h1>
							<h4 className="max-w-2xl text-2xl tracking-tight text-gray-900 lg:col-span-2 xl:col-auto my-4">
								No credit card needed, just sign up to get instant online access to your free Experian
								credit report and FICO® Score.
							</h4>
							<div className="w-full my-4">
								<div className="flex flex-row justify-between w-full">
									{features_two.map((feature) => (
										<div key={feature.name} className="flex flex-col mx-4">
											<div className="flex flex-col items-center gap-x-3 text-base font-semibold leading-7 text-white">
												<feature.icon
													className="h-8 w-8 flex-none text-gray-400"
													aria-hidden="true"
												/>
											</div>
											<div className="mt-4 flex flex-col items-center text-base leading-7 text-gray-600 text-center">
												<p className="flex-auto">{feature.description}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
			</div>
		</div>
	);
}

export default function LandingPage() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<div className="bg-white">
			<header className="absolute inset-x-0 top-0 z-50">
				<nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
					<div className="flex lg:flex-1">
						<a href="#" className="-m-1.5 p-1.5">
							<span className="sr-only">Credit Banc</span>
							<img className="h-5 w-auto" src={cb_logo_3} alt="" />
						</a>
					</div>
					<div className="flex lg:hidden">
						<button
							type="button"
							className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
							onClick={() => setMobileMenuOpen(true)}
						>
							<span className="sr-only">Open main menu</span>
							<Bars3Icon className="h-6 w-6" aria-hidden="true" />
						</button>
					</div>
					<div className="hidden lg:flex lg:gap-x-12">
						{navigation.map((item) => (
							<a
								key={item.name}
								href={item.href}
								className="text-sm font-semibold leading-6 text-gray-900"
							>
								{item.name}
							</a>
						))}
					</div>
					<div className="hidden lg:flex lg:flex-1 lg:justify-end">
						<Link to={"/signin"} className="text-sm font-semibold leading-6 text-gray-900">
							Sign In <span aria-hidden="true">&rarr;</span>
						</Link>
					</div>
				</nav>
				<Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
					<div className="fixed inset-0 z-50" />
					<Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
						<div className="flex items-center justify-between">
							<a href="#" className="visible sm:invisible -m-1.5 p-1.5">
								<span className="sr-only">Your Company</span>
								<img className="h-8 w-auto" src={cb_logo_3} alt="" />
							</a>
							<button
								type="button"
								className="-m-2.5 rounded-md p-2.5 text-gray-700 items-end"
								onClick={() => setMobileMenuOpen(false)}
							>
								<span className="sr-only">Close menu</span>
								<XMarkIcon className="h-6 w-6" aria-hidden="true" />
							</button>
						</div>
						<div className="mt-6 flow-root">
							<div className="-my-6 divide-y divide-gray-500/10">
								<div className="space-y-2 py-6">
									{navigation.map((item) => (
										<a
											key={item.name}
											href={item.href}
											className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
										>
											{item.name}
										</a>
									))}
								</div>
								<div className="py-6">
									<Link
										to="/signin"
										className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
									>
										Sign In
									</Link>
								</div>
							</div>
						</div>
					</Dialog.Panel>
				</Dialog>
			</header>

			<main className="isolate">
				<div className="relative pt-24">
					<div className="flex flex-col w-full items-center -mt-[50px] mb-[50px]">
						<div className="flex flex-col w-[300px] h-[200px]">
							<Single />
						</div>
					</div>
					<div className="mx-auto max-w-7xl px-6 lg:px-8 py-5">
						<div className="mx-auto max-w-5xl text-center ">
							<div className="font-bold text-[#55CF9E] text-6xl mb-3 -mt-3 w-[80%] mx-auto">
								<img src={cb_logo_3} className="mb-0" />
							</div>
						</div>
					</div>
					<div className="flex flex-col items-center my-10">
						<div className="flex flex-row max-w-7xl w-full">
							<div className="flex flex-col w-3/5 space-y-10">
								<div className="text-5xl text-gray-700 font-semibold">
									Your Experian Credit Report and FICO® Score* are completely free.
								</div>

								<div className="text-2xl text-gray-700">
									No credit card required. Your free report and score are updated every 30 days on
									sign in.
								</div>

								<div className="cta_lp1_top bg-[#55CF9E] px-5 py-5 flex flex-col items-center rounded-lg cursor-pointer">
									<div className="text-white text-2xl">
										Get your Free Credit Report and FICO score
									</div>
								</div>

								<div>
									*Credit score calculated based on FICO® Score 8 model. Your lender or insurer may
									use a different FICO® Score than FICO® Score 8, or another type of credit score
									altogether.
								</div>
							</div>
							<div className="flex flex-col w-2/5">
								<div className="relative h-[610px] ml-[30%]">
									<img
										className="z-10 absolute top-[80px] left-[35px]"
										alt=""
										src="https://assets.experiancs.com/fcr/images/graphic-phone-fcr-summary.png"
									/>
									<img
										className="absolute top-0 left-0"
										src="https://assets.experiancs.com/fcr/images/com-phone.png?hs=48a6600747394091f28b3e74af0d3f1c"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div>
					<BoxyFeatureSection />
				</div>

				<div className="border-t ">
					<DiagonalFeatureSection />
				</div>

				<div>
					<FAQ />
				</div>

				<div>
					<FooterTwo />
				</div>
			</main>
		</div>
	);
}
