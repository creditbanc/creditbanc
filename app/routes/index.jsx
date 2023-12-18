import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Disclosure } from "@headlessui/react";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "@remix-run/react";
const pc_bg = "/images/pc_bg.png";
const cashflow_bg = "/images/cashflow.png";
const university_bg = "/images/university_bg.png";
const permissions_bg = "/images/permissions.png";
const vault_bg = "/images/vault_bg.png";
const cb_logo_3 = "/images/logos/cb_logo_3.png";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from "@heroicons/react/20/solid";

const HeaderLogos = () => {
	return (
		<div className="py-4">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl lg:max-w-none">
					<h2 className="text-lg font-semibold leading-8 text-white">
						Trusted by the world’s most innovative teams
					</h2>
					<div className="mx-auto mt-10 grid grid-cols-4 items-start gap-x-8 gap-y-10 sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:grid-cols-5">
						<img
							className="col-span-2 max-h-12 w-full object-contain object-left lg:col-span-1"
							src="https://tailwindui.com/img/logos/transistor-logo-gray-900.svg"
							alt="Transistor"
							width={158}
							height={48}
						/>
						<img
							className="col-span-2 max-h-12 w-full object-contain object-left lg:col-span-1"
							src="https://tailwindui.com/img/logos/reform-logo-gray-900.svg"
							alt="Reform"
							width={158}
							height={48}
						/>
						<img
							className="col-span-2 max-h-12 w-full object-contain object-left lg:col-span-1"
							src="https://tailwindui.com/img/logos/tuple-logo-gray-900.svg"
							alt="Tuple"
							width={158}
							height={48}
						/>
						<img
							className="col-span-2 max-h-12 w-full object-contain object-left lg:col-span-1"
							src="https://tailwindui.com/img/logos/savvycal-logo-gray-900.svg"
							alt="SavvyCal"
							width={158}
							height={48}
						/>
						<img
							className="col-span-2 max-h-12 w-full object-contain object-left lg:col-span-1"
							src="https://tailwindui.com/img/logos/statamic-logo-gray-900.svg"
							alt="Statamic"
							width={158}
							height={48}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

const LogosBanner = () => {
	return (
		<div className="mx-auto max-w-7xl px-6 lg:px-8">
			<h2 className="text-center text-lg font-semibold leading-8 text-white">
				Trusted by the world’s most innovative teams
			</h2>
			<div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
				<img
					className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
					src="https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg"
					alt="Transistor"
					width={158}
					height={48}
				/>
				<img
					className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
					src="https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg"
					alt="Reform"
					width={158}
					height={48}
				/>
				<img
					className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
					src="https://tailwindui.com/img/logos/158x48/tuple-logo-gray-900.svg"
					alt="Tuple"
					width={158}
					height={48}
				/>
				<img
					className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
					src="https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-900.svg"
					alt="SavvyCal"
					width={158}
					height={48}
				/>
				<img
					className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
					src="https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg"
					alt="Statamic"
					width={158}
					height={48}
				/>
			</div>
		</div>
	);
};

const people = [
	{
		name: "Lindsay Walton",
		role: "Front-end Developer",
		imageUrl:
			"https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
		twitterUrl: "#",
		linkedinUrl: "#",
	},
	{
		name: "Lindsay Walton",
		role: "Front-end Developer",
		imageUrl:
			"https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
		twitterUrl: "#",
		linkedinUrl: "#",
	},
	{
		name: "Lindsay Walton",
		role: "Front-end Developer",
		imageUrl:
			"https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
		twitterUrl: "#",
		linkedinUrl: "#",
	},
];

const MainFeatures = () => {
	return (
		<div className="mx-auto max-w-7xl px-6 lg:px-8">
			<div className="mx-auto max-w-2xl lg:mx-0">
				<h2 className="text-3xl font-bold tracking-tight text-[#1a3380]">Our Team</h2>
				<p className="mt-6 text-lg leading-8 text-gray-600">
					We’re a dynamic group of individuals who are passionate about what we do and dedicated to delivering
					the best results for our clients.
				</p>
			</div>
			<ul
				role="list"
				className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
			>
				{people.map((person) => (
					<li key={person.name}>
						<img className="aspect-[3/2] w-full rounded-2xl object-cover" src={person.imageUrl} alt="" />
						<h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">
							{person.name}
						</h3>
						<p className="text-base leading-7 text-gray-600">{person.role}</p>
					</li>
				))}
			</ul>
		</div>
	);
};

const Accordion = ({ header, body, open = true }) => {
	return (
		<div className="flex flex-col items-start w-full text-sm">
			<Disclosure defaultOpen={open}>
				<Disclosure.Button className="flex flex-row w-full h-[80px] bg-white border rounded">
					<div className="flex flex-col w-[5px] bg-green-500 h-full rounded-l"></div>
					<div className="flex flex-row w-full h-full pr-2 lg:pr-2 justify-between items-center">
						<div className="flex flex-col gap-y-1 flex-1 items-start">{header}</div>

						<div className="hidden lg:flex flex-col w-[20px] items-center">
							<MinusCircleIcon className="w-4 h-4 stroke-slate-400" />
						</div>
					</div>
				</Disclosure.Button>
				<Disclosure.Panel className="flex flex-col w-full text-gray-500">
					<div className="flex flex-col lg:flex-row w-full gap-x-5 bg-white border -mt-2 rounded-b">
						{body}
					</div>
				</Disclosure.Panel>
			</Disclosure>
		</div>
	);
};

const ListHeader = () => {
	return (
		<div className="mx-auto max-w-2xl text-center my-8 text-[#1a3380]">
			<h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">Support Center</h2>
			<p className="mt-6 text-lg leading-8 ">
				Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
				fugiat veniam occaecat fugiat aliqua.
			</p>
		</div>
	);
};

const incentives = [
	{
		name: "Free shipping",
		imageSrc: "https://tailwindui.com/img/ecommerce/icons/icon-shipping-simple.svg",
		description:
			"It's not actually free we just price it into the products. Someone's paying for it, and it's not us.",
	},
	{
		name: "10-year warranty",
		imageSrc: "https://tailwindui.com/img/ecommerce/icons/icon-warranty-simple.svg",
		description: "If it breaks in the first 10 years we'll replace it. After that you're on your own though.",
	},
	{
		name: "Exchanges",
		imageSrc: "https://tailwindui.com/img/ecommerce/icons/icon-exchange-simple.svg",
		description:
			"If you don't like it, trade it to one of your friends for something of theirs. Don't send it here though.",
	},
];

const Incentives = () => {
	return (
		<div className="mx-auto w-[1200px] py-10">
			<div className="mx-auto max-w-2xl px-4 lg:max-w-none">
				<div className="grid grid-cols-1 items-center gap-x-16 gap-y-10 lg:grid-cols-2 text-[#1a3380]">
					<div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg bg-gray-100">
						<img
							src="https://tailwindui.com/img/ecommerce-images/incentives-07-hero.jpg"
							alt=""
							className="object-cover object-center"
						/>
					</div>
					<div>
						<h2 className="text-4xl font-bold tracking-tight">
							We built our business on great customer service
						</h2>
						<p className="mt-4 text-gray-500">
							At the beginning at least, but then we realized we could make a lot more money if we kinda
							stopped caring about that. Our new strategy is to write a bunch of things that look really
							good in the headlines, then clarify in the small print but hope people don't actually read
							it.
						</p>
					</div>
				</div>
				<div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
					{incentives.map((incentive) => (
						<div key={incentive.name} className="sm:flex lg:block">
							<div className="sm:flex-shrink-0">
								<img className="h-16 w-16" src={incentive.imageSrc} alt="" />
							</div>
							<div className="mt-4 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6">
								<h3 className="text-sm font-medium ">{incentive.name}</h3>
								<p className="mt-2 text-sm text-gray-500">{incentive.description}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

const Stats = () => {
	return (
		<div className="mx-auto w-[1200px]">
			<div className="mx-auto lg:mx-0 text-[#1a3380]">
				<h2 className="text-3xl font-bold tracking-tight  sm:text-4xl">
					We approach the workplace as something that adds to our lives and adds value to world.
				</h2>
			</div>
			<div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
				<div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-50 p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
					<p className="flex-none text-3xl font-bold tracking-tight">250k</p>
					<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
						<p className="text-lg font-semibold tracking-tight ">Users on the platform</p>
						<p className="mt-2 text-base leading-7 text-gray-600">
							Vel labore deleniti veniam consequuntur sunt nobis.
						</p>
					</div>
				</div>
				<div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-900 p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44">
					<p className="flex-none text-3xl font-bold tracking-tight text-white">$8.9 billion</p>
					<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
						<p className="text-lg font-semibold tracking-tight text-white">
							We’re proud that our customers have made over $8 billion in total revenue.
						</p>
						<p className="mt-2 text-base leading-7 text-gray-400">
							Eu duis porta aliquam ornare. Elementum eget magna egestas.
						</p>
					</div>
				</div>
				<div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-indigo-600 p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
					<p className="flex-none text-3xl font-bold tracking-tight text-white">401,093</p>
					<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
						<p className="text-lg font-semibold tracking-tight text-white">Transactions this year</p>
						<p className="mt-2 text-base leading-7 text-indigo-200">
							Eu duis porta aliquam ornare. Elementum eget magna egestas. Eu duis porta aliquam ornare.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const Header = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	return (
		<header className="absolute inset-x-0 top-0 z-50 bg-white border-b">
			<nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
				<div className="flex lg:flex-1">
					<Link href="/" className="-m-1.5 p-1.5">
						<span className="sr-only">Credit Banc</span>
						<img className="h-5 w-auto" src={cb_logo_3} alt="" />
					</Link>
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
						<a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
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
	);
};

const navigation = [
	{ name: "Pro", href: "/comingsoon" },
	{ name: "Small Business Lending", href: "/comingsoon" },
	{ name: "Tax Credits", href: "/comingsoon" },
	{ name: "Business Valuations", href: "/comingsoon" },
	{ name: "CB University", href: "/university/courses" },
];

const Collage = () => {
	return (
		<div className="mx-auto max-[1200px] px-6 text-[#1a3380]">
			<div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
				<div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl text-[#1a3380]">
					<h1 className="text-4xl font-bold tracking-tight  sm:text-6xl">
						We’re changing the way people connect.
					</h1>
					<p className="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
						Cupidatat minim id magna ipsum sint dolor qui. Sunt sit in quis cupidatat mollit aute velit. Et
						labore commodo nulla aliqua proident mollit ullamco exercitation tempor. Sint aliqua anim nulla
						sunt mollit id pariatur in voluptate cillum. Eu voluptate tempor esse minim amet fugiat veniam
						occaecat aliqua.
					</p>
				</div>
				<div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
					<div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
						<div className="relative">
							<img
								src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80"
								alt=""
								className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
							/>
							<div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
						</div>
					</div>
					<div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
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
					<div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
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
			</div>
		</div>
	);
};

const CashFlow = () => {
	return (
		<div className="flex flex-row w-[1200px] my-[50px] gap-x-6 justify-between text-[#1a3380]">
			<div className="flex flex-col w-[500px]">
				<div className="lg:max-w-lg">
					<p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Cash Flow</p>
					<p className="mt-6 text-lg leading-8 text-gray-600">
						We've got you covered! Credit Banc can help you build and monitor your personal and business
						credit...and get you the cash you need when you need it - all without leaving our website. We’re
						all about working smarter, not harder.
					</p>
				</div>
			</div>
			<div className="flex flex-col w-[600px]">
				<img src={cashflow_bg} alt="Product screenshot" className="max-w-none rounded-xl " width={600} />
			</div>
		</div>
	);
};

const TaxCredits = () => {
	return (
		<div className="flex flex-row w-[1200px] my-[50px] gap-x-6 justify-between text-[#1a3380]">
			<div className="flex flex-col w-[600px]">
				<img
					src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
					alt="Product screenshot"
					className="max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10"
					width={600}
				/>
			</div>
			<div className="flex flex-col w-[500px]">
				<div className="lg:max-w-lg">
					<p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
						Maximize Your Eligible Tax Credits with Credit Banc
					</p>
					<p className="mt-6 text-lg leading-8 text-gray-600">
						Let's put more money back in your pocket, ok? Our tax experts will work with you to ensure you
						get every dollar and cent you rightfully deserve. Because when your business thrives, so does
						your bottom line. (And who doesn’t love a good bottom line?)
					</p>
				</div>
			</div>
		</div>
	);
};

const University = () => {
	return (
		<div className="flex flex-row w-[1200px] my-[50px] gap-x-6 justify-between text-[#1a3380]">
			<div className="flex flex-col w-[500px]">
				<div className="lg:max-w-lg">
					<p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Knowledge Is Power.</p>
					<p className="mt-6 text-lg leading-8 text-gray-600">
						Listen, we know that financial literacy can feel like wading through alphabet soup, and we're
						here to change that. Access our growing library of training videos on everything from credit
						building to R&D tax credits to understanding balance sheets. No complicated jargon. No boring
						PowerPoint. Just financial education without the fuss.
					</p>
				</div>
			</div>
			<div className="flex flex-col w-[600px]">
				<img src={university_bg} alt="Product screenshot" className="max-w-none rounded-xl " width={600} />
			</div>
		</div>
	);
};

const Vault = () => {
	return (
		<div className="flex flex-row w-[1200px] my-[50px] gap-x-6 justify-between text-[#1a3380]">
			<div className="flex flex-col w-[600px]">
				<img src={vault_bg} alt="Product screenshot" className="max-w-none rounded-xl" width={600} />
			</div>
			<div className="flex flex-col w-[500px]">
				<div className="lg:max-w-lg">
					<p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
						Where Security and Convenience Go Hand-in-Hand
					</p>
					<p className="mt-6 text-lg leading-8 text-gray-600">
						Credit Banc members have 24/7 access to The Vault, a virtual fortress for safeguarding all
						things personal and financial. Ditch the fax machine or email to send and receive sensitive
						documents; you can securely share the contents of your Vault with anyone who needs real-time
						access.
					</p>
				</div>
			</div>
		</div>
	);
};

const testimonials = [
	{
		body: "Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.",
		author: {
			name: "Leslie Alexander",
			handle: "lesliealexander",
			imageUrl:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
	},
	{
		body: "Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.",
		author: {
			name: "Leslie Alexander",
			handle: "lesliealexander",
			imageUrl:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
	},
	{
		body: "Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.",
		author: {
			name: "Leslie Alexander",
			handle: "lesliealexander",
			imageUrl:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
	},
	{
		body: "Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.",
		author: {
			name: "Leslie Alexander",
			handle: "lesliealexander",
			imageUrl:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
	},
	{
		body: "Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.",
		author: {
			name: "Leslie Alexander",
			handle: "lesliealexander",
			imageUrl:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
	},
	{
		body: "Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.",
		author: {
			name: "Leslie Alexander",
			handle: "lesliealexander",
			imageUrl:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
	},
];

const Testimonials = () => {
	return (
		<div className="mx-auto max-w-7xl px-6 lg:px-8">
			<div className="mx-auto max-w-xl text-center">
				<h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">Testimonials</h2>
				<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
					We have worked with thousands of amazing people
				</p>
			</div>
			<div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
				<div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
					{testimonials.map((testimonial) => (
						<div key={testimonial.author.handle} className="pt-8 sm:inline-block sm:w-full sm:px-4">
							<figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6">
								<blockquote className="text-gray-900">
									<p>{`“${testimonial.body}”`}</p>
								</blockquote>
								<figcaption className="mt-6 flex items-center gap-x-4">
									<img
										className="h-10 w-10 rounded-full bg-gray-50"
										src={testimonial.author.imageUrl}
										alt=""
									/>
									<div>
										<div className="font-semibold text-gray-900">{testimonial.author.name}</div>
										<div className="text-gray-600">{`@${testimonial.author.handle}`}</div>
									</div>
								</figcaption>
							</figure>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	return (
		<div className="flex flex-col w-full h-full bg-[#F5F7FF] items-center overflow-y-scroll relative py-20 poppins s">
			<Header />

			<div className="flex flex-row w-[1200px] gap-x-4 my-8 h-[350px]">
				<div className="flex flex-row flex-1 h-[100%] items-start">
					<div>
						<div className="flex flex-col py-3 gap-y-2 text-5xl text-[#1a3380]">
							<div>Credit Banc</div>
							<div className="font-bold text-lg">(pronounced like bank, just spelled fancy)</div>
						</div>
						<div className="flex flex-col gap-y-3">
							<div>
								Credit Banc is a one-stop shop for everything needed to fuel small business growth.
							</div>
							<div>
								We're not your average number crunchers - and this isn't your average
								((app/website/platform)). We know running a small biz is hard as hell, so we're doing
								our part to make it a bit easier for you, one click at a time.
							</div>
							<div className="flex flex-col px-4 py-3 bg-blue-500 text-white rounded-lg items-center cursor-pointer my-6">
								Sign Up Now
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-row w-[600px] h-[100%]">
					<img src={pc_bg} />
				</div>
			</div>
			<div className="mt-[30px] bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 w-full py-[60px]">
				<LogosBanner />
			</div>

			{/* <div className="flex flex-col relative w-[1200px] my-[30px] gap-x-4">
				<div>
					<ListHeader />
				</div>
				<div className="flex flex-row relative w-[1200px] my-[30px] gap-x-4 justify-center">
					<div className="flex flex-col w-[900px] gap-y-6">
						<Accordion
							open={false}
							header={
								<div className="px-4 text-[#1a3380] font-semibold text-xl">
									Swift DMARC Policy Enforcement
								</div>
							}
							body={
								<div className="px-4 py-4">
									EasyDMARC paves the way through the main milestones in your email authentication
									journey. Our robust platform consists of 20+ tools – all there to help you navigate
									the “jungle” during your DMARC journey (and get there alive!). Implement the
									necessary protocols without the need to become an expert.
								</div>
							}
						/>

						<Accordion
							open={false}
							header={
								<div className="px-4 text-[#1a3380] font-semibold text-xl">Permission Management</div>
							}
							body={
								<div className="px-4 py-4">
									Leverage our new approach to domain management with a streamlined product plan
									application, access control, and domain groups. Remove second-guessing about who can
									access what while managing multiple domains. Set up your Organization’s dashboard
									and add your teammates to relevant groups with the appropriate user access level.
								</div>
							}
						/>

						<Accordion
							open={false}
							header={<div className="px-4 text-[#1a3380] font-semibold text-xl">Smart Reporting</div>}
							body={
								<div className="px-4 py-4">
									Our AI-powered DMARC Reporting solution is designed to save you time and IT costs
									with a simple user interface, dedicated visibility, and out-of-the-box management
									workflows. You can even visualize your email sending traffic distribution by country
									in real time. We make DMARC report analysis easy, letting you take action on what’s
									most important.
								</div>
							}
						/>

						<Accordion
							open={false}
							header={<div className="px-4 text-[#1a3380] font-semibold text-xl">Smart Reporting</div>}
							body={
								<div className="px-4 py-4">
									Our AI-powered DMARC Reporting solution is designed to save you time and IT costs
									with a simple user interface, dedicated visibility, and out-of-the-box management
									workflows. You can even visualize your email sending traffic distribution by country
									in real time. We make DMARC report analysis easy, letting you take action on what’s
									most important.
								</div>
							}
						/>
					</div>
				</div>
			</div> */}

			<div className="my-[50px]">
				<Collage />
			</div>

			<div>
				<CashFlow />
			</div>
			<div>
				<TaxCredits />
			</div>
			<div>
				<University />
			</div>
			<div>
				<Vault />
			</div>
			<div>
				<Testimonials />
			</div>
		</div>
	);
}
