import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { DocumentIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "@remix-run/react";
import { get, get_entity_id, get_file_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { Disclosure } from "@headlessui/react";
import { pipe } from "ramda";

export default function CurriculumAccordion({ curriculum }) {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let resource_path = get_file_id(pathname);

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
										mapIndexed((resource, index) => (
											<Link
												key={index}
												to={resource.href}
												className="flex flex-row w-full border p-2 rounded"
												style={{
													borderColor: resource_path === resource.id ? "#56CF9E" : "",
												}}
											>
												<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
													<div>
														{resource.type === "video" && (
															<PlayCircleIcon
																className="h-5 w-5 text-gray-500"
																style={{
																	color:
																		resource_path === resource.id ? "#56CF9E" : "",
																}}
															/>
														)}
														{resource.type !== "video" && (
															<DocumentIcon
																className="h-4 w-4 text-gray-500"
																style={{
																	color:
																		resource_path === resource.id ? "#56CF9E" : "",
																}}
															/>
														)}
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
}
