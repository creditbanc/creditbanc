import { ChevronUpIcon, PencilIcon, PlusIcon } from "@heroicons/react/20/solid";
import {
	DocumentIcon,
	PlayCircleIcon,
	PlayIcon,
	BackwardIcon,
	ForwardIcon,
	HeartIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import {
	classNames,
	get,
	get_course_id,
	get_entity_id,
	get_group_id,
	get_resource_id,
	mapIndexed,
} from "~/utils/helpers";
import { Disclosure } from "@headlessui/react";
import { course as curriculum } from "../data";
import { flatten, head, map, pipe } from "ramda";
import { all, filter } from "shades";
import { CalendarDaysIcon, CreditCardIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
// import { HeartIcon, XMarkIcon } from '@heroicons/react/24/outline'
// import { PencilIcon, PlusIcon } from '@heroicons/react/20/solid'

export const loader = async ({ request }) => {
	console.log("course_loader");
	let course_id = get_resource_id(request?.url);
	// console.log("course_id");
	// console.log(course_id);
	let resource = pipe(get("sections", all, "resources", all), flatten)(curriculum);
	console.log("resource______");
	console.log(resource);
	resource = pipe(filter({ id: course_id }), head)(resource);

	// console.log("resource");
	// console.log(resource);
	return { resource, curriculum };
};

const CurriculumAccordion = () => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let { curriculum } = useLoaderData();

	return (
		<div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2 space-y-3 ">
			{pipe(
				get("sections"),
				mapIndexed((section, index) => (
					<Disclosure defaultOpen={true} key={index}>
						{({ open }) => (
							<>
								<Disclosure.Button className="flex w-full justify-between rounded-lg  px-4 py-2 text-left text-sm font-medium   focus:outline-none focus-visible:ring  focus-visible:ring-opacity-75">
									<span>{section.title}</span>
									<ChevronUpIcon
										className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-gray-500`}
									/>
								</Disclosure.Button>
								<Disclosure.Panel className="px-4  pb-2 text-gray-500 space-y-3 text-sm">
									{pipe(
										map((resource) => (
											<Link
												to={`/university/creditbuilder/${resource.id}/resource/e/${entity_id}/g/${group_id}/f/${resource.id}`}
												className="flex flex-row w-full border p-2 rounded"
											>
												<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
													<div>
														<PlayCircleIcon className="h-5 w-5 text-gray-500" />
													</div>
													<div>{resource.title}</div>
												</div>
												<div>{resource.duration}</div>
											</Link>
										))
									)(section.resources)}
								</Disclosure.Panel>
							</>
						)}
					</Disclosure>
				))
			)(curriculum)}
		</div>
	);
};

const resources = [
	{
		name: "KeyBank Business Rewards Mastercard",
		status: "Recommended",
		reports_to: ["Experian", "Equifax"],
		terms: "Revolving",
		is_pg_required: true,
		img: "https://www.key.com/content/experience-fragments/kco/header/personal/_jcr_content/header/logo.coreimg.svg/1644846310200/kb-logo.svg",
		url: "https://www.key.com/small-business/banking/credit-cards/mastercard-small-business-credit-card.html",
		phone: "888-539-4249",
		description: `Since our earliest days, we’ve strived to find new ways to enrich our customers’ lives, have their backs, and provide our special brand of service, in ways both big and small. Our business is helping small businesses grow theirs. KeyBank offers the KeyBank Business Card, KeyBank Business Reward Card, and KeyBank Business Reward Cash card. You can choose the best card for your business needs.`,
		instructions: [
			`Cash advances are available with business credit card approval, the amount of cash advance depends upon the approval amount.`,
			`Key Bank considers both business and personal credit histories. An inquiry may occur, but it will not be reflected as a hard or soft pull on personal credit.`,
		],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			"Business address- matching everywhere.",
			"D & B number",
			"Business phone number listed to 411",
			"Business license- if applicable",
			"Business bank account",
			"2 years in business, can apply with a personal guarantee(PG) if less than 2 years in business.",
		],
	},
	{
		name: "Kum & Go",
		status: "Recommended",
		reports_to: ["D&B", "Experian", "Equifax"],
		terms: "Net 15",
		is_pg_required: true,
		img: "https://cdn.brandfolder.io/9I9LN923/at/3tf6xqncpw4tx6pg6x5r3/kumandgo-500x250.png",
		phone: "888-539-4249",
		url: "https://www.key.com/small-business/index.html",
		description: `Since our earliest days, we’ve strived to find new ways to enrich our customers’ lives, have their backs, and provide our special brand of service, in ways both big and small. Our business is helping small businesses grow theirs. KeyBank offers the KeyBank Business Card, KeyBank Business Reward Card, and KeyBank Business Reward Cash card. You can choose the best card for your business needs.`,
		instructions: [
			`Cash advances are available with business credit card approval, the amount of cash advance depends upon the approval amount.`,
			`Key Bank considers both business and personal credit histories. An inquiry may occur, but it will not be reflected as a hard or soft pull on personal credit.`,
		],
		qualifications: [
			"Entity in good standing with the Secretary of State",
			"EIN number with IRS",
			"Business address- matching everywhere.",
			"D & B number",
			"Business phone number listed to 411",
			"Business license- if applicable",
			"Business bank account",
			"2 years in business, can apply with a personal guarantee(PG) if less than 2 years in business.",
		],
	},
];

const Resource = ({ resource }) => {
	return (
		<div className="flex flex-col w-full">
			<div className="rounded-lg shadow-sm ring-1 ring-gray-900/5">
				<dl className="flex flex-wrap">
					<div className="flex flex-row w-full h-[150px] items-center">
						<div className="flex-auto px-6 py-6">
							<img src={resource.img} alt="" />
						</div>
					</div>
					<div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
						<dt className="flex-none">
							<UserCircleIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
						</dt>
						<dd className="text-sm font-medium leading-6 text-gray-900">{resource.name}</dd>
					</div>
					{/* <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
						<dt className="flex-none">
							<CalendarDaysIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
						</dt>
						<dd className="text-sm leading-6 text-gray-500">
							<time dateTime="2023-01-31">January 31, 2023</time>
						</dd>
					</div> */}
					<div className="mt-4 flex w-full flex-none gap-x-4 px-6">
						<dt className="flex-none">
							<CreditCardIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
						</dt>
						<dd className="flex flex-row text-sm leading-6 text-gray-500 gap-x-1">
							<div>Cost:</div>
							<div>{resource.cost}</div>
						</dd>
					</div>
				</dl>
				<div className="mt-6 border-t border-gray-900/5 px-6 py-6">
					<a href={resource?.url} target="_blank" className="text-sm font-semibold leading-6 text-gray-900">
						Learn More <span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			</div>
		</div>
	);
};

const Content = () => {
	return (
		<div className="w-full text-base leading-7 text-gray-700 px-3 my-4">
			<div className="mt-10 max-w-2xl">
				<h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900 my-3">
					APPLY WITH 3 TRADE ACCOUNTS
				</h2>
				<div className="flex flex-col gap-y-5">
					<p>
						What is a trade account? A trade account (sometimes referred to as a vendor account) is
						typically a store account. As you set up your accounts with various vendors make sure you are
						working towards or setting up net terms. Payments on net terms are reported to the business
						credit bureaus.
					</p>
					<p>
						When applying for trade accounts make sure you use your correct business information as it
						matches on all of your business records.
					</p>
					<p>
						To make sure your vendors report make sure you purchase is over $50. It typically takes 30-90
						days to complete this step and for your payments to report on your business credit reports.
						Continue to search your reports regularly so you are aware when they start reporting.
					</p>
					<p>
						If you have any questions reach out to our Advisor Team. Once you have applied for your trade
						accounts submit the information by clicking on the button below.
					</p>
				</div>
			</div>
			<div className="mt-10">
				<div className="border-b border-gray-200 pb-3 my-5">
					<h3 className="text-base font-semibold leading-6 text-gray-900">Resources</h3>
				</div>
				<div className="flex flex-row flex-wrap gap-x-5 gap-y-5">
					{pipe(
						map((resource) => (
							<div className="flex flex-col w-[31%]">
								<Resource resource={resource} />
							</div>
						))
					)(resources)}
				</div>
			</div>
		</div>
	);
};

const SidePanel = () => {
	const [open, setOpen] = useState(true);
	const resource = resources[1];

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-[99]" onClose={setOpen}>
				<Transition.Child
					as={Fragment}
					enter="ease-in-out duration-500"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in-out duration-500"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-700"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-700"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full"
							>
								<Dialog.Panel className="pointer-events-auto relative">
									<Transition.Child
										as={Fragment}
										enter="ease-in-out duration-500"
										enterFrom="opacity-0"
										enterTo="opacity-100"
										leave="ease-in-out duration-500"
										leaveFrom="opacity-100"
										leaveTo="opacity-0"
									>
										<div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
											<button
												type="button"
												className="relative rounded-md text-gray-300 hover:text-white focus:outline-none"
												onClick={() => setOpen(false)}
											>
												<span className="absolute -inset-2.5" />
												<span className="sr-only">Close panel</span>
												<XMarkIcon className="h-6 w-6" aria-hidden="true" />
											</button>
										</div>
									</Transition.Child>
									<div className="h-full overflow-y-auto bg-white p-8 w-[700px]">
										<div className="space-y-6">
											<div className="flex flex-col items-center h-full">
												<img src={resource.img} />
											</div>

											<div>
												<h3 className="font-medium text-gray-900">Description</h3>
												<div className="mt-2 flex items-center justify-between">
													<p className="text-sm italic text-gray-500">
														{resource?.description}
													</p>
												</div>
											</div>

											<div>
												<h3 className="font-medium text-gray-900">Information</h3>
												<dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
													<div className="flex justify-between py-3 text-sm font-medium">
														<dt className="text-gray-500">Phone:</dt>
														<dd className="text-gray-900">{resource?.phone}</dd>
													</div>
													<div className="flex justify-between py-3 text-sm font-medium">
														<dt className="text-gray-500">Website:</dt>
														<dd className="text-gray-900">{resource?.site}</dd>
													</div>
													<div className="flex justify-between py-3 text-sm font-medium">
														<dt className="text-gray-500">Reports to:</dt>
														<div className="text-gray-900 flex flex-row gap-x-5">
															{pipe(map((bureau) => <div>{bureau}</div>))(
																resource?.reports_to
															)}
														</div>
													</div>

													<div className="flex justify-between py-3 text-sm font-medium">
														<dt className="text-gray-500">Terms:</dt>
														<dd className="text-gray-900">{resource?.terms}</dd>
													</div>
												</dl>
											</div>

											<div>
												<h3 className="font-medium text-gray-900 my-4">To Qualify</h3>
												<div className="mt-2 flex items-center justify-between">
													<div className="overflow-hidden rounded-md bg-white border list-none divide-y">
														{pipe(
															map((item) => (
																<li key={item.id} className="px-6 py-4">
																	{item}
																</li>
															))
														)(resource?.qualifications)}
													</div>
												</div>
											</div>

											<div>
												<h3 className="font-medium text-gray-900 my-4">Instructions</h3>
												<div className="mt-2 flex items-center justify-between">
													<div className="overflow-hidden rounded-md bg-white border list-none divide-y">
														{pipe(
															map((item) => (
																<li key={item.id} className="px-6 py-4">
																	{item}
																</li>
															))
														)(resource?.instructions)}
													</div>
												</div>
											</div>

											<div className="flex flex-row gap-x-3">
												<a
													href={resource?.url}
													target="_blank"
													type="button"
													className="flex flex-col w-1/2 items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
												>
													Apply
												</a>
												<button
													onClick={() => setOpen(false)}
													type="button"
													className="flex flex-col w-1/2 items-center rounded-md bg-white py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
												>
													Close
												</button>
											</div>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default function Course() {
	let { resource } = useLoaderData();

	return (
		<div className="flex flex-row w-full h-full overflow-hiddens gap-x-5 overflow-hidden">
			<SidePanel />
			<div className="flex flex-col w-full lg:w-[70%] h-full rounded overflow-scroll scrollbar-none">
				<div className="flex flex-col w-full h-fit bg-white rounded px-5">
					<div className="flex flex-row justify-between items-center border-b border-gray-200 bg-white py-1 sticky top-0 z-10">
						<h3 className="text-base font-semibold leading-6 text-gray-900 my-2">{resource?.title}</h3>
					</div>
					{resource?.type === "video" && (
						<div className="flex flex-col w-full scrollbar-none">
							<div className="relative pb-[56.25%] h-0 overflow-hidden">
								<iframe
									className="absolute top-0 left-0 w-full h-full"
									src={resource?.url}
									title="YouTube video player"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
							</div>
						</div>
					)}

					<div className="">
						<Content />
					</div>
				</div>
			</div>
			<div className="hidden lg:flex flex-col w-[30%]">
				<div className="flex flex-col bg-white border rounded overflow-scroll scrollbar-none">
					<div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 sticky top-0 z-10">
						<h3 className="text-base font-semibold leading-6 text-gray-900 my-2">Portfolio Manager</h3>

						<div className="flex flex-col w-full space-y-5">
							<p className="mt-1 text-sm text-gray-500">
								Deep dive into the portfolio management process & earn your certification with new
								topics on the latest trends in ESG, active vs passive investing, and more!
							</p>

							<p className="mt-1 text-sm text-gray-500">
								New content – discover our expert interview with a wealth manager!
							</p>
						</div>

						<div className="my-2 flex flex-col w-full">
							<div className="flex flex-row w-full justify-between my-2 text-sm text-gray-400">
								<div>45%</div>
								<div>4/20 lessons</div>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
								<div className="bg-blue-600 h-2.5 rounded-full w-[45%]"></div>
							</div>
						</div>
					</div>

					<div className="flex flex-col w-full my-3">
						<CurriculumAccordion />
					</div>
				</div>
			</div>
		</div>
	);
}
