import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { DocumentIcon, PlayCircleIcon, PlayIcon, BackwardIcon, ForwardIcon } from "@heroicons/react/24/outline";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { classNames, get, get_course_id, get_entity_id, get_group_id, get_resource_id } from "~/utils/helpers";
import { Disclosure } from "@headlessui/react";
import { course as curriculum } from "../data";
import { flatten, head, map, pipe } from "ramda";
import { all, filter } from "shades";
import { CalendarDaysIcon, CreditCardIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import CurriculumAccordion from "~/components/CurriculumAccordion";

export const loader = async ({ request }) => {
	console.log("course_loader");
	let course_id = get_resource_id(request.url);
	// console.log("course_id");
	// console.log(course_id);
	let resource = pipe(get("sections", all, "resources", all), flatten)(curriculum);
	resource = pipe(filter({ id: course_id }), head)(resource);

	// console.log("resource");
	// console.log(resource);
	return { resource, curriculum };
};

// const CurriculumAccordion = () => {
// 	let { pathname } = useLocation();
// 	let entity_id = get_entity_id(pathname);
// 	let group_id = get_group_id(pathname);
// 	let { curriculum } = useLoaderData();

// 	return (
// 		<div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2 space-y-3 ">
// 			{pipe(
// 				get("sections"),
// 				map((section) => (
// 					<Disclosure defaultOpen={true}>
// 						{({ open }) => (
// 							<>
// 								<Disclosure.Button className="flex w-full justify-between rounded-lg  px-4 py-2 text-left text-sm font-medium   focus:outline-none focus-visible:ring  focus-visible:ring-opacity-75">
// 									<span>{section.title}</span>
// 									<ChevronUpIcon
// 										className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-gray-500`}
// 									/>
// 								</Disclosure.Button>
// 								<Disclosure.Panel className="px-4  pb-2 text-gray-500 space-y-3 text-sm">
// 									{pipe(
// 										map((resource) => (
// 											<Link
// 												to={`/university/creditbuilder/${resource.id}/resource/e/${entity_id}/g/${group_id}/f/${resource.id}`}
// 												className="flex flex-row w-full border p-2 rounded"
// 											>
// 												<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
// 													<div>
// 														<PlayCircleIcon className="h-5 w-5 text-gray-500" />
// 													</div>
// 													<div>{resource.title}</div>
// 												</div>
// 												<div>{resource.duration}</div>
// 											</Link>
// 										))
// 									)(section.resources)}
// 								</Disclosure.Panel>
// 							</>
// 						)}
// 					</Disclosure>
// 				))
// 			)(curriculum)}
// 		</div>
// 	);
// };

const resources = [
	{
		img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/GoDaddy_logo.svg/2560px-GoDaddy_logo.svg.png",
		name: "GoDaddy",
		url: "https://www.godaddy.com/",
		cost: "Varies",
	},
	// {
	// 	img: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Vonage_Logo.png",
	// 	name: "Webpaz",
	// 	url: "https://www.vonage.com/",
	// 	cost: "Varies",
	// },
	// {
	// 	img: "https://www.phone.com/wp-content/uploads/2019/01/phonecom_logo_horiz_comm_better_lightbg.png",
	// 	name: "My Web Chef",
	// 	url: "https://www.phone.com/business-phone-systems/",
	// 	cost: "Varies",
	// },
	{
		img: "https://images.squarespace-cdn.com/content/5134cbefe4b0c6fb04df8065/1540481377494-6F0ZRE16VTIMGIFPVW7K/squarespace-logo-horizontal-black.jpg?format=1000w&content-type=image%2Fjpeg",
		name: "Squarespace",
		url: "https://www.squarespace.com/",
		cost: "Varies",
	},
	{
		img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/WordPress_logo.svg/2560px-WordPress_logo.svg.png",
		name: "Wordpress",
		url: "https://wordpress.com/",
		cost: "Varies",
	},
];

const Resource = ({ resource }) => {
	return (
		<div className="flex flex-col w-full">
			<div className="rounded-lg shadow-sm ring-1 ring-gray-900/5">
				<dl className="flex flex-wrap">
					<div className="flex flex-row w-full h-[150px] items-center">
						<div className="flex-auto pl-6 pt-6">
							<img src={resource.img} alt="" />
						</div>
						<div className="flex flex-col justify-center px-6 pt-4">
							<dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
								Paid
							</dd>
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
					<a href={resource.url} target="_blank" className="text-sm font-semibold leading-6 text-gray-900">
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
					SET UP BUSINESS WEBSITE & EMAIL
				</h2>
				<div className="flex flex-col gap-y-5">
					<p>
						A business website can drastically affect your growth. Clients and lenders are looking for your
						business online. What message are you sending online? Do you have an established website that
						portrays the image you want?
					</p>
					<p>
						For example: george@gmail.com as a business email address doesn’t look as professional as
						george@mybusinessname.com.
					</p>
					<p>
						Having a business website and email can build credibility. Though not required we recommend that
						you have a business website and email.
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

export default function Course() {
	let { resource, curriculum } = useLoaderData();

	// console.log("resource");
	// console.log(resource);

	return (
		<div className="flex flex-row w-full h-full overflow-hiddens gap-x-5 overflow-hidden">
			<div className="flex flex-col w-full lg:w-[70%] h-full rounded overflow-scroll scrollbar-none">
				<div className="flex flex-col w-full h-fit bg-white rounded px-5">
					<div className="flex flex-row justify-between items-center border-b border-gray-200 bg-white py-1 sticky top-0 z-10">
						<h3 className="text-base font-semibold leading-6 text-gray-900 my-2">{resource.title}</h3>
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

					{/* <div className="flex flex-col w-full mt-4 sticky top-[60px] z-10 bg-white">
						<CourseTabs />
					</div>
					*/}

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
						<CurriculumAccordion curriculum={curriculum} />
					</div>
				</div>
			</div>
		</div>
	);
}
