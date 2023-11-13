import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { classNames, get, get_entity_id, get_group_id, get_resource_id, mapIndexed, store } from "~/utils/helpers";

import { course as curriculum, secretary_of_state } from "../data";
import { flatten, head, map, pipe } from "ramda";
import { all, filter } from "shades";
import { CreditCardIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import CurriculumAccordion from "~/components/CurriculumAccordion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

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

const projects = [{ name: "Secretaries of State", initials: "SOS", bgColor: "bg-green-400" }];

const useSliderStore = store({ is_opened: false });

const CTASection = () => {
	let { is_opened, set_props } = useSliderStore();

	const onViewSecretaryOfState = () => {
		set_props({ is_opened: !is_opened });
	};

	return (
		<div className="flex flex-col my-5">
			<ul role="list" className="mt-3 flex flex-col">
				{projects.map((project) => (
					<li
						key={project.name}
						className="col-span-1 flex rounded-md shadow-sm h-[60px] cursor-pointer"
						onClick={onViewSecretaryOfState}
					>
						<div
							className={classNames(
								project.bgColor,
								"flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
							)}
						>
							{project.initials}
						</div>
						<div className="flex flex-col w-full h-full items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
							<div className="flex flex-row h-full w-full items-center justify-between truncate px-4 py-2 text-sm">
								<div>
									<a href={project.href} className="font-medium text-gray-900 hover:text-gray-600">
										{project.name}
									</a>
								</div>
								<div>View</div>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

const SOSList = () => {
	return (
		<div>
			<ul role="list" className="divide-y divide-gray-100">
				<div className="border-b border-gray-200 bg-white pb-5">
					<h3 className="text-base font-semibold text-gray-900">Secretaries of State</h3>
				</div>
				{secretary_of_state.map((person) => (
					<li key={person.email} className="flex items-center justify-between gap-x-6 py-5">
						<div className="flex min-w-0 gap-x-4">
							{/* <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={person.imageUrl} alt="" /> */}
							<div className="min-w-0 flex-auto">
								<p className="text-sm font-semibold leading-6 text-gray-900">{person.state}</p>
								<p className="mt-1 truncate text-xs leading-5 text-gray-500">{person.url}</p>
							</div>
						</div>
						<a
							href={person.url}
							target="_blank"
							className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						>
							View
						</a>
					</li>
				))}
			</ul>
			{/* <a
				href="#"
				className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
			>
				View all
			</a> */}
		</div>
	);
};

const SidePanel = () => {
	const { is_opened, set_props } = useSliderStore();

	const setOpen = () => {
		set_props({ is_opened: !is_opened });
	};

	return (
		<Transition.Root show={is_opened} as={Fragment}>
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
										<SOSList />
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

const Content = () => {
	return (
		<div className="w-full text-base leading-7 text-gray-700 px-3 my-4">
			<div className="mt-10 max-w-2xl">
				<h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900 my-3">FILE A BUSINESS ENTITY</h2>
				<div className="flex flex-col gap-y-5">
					<p>It’s important for a business to have a business address.</p>
					<p>
						In order to have a strong business foundation, your business should use a physical business
						address. Most lenders prefer that you have a business address but, you can use your residential
						address.
					</p>
					<p>
						Do NOT use any type of PO Box for your business address. Many lenders see this as a higher risk
						business address.
					</p>
					<p>What’s most important is that your business address shows the same on ALL business records.</p>
				</div>
				<CTASection />
			</div>
			<div className="mt-10">
				<div className="border-b border-gray-200 pb-3 my-5">
					<h3 className="text-base font-semibold leading-6 text-gray-900">Resources</h3>
				</div>
				<div className="flex flex-row gap-x-5">
					{pipe(
						mapIndexed((resource, index) => (
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

	// console.log("resource");
	// console.log(resource);

	return (
		<div className="flex flex-row w-full h-full overflow-hiddens gap-x-5 overflow-hidden">
			<SidePanel />
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
						<CurriculumAccordion curriculum={curriculum} />
					</div>
				</div>
			</div>
		</div>
	);
}
