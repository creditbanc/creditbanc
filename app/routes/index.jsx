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

function Hero() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<div className="isolate bg-white">
			<div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
				<svg
					className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
					viewBox="0 0 1155 678"
				>
					<path
						fill="url(#9b2541ea-d39d-499b-bd42-aeea3e93f5ff)"
						fillOpacity=".3"
						d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
					/>
					<defs>
						<linearGradient
							id="9b2541ea-d39d-499b-bd42-aeea3e93f5ff"
							x1="1155.49"
							x2="-78.208"
							y1=".177"
							y2="474.645"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#9089FC" />
							<stop offset={1} stopColor="#FF80B5" />
						</linearGradient>
					</defs>
				</svg>
			</div>
			<div className="px-6 pt-6 lg:px-8">
				<nav
					className="flex items-center justify-between"
					aria-label="Global"
				>
					<div className="flex lg:flex-1">
						<a href="#" className="-m-1.5 p-1.5">
							<span className="sr-only">Your Company</span>
							<img
								className="h-8"
								src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
								alt=""
							/>
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
						<a
							href="#"
							className="text-sm font-semibold leading-6 text-gray-900"
						>
							Log in <span aria-hidden="true">&rarr;</span>
						</a>
					</div>
				</nav>
				<Dialog
					as="div"
					open={mobileMenuOpen}
					onClose={setMobileMenuOpen}
				>
					<Dialog.Panel
						focus="true"
						className="fixed inset-0 z-10 overflow-y-auto bg-white px-6 py-6 lg:hidden"
					>
						<div className="flex items-center justify-between">
							<a href="#" className="-m-1.5 p-1.5">
								<span className="sr-only">Your Company</span>
								<img
									className="h-8"
									src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
									alt=""
								/>
							</a>
							<button
								type="button"
								className="-m-2.5 rounded-md p-2.5 text-gray-700"
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
											className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10"
										>
											{item.name}
										</a>
									))}
								</div>
								<div className="py-6">
									<a
										href="#"
										className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-400/10"
									>
										Log in
									</a>
								</div>
							</div>
						</div>
					</Dialog.Panel>
				</Dialog>
			</div>
			<main>
				<div className="relative py-20 ">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-2xl text-center">
							<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
								Data to enrich your online business
							</h1>
							<p className="mt-6 text-lg leading-8 text-gray-600">
								Anim aute id magna aliqua ad ad non deserunt
								sunt. Qui irure qui lorem cupidatat commodo.
								Elit sunt amet fugiat veniam occaecat fugiat
								aliqua.
							</p>
							<div className="mt-10 flex items-center justify-center gap-x-6">
								<a
									href="#"
									className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								>
									Get started
								</a>
								<a
									href="#"
									className="text-base font-semibold leading-7 text-gray-900"
								>
									Learn more <span aria-hidden="true">→</span>
								</a>
							</div>
						</div>
						<div className="mt-16 flow-root sm:mt-24">
							<div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
								<img
									src="https://tailwindui.com/img/component-images/project-app-screenshot.png"
									alt="App screenshot"
									width={2432}
									height={1442}
									className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
								/>
							</div>
						</div>
					</div>
					<div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
						<svg
							className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
							viewBox="0 0 1155 678"
						>
							<path
								fill="url(#b9e4a85f-ccd5-4151-8e84-ab55c66e5aa1)"
								fillOpacity=".3"
								d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
							/>
							<defs>
								<linearGradient
									id="b9e4a85f-ccd5-4151-8e84-ab55c66e5aa1"
									x1="1155.49"
									x2="-78.208"
									y1=".177"
									y2="474.645"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#9089FC" />
									<stop offset={1} stopColor="#FF80B5" />
								</linearGradient>
							</defs>
						</svg>
					</div>
				</div>
			</main>
		</div>
	);
}

