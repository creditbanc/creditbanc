import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { classNames, get, get_entity_id, get_group_id, get_resource_id, mapIndexed, store } from "~/utils/helpers";
import { course as curriculum, resources as all_resources } from "../data";
import { flatten, head, map, pipe } from "ramda";
import { all, filter } from "shades";
import CurriculumAccordion from "~/components/CurriculumAccordion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export const loader = async ({ request }) => {
	console.log("course_loader");
	let course_id = get_resource_id(request?.url);

	let resource = pipe(get("sections", all, "resources", all), flatten)(curriculum);
	resource = pipe(filter({ id: course_id }), head)(resource);

	return { resource, curriculum };
};

let useSliderStore = store({ is_open: false, selected_id: "KeyBank Business Rewards Mastercard" });

const Resource = ({ resource }) => {
	let { set_props } = useSliderStore();

	return (
		<div className="flex flex-col w-full">
			<div className="rounded-lg shadow-sm ring-1 ring-gray-900/5">
				<dl className="flex flex-wrap">
					<div className="flex flex-row w-full h-[150px] items-center">
						<div className="flex-auto px-6 py-6">
							<img src={resource.img} />
						</div>
					</div>
				</dl>
				<div className="flex flex-col items-end mt-6 border-t border-gray-900/5 px-6 py-6">
					<div
						className="flex flex-row text-sm font-semibold text-gray-900 bg-green-400 px-3 py-2 rounded-full hover:bg-green-500 cusor-pointer justify-end gap-x-3 w-[150px] cursor-pointer"
						onClick={() => set_props({ selected_id: resource.name, is_open: true })}
					>
						Learn More <span aria-hidden="true">&rarr;</span>
					</div>
				</div>
			</div>
		</div>
	);
};

const Content = () => {
	let resources = pipe(filter({ tier: 3 }))(all_resources);

	return (
		<div className="w-full text-base leading-7 text-gray-700 px-3 my-4">
			<div className="mt-10">
				<div className="border-b border-gray-200 pb-3 my-5">
					<h3 className="text-base font-semibold leading-6 text-gray-900">Resources</h3>
				</div>
				<div className="flex flex-row flex-wrap gap-x-5 gap-y-5">
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

const SidePanel = () => {
	let { is_open, selected_id, set_props } = useSliderStore();
	const resource = pipe(filter({ name: selected_id }), head)(all_resources);

	const setOpen = () => {
		set_props({ is_open: !is_open });
	};

	return (
		<Transition.Root show={is_open} as={Fragment}>
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
															{pipe(
																mapIndexed((bureau, index) => (
																	<div key={index}>{bureau}</div>
																))
															)(resource?.reports_to)}
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
													<div className="overflow-hidden rounded-md bg-white border list-none divide-y w-full">
														{pipe(
															mapIndexed((item, index) => (
																<li key={index} className="px-6 py-4">
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
													<div className="overflow-hidden rounded-md bg-white border list-none divide-y w-full">
														{pipe(
															mapIndexed((item, index) => (
																<li key={index} className="px-6 py-4">
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
													className="flex flex-col w-1/2 items-center rounded-md bg-green-300 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gree-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gree-400"
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
	let { resource, curriculum = [] } = useLoaderData();
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let next_id = 27;

	return (
		<div className="flex flex-row w-full h-full overflow-hiddens gap-x-5 overflow-hidden">
			<SidePanel />
			<div className="flex flex-col w-full lg:w-[70%] h-full rounded overflow-scroll scrollbar-none">
				<div className="flex flex-col w-full h-fit bg-white rounded px-5">
					<div className="flex flex-row justify-between items-center border-b border-gray-200 bg-white py-1 sticky top-0 z-10">
						<h3 className="text-base font-semibold leading-6 text-gray-900 my-2">{resource?.title}</h3>
						<Link
							to={`/university/creditbuilder/${next_id}`}
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
