import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { classNames, get, get_entity_id, get_group_id, get_resource_id, mapIndexed, store } from "~/utils/helpers";
import { course as curriculum } from "../data";
import { findIndex, flatten, head, map, pipe } from "ramda";
import { all, filter } from "shades";
import { CreditCardIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import CurriculumAccordion from "~/components/CurriculumAccordion";

export const loader = async ({ request }) => {
	console.log("course_loader");
	let course_id = get_resource_id(request.url);
	let course = pipe(
		filter((course) => course.id == "creditbuilder"),
		head
	)(curriculum);

	let resources = pipe(get("sections", all, "resources", all), flatten)(course);
	let resource = pipe(filter({ id: course_id }), head)(resources);

	let resource_index = findIndex((resource) => resource.id == course_id)(resources);
	let next_resource = resources[resource_index + 1];
	let next_href = next_resource?.href;

	return { resource: { ...resource, next_href }, course };
};

const resources = [
	{
		img: "https://cdn.cookielaw.org/logos/3b8d861e-ab31-40f1-80cd-b4277504df53/7d4ee6dc-9926-422b-9d98-2bedc1e113e0/6047067e-0919-4abd-b89e-4dfb96f8c37a/RingCentral_Logo_(Color).png",
		name: "Ring Central",
		url: "https://www.ringcentral.com/",
		cost: "Varies",
	},
	{
		img: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Vonage_Logo.png",
		name: "Vonage",
		url: "https://www.vonage.com/",
		cost: "Varies",
	},
	{
		img: "https://www.phone.com/wp-content/uploads/2019/01/phonecom_logo_horiz_comm_better_lightbg.png",
		name: "Phone.com",
		url: "https://www.phone.com/business-phone-systems/",
		cost: "Varies",
	},
];

const Resource = ({ resource }) => {
	return (
		<div className="flex flex-col w-full">
			<div className="rounded-lg shadow-sm ring-1 ring-gray-900/5">
				<div className="flex flex-col">
					<div className="flex flex-col items-center justify-center w-full h-[150px] p-4">
						<img src={resource.img} className="object-contain" />
					</div>
					<div className="flex flex-col h-[120px]">
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
					</div>
				</div>
				<div className="flex flex-col items-end mt-6 border-t border-gray-900/5 px-6 py-6">
					<a
						href={resource.url}
						target="_blank"
						className="text-sm font-semibold text-white bg-green-400 px-3 py-2 rounded-full hover:bg-green-500"
					>
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
					Your Business Phone Number & 411 Listing
				</h2>
				<div className="flex flex-col gap-y-5">
					<p>
						It's time to ditch the personal number and residential phone lines and snag yourself a dedicated
						business phone number. And while you're at it, make sure it gets listed on the National 411
						directory. (Note: Cell phone numbers can NOT be listed.) This is an easy way to boost your
						credibility - not to mention it makes for easy verification by trade vendors when seeking credit
						accounts; if they don't see you listed, some of 'em will decline you out the gate.
					</p>
					<p>
						Need some help? We got you. Credit Banc can list your business phone number if you choose one of
						our recommendations below. It's easy; just select "Yes" and fill in the info requested.
					</p>
					<p>
						Got another provider in mind? Contact your Business Phone provider to confirm the number can be
						listed on the National 411 directory and what criteria are required. If they allow a third party
						to list it on your behalf, select "Yes" below and fill in the info requested.
					</p>
					<p>
						A dedicated business phone number is a simple thing, but could make or break your credibility.
						Don't skip this step.
					</p>
				</div>
			</div>
			<div className="mt-10">
				<div className="border-b border-gray-200 pb-3 my-5">
					<h3 className="text-base font-semibold leading-6 text-gray-900">Resources</h3>
				</div>
				<div className="flex flex-row gap-x-5">
					{pipe(
						mapIndexed((resource, index) => (
							<div className="flex flex-col w-[31%]" key={index}>
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
	let { resource, course } = useLoaderData();
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
							to={resource.next_href}
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

					<div className="">
						<Content />
					</div>
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