function DarkHero() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<div className="isolate bg-gray-900">
			<div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
				<svg
					className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
					viewBox="0 0 1155 678"
				>
					<path
						fill="url(#f4773080-2a16-4ab4-9fd7-579fec69a4f7)"
						fillOpacity=".2"
						d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
					/>
					<defs>
						<linearGradient
							id="f4773080-2a16-4ab4-9fd7-579fec69a4f7"
							x1="1155.49"
							x2="-78.208"
							y1=".177"
							y2="474.645"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#9089FC" />
							<stop offset={1} stopColor="#FF80B5" />
						</linearGradient>
					</defs>
				</svg>
			</div>
			<div className="px-6 pt-6 lg:px-8">
				<nav
					className="flex items-center justify-between"
					aria-label="Global"
				>
					<div className="flex lg:flex-1">
						<a href="#" className="-m-1.5 p-1.5">
							<span className="sr-only">Your Company</span>
							<img
								className="h-8"
								src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
								alt=""
							/>
						</a>
					</div>
					<div className="flex lg:hidden">
						<button
							type="button"
							className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
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
								className="text-sm font-semibold leading-6 text-white"
							>
								{item.name}
							</a>
						))}
					</div>
					<div className="hidden lg:flex lg:flex-1 lg:justify-end">
						<a
							href="#"
							className="text-sm font-semibold leading-6 text-white"
						>
							Log in <span aria-hidden="true">&rarr;</span>
						</a>
					</div>
				</nav>
				<Dialog
					as="div"
					open={mobileMenuOpen}
					onClose={setMobileMenuOpen}
				>
					<Dialog.Panel
						focus="true"
						className="fixed inset-0 z-10 overflow-y-auto bg-gray-900 px-6 py-6 lg:hidden"
					>
						<div className="flex items-center justify-between">
							<a href="#" className="-m-1.5 p-1.5">
								<span className="sr-only">Your Company</span>
								<img
									className="h-8"
									src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
									alt=""
								/>
							</a>
							<button
								type="button"
								className="-m-2.5 rounded-md p-2.5 text-gray-400"
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
							<div className="-my-6 divide-y divide-gray-500/25">
								<div className="space-y-2 py-6">
									{navigation.map((item) => (
										<a
											key={item.name}
											href={item.href}
											className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-white hover:bg-gray-400/10"
										>
											{item.name}
										</a>
									))}
								</div>
								<div className="py-6">
									<a
										href="#"
										className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-white hover:bg-gray-400/10"
									>
										Log in
									</a>
								</div>
							</div>
						</div>
					</Dialog.Panel>
				</Dialog>
			</div>
			<main>
				<div className="relative py-24 pb-12">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-2xl text-center">
							<h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
								Data to enrich your online business
							</h1>
							<p className="mt-6 text-lg leading-8 text-gray-300">
								Anim aute id magna aliqua ad ad non deserunt
								sunt. Qui irure qui lorem cupidatat commodo.
								Elit sunt amet fugiat veniam occaecat fugiat
								aliqua.
							</p>
							<div className="mt-10 flex items-center justify-center gap-x-6">
								<a
									href="#"
									className="rounded-md bg-indigo-500 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
								>
									Get started
								</a>
								<a
									href="#"
									className="text-base font-semibold leading-7 text-white"
								>
									Learn more <span aria-hidden="true">→</span>
								</a>
							</div>
						</div>
						{/* <img
							src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
							alt="App screenshot"
							width={2432}
							height={1442}
							className="mt-16 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 sm:mt-24"
						/> */}

						<img
							src="https://tailwindui.com/img/component-images/project-app-screenshot.png"
							alt="App screenshot"
							width={2432}
							height={1442}
							className="mt-16  rounded-md shadow-2xl ring-1 ring-gray-900/10"
						/>
					</div>
					<div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
						<svg
							className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
							viewBox="0 0 1155 678"
						>
							<path
								fill="url(#ee0717bf-3e43-49df-b1bd-de36422ed3d3)"
								fillOpacity=".2"
								d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
							/>
							<defs>
								<linearGradient
									id="ee0717bf-3e43-49df-b1bd-de36422ed3d3"
									x1="1155.49"
									x2="-78.208"
									y1=".177"
									y2="474.645"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#9089FC" />
									<stop offset={1} stopColor="#FF80B5" />
								</linearGradient>
							</defs>
						</svg>
					</div>
				</div>
			</main>
		</div>
	);
}

function Logos() {
	return (
		<div className="bg-white ">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5">
					<img
						className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
						src="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2091878/settings_images/rX8FAlscRrm61tdsJduT_Shield_Media_2.png"
						alt="Transistor"
						// width={158}
						// height={48}
					/>
					<img
						className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
						src="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2091878/settings_images/qGNYdurCReZ43zU70HVy_Shield_Advisory_Group_1.png"
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
				<div className="mt-16 flex justify-center">
					<p className="relative rounded-full bg-gray-50 px-4 py-1.5 text-sm leading-6 text-gray-600 ring-1 ring-inset ring-gray-900/5">
						<span className="hidden md:inline">
							Over 2500 companies use our tools to better their
							business.
						</span>
						{/* <a href="#" className="font-semibold text-indigo-600">
							<span
								className="absolute inset-0"
								aria-hidden="true"
							/>{" "}
							Read our customer stories{" "}
							<span aria-hidden="true">&rarr;</span>
						</a> */}
					</p>
				</div>
			</div>
		</div>
	);
}

