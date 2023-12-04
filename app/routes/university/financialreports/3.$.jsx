import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { get, get_entity_id, get_group_id, get_resource_id, mapIndexed } from "~/utils/helpers";
import { course as curriculum } from "../data";
import { findIndex, flatten, head, pipe } from "ramda";
import { all, filter } from "shades";
import CurriculumAccordion from "~/components/CurriculumAccordion";

export const loader = async ({ request }) => {
	console.log("course_loader");
	let course_id = get_resource_id(request.url);
	let course = pipe(
		filter((course) => course.id == "financialreports"),
		head
	)(curriculum);
	let resources = pipe(get("sections", all, "resources", all), flatten)(course);

	let resource = pipe(filter({ id: course_id }), head)(resources);

	let resource_index = findIndex((resource) => resource.id == course_id)(resources);
	let next_resource = resources[resource_index + 1];
	let next_href = next_resource?.href;

	return { resource: { ...resource, next_href }, course };
};

export default function Course() {
	let { resource, course } = useLoaderData();
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let next_id = Number(resource.id) + 1;

	return (
		<div className="flex flex-row w-full h-full overflow-hiddens gap-x-5 overflow-hidden">
			<div className="flex flex-col w-full lg:w-[70%] h-full rounded overflow-scroll scrollbar-none ">
				<div className="flex flex-col w-full bg-white rounded px-5 h-full">
					<div className="flex flex-row justify-between items-center border-b border-gray-200 bg-white py-1 sticky top-0 z-10">
						<h3 className="text-base font-semibold leading-6 text-gray-900 my-2">{resource?.title}</h3>

						<Link
							to={resource?.next_href}
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
									src={resource?.url}
									title="YouTube video player"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
							</div>
						</div>
					)}
					<p className="my-5">
						Lesson One is all about getting your business looking top-notch! We'll walk you through the
						steps to develop a great name, an actual address, the proper structure, and getting an important
						EIN. Plus, we'll help you set up a phone number, get listed on 411, create a slick website, and
						open a business bank account. It's all part of the process of establishing business credibility.
					</p>
				</div>
			</div>
			<div className="hidden lg:flex flex-col w-[30%]">
				<div className="flex flex-col bg-white border rounded overflow-scroll scrollbar-none">
					<div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 sticky top-0 z-10">
						<h3 className="text-base font-semibold leading-6 text-gray-900 my-2">Credit Builder</h3>
					</div>

					<div className="flex flex-col w-full my-3">
						<CurriculumAccordion curriculum={course} />
					</div>
				</div>
			</div>
		</div>
	);
}
