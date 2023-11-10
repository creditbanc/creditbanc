import { useLoaderData } from "@remix-run/react";
import { get, get_resource_id } from "~/utils/helpers";
import { course as curriculum } from "../data";
import { flatten, head, map, pipe } from "ramda";
import { all, filter } from "shades";
import { CreditCardIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import CurriculumAccordion from "~/components/CurriculumAccordion";

export const loader = async ({ request }) => {
	console.log("course_loader");
	let course_id = get_resource_id(request.url);
	let resource = pipe(get("sections", all, "resources", all), flatten)(curriculum);
	resource = pipe(filter({ id: course_id }), head)(resource);
	return { resource, curriculum };
};

const resources = [
	{
		img: "https://www.northwestregisteredagent.com/wp-content/themes/nwra/assets/img/NW-logo-web-final-01.svg",
		name: "Northwest Registered Agent",
		url: "https://www.northwestregisteredagent.com/northwest-39-package-landing-page",
		cost: "Varies",
	},
	{
		img: "https://cdn.mycorporation.com/www/img/common/mycorpLogo.svg",
		name: "My Corporation",
		url: "https://www.mycorporation.com/",
		cost: "Varies",
	},
];

const Resource = ({ resource }) => {
	return (
		<div className="flex flex-col w-full">
			<div className="rounded-lg shadow-sm ring-1 ring-gray-900/5">
				<dl className="flex flex-wrap">
					<div className="flex flex-row w-full">
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

const BusinessName = () => {
	return (
		<div className="w-full text-base leading-7 text-gray-700 px-3 my-4">
			<div className="mt-10 max-w-2xl">
				{/* <p className="mt-8">
					There is a lot that goes into a name! Have you selected your business name? Make sure your business
					name can be trademarked, doesn't include any high-risk industries, and can be, or is filed with the
					state before you build your business further.
				</p> */}
				<h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">ENTER BUSINESS NAME</h2>
				<p className="mt-6">
					Please enter the Business Name as it is listed with the Secretary of State and IRS. Keep in mind
					this will be the permanent Business Name for duration of the program.
				</p>
				<figure className="mt-10 border-l border-blue-600 pl-9">
					<blockquote className="font-semibold text-gray-900">
						<p>
							There is a lot that goes into a name! Make sure your business name can be trademarked,
							doesn’t include any high-risk industries and can be or is filed with the state before you
							build your business further.
						</p>
					</blockquote>
					{/* <figcaption className="mt-6 flex gap-x-4">
						<img
							className="h-6 w-6 flex-none rounded-full bg-gray-50"
							src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
							alt=""
						/>
						<div className="text-sm leading-6">
							<strong className="font-semibold text-gray-900">Maria Hill</strong> – Marketing Manager
						</div>
					</figcaption> */}
				</figure>
				{/* <p className="mt-10">
					Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed
					amet vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus varius
					sit neque erat velit.
				</p> */}
			</div>
			<div className="mt-10">
				<div className="border-b border-gray-200 pb-3 my-5">
					<h3 className="text-base font-semibold leading-6 text-gray-900">Resources</h3>
				</div>
				<div className="flex flex-row gap-x-5">
					{pipe(
						map((resource) => (
							<div className="flex flex-col w-1/3">
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

	return (
		<div className="flex flex-row w-full h-full overflow-hiddens gap-x-5 overflow-hidden">
			<div className="flex flex-col w-full lg:w-[70%] h-full rounded overflow-scroll scrollbar-none">
				<div className="flex flex-col w-full h-fit bg-white rounded px-5">
					<div className="flex flex-row justify-between items-center border-b border-gray-200 bg-white py-1 sticky top-0 z-10">
						<h3 className="text-base font-semibold leading-6 text-gray-900 my-2">{resource.title}</h3>
						{/* <div className="flex flex-row items-center space-x-3">
							<div className="cursor-pointer">
								<BackwardIcon className="h-5 w-5 text-gray-400" />
							</div>
							<div className="flex flex-col items-center justify-center rounded-full bg-gray-100 p-2 cursor-pointer">
								<PlayIcon className="h-5 w-5 text-gray-400" />
							</div>
							<div className="cursor-pointer">
								<ForwardIcon className="h-5 w-5 text-gray-400" />
							</div>
						</div> */}
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
						<BusinessName />
						{/* <CourseDescription /> */}
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
