import { useState } from "react";
import { Link } from "@remix-run/react";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import CreditScoreDoughnut from "~/components/CreditScoreDoughnut";
import { redirect } from "@remix-run/node";
const shield_advisory_logo = "/images/logos/shield_advisory_group_logo.png";
const liquid_lunch_logo = "/images/logos/liquid_lunch_logo.jpg";
const the_weekly_logo = "/images/logos/the_weekly_logo.png";
const cb_logo_3 = "/images/logos/cb_logo_3.png";
import { Plans } from "~/components/IndexPricingPlans";
import { plans } from "~/data/index_plans";

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
						<a
							key={item.name}
							href={item.href}
							className="text-gray-400 hover:text-gray-500"
						>
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

const logo_cloud = [
	{
		name: "Shield Advisory Group",
		description:
			"Always informative. Always entertaining. Join The Weekly mailing list and stay up to date on all things small-biz, finance, tech, and more. (This goes underneath The Weekly)",
		imageSrc: shield_advisory_logo,
		href: "https://www.shieldadvisorygroup.com/",
	},
	{
		name: "Liquid Lunch",
		description:
			"Empowering small business owners with the tools, resources, and solutions they need to grow and scale. (This goes underneath Shield Advisory Group)",
		imageSrc: liquid_lunch_logo,
		href: "https://www.theliquidlunchproject.com/",
	},
	{
		name: "The Weekly",
		description:
			"A masterclass in entrepreneurship for those who want to get shit done. Subscribe to The Liquid Lunch Project Podcast for your number one resource on building and funding successful businesses for today’s economy. (This goes underneath the Liquid Lunch)",
		imageSrc: the_weekly_logo,
		href: "https://theweeklyfromshieldadvisory.substack.com/",
	},
];

function LogoCloud() {
	return (
		<div className="bg-white">
			<div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
				<div className="flex flex-col sm:flex-row justify-center">
					{logo_cloud.map((incentive) => (
						<div key={incentive.name} className="mx-2 w-1/3">
							<div className="flex flex-col w-[200px] h-[200px] justify-center items-center m-auto">
								<a href={incentive.href} target="_blank">
									<img
										src={incentive.imageSrc}
										alt=""
										className="w-fit h-auto"
									/>
								</a>
							</div>
							<a href={incentive.href} target="_blank">
								<h3 className="text-sm font-medium text-gray-900">
									{incentive.name}
								</h3>
							</a>
							<p className="mt-2 text-sm text-gray-500">
								{incentive.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

const bureau_logos = [
	"https://www.fico.com/sites/default/files/fico-logo-blue-large.png",
	"https://vantagescore.com/wp-content/uploads/2022/03/vantagescore-logo.svg",
	"https://www.dnb.com/content/dam/english/image-library/dnb-mod/logo-dnb.svg",
	"https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Experian_logo.svg/1280px-Experian_logo.svg.png",
	"https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/TransUnion_logo.svg/2560px-TransUnion_logo.svg.png",
	"https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Equifax_Logo.svg/2560px-Equifax_Logo.svg.png",
];

function PoweredBy() {
	return (
		<div className="bg-white pt-14">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
					Powered By
				</h2>
				<div className="mx-auto mt-10 w-full flex flex-col items-center justify-between space-y-10 md:flex-row flex-wrap">
					{bureau_logos.map((logo_src, idx) => (
						<img
							key={idx}
							className="col-span-2 max-h-12 w-4/6 md:w-1/2 lg:w-1/3 object-contain lg:col-span-1"
							src={logo_src}
							width={158}
							height={48}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

const Single = () => {
	return (
		<div className="flex flex-col items-center overflow-hidden">
			<CreditScoreDoughnut
				bureau={"Equifax"}
				scoreClassNames="text-6xl"
				bureauTitleClassNames="text-1xl"
				score={750}
				customChartStyles={{ width: 300, height: 280 }}
			>
				<div className="mt-[170px] font-bold text-5xl">780</div>
			</CreditScoreDoughnut>
		</div>
	);
};

export const loader = async ({ request }) => {
	let entity_id = await get_session_entity_id(request);
	if (entity_id) return redirect("/home");
	return null;
};

export default function LandingPage() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<div className="bg-white">
			<header className="absolute inset-x-0 top-0 z-50">
				<nav
					className="flex items-center justify-between p-6 lg:px-8"
					aria-label="Global"
				>
					<div className="flex lg:flex-1">
						<Link href="/" className="-m-1.5 p-1.5">
							<span className="sr-only">Credit Banc</span>
							<img
								className="h-5 w-auto"
								src={cb_logo_3}
								alt=""
							/>
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
						<Link
							to={"/signin"}
							className="text-sm font-semibold leading-6 text-gray-900"
						>
							Sign In <span aria-hidden="true">&rarr;</span>
						</Link>
					</div>
				</nav>
				<Dialog
					as="div"
					className="lg:hidden"
					open={mobileMenuOpen}
					onClose={setMobileMenuOpen}
				>
					<div className="fixed inset-0 z-50" />
					<Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
						<div className="flex items-center justify-between">
							<a
								href="#"
								className="visible sm:invisible -m-1.5 p-1.5"
							>
								<span className="sr-only">Your Company</span>
								<img
									className="h-8 w-auto"
									src={cb_logo_3}
									alt=""
								/>
							</a>
							<button
								type="button"
								className="-m-2.5 rounded-md p-2.5 text-gray-700 items-end"
								onClick={() => setMobileMenuOpen(false)}
							>
								<span className="sr-only">Close menu</span>
								<XMarkIcon
									className="h-6 w-6"
									aria-hidden="true"
								/>
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
					<div className="flex flex-col w-full items-center -mt-[50px] mb-[10px]">
						<div className="flex flex-col w-[300px] h-[200px]">
							<Single />
						</div>
					</div>
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="font-bold text-[#55CF9E] text-6xl mb-3 -mt-3 w-[80%] mx-auto">
							<img src={cb_logo_3} className="my-10 mt-20 mb-0" />
						</div>
						<div className="text-base md:text-xl flex flex-row space-x-1 w-full items-center justify-center text-[#202536] pt-3 font-semibold">
							Fueling Growth &#8226; Helping Small Businesses
						</div>
						<div className="mx-auto max-w-3xl text-center pt-5 ">
							<p className="sm:text-lg text-[#202536] m-auto leading-6 sm:leading-8">
								Credit Banc (pronounced like Bank, just spelled
								fancy) is the simple, one-stop-shop where you
								can access, monitor, and share real-time data
								from your personal and business credit reports
								with, well…anyone you want to! (Think loan
								officers, accountants, etc.) It’s so genius
								we’re kind of surprised nobody thought of it
								sooner.
							</p>
						</div>
						<div className="flex flex-col w-full items-center py-3 sm:py-5 text-center text-4xl sm:text-5xl text-[#202536] font-bold">
							<p className="py-2">Pick Your Plan</p>
							<p>And We’ll Do The Rest.</p>
						</div>
					</div>
				</div>

				<Plans plans={plans} />

				<div className="pb-14">
					<PoweredBy />
				</div>
				<div>
					<FooterTwo />
				</div>
			</main>
		</div>
	);
}
