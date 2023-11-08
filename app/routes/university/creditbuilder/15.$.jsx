import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { DocumentIcon, PlayCircleIcon, PlayIcon, BackwardIcon, ForwardIcon } from "@heroicons/react/24/outline";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { classNames, get, get_course_id, get_entity_id, get_group_id, get_resource_id } from "~/utils/helpers";
import { Disclosure } from "@headlessui/react";
import { course as curriculum } from "../data";
import { flatten, head, map, pipe } from "ramda";
import { all, filter } from "shades";
import { CalendarDaysIcon, CreditCardIcon, UserCircleIcon } from "@heroicons/react/20/solid";

export const loader = async ({ request }) => {
	console.log("course_loader");
	let course_id = get_resource_id(request.url);
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
				map((section) => (
					<Disclosure defaultOpen={true}>
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

const Resource = () => {
	return (
		<div className="flex flex-col w-full">
			<h2 className="sr-only">Summary</h2>
			<div className="rounded-lg shadow-sm ring-1 ring-gray-900/5">
				<dl className="flex flex-wrap">
					<div className="flex-auto pl-6 pt-6">
						<dt className="text-sm font-semibold leading-6 text-gray-900">Amount</dt>
						<dd className="mt-1 text-base font-semibold leading-6 text-gray-900">$10,560.00</dd>
					</div>
					<div className="flex-none self-end px-6 pt-4">
						<dt className="sr-only">Status</dt>
						<dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
							Paid
						</dd>
					</div>
					<div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
						<dt className="flex-none">
							<span className="sr-only">Client</span>
							<UserCircleIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
						</dt>
						<dd className="text-sm font-medium leading-6 text-gray-900">Alex Curren</dd>
					</div>
					<div className="mt-4 flex w-full flex-none gap-x-4 px-6">
						<dt className="flex-none">
							<span className="sr-only">Due date</span>
							<CalendarDaysIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
						</dt>
						<dd className="text-sm leading-6 text-gray-500">
							<time dateTime="2023-01-31">January 31, 2023</time>
						</dd>
					</div>
					<div className="mt-4 flex w-full flex-none gap-x-4 px-6">
						<dt className="flex-none">
							<span className="sr-only">Status</span>
							<CreditCardIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
						</dt>
						<dd className="text-sm leading-6 text-gray-500">Paid with MasterCard</dd>
					</div>
				</dl>
				<div className="mt-6 border-t border-gray-900/5 px-6 py-6">
					<a href="#" className="text-sm font-semibold leading-6 text-gray-900">
						Go to website <span aria-hidden="true">&rarr;</span>
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
				<div className="flex flex-row gap-x-5">
					<div className="flex flex-col w-1/3">
						<Resource />
					</div>
					<div className="flex flex-col w-1/3">
						<Resource />
					</div>
					<div className="flex flex-col w-1/3">
						<Resource />
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Course() {
	let { resource } = useLoaderData();

	return (
		<div className="flex flex-row w-full h-full overflow-hiddens gap-x-5 overflow-hidden">
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
									src={resource.url}
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
