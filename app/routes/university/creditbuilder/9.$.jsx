import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { DocumentIcon, PlayCircleIcon, PlayIcon, BackwardIcon, ForwardIcon } from "@heroicons/react/24/outline";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { classNames, get, get_entity_id, get_group_id, get_resource_id, store } from "~/utils/helpers";
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

const resources = [
	{
		img: "https://mms.businesswire.com/media/20210525005195/en/880658/5/NorthOne-Logo-Full.jpg",
		name: "NorthOne",
		url: "https://get.northone.com/affiliate-offer/",
		cost: "Varies",
	},
];

const Resource = ({ resource }) => {
	return (
		<div className="flex flex-col w-full">
			<div className="rounded-lg shadow-sm ring-1 ring-gray-900/5">
				<dl className="flex flex-wrap">
					<div className="flex flex-row w-full h-[150px] items-center">
						<div className="flex-auto px-6 pt-6">
							<img src={resource.img} alt="" />
						</div>
					</div>
					<div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
						<dt className="flex-none">
							<UserCircleIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
						</dt>
						<dd className="text-sm font-medium leading-6 text-gray-900">{resource.name}</dd>
					</div>

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
					SET UP YOUR BUSINESS BANK ACCOUNT
				</h2>
				<div className="flex flex-col gap-y-5">
					<p>
						All businesses big or small, new or established should set up a business bank account. A
						business bank account opens up financing options. Additionally, a business bank account affects
						the business in both accounting and legal departments.
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
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let next_id = Number(resource.id) + 1;

	return (
		<div className="flex flex-row w-full h-full overflow-hiddens gap-x-5 overflow-hidden">
			<div className="flex flex-col w-full lg:w-[70%] h-full rounded overflow-scroll scrollbar-none">
				<div className="flex flex-col w-full h-fit bg-white rounded px-5">
					<div className="flex flex-row justify-between items-center border-b border-gray-200 bg-white py-1 sticky top-0 z-10">
						<h3 className="text-base font-semibold leading-6 text-gray-900 my-2">{resource.title}</h3>
						<Link
							to={`/university/creditbuilder/${next_id}/resource/e/${entity_id}/g/${group_id}/f/${next_id}`}
							type="button"
							className="rounded-full bg-green-400 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
						>
							Continue
						</Link>
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