function LogosTwo() {
	return (
		<div className="bg-gray-900 py-20">
			<div className="mx-auto ">
				<div className="grid grid-cols-1 items-center gap-x-8 gap-y-16 lg:grid-cols-2 px-10">
					<div className="mx-auto w-full">
						<h2 className="text-3xl font-bold tracking-tight text-white">
							Trusted by the most innovative teams
						</h2>
						<p className="mt-6 text-lg leading-8 text-gray-300">
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Et, egestas tempus tellus etiam sed. Quam a
							scelerisque amet ullamcorper eu enim et fermentum,
							augue.
						</p>
						{/* <div className="mt-8 flex items-center gap-x-6">
							<a
								href="#"
								className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
							>
								Create account
							</a>
							<a
								href="#"
								className="text-sm font-semibold text-white"
							>
								Contact us{" "}
								<span aria-hidden="true">&rarr;</span>
							</a>
						</div> */}
					</div>
					<div className="mx-auto grid w-full grid-cols-2 items-center gap-y-12 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:pl-8">
						<img
							className="max-h-12 w-full object-contain object-left"
							src="https://tailwindui.com/img/logos/tuple-logo-white.svg"
							alt="Tuple"
							width={105}
							height={48}
						/>
						<img
							className="max-h-12 w-full object-contain object-right"
							src="https://tailwindui.com/img/logos/reform-logo-white.svg"
							alt="Reform"
							width={104}
							height={48}
						/>
						<img
							className="max-h-12 w-full object-contain object-left"
							src="https://tailwindui.com/img/logos/savvycal-logo-white.svg"
							alt="SavvyCal"
							width={140}
							height={48}
						/>
						<img
							className="max-h-12 w-full object-contain object-right"
							src="https://tailwindui.com/img/logos/laravel-logo-white.svg"
							alt="Laravel"
							width={136}
							height={48}
						/>
						<img
							className="max-h-12 w-full object-contain object-left"
							src="https://tailwindui.com/img/logos/transistor-logo-white.svg"
							alt="Transistor"
							width={158}
							height={48}
						/>
						<img
							className="max-h-12 w-full object-contain object-right"
							src="https://tailwindui.com/img/logos/statamic-logo-white.svg"
							alt="Statamic"
							width={147}
							height={48}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

function LogosThree() {
	return (
		<div className="bg-gray-900 py-20">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<h2 className="text-center text-lg font-semibold leading-8 text-white">
					Trusted by the world’s most innovative teams
				</h2>
				<div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
					<img
						className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
						src="https://tailwindui.com/img/logos/158x48/transistor-logo-white.svg"
						alt="Transistor"
						width={158}
						height={48}
					/>
					<img
						className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
						src="https://tailwindui.com/img/logos/158x48/reform-logo-white.svg"
						alt="Reform"
						width={158}
						height={48}
					/>
					<img
						className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
						src="https://tailwindui.com/img/logos/158x48/tuple-logo-white.svg"
						alt="Tuple"
						width={158}
						height={48}
					/>
					<img
						className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
						src="https://tailwindui.com/img/logos/158x48/savvycal-logo-white.svg"
						alt="SavvyCal"
						width={158}
						height={48}
					/>
					<img
						className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
						src="https://tailwindui.com/img/logos/158x48/statamic-logo-white.svg"
						alt="Statamic"
						width={158}
						height={48}
					/>
				</div>
			</div>
		</div>
	);
}

const features = [
	{
		name: "Push to deploy",
		description:
			"Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi. Odio urna massa nunc massa.",
		icon: CloudArrowUpIcon,
	},
	{
		name: "SSL certificates",
		description:
			"Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget. Sem sodales gravida quam turpis enim lacus amet.",
		icon: LockClosedIcon,
	},
	{
		name: "Simple queues",
		description:
			"Quisque est vel vulputate cursus. Risus proin diam nunc commodo. Lobortis auctor congue commodo diam neque.",
		icon: ArrowPathIcon,
	},
	{
		name: "Advanced security",
		description:
			"Arcu egestas dolor vel iaculis in ipsum mauris. Tincidunt mattis aliquet hac quis. Id hac maecenas ac donec pharetra eget.",
		icon: FingerPrintIcon,
	},
];

function FeaturesOne() {
	return (
		<div className="bg-white sm:py-20">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl lg:text-center">
					<h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">
						Deploy faster
					</h2>
					<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						Everything you need to deploy your app
					</p>
					<p className="mt-6 text-lg leading-8 text-gray-600">
						Quis tellus eget adipiscing convallis sit sit eget
						aliquet quis. Suspendisse eget egestas a elementum
						pulvinar et feugiat blandit at. In mi viverra elit nunc.
					</p>
				</div>
				<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
					<dl className="grid max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
						{features.map((feature) => (
							<div key={feature.name} className="relative pl-16">
								<dt className="text-base font-semibold leading-7 text-gray-900">
									<div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
										<feature.icon
											className="h-6 w-6 text-white"
											aria-hidden="true"
										/>
									</div>
									{feature.name}
								</dt>
								<dd className="mt-2 text-base leading-7 text-gray-600">
									{feature.description}
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</div>
	);
}

const features_two = [
	{
		name: "Push to deploy",
		description:
			"Commodo nec sagittis tortor mauris sed. Turpis tortor quis scelerisque diam id accumsan nullam tempus. Pulvinar etiam lacus volutpat eu. Phasellus praesent ligula sit faucibus.",
		href: "#",
		icon: CloudArrowUpIcon,
	},
	{
		name: "SSL certificates",
		description:
			"Pellentesque enim a commodo malesuada turpis eleifend risus. Facilisis donec placerat sapien consequat tempor fermentum nibh.",
		href: "#",
		icon: LockClosedIcon,
	},
	{
		name: "Simple queues",
		description:
			"Pellentesque sit elit congue ante nec amet. Dolor aenean curabitur viverra suspendisse iaculis eget. Nec mollis placerat ultricies euismod ut condimentum.",
		href: "#",
		icon: ArrowPathIcon,
	},
];

function FeaturesTwo() {
	return (
		<div className="bg-gray-900 py-20 ">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl lg:text-center">
					<h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-400">
						Deploy faster
					</h2>
					<p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
						Everything you need to deploy your app
					</p>
					<p className="mt-6 text-lg leading-8 text-gray-300">
						Quis tellus eget adipiscing convallis sit sit eget
						aliquet quis. Suspendisse eget egestas a elementum
						pulvinar et feugiat blandit at. In mi viverra elit nunc.
					</p>
				</div>
				<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
					<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
						{features_two.map((feature) => (
							<div key={feature.name} className="flex flex-col">
								<dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
									<feature.icon
										className="h-5 w-5 flex-none text-indigo-400"
										aria-hidden="true"
									/>
									{feature.name}
								</dt>
								<dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
									<p className="flex-auto">
										{feature.description}
									</p>
									<p className="mt-6">
										<a
											href={feature.href}
											className="text-base font-semibold leading-7 text-indigo-400"
										>
											Learn more{" "}
											<span aria-hidden="true">→</span>
										</a>
									</p>
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</div>
	);
}

function FeatuersThree() {
	return (
		<div className="overflow-hidden bg-white py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start">
					<div className="lg:pt-4 lg:pr-4">
						<div className="lg:max-w-lg">
							<h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">
								Deploy faster
							</h2>
							<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
								A better workflow
							</p>
							<p className="mt-6 text-lg leading-8 text-gray-600">
								Lorem ipsum, dolor sit amet consectetur
								adipisicing elit. Maiores impedit perferendis
								suscipit eaque, iste dolor cupiditate blanditiis
								ratione.
							</p>
							<div className="mt-8">
								<a
									href="#"
									className="inline-flex rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								>
									Get started
								</a>
							</div>
							<figure className="mt-16 border-l border-gray-200 pl-8 text-gray-600">
								<blockquote className="text-base leading-7">
									<p>
										“Vel ultricies morbi odio facilisi
										ultrices accumsan donec lacus purus.
										Lectus nibh ullamcorper ac dictum justo
										in euismod. Risus aenean ut elit massa.
										In amet aliquet eget cras. Sem volutpat
										enim tristique.”
									</p>
								</blockquote>
								<figcaption className="mt-6 flex gap-x-4 text-sm leading-6">
									<img
										src="https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
										alt=""
										className="h-6 w-6 flex-none rounded-full"
									/>
									<div>
										<span className="font-semibold text-gray-900">
											Maria Hill
										</span>{" "}
										– Marketing Manager
									</div>
								</figcaption>
							</figure>
						</div>
					</div>
					<img
						src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
						alt="Product screenshot"
						className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:ml-0"
						width={2432}
						height={1442}
					/>
				</div>
			</div>
		</div>
	);
}

const features_four = [
	{
		name: "Push to deploy.",
		description:
			"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
		icon: CloudArrowUpIcon,
	},
	{
		name: "SSL certificates.",
		description:
			"Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
		icon: LockClosedIcon,
	},
	{
		name: "Database backups.",
		description:
			"Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.",
		icon: ServerIcon,
	},
];

function FeaturesFour() {
	return (
		<div className="overflow-hidden bg-white py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
					<div className="lg:ml-auto lg:pt-4 lg:pl-4">
						<div className="lg:max-w-lg">
							<h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">
								Deploy faster
							</h2>
							<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
								A better workflow
							</p>
							<p className="mt-6 text-lg leading-8 text-gray-600">
								Lorem ipsum, dolor sit amet consectetur
								adipisicing elit. Maiores impedit perferendis
								suscipit eaque, iste dolor cupiditate blanditiis
								ratione.
							</p>
							<dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
								{features_four.map((feature) => (
									<div
										key={feature.name}
										className="relative pl-9"
									>
										<dt className="inline font-semibold text-gray-900">
											<feature.icon
												className="absolute top-1 left-1 h-5 w-5 text-indigo-600"
												aria-hidden="true"
											/>
											{feature.name}
										</dt>{" "}
										<dd className="inline">
											{feature.description}
										</dd>
									</div>
								))}
							</dl>
						</div>
					</div>
					<div className="flex items-start justify-end lg:order-first">
						<img
							src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
							alt="Product screenshot"
							className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
							width={2432}
							height={1442}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

const featuredTestimonial = {
	body: "Integer id nunc sit semper purus. Bibendum at lacus ut arcu blandit montes vitae auctor libero. Hac condimentum dignissim nibh vulputate ut nunc. Amet nibh orci mi venenatis blandit vel et proin. Non hendrerit in vel ac diam.",
	author: {
		name: "Brenna Goyette",
		handle: "brennagoyette",
		imageUrl:
			"https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80",
		logoUrl: "https://tailwindui.com/img/logos/savvycal-logo-gray-900.svg",
	},
};

const testimonials = [
	[
		[
			{
				body: "Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.",
				author: {
					name: "Leslie Alexander",
					handle: "lesliealexander",
					imageUrl:
						"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
				},
			},
			// More testimonials...
		],
		[
			{
				body: "Aut reprehenderit voluptatem eum asperiores beatae id. Iure molestiae ipsam ut officia rem nulla blanditiis.",
				author: {
					name: "Lindsay Walton",
					handle: "lindsaywalton",
					imageUrl:
						"https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
				},
			},
			// More testimonials...
		],
	],
	[
		[
			{
				body: "Voluptas quos itaque ipsam in voluptatem est. Iste eos blanditiis repudiandae. Earum deserunt enim molestiae ipsum perferendis recusandae saepe corrupti.",
				author: {
					name: "Tom Cook",
					handle: "tomcook",
					imageUrl:
						"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
				},
			},
			// More testimonials...
		],
		[
			{
				body: "Molestias ea earum quos nostrum doloremque sed. Quaerat quasi aut velit incidunt excepturi rerum voluptatem minus harum.",
				author: {
					name: "Leonard Krasner",
					handle: "leonardkrasner",
					imageUrl:
						"https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
				},
			},
			// More testimonials...
		],
	],
];

function Testimonials() {
	return (
		<div className="relative isolate bg-white pt-10 pb-32 ">
			<div className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl">
				<svg
					viewBox="0 0 1313 771"
					aria-hidden="true"
					className="ml-[max(50%,38rem)] w-[82.0625rem]"
				>
					<path
						id="bc169a03-3518-42d4-ab1e-d3eadac65edc"
						fill="url(#85a0eca5-25f1-4ab9-af84-4e2d8d9cdbf3)"
						d="M360.508 589.796 231.671 770.522 0 498.159l360.508 91.637 232.034-325.485c1.485 150.396 51.235 393.965 238.354 165.069C1064.79 143.261 1002.42-107.094 1171.72 46.97c135.44 123.252 148.51 335.641 138.11 426.428L971.677 339.803l24.062 411.461-635.231-161.468Z"
					/>
					<defs>
						<linearGradient
							id="85a0eca5-25f1-4ab9-af84-4e2d8d9cdbf3"
							x1="1313.17"
							x2="-88.881"
							y1=".201"
							y2="539.417"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#9089FC" />
							<stop offset={1} stopColor="#FF80B5" />
						</linearGradient>
					</defs>
				</svg>
			</div>
			<div className="absolute inset-x-0 top-0 -z-10 flex transform-gpu overflow-hidden pt-32 opacity-25 blur-3xl sm:pt-40 xl:justify-end">
				<svg
					viewBox="0 0 1313 771"
					aria-hidden="true"
					className="ml-[-22rem] w-[82.0625rem] flex-none origin-top-right rotate-[30deg] xl:ml-0 xl:mr-[calc(50%-12rem)]"
				>
					<use href="#bc169a03-3518-42d4-ab1e-d3eadac65edc" />
				</svg>
			</div>
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-xl text-center">
					<h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">
						Testimonials
					</h2>
					<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						We have worked with thousands of amazing people
					</p>
				</div>
				<div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
					<figure className="col-span-2 hidden sm:block sm:rounded-2xl sm:bg-white sm:shadow-lg sm:ring-1 sm:ring-gray-900/5 xl:col-start-2 xl:row-end-1">
						<blockquote className="p-12 text-xl font-semibold leading-8 tracking-tight text-gray-900">
							<p>{`“${featuredTestimonial.body}”`}</p>
						</blockquote>
						<figcaption className="flex items-center gap-x-4 border-t border-gray-900/10 py-4 px-6">
							<img
								className="h-10 w-10 flex-none rounded-full bg-gray-50"
								src={featuredTestimonial.author.imageUrl}
								alt=""
							/>
							<div className="flex-auto">
								<div className="font-semibold">
									{featuredTestimonial.author.name}
								</div>
								<div className="text-gray-600">{`@${featuredTestimonial.author.handle}`}</div>
							</div>
							<img
								className="h-10 w-auto flex-none"
								src={featuredTestimonial.author.logoUrl}
								alt=""
							/>
						</figcaption>
					</figure>
					{testimonials.map((columnGroup, columnGroupIdx) => (
						<div
							key={columnGroupIdx}
							className="space-y-8 xl:contents xl:space-y-0"
						>
							{columnGroup.map((column, columnIdx) => (
								<div
									key={columnIdx}
									className={classNames(
										(columnGroupIdx === 0 &&
											columnIdx === 0) ||
											(columnGroupIdx ===
												testimonials.length - 1 &&
												columnIdx ===
													columnGroup.length - 1)
											? "xl:row-span-2"
											: "xl:row-start-1",
										"space-y-8"
									)}
								>
									{column.map((testimonial) => (
										<figure
											key={testimonial.author.handle}
											className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5"
										>
											<blockquote className="text-gray-900">
												<p>{`“${testimonial.body}”`}</p>
											</blockquote>
											<figcaption className="mt-6 flex items-center gap-x-4">
												<img
													className="h-10 w-10 rounded-full bg-gray-50"
													src={
														testimonial.author
															.imageUrl
													}
													alt=""
												/>
												<div>
													<div className="font-semibold">
														{
															testimonial.author
																.name
														}
													</div>
													<div className="text-gray-600">{`@${testimonial.author.handle}`}</div>
												</div>
											</figcaption>
										</figure>
									))}
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

const stats = [
	{ id: 1, name: "Creators on the platform", value: "8,000+" },
	{ id: 2, name: "Flat platform fee", value: "3%" },
	{ id: 3, name: "Uptime guarantee", value: "99.9%" },
	{ id: 4, name: "Paid out to creators", value: "$70M" },
];

function Stats() {
	return (
		<div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
			<img
				src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2850&q=80&blend=111827&blend-mode=multiply&sat=-100&exp=15"
				alt=""
				className="absolute inset-0 -z-10 h-full w-full object-cover"
			/>
			<div className="relative mx-auto max-w-7xl px-6 lg:px-8">
				<svg
					viewBox="0 0 1266 975"
					aria-hidden="true"
					className="absolute -bottom-8 -left-96 -z-10 w-[79.125rem] transform-gpu blur-3xl sm:-left-40 sm:-bottom-64 lg:left-8 lg:-bottom-32 xl:-left-10"
				>
					<path
						fill="url(#05f95398-6ec0-404d-8f7d-a69a4504684d)"
						fillOpacity=".2"
						d="M347.52 746.149 223.324 974.786 0 630.219l347.52 115.93 223.675-411.77c1.431 190.266 49.389 498.404 229.766 208.829C1026.43 181.239 966.307-135.484 1129.51 59.422c130.55 155.925 143.15 424.618 133.13 539.473L936.67 429.884l23.195 520.539L347.52 746.149Z"
					/>
					<defs>
						<linearGradient
							id="05f95398-6ec0-404d-8f7d-a69a4504684d"
							x1="1265.86"
							x2="-162.888"
							y1=".254"
							y2="418.947"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#776FFF" />
							<stop offset={1} stopColor="#FF4694" />
						</linearGradient>
					</defs>
				</svg>
				<div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
					<h2 className="text-base font-semibold leading-8 text-indigo-400">
						Our track record
					</h2>
					<p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
						Trusted by thousands of creators&nbsp;worldwide
					</p>
					<p className="mt-6 text-lg leading-8 text-gray-300">
						Lorem ipsum, dolor sit amet consectetur adipisicing
						elit. Maiores impedit perferendis suscipit eaque, iste
						dolor cupiditate blanditiis ratione.
					</p>
				</div>
				<dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-white sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
					{stats.map((stat) => (
						<div
							key={stat.id}
							className="flex flex-col gap-y-3 border-l border-white/10 pl-6"
						>
							<dt className="text-sm leading-6">{stat.name}</dt>
							<dd className="order-first text-3xl font-semibold tracking-tight">
								{stat.value}
							</dd>
						</div>
					))}
				</dl>
			</div>
		</div>
	);
}

const tiers = [
	{
		name: "Personal Credit Report",
		id: "personal",
		href: "/credit/personal/new",
		priceMonthly: "$40",
		description: "The essentials to provide your best work for clients.",
		features: [
			"5 products",
			"Up to 1,000 subscribers",
			"Basic analytics",
			"48-hour support response time",
		],
		mostPopular: false,
	},
	{
		name: "Business & Personal Credit Report",
		id: "personal_business",
		href: "#",
		priceMonthly: "$50",
		description: "A plan that scales with your rapidly growing business.",
		features: [
			"25 products",
			"Up to 10,000 subscribers",
			"Advanced analytics",
			"24-hour support response time",
			"Marketing automations",
		],
		mostPopular: true,
	},
	{
		name: "Business Credit Report",
		id: "business",
		href: "/credit/business/new",
		priceMonthly: "$40",
		description: "Dedicated support and infrastructure for your company.",
		features: [
			"Unlimited products",
			"Unlimited subscribers",
			"Advanced analytics",
			"1-hour, dedicated support response time",
			"Marketing automations",
		],
		mostPopular: false,
	},
];

function Pricing() {
	return (
		<div className="bg-white py-10">
			<div className="mx-auto px-6 lg:px-8 max-w-7xl">
				<div className="mx-auto max-w-4xl text-center">
					<h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">
						Pricing
					</h2>
					<p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
						Pricing plans for teams of&nbsp;all&nbsp;sizes
					</p>
				</div>
				<p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
					Distinctio et nulla eum soluta et neque labore quibusdam.
					Saepe et quasi iusto modi velit ut non voluptas in.
					Explicabo id ut laborum.
				</p>
				<div className="isolate mx-auto mt-16 grid grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
					{tiers.map((tier, tierIdx) => (
						<div
							key={tier.id}
							className={classNames(
								tier.mostPopular
									? "lg:z-10 lg:rounded-b-none"
									: "lg:mt-8",
								tierIdx === 0 ? "lg:rounded-r-none" : "",
								tierIdx === tiers.length - 1
									? "lg:rounded-l-none"
									: "",
								"flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10"
							)}
						>
							<div>
								<div className="flex items-center justify-between gap-x-4">
									<h3
										id={tier.id}
										className={classNames(
											tier.mostPopular
												? "text-indigo-600"
												: "text-gray-900",
											"text-lg font-semibold leading-8"
										)}
									>
										{tier.name}
									</h3>
									{tier.mostPopular ? (
										<p className="rounded-full bg-indigo-600/10 py-1 px-2.5 text-xs font-semibold leading-5 text-indigo-600">
											Most popular
										</p>
									) : null}
								</div>
								<p className="mt-4 text-sm leading-6 text-gray-600">
									{tier.description}
								</p>
								<p className="mt-6 flex items-baseline gap-x-1">
									<span className="text-4xl font-bold tracking-tight text-gray-900">
										{tier.priceMonthly}
									</span>
									<span className="text-sm font-semibold leading-6 text-gray-600">
										/month
									</span>
								</p>
								<ul
									role="list"
									className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
								>
									{tier.features.map((feature) => (
										<li
											key={feature}
											className="flex gap-x-3"
										>
											<CheckIcon
												className="h-6 w-5 flex-none text-indigo-600"
												aria-hidden="true"
											/>
											{feature}
										</li>
									))}
								</ul>
							</div>
							<a
								href={tier.href}
								aria-describedby={tier.id}
								className={classNames(
									tier.mostPopular
										? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
										: "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300",
									"mt-8 block rounded-md py-2 px-3 text-center text-sm leading-6 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								)}
							>
								Buy plan
							</a>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

const frequencies = [
	{ value: "monthly", label: "Monthly", priceSuffix: "/month" },
	{ value: "annually", label: "Annually", priceSuffix: "/year" },
];

const tiers_two = [
	{
		name: "Freelancer",
		id: "tier-freelancer",
		href: "#",
		price: { monthly: "$15", annually: "$144" },
		description: "The essentials to provide your best work for clients.",
		features: [
			"5 products",
			"Up to 1,000 subscribers",
			"Basic analytics",
			"48-hour support response time",
		],
		mostPopular: false,
	},
	{
		name: "Startup",
		id: "tier-startup",
		href: "#",
		price: { monthly: "$30", annually: "$288" },
		description: "A plan that scales with your rapidly growing business.",
		features: [
			"25 products",
			"Up to 10,000 subscribers",
			"Advanced analytics",
			"24-hour support response time",
			"Marketing automations",
		],
		mostPopular: true,
	},
	{
		name: "Enterprise",
		id: "tier-enterprise",
		href: "#",
		price: { monthly: "$60", annually: "$576" },
		description: "Dedicated support and infrastructure for your company.",
		features: [
			"Unlimited products",
			"Unlimited subscribers",
			"Advanced analytics",
			"1-hour, dedicated support response time",
			"Marketing automations",
			"Custom reporting tools",
		],
		mostPopular: false,
	},
];

function PricingTwo() {
	const [frequency, setFrequency] = useState(frequencies[0]);

	return (
		<div className="bg-white py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-4xl text-center">
					<h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">
						Pricing
					</h2>
					<p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
						Pricing plans for teams of&nbsp;all&nbsp;sizes
					</p>
				</div>
				<p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
					Choose an affordable plan that’s packed with the best
					features for engaging your audience, creating customer
					loyalty, and driving sales.
				</p>
				<div className="mt-16 flex justify-center">
					<RadioGroup
						value={frequency}
						onChange={setFrequency}
						className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
					>
						<RadioGroup.Label className="sr-only">
							Payment frequency
						</RadioGroup.Label>
						{frequencies.map((option) => (
							<RadioGroup.Option
								key={option.value}
								value={option}
								className={({ checked }) =>
									classNames(
										checked
											? "bg-indigo-600 text-white"
											: "text-gray-500",
										"cursor-pointer rounded-full py-1 px-2.5"
									)
								}
							>
								<span>{option.label}</span>
							</RadioGroup.Option>
						))}
					</RadioGroup>
				</div>
				<div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
					{tiers_two.map((tier) => (
						<div
							key={tier.id}
							className={classNames(
								tier.mostPopular
									? "ring-2 ring-indigo-600"
									: "ring-1 ring-gray-200",
								"rounded-3xl p-8 xl:p-10"
							)}
						>
							<div className="flex items-center justify-between gap-x-4">
								<h3
									id={tier.id}
									className={classNames(
										tier.mostPopular
											? "text-indigo-600"
											: "text-gray-900",
										"text-lg font-semibold leading-8"
									)}
								>
									{tier.name}
								</h3>
								{tier.mostPopular ? (
									<p className="rounded-full bg-indigo-600/10 py-1 px-2.5 text-xs font-semibold leading-5 text-indigo-600">
										Most popular
									</p>
								) : null}
							</div>
							<p className="mt-4 text-sm leading-6 text-gray-600">
								{tier.description}
							</p>
							<p className="mt-6 flex items-baseline gap-x-1">
								<span className="text-4xl font-bold tracking-tight text-gray-900">
									{tier.price[frequency.value]}
								</span>
								<span className="text-sm font-semibold leading-6 text-gray-600">
									{frequency.priceSuffix}
								</span>
							</p>
							<a
								href={tier.href}
								aria-describedby={tier.id}
								className={classNames(
									tier.mostPopular
										? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
										: "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300",
									"mt-6 block rounded-md py-2 px-3 text-center text-sm leading-6 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								)}
							>
								Buy plan
							</a>
							<ul
								role="list"
								className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10"
							>
								{tier.features.map((feature) => (
									<li key={feature} className="flex gap-x-3">
										<CheckIcon
											className="h-6 w-5 flex-none text-indigo-600"
											aria-hidden="true"
										/>
										{feature}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

const footer_navigation = {
	solutions: [
		{ name: "Marketing", href: "#" },
		{ name: "Analytics", href: "#" },
		{ name: "Commerce", href: "#" },
		{ name: "Insights", href: "#" },
	],
	support: [
		{ name: "Pricing", href: "#" },
		{ name: "Documentation", href: "#" },
		{ name: "Guides", href: "#" },
		{ name: "API Status", href: "#" },
	],
	company: [
		{ name: "About", href: "#" },
		{ name: "Blog", href: "#" },
		{ name: "Jobs", href: "#" },
		{ name: "Press", href: "#" },
		{ name: "Partners", href: "#" },
	],
	legal: [
		{ name: "Claim", href: "#" },
		{ name: "Privacy", href: "#" },
		{ name: "Terms", href: "#" },
	],
};

function Footer() {
	return (
		<footer className="bg-gray-900" aria-labelledby="footer-heading">
			<h2 id="footer-heading" className="sr-only">
				Footer
			</h2>
			<div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
				<div className="xl:grid xl:grid-cols-3 xl:gap-8">
					<img
						className="h-7"
						src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
						alt="Company name"
					/>
					<div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
						<div className="md:grid md:grid-cols-2 md:gap-8">
							<div>
								<h3 className="text-sm font-semibold leading-6 text-white">
									Solutions
								</h3>
								<ul role="list" className="mt-6 space-y-4">
									{footer_navigation.solutions.map((item) => (
										<li key={item.name}>
											<a
												href={item.href}
												className="text-sm leading-6 text-gray-300 hover:text-white"
											>
												{item.name}
											</a>
										</li>
									))}
								</ul>
							</div>
							<div className="mt-10 md:mt-0">
								<h3 className="text-sm font-semibold leading-6 text-white">
									Support
								</h3>
								<ul role="list" className="mt-6 space-y-4">
									{footer_navigation.support.map((item) => (
										<li key={item.name}>
											<a
												href={item.href}
												className="text-sm leading-6 text-gray-300 hover:text-white"
											>
												{item.name}
											</a>
										</li>
									))}
								</ul>
							</div>
						</div>
						<div className="md:grid md:grid-cols-2 md:gap-8">
							<div>
								<h3 className="text-sm font-semibold leading-6 text-white">
									Company
								</h3>
								<ul role="list" className="mt-6 space-y-4">
									{footer_navigation.company.map((item) => (
										<li key={item.name}>
											<a
												href={item.href}
												className="text-sm leading-6 text-gray-300 hover:text-white"
											>
												{item.name}
											</a>
										</li>
									))}
								</ul>
							</div>
							<div className="mt-10 md:mt-0">
								<h3 className="text-sm font-semibold leading-6 text-white">
									Legal
								</h3>
								<ul role="list" className="mt-6 space-y-4">
									{footer_navigation.legal.map((item) => (
										<li key={item.name}>
											<a
												href={item.href}
												className="text-sm leading-6 text-gray-300 hover:text-white"
											>
												{item.name}
											</a>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

const faqs = [
	{
		question: "What's the best thing about Switzerland?",
		answer: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
	},
	{
		question: "What's the best thing about Switzerland?",
		answer: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
	},
	{
		question: "What's the best thing about Switzerland?",
		answer: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
	},
	{
		question: "What's the best thing about Switzerland?",
		answer: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
	},
	{
		question: "What's the best thing about Switzerland?",
		answer: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
	},
	{
		question: "What's the best thing about Switzerland?",
		answer: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
	},
	{
		question: "What's the best thing about Switzerland?",
		answer: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
	},
];

function FAQ() {
	return (
		<div className="bg-white">
			<div className="mx-auto px-6 py-10 lg:px-8">
				<div className="mx-auto max-w-7xl divide-y divide-gray-900/10">
					<h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
						Frequently asked questions
					</h2>
					<dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
						{faqs.map((faq, id) => (
							<Disclosure as="div" key={id} className="pt-6">
								{({ open }) => (
									<>
										<dt>
											<Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
												<span className="text-base font-semibold leading-7">
													{faq.question}
												</span>
												<span className="ml-6 flex h-7 items-center">
													{open ? (
														<PlusSmallIcon
															className="h-6 w-6"
															aria-hidden="true"
														/>
													) : (
														<MinusSmallIcon
															className="h-6 w-6"
															aria-hidden="true"
														/>
													)}
												</span>
											</Disclosure.Button>
										</dt>
										<Disclosure.Panel
											as="dd"
											className="mt-2 pr-12"
										>
											<p className="text-base leading-7 text-gray-600">
												{faq.answer}
											</p>
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

const incentives = [
	{
		name: "Shield Advisory Group",
		description:
			"It's not actually free we just price it into the products. Someone's paying for it, and it's not uss.",
		imageSrc: shield_advisory_logo,
		href: "https://www.shieldadvisorygroup.com/",
	},
	{
		name: "Liquid Lunch",
		description:
			"Our AI chat widget is powered by a naive series of if/else statements. Guaranteed to irritate.",
		imageSrc: liquid_lunch_logo,
		href: "https://www.theliquidlunchproject.com/",
	},
	{
		name: "The Weekly",
		description:
			"Look how fast that cart is going. What does this mean for the actual experience? I don't know.",
		imageSrc: the_weekly_logo,
		href: "https://theweeklyfromshieldadvisory.substack.com/",
	},
];

function LogoCloud() {
	return (
		<div className="bg-white">
			<div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
				<div className="flex flex-col sm:flex-row justify-center">
					{incentives.map((incentive) => (
						<div key={incentive.name} className="mx-2">
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
								<h3 className="mt-6 text-sm font-medium text-gray-900">
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

const Single = () => {
	return (
		<div className="flex flex-col items-center">
			<CreditScoreDoughnut
				bureau={"Equifax"}
				scoreClassNames="text-6xl"
				bureauTitleClassNames="text-1xl"
			>
				<div className="mt-[170px] font-bold text-5xl">750</div>
			</CreditScoreDoughnut>
		</div>
	);
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
						<a href="#" className="-m-1.5 p-1.5">
							<span className="sr-only">Credit Banc</span>
							<img
								className="h-5 w-auto"
								src={cb_logo_3}
								alt=""
							/>
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
					<div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
						<svg
							className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
							viewBox="0 0 1155 678"
						>
							<path
								fill="url(#9b2541ea-d39d-499b-bd42-aeea3e93f5ff)"
								fillOpacity=".3"
								d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
							/>
							<defs>
								<linearGradient
									id="9b2541ea-d39d-499b-bd42-aeea3e93f5ff"
									x1="1155.49"
									x2="-78.208"
									y1=".177"
									y2="474.645"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#9089FC" />
									<stop offset={1} stopColor="#FF80B5" />
								</linearGradient>
							</defs>
						</svg>
					</div>
					{/* <div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-5xl text-center">
							<div className="font-semibold text-[#202536] text-lg">
								<div className="py-4">Say hello to</div>
							</div>
						</div>
					</div> */}
					<div className="flex flex-col w-full items-center -mt-[50px] mb-[50px]">
						<div className="flex flex-col w-[300px] h-[200px]">
							<Single />
						</div>
					</div>
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-5xl text-center ">
							{/* <div className="font-bold text-2xl text-[#55CF9E]">
								<div className="py-2">
									Let’s cut to the chase
								</div>
							</div>
							<p className="text-lg leading-8 text-[#202536]">
								Sometimes, you need access to your personal
								credit report. Sometimes, you need access to
								your business credit report. And sometimes you
								need access to both.
							</p> */}
							<div className="font-bold text-[#55CF9E] text-6xl mb-3 -mt-3 w-[80%] mx-auto">
								{/* <div className="py-2">Credit Banc</div> */}
								<img
									src={cb_logo_3}
									className="my-10 mt-20 mb-0"
								/>
							</div>
							<p className="text-xs sm:text-lg text-[#202536] max-w-4xl m-auto py-5 leading-6 sm:leading-8">
								Credit Banc (pronounced like Bank, just spelled
								fancy) is the simple, one-stop-shop where you
								can access, monitor, and share real-time data
								from your personal and business credit reports
								with, well…anyone you want to! (Think loan
								officers, accountants, etc.) It’s so genius
								we’re kind of surprised nobody thought of it
								sooner.
							</p>
							<p className="sm:text-lg text-[#202536] font-bold">
								Pick your plan, and we’ll do the rest.
							</p>
						</div>
					</div>

					<div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
						<svg
							className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
							viewBox="0 0 1155 678"
						>
							<path
								fill="url(#b9e4a85f-ccd5-4151-8e84-ab55c66e5aa1)"
								fillOpacity=".3"
								d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
							/>
							<defs>
								<linearGradient
									id="b9e4a85f-ccd5-4151-8e84-ab55c66e5aa1"
									x1="1155.49"
									x2="-78.208"
									y1=".177"
									y2="474.645"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="#9089FC" />
									<stop offset={1} stopColor="#FF80B5" />
								</linearGradient>
							</defs>
						</svg>
					</div>
				</div>

				<div className="mx-auto max-w-7xl px-6 lg:px-8 -mt-[40px]">
					<div className="isolate mx-auto mt-16 grid max-w-xl grid-cols-1 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
						{tiers.map((tier, tierIdx) => (
							<div
								key={tier.id}
								className={classNames(
									tier.mostPopular
										? "lg:z-10 lg:rounded-b-none"
										: "lg:mt-8",
									tierIdx === 0 ? "lg:rounded-r-none" : "",
									tierIdx === tiers.length - 1
										? "lg:rounded-l-none"
										: "",
									"flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10"
								)}
							>
								<div>
									<div className="flex justify-between gap-x-4">
										<h3
											id={tier.id}
											className={classNames(
												tier.mostPopular
													? "text-[#55CF9E]"
													: "text-gray-900",
												"text-lg font-semibold"
											)}
										>
											{tier.name}
										</h3>
										{tier.mostPopular ? (
											<div className="w-[175px]">
												<div className="rounded-full bg-indigo-300/10 text-xs font-semibold text-[#55CF9E] flex flex-row items-center justify-center mt-2 py-1">
													Most popular
												</div>
											</div>
										) : null}
									</div>
									<p className="mt-4 text-sm leading-6 text-gray-600">
										{tier.description}
									</p>
									<p className="mt-6 flex items-baseline gap-x-1">
										<span className="text-4xl font-bold tracking-tight text-gray-900">
											{tier.priceMonthly}
										</span>
										<span className="text-sm font-semibold leading-6 text-gray-600">
											/month
										</span>
									</p>
									<ul
										role="list"
										className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
									>
										{tier.features.map((feature) => (
											<li
												key={feature}
												className="flex gap-x-3"
											>
												<CheckIcon
													className="h-6 w-5 flex-none text-[#55CF9E]"
													aria-hidden="true"
												/>
												{feature}
											</li>
										))}
									</ul>
								</div>
								<a
									href={tier.href}
									aria-describedby={tier.id}
									className={classNames(
										tier.mostPopular
											? "bg-[#55CF9E] text-white shadow-sm hover:bg-[#55CF9E]"
											: "text-[#55CF9E] ring-1 ring-inset ring-[#55CF9E] hover:ring-[#55CF9E]",
										"mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
									)}
								>
									Pull Report
								</a>
							</div>
						))}
					</div>
				</div>
				<div className="py-14">
					<LogoCloud />
				</div>
				<div>
					<FooterTwo />
				</div>
			</main>
		</div>
	);
}
