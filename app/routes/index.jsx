import { require_user_session } from "~/utils/auth.server";
import { Hero as HeroSection } from "~/components/Hero";
import { useState } from "react";
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
} from "@heroicons/react/24/outline";
import { RadioGroup } from "@headlessui/react";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const navigation = [
	{ name: "Product", href: "#" },
	{ name: "Features", href: "#" },
	{ name: "Marketplace", href: "#" },
	{ name: "Company", href: "#" },
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
		<div className="bg-white py-12">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5">
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
				<div className="mt-16 flex justify-center">
					<p className="relative rounded-full bg-gray-50 px-4 py-1.5 text-sm leading-6 text-gray-600 ring-1 ring-inset ring-gray-900/5">
						<span className="hidden md:inline">
							Over 2500 companies use our tools to better their
							business.
						</span>
						<a href="#" className="font-semibold text-indigo-600">
							<span
								className="absolute inset-0"
								aria-hidden="true"
							/>{" "}
							Read our customer stories{" "}
							<span aria-hidden="true">&rarr;</span>
						</a>
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
		name: "Freelancer",
		id: "tier-freelancer",
		href: "#",
		priceMonthly: "$24",
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
		priceMonthly: "$32",
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
		priceMonthly: "$48",
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
					Distinctio et nulla eum soluta et neque labore quibusdam.
					Saepe et quasi iusto modi velit ut non voluptas in.
					Explicabo id ut laborum.
				</p>
				<div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
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

export default function Index() {
	return (
		<div className="h-full w-full">
			<main>
				<DarkHero />
				<LogosThree />
				<FeatuersThree />
				<FeaturesTwo />
				<FeaturesFour />
				<Testimonials />
				<Stats />
				<Pricing />
				{/* <PricingTwo /> */}
				<Footer />
			</main>
		</div>
	);
}
