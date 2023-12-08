import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Disclosure } from "@headlessui/react";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "@remix-run/react";
const pc_bg = "/images/pc_bg.png";
const cb_logo_3 = "/images/logos/cb_logo_3.png";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";

const HeaderLogos = () => {
	return (
		<div className="py-4">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl lg:max-w-none">
					<h2 className="text-lg font-semibold leading-8 text-gray-900">
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
			<h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
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
				<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our team</h2>
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
		<div className="mx-auto max-w-2xl text-center my-8">
			<h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Support center</h2>
			<p className="mt-6 text-lg leading-8 text-gray-600">
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
				<div className="grid grid-cols-1 items-center gap-x-16 gap-y-10 lg:grid-cols-2">
					<div>
						<h2 className="text-4xl font-bold tracking-tight text-gray-900">
							We built our business on great customer service
						</h2>
						<p className="mt-4 text-gray-500">
							At the beginning at least, but then we realized we could make a lot more money if we kinda
							stopped caring about that. Our new strategy is to write a bunch of things that look really
							good in the headlines, then clarify in the small print but hope people don't actually read
							it.
						</p>
					</div>
					<div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg bg-gray-100">
						<img
							src="https://tailwindui.com/img/ecommerce-images/incentives-07-hero.jpg"
							alt=""
							className="object-cover object-center"
						/>
					</div>
				</div>
				<div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
					{incentives.map((incentive) => (
						<div key={incentive.name} className="sm:flex lg:block">
							<div className="sm:flex-shrink-0">
								<img className="h-16 w-16" src={incentive.imageSrc} alt="" />
							</div>
							<div className="mt-4 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-6">
								<h3 className="text-sm font-medium text-gray-900">{incentive.name}</h3>
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
			<div className="mx-auto max-w-2xl lg:mx-0">
				<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
					We approach the workplace as something that adds to our lives and adds value to world.
				</h2>
				<p className="mt-6 text-base leading-7 text-gray-600">
					Diam nunc lacus lacus aliquam turpis enim. Eget hac velit est euismod lacus. Est non placerat nam
					arcu. Cras purus nibh cursus sit eu in id. Integer vel nibh.
				</p>
			</div>
			<div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
				<div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-50 p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
					<p className="flex-none text-3xl font-bold tracking-tight text-gray-900">250k</p>
					<div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
						<p className="text-lg font-semibold tracking-tight text-gray-900">Users on the platform</p>
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

export default function Container() {
	return (
		<div className="flex flex-col w-full h-full bg-[#F5F7FF] items-center overflow-y-scroll relative py-20 poppins">
			<Header />

			<div className="flex flex-row w-[1200px] gap-x-4 my-8 h-[350px]">
				<div className="flex flex-row flex-1 h-[100%] items-start">
					<div>
						<div className="flex flex-col py-3 gap-y-2 text-5xl text-[#1a3380]">
							<div>Cloud Native</div>
							<div className="font-bold">DMARC</div>
						</div>
						<div className="flex flex-col gap-y-3">
							<div>
								Level up your domain security and email deliverability. Achieve peace of mind. Stop
								ransomware, business email compromise, email phishing, CEO fraud, domain spoofing, and
								other attacks.
							</div>
							<div>Ideal for mid-sized to large enterprises.</div>
							<div className="flex flex-col px-4 py-3 bg-blue-600 text-white rounded-lg items-center cursor-pointer my-6">
								Start DMARC Journey
							</div>
						</div>
						{/* <div>
							<HeaderLogos />
						</div> */}
					</div>
				</div>
				<div className="flex flex-row w-[600px] h-[100%]">
					<div className="flex flex-col border-[10px] border-white rounded bg-black h-[100%] w-[100%]"></div>
				</div>
			</div>
			<div className="mt-[30px] bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 w-full py-[60px]">
				<LogosBanner />
			</div>
			<div className="flex flex-col w-full items-center border-b bg-[#E9EEFF]">
				<div className="flex flex-col w-[1200px] mb-[30px]  pt-10">
					<MainFeatures />
					<div className="flex flex-col w-full items-center mt-[30px]">
						<div className="flex flex-col w-[200px] bg-blue-500 py-3 items-center text-white rounded-lg cursor-pointer">
							Request Demo
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col relative w-[1200px] my-[30px] gap-x-4">
				<div>
					<ListHeader />
				</div>
				<div className="flex flex-row relative w-[1200px] my-[30px] gap-x-4">
					<div className="flex flex-col relative flex-1">
						<div>
							<div style={{ position: "relative", paddingBottom: "54.0%", height: 0, zIndex: 1 }}>
								<iframe
									src="https://www.loom.com/embed/cf55ed26d3d64861bee405354139e805?sid=e8e260af-2f4c-4c38-9377-21a54c11e550"
									frameborder="0"
									webkitallowfullscreen
									mozallowfullscreen
									allowfullscreen
									style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
								></iframe>
							</div>
						</div>
						{/* <img
							className="w-[280px] absolute top-[60px] left-[140px] z-10"
							src="https://easydmarc.com/img/home/redesign/peace-of-mind/layer-1.webp"
						/> */}
						<img className="w-[600px] absolute top-0 left-0" src={pc_bg} />
					</div>

					<div className="flex flex-col w-[600px] gap-y-4">
						<Accordion
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
				<div className="flex flex-row w-full h-[700px] rounded-lg shadow bg-white relative">
					<div className="flex flex-col w-[600px] px-6 gap-y-[40px] justify-center">
						<div className="text-[#1a3380] font-bold text-4xl">
							<div>EasyDMARC Academy.</div>
							<div>Become a DMARC Associate</div>
						</div>
						<div className="flex flex-col gap-y-6">
							<p>
								Whether you're new to DMARC or a seasoned pro looking to brush up your knowledge, DMARC
								Academy from EasyDMARC has something for everyone. Our engaging and interactive course
								materials are designed to make learning fun and easy, and our team is here to support
								you every step of the way.
							</p>
							<p>
								This is the brainchild of our email security experts, wrapped in a sturdy layer of
								awesomeness from the rest of the team. The courses here aim to help you and your
								employees fully understand DMARC, email security, and general cybersecurity.
							</p>
							<p>
								So let's get started! Demonstrate your expertise in email security by earning DMARC
								certifications for your professional portfolio today.
							</p>
						</div>
						<div className="flex flex-col py-3 px-5 bg-[#36f] text-white rounded cursor-pointer">
							Enroll Now
						</div>
					</div>
					<div className="flex flex-col h-full justify-center items-end absolute right-0 -mr-[60px]">
						<img
							src="https://easydmarc.com/img/home/redesign/academy.webp"
							height={530}
							className="rounded-lg"
						/>
					</div>
				</div>
			</div>
			<div>
				<Incentives />
			</div>
			<div>
				<Stats />
			</div>
		</div>
	);
}
