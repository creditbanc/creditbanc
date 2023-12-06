import { useState } from "react";
import { Link } from "@remix-run/react";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import CreditScoreDoughnut from "~/components/CreditScoreDoughnut";
import { redirect } from "@remix-run/node";
const shield_advisory_logo = "/images/logos/shield_advisory_group_logo.png";
const liquid_lunch_logo = "/images/logos/liquid_lunch_logo.jpg";
const the_weekly_logo = "/images/logos/the_weekly_logo.png";
const cb_logo_3 = "/images/logos/cb_logo_3.png";
const business_stock_one = "/images/businessstock/one.jpg";
const business_stock_two = "/images/businessstock/two.jpg";
const business_stock_three = "/images/businessstock/three.jpg";
const business_stock_four = "/images/businessstock/four.jpg";
const business_stock_five = "/images/businessstock/five.jpg";
import { Plans } from "~/components/IndexPricingPlans";
import { plans } from "~/data/index_plans";

const navigation = [
	{ name: "Pro", href: "/comingsoon" },
	{ name: "Small Business Lending", href: "/comingsoon" },
	{ name: "Tax Credits", href: "/comingsoon" },
	{ name: "Business Valuations", href: "/comingsoon" },
	{ name: "CB University", href: "/university/courses" },
];

const footerNavigation = [
	{
		name: "Facebook",
		href: "https://www.facebook.com/profile.php?id=61551908787032",
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
		href: "https://www.instagram.com/credit_banc",
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
		name: "LinkedIn",
		href: "https://www.linkedin.com/company/credit-banc/",
		icon: (props) => (
			<svg viewBox="0 0 24 24" {...props} fill="currentColor">
				<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
			</svg>
		),
	},
	// {
	// 	name: "GitHub",
	// 	href: "#",
	// 	icon: (props) => (
	// 		<svg fill="currentColor" viewBox="0 0 24 24" {...props}>
	// 			<path
	// 				fillRule="evenodd"
	// 				d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
	// 				clipRule="evenodd"
	// 			/>
	// 		</svg>
	// 	),
	// },
	// {
	// 	name: "YouTube",
	// 	href: "#",
	// 	icon: (props) => (
	// 		<svg fill="currentColor" viewBox="0 0 24 24" {...props}>
	// 			<path
	// 				fillRule="evenodd"
	// 				d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
	// 				clipRule="evenodd"
	// 			/>
	// 		</svg>
	// 	),
	// },
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
									<img src={incentive.imageSrc} alt="" className="w-fit h-auto" />
								</a>
							</div>
							<a href={incentive.href} target="_blank">
								<h3 className="text-sm font-medium text-gray-900">{incentive.name}</h3>
							</a>
							<p className="mt-2 text-sm text-gray-500">{incentive.description}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

const bureau_logos = [
	{ img: "https://www.fico.com/sites/default/files/fico-logo-blue-large.png", url: "https://www.fico.com/" },
	{
		img: "https://vantagescore.com/wp-content/uploads/2022/03/vantagescore-logo.svg",
		url: "https://www.vantagescore.com/",
	},
	{ img: "https://www.dnb.com/content/dam/english/image-library/dnb-mod/logo-dnb.svg", url: "https://www.dnb.com/" },
	{
		img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Experian_logo.svg/1280px-Experian_logo.svg.png",
		url: "https://www.experian.com/",
	},
	{
		img: "https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/TransUnion_logo.svg/2560px-TransUnion_logo.svg.png",
		url: "https://www.transunion.com/",
	},
	{
		img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Equifax_Logo.svg/2560px-Equifax_Logo.svg.png",
		url: "https://www.equifax.com/",
	},
];

function PoweredBy() {
	return (
		<div className="bg-white pt-14">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<h2 className="text-center text-lg font-semibold leading-8 text-gray-900">Powered By</h2>
				<div className="mx-auto mt-10 w-full flex flex-col items-center justify-between space-y-10 md:flex-row flex-wrap">
					{bureau_logos.map((logo, idx) => (
						<a
							key={idx}
							href={logo.url}
							className="flex flex-col col-span-2 max-h-12 w-4/6 md:w-1/2 lg:w-1/3 object-contain lg:col-span-1 items-center justify-center"
						>
							<img src={logo.img} height={48} className="flex flex-col h-[48px]" />
						</a>
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
				score={850}
				customChartStyles={{ width: 300, height: 280 }}
			>
				<div className="mt-[170px] font-bold text-5xl">850</div>
			</CreditScoreDoughnut>
		</div>
	);
};

export const loader = async ({ request }) => {
	let entity_id = await get_session_entity_id(request);
	if (entity_id) return redirect("/home");
	return null;
};

import { CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/20/solid";

const MainContent = () => {
	return (
		<div className="bg-white px-6 py-[50px]">
			<div className="mx-auto max-w-4xl text-base leading-7 text-gray-700">
				<p className="text-base font-semibold leading-7 text-[#56cf9e]">Introducing</p>
				<h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
					JavaScript for Beginners
				</h1>
				<p className="mt-6 text-xl leading-8">
					Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At arcu, sit dui mi, nibh dui,
					diam eget aliquam. Quisque id at vitae feugiat egestas ac. Diam nulla orci at in viverra scelerisque
					eget. Eleifend egestas fringilla sapien.
				</p>
				<div className="mt-10 max-w-2xl">
					<p>
						Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper
						sed amet vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus
						varius sit neque erat velit. Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus
						enim. Mattis mauris semper sed amet vitae sed turpis id.
					</p>
					<ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600">
						<li className="flex gap-x-3">
							<CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-[#56cf9e]" aria-hidden="true" />
							<span>
								<strong className="font-semibold text-gray-900">Data types.</strong> Lorem ipsum, dolor
								sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste
								dolor cupiditate blanditiis ratione.
							</span>
						</li>
						<li className="flex gap-x-3">
							<CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-[#56cf9e]" aria-hidden="true" />
							<span>
								<strong className="font-semibold text-gray-900">Loops.</strong> Anim aute id magna
								aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
							</span>
						</li>
						<li className="flex gap-x-3">
							<CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-[#56cf9e]" aria-hidden="true" />
							<span>
								<strong className="font-semibold text-gray-900">Events.</strong> Ac tincidunt sapien
								vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.
							</span>
						</li>
					</ul>
					<p className="mt-8">
						Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis odio id et. Id blandit molestie
						auctor fermentum dignissim. Lacus diam tincidunt ac cursus in vel. Mauris varius vulputate et
						ultrices hac adipiscing egestas. Iaculis convallis ac tempor et ut. Ac lorem vel integer orci.
					</p>
					<h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
						From beginner to expert in 3 hours
					</h2>
					<p className="mt-6">
						Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam consequat in. Convallis arcu ipsum
						urna nibh. Pharetra, euismod vitae interdum mauris enim, consequat vulputate nibh. Maecenas
						pellentesque id sed tellus mauris, ultrices mauris. Tincidunt enim cursus ridiculus mi.
						Pellentesque nam sed nullam sed diam turpis ipsum eu a sed convallis diam.
					</p>
					<figure className="mt-10 border-l border-[#56cf9e] pl-9">
						<blockquote className="font-semibold text-gray-900">
							<p>
								“Vel ultricies morbi odio facilisi ultrices accumsan donec lacus purus. Lectus nibh
								ullamcorper ac dictum justo in euismod. Risus aenean ut elit massa. In amet aliquet eget
								cras. Sem volutpat enim tristique.”
							</p>
						</blockquote>
						<figcaption className="mt-6 flex gap-x-4">
							<img
								className="h-6 w-6 flex-none rounded-full bg-gray-50"
								src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
								alt=""
							/>
							<div className="text-sm leading-6">
								<strong className="font-semibold text-gray-900">Maria Hill</strong> – Marketing Manager
							</div>
						</figcaption>
					</figure>
					<p className="mt-10">
						Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper
						sed amet vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus
						varius sit neque erat velit.
					</p>
				</div>
				<figure className="mt-16">
					<img
						className="aspect-video rounded-xl bg-gray-50 object-cover"
						src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&w=1310&h=873&q=80&facepad=3"
						alt=""
					/>
					<figcaption className="mt-4 flex gap-x-2 text-sm leading-6 text-gray-500">
						<InformationCircleIcon className="mt-0.5 h-5 w-5 flex-none text-gray-300" aria-hidden="true" />
						Faucibus commodo massa rhoncus, volutpat.
					</figcaption>
				</figure>
				<div className="mt-16 max-w-2xl">
					<h2 className="text-2xl font-bold tracking-tight text-gray-900">
						Everything you need to get up and running
					</h2>
					<p className="mt-6">
						Purus morbi dignissim senectus mattis adipiscing. Amet, massa quam varius orci dapibus volutpat
						cras. In amet eu ridiculus leo sodales cursus tristique. Tincidunt sed tempus ut viverra
						ridiculus non molestie. Gravida quis fringilla amet eget dui tempor dignissim. Facilisis auctor
						venenatis varius nunc, congue erat ac. Cras fermentum convallis quam.
					</p>
					<p className="mt-8">
						Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper
						sed amet vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus
						varius sit neque erat velit.
					</p>
				</div>
			</div>
		</div>
	);
};

import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from "@heroicons/react/20/solid";

const features = [
	{
		name: "Push to deploy.",
		description:
			"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
		icon: CloudArrowUpIcon,
	},
	{
		name: "SSL certificates.",
		description: "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
		icon: LockClosedIcon,
	},
	{
		name: "Database backups.",
		description: "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.",
		icon: ServerIcon,
	},
];

// const SmallBusinessLending = () => {
// 	return (
// 		<div className="overflow-hidden bg-white py-24 sm:py-32">
// 			<div className="mx-auto max-w-7xl px-6 lg:px-8">
// 				<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
// 					<div className="lg:ml-auto lg:pl-4 lg:pt-4">
// 						<div className="lg:max-w-lg">
// 							{/* <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2> */}
// 							<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
// 								Small Business Lending:
// 							</p>
// 							<p className="mt-6 text-lg leading-8 text-gray-600">
// 								Credit Banc is your business funding hub. Whether you're eyeing growth, need quick
// 								processing, or seeking expert advice, we're here to accelerate your success. You’re
// 								going to love the zero-cost, no-obligation access to multiple programs (offering up to
// 								$10 million) and competitive rates. Plus, we’ll match you with a personalized loan
// 								officer to guide you through our transparent, paperless application process. The future
// 								of funding is hassle-free! If only everything in life was this easy.
// 							</p>
// 						</div>
// 					</div>
// 					<div className="flex items-start justify-end lg:order-first">
// 						<img
// 							src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
// 							alt="Product screenshot"
// 							className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
// 							width={2432}
// 							height={1442}
// 						/>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

const featurestwo = [
	{
		name: "Push to deploy.",
		description:
			"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
		icon: CloudArrowUpIcon,
	},
	{
		name: "SSL certificates.",
		description: "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
		icon: LockClosedIcon,
	},
	{
		name: "Database backups.",
		description: "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.",
		icon: ServerIcon,
	},
];

const TheVault = () => {
	return (
		<div className="overflow-hidden bg-white py-24 sm:py-32">
			<div className="mx-auto max-w-7xl md:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
					<div className="px-6 md:px-0 lg:pr-4 lg:pt-4">
						<div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
							{/* <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2> */}
							<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
								A better workflow
							</p>
							<p className="mt-6 text-lg leading-8 text-gray-600">
								The Vault is exactly what it sounds like - a safe and secure place to store all your
								personal and financial docs and info electronically without fear of peeping Toms or
								Nigerian Princes getting a look at it. Anything kept inside The Vault can be shared with
								anyone- but only with your permission, and you can choose to assign “View Only” or
								“Edit” capabilities. We have a backend 2-factor authentication, and our enterprise
								servers are housed at data storage centers with multiple encryption safeguards. The only
								thing more difficult to break into is Area 51 or maybe a Nun’s chastity belt. It’s that
								off-limits.
							</p>
							<dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
								{features.map((feature) => (
									<div key={feature.name} className="relative pl-9">
										<dt className="inline font-semibold text-gray-900">
											<feature.icon
												className="absolute left-1 top-1 h-5 w-5 text-[#56cf9e]"
												aria-hidden="true"
											/>
											{feature.name}
										</dt>{" "}
										<dd className="inline">{feature.description}</dd>
									</div>
								))}
							</dl>
						</div>
					</div>
					<div className="sm:px-6 lg:px-0">
						<div className="relative isolate overflow-hidden bg-[#56cf9e] px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pl-16 sm:pr-0 sm:pt-16 lg:mx-0 lg:max-w-none">
							<div
								className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-30deg] bg-[#56cf9e] opacity-20 ring-1 ring-inset ring-white"
								aria-hidden="true"
							/>
							<div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
								<div className="w-screen overflow-hidden rounded-tl-xl bg-gray-900 ring-1 ring-white/10">
									<div className="flex bg-gray-800/40 ring-1 ring-white/5">
										<div className="-mb-px flex text-sm font-medium leading-6 text-gray-400">
											<div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
												NotificationSetting.jsx
											</div>
											<div className="border-r border-gray-600/10 px-4 py-2">App.jsx</div>
										</div>
									</div>
									<div className="px-6 pb-14 pt-6">{/* Your code example */}</div>
								</div>
							</div>
							<div
								className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 sm:rounded-3xl"
								aria-hidden="true"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const leftfeatures = [
	{
		name: "Push to deploy.",
		description:
			"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
		icon: CloudArrowUpIcon,
	},
	{
		name: "SSL certificates.",
		description: "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
		icon: LockClosedIcon,
	},
	{
		name: "Database backups.",
		description: "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.",
		icon: ServerIcon,
	},
];

const SmallBusinessLending = () => {
	return (
		<div className="flex flex-col w-full">
			<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
				<div className="lg:max-w-lg">
					{/* <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2> */}
					<p className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						Small Business Lending
					</p>
					<p className="mt-6 leading-8 text-gray-600">
						Credit Banc is your business funding hub. Whether you're eyeing growth, need quick processing,
						or seeking expert advice, we're here to accelerate your success. You’re going to love the
						zero-cost, no-obligation access to multiple programs (offering up to $10 million) and
						competitive rates. Plus, we’ll match you with a personalized loan officer to guide you through
						our transparent, paperless application process. The future of funding is hassle-free! If only
						everything in life was this easy.
					</p>
					{/* <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
							{leftfeatures.map((feature) => (
								<div key={feature.name} className="relative pl-9">
									<dt className="inline font-semibold text-gray-900">
										<feature.icon
											className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
											aria-hidden="true"
										/>
										{feature.name}
									</dt>{" "}
									<dd className="inline">{feature.description}</dd>
								</div>
							))}
						</dl> */}
				</div>

				<img src={business_stock_two} className="w-[100%] rounded-xl" />
			</div>
		</div>
	);
};

const TaxCredits = () => {
	return (
		<div className="flex flex-col w-full">
			<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
				<img src={business_stock_one} className="w-[100%] rounded-xl" />
				<div className="lg:max-w-lg">
					<p className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Tax Credits</p>
					<p className="mt-6 leading-8 text-gray-600">
						What can we say? We nerd out over numbers. Our seasoned team of financial wizards will help you
						turn complex tax codes into an arsenal of savings for your business. From unearthing Research
						and Development credits to optimizing Cost Segregation, Employee Retention, Work Opportunity,
						and Family First Credits (and beyond), we're your partners in navigating the intricate world of
						tax credits. At Credit Banc, we don't just crunch numbers; we strategize, innovate, and ensure
						every eligible credit is claimed, putting money back where it belongs – in your pocket.
					</p>
				</div>
			</div>
		</div>
	);
};

const rightfeatures = [
	{
		name: "Push to deploy.",
		description:
			"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
		icon: CloudArrowUpIcon,
	},
	{
		name: "SSL certificates.",
		description: "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
		icon: LockClosedIcon,
	},
	{
		name: "Database backups.",
		description: "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.",
		icon: ServerIcon,
	},
];

const RightFeatureOne = () => {
	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-row w-full gap-x-[50px]">
				<div className="flex">
					<img
						src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
						alt="Product screenshot"
						className="h-[350px] rounded-xl"
					/>
				</div>
				<div className="flex flex-col flex-1">
					<h2 className="text-base font-semibold leading-7 text-[#56cf9e]">Deploy faster</h2>
					<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						A better workflow
					</p>
					<p className="mt-6 text-lg leading-8 text-gray-600">
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit
						eaque, iste dolor cupiditate blanditiis ratione.
					</p>
					<dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
						{rightfeatures.map((feature) => (
							<div key={feature.name} className="relative pl-9">
								<dt className="inline font-semibold text-gray-900">
									<feature.icon
										className="absolute left-1 top-1 h-5 w-5 text-[#56cf9e]"
										aria-hidden="true"
									/>
									{feature.name}
								</dt>{" "}
								<dd className="inline">{feature.description}</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</div>
	);
};

const featuresthree = [
	{
		name: "SBA Loans",
		description: "Lower interest, lower monthly payments",
		href: "#",
		icon: CloudArrowUpIcon,
	},
	{
		name: "Bank Term Loans",
		description: "Shorter terms, faster delivery of funds",
		href: "#",
		icon: LockClosedIcon,
	},
	{
		name: "Line of Credit",
		description: "Flexible funds and a low monthly payment",
		href: "#",
		icon: ArrowPathIcon,
	},
];

const LoanTypes = () => {
	return (
		<div className="flex flex-col w-full">
			<div className="mx-auto max-w-2xl lg:text-center">
				{/* <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2> */}
				<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
					Access to the right loan for right now
				</p>
				<p className="mt-3 mb-8 text-lg leading-8 text-gray-600">
					See if you pre-qualify, without impacting your credit score.
				</p>
			</div>
			<div className="flex flex-col w-full">
				<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
					{featuresthree.map((feature) => (
						<div key={feature.name} className="flex flex-col">
							<dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
								<feature.icon className="h-5 w-5 flex-none text-[#56cf9e]" aria-hidden="true" />
								{feature.name}
							</dt>
							<dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
								<p className="flex-auto">{feature.description}</p>
								<p className="mt-6">
									<a href={feature.href} className="text-sm font-semibold leading-6 text-[#56cf9e]">
										Learn more <span aria-hidden="true">→</span>
									</a>
								</p>
							</dd>
						</div>
					))}
				</dl>
			</div>
		</div>
	);
};

const stats = [
	{ id: 1, name: "Delivered to small businesses", value: "$9 Billion" },
	{ id: 2, name: "In SBA 7(a) Loans < $350k", value: "#1 Facilitator" },
	{ id: 3, name: "230,000+", value: "Entrepreneurs Funded" },
];

const Stats = () => {
	return (
		<div className="flex flex-col w-full">
			<div className="text-center my-6">
				<h2 className="text-3xl font-bold tracking-tight text-gray-900">By the numbers</h2>
				{/* <p className="mt-4 text-lg leading-8 text-gray-600">
					Lorem ipsum dolor sit amet consect adipisicing possimus.
				</p> */}
			</div>
			<dl className="flex flex-row w-full rounded-lg overflow-hidden divide-x">
				{stats.map((stat) => (
					<div key={stat.id} className="flex flex-col items-center bg-gray-400/5 p-8 w-1/3">
						<dt className="text-sm font-semibold leading-6 text-gray-600">{stat.name}</dt>
						<dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
							{stat.value}
						</dd>
					</div>
				))}
			</dl>
		</div>
	);
};

export default function LandingPage() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<div className="bg-white overflow-y-scroll">
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

			<main className="flex flex-col w-full relative">
				<div className="flex flex-col h-[572px] w-full items-center">
					<div
						className="flex flex-col h-full bg-center w-full bg-cover bg-no-repeat"
						style={{ backgroundImage: `url(${business_stock_four})` }}
					/>
					<div className="flex flex-col w-[1200px] absolute top-[100px] text-white">
						<div className="text-5xl drop-shadow w-[600px]">
							The smarter source for small business loans
						</div>
						<div className="flex flex-col h-[5px] bg-white my-[20px] w-[600px] shadow"></div>
						<div className="flex flex-col w-[600px] drop-shadow">
							Get the capital you need to grow through SBA Loans, Bank Term Loans, Lines of Credit, and
							more fast and flexible financing options.
						</div>
						<div>
							<div className="flex flex-col py-3 px-7 bg-[#56cf9e] w-fit mt-[50px] mb-[20px] rounded cursor-pointer ">
								Apply Now
							</div>
						</div>
						<div className="flex flex-row gap-x-2 drop-shadow text-sm">
							<div>
								<LockClosedIcon className="h-5 w-5 flex-none text-white" aria-hidden="true" />
							</div>
							<div>Only takes 5 minutes and won’t affect your credit score.</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full items-center my-[40px]">
					<div className="flex flex-col w-[1200px] items-center gap-y-[80px] overflow-hidden">
						<div className="flex flex-col w-full">
							<LoanTypes />
						</div>

						<div className="flex flex-col w-full">
							<SmallBusinessLending />
						</div>
						<div className="flex flex-col w-full">
							<Stats />
						</div>
						<div className="flex flex-col w-full">
							<TaxCredits />
						</div>
					</div>
				</div>

				{/* <div className="relative pt-24">
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
								Credit Banc (pronounced like Bank, just spelled fancy) is the simple, one-stop-shop
								where you can access, monitor, and share real-time data from your personal and business
								credit reports with, well…anyone you want to! (Think loan officers, accountants, etc.)
								It’s so genius we’re kind of surprised nobody thought of it sooner.
							</p>
						</div>

						<div>
							<TheVault />
						</div>

						<div>
							<SmallBusinessLending />
						</div>

						<div>
							<MainContent />
						</div>

						<div className="flex flex-col w-full items-center py-3 sm:py-5 text-center text-4xl sm:text-5xl text-[#202536] font-bold">
							<p className="py-2">Pick Your Plan</p>
							<p>And We’ll Do The Rest</p>
						</div>
					</div>
				</div> */}

				{/* <Plans plans={plans} /> */}

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
