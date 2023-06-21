import { ChevronUpIcon } from "@heroicons/react/20/solid";
import {
	DocumentIcon,
	PlayCircleIcon,
	PlayIcon,
	BackwardIcon,
	ForwardIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";
import { classNames } from "~/utils/helpers";
import { Disclosure } from "@headlessui/react";

const CurriculumAccordion = () => {
	return (
		<div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2 space-y-3 ">
			<Disclosure defaultOpen={true}>
				{({ open }) => (
					<>
						<Disclosure.Button className="flex w-full justify-between rounded-lg  px-4 py-2 text-left text-sm font-medium   focus:outline-none focus-visible:ring  focus-visible:ring-opacity-75">
							<span>What is your refund policy?</span>
							<ChevronUpIcon
								className={`${
									open ? "rotate-180 transform" : ""
								} h-5 w-5 text-gray-500`}
							/>
						</Disclosure.Button>
						<Disclosure.Panel className="px-4  pb-2 text-gray-500 space-y-3 text-sm">
							<div className="flex flex-row w-full border p-2 rounded">
								<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
									<div>
										<PlayCircleIcon className="h-5 w-5 text-gray-500" />
									</div>
									<div>Modern Portfolio Theory</div>
								</div>
								<div>2:45</div>
							</div>
							<div className="flex flex-row w-full border p-2 rounded">
								<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
									<div>
										<DocumentIcon className="h-5 w-5 text-gray-500" />
									</div>
									<div>Modern Portfolio Theory</div>
								</div>
								<div>2:45</div>
							</div>
							<div className="flex flex-row w-full border p-2 rounded">
								<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
									<div>
										<PlayCircleIcon className="h-5 w-5 text-gray-500" />
									</div>
									<div>Modern Portfolio Theory</div>
								</div>
								<div>2:45</div>
							</div>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
			<Disclosure defaultOpen={true}>
				{({ open }) => (
					<>
						<Disclosure.Button className="flex w-full justify-between rounded-lg  px-4 py-2 text-left text-sm font-medium   focus:outline-none focus-visible:ring  focus-visible:ring-opacity-75">
							<span>What is your refund policy?</span>
							<ChevronUpIcon
								className={`${
									open ? "rotate-180 transform" : ""
								} h-5 w-5 text-gray-500`}
							/>
						</Disclosure.Button>
						<Disclosure.Panel className="px-4  pb-2 text-gray-500 space-y-3 text-sm">
							<div className="flex flex-row w-full border p-2 rounded">
								<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
									<div>
										<PlayCircleIcon className="h-5 w-5 text-gray-500" />
									</div>
									<div>Modern Portfolio Theory</div>
								</div>
								<div>2:45</div>
							</div>
							<div className="flex flex-row w-full border p-2 rounded">
								<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
									<div>
										<DocumentIcon className="h-5 w-5 text-gray-500" />
									</div>
									<div>Modern Portfolio Theory</div>
								</div>
								<div>2:45</div>
							</div>
							<div className="flex flex-row w-full border p-2 rounded">
								<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
									<div>
										<PlayCircleIcon className="h-5 w-5 text-gray-500" />
									</div>
									<div>Modern Portfolio Theory</div>
								</div>
								<div>2:45</div>
							</div>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
			<Disclosure defaultOpen={true}>
				{({ open }) => (
					<>
						<Disclosure.Button className="flex w-full justify-between rounded-lg  px-4 py-2 text-left text-sm font-medium   focus:outline-none focus-visible:ring  focus-visible:ring-opacity-75">
							<span>What is your refund policy?</span>
							<ChevronUpIcon
								className={`${
									open ? "rotate-180 transform" : ""
								} h-5 w-5 text-gray-500`}
							/>
						</Disclosure.Button>
						<Disclosure.Panel className="px-4  pb-2 text-gray-500 space-y-3 text-sm">
							<div className="flex flex-row w-full border p-2 rounded">
								<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
									<div>
										<PlayCircleIcon className="h-5 w-5 text-gray-500" />
									</div>
									<div>Modern Portfolio Theory</div>
								</div>
								<div>2:45</div>
							</div>
							<div className="flex flex-row w-full border p-2 rounded">
								<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
									<div>
										<DocumentIcon className="h-5 w-5 text-gray-500" />
									</div>
									<div>Modern Portfolio Theory</div>
								</div>
								<div>2:45</div>
							</div>
							<div className="flex flex-row w-full border p-2 rounded">
								<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
									<div>
										<PlayCircleIcon className="h-5 w-5 text-gray-500" />
									</div>
									<div>Modern Portfolio Theory</div>
								</div>
								<div>2:45</div>
							</div>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>
		</div>
	);
};

const tabs = [
	{ name: "Description", href: "#", current: true },
	{ name: "Resources", href: "#", current: false },
];

const CourseTabs = () => {
	return (
		<div>
			<div className="sm:hidden">
				<label htmlFor="tabs" className="sr-only">
					Select a tab
				</label>

				<select
					id="tabs"
					name="tabs"
					className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
					defaultValue={tabs.find((tab) => tab.current).name}
				>
					{tabs.map((tab) => (
						<option key={tab.name}>{tab.name}</option>
					))}
				</select>
			</div>
			<div className="hidden sm:block">
				<div className="border-b border-gray-200">
					<nav className="-mb-px flex space-x-8" aria-label="Tabs">
						{tabs.map((tab) => (
							<a
								key={tab.name}
								href={tab.href}
								className={classNames(
									tab.current
										? "border-blue-500 text-blue-600"
										: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
									"whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
								)}
								aria-current={tab.current ? "page" : undefined}
							>
								{tab.name}
							</a>
						))}
					</nav>
				</div>
			</div>
		</div>
	);
};

const CourseDescription = () => {
	return (
		<div className="w-full text-base leading-7 text-gray-700 px-3 my-4">
			<div className="mt-10 max-w-2xl">
				<p className="mt-8">
					Et vitae blandit facilisi magna lacus commodo. Vitae sapien
					duis odio id et. Id blandit molestie auctor fermentum
					dignissim. Lacus diam tincidunt ac cursus in vel. Mauris
					varius vulputate et ultrices hac adipiscing egestas. Iaculis
					convallis ac tempor et ut. Ac lorem vel integer orci.
				</p>
				<h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">
					From beginner to expert in 3 hours
				</h2>
				<p className="mt-6">
					Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam
					consequat in. Convallis arcu ipsum urna nibh. Pharetra,
					euismod vitae interdum mauris enim, consequat vulputate
					nibh. Maecenas pellentesque id sed tellus mauris, ultrices
					mauris. Tincidunt enim cursus ridiculus mi. Pellentesque nam
					sed nullam sed diam turpis ipsum eu a sed convallis diam.
				</p>
				<figure className="mt-10 border-l border-blue-600 pl-9">
					<blockquote className="font-semibold text-gray-900">
						<p>
							“Vel ultricies morbi odio facilisi ultrices accumsan
							donec lacus purus. Lectus nibh ullamcorper ac dictum
							justo in euismod. Risus aenean ut elit massa. In
							amet aliquet eget cras. Sem volutpat enim
							tristique.”
						</p>
					</blockquote>
					<figcaption className="mt-6 flex gap-x-4">
						<img
							className="h-6 w-6 flex-none rounded-full bg-gray-50"
							src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
							alt=""
						/>
						<div className="text-sm leading-6">
							<strong className="font-semibold text-gray-900">
								Maria Hill
							</strong>{" "}
							– Marketing Manager
						</div>
					</figcaption>
				</figure>
				<p className="mt-10">
					Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget
					risus enim. Mattis mauris semper sed amet vitae sed turpis
					id. Id dolor praesent donec est. Odio penatibus risus
					viverra tellus varius sit neque erat velit.
				</p>
			</div>
		</div>
	);
};

export default function Course() {
	return (
		<div className="flex flex-row w-full h-full p-5 overflow-hiddens space-x-3 overflow-hidden">
			<div className="flex flex-col w-[70%] h-full rounded px-5  overflow-scroll scrollbar-none">
				<div className="flex flex-col w-full h-fit bg-white rounded px-5">
					<div className="flex flex-row justify-between items-center border-b border-gray-200 bg-white py-4 sticky top-0 z-10">
						<h3 className="text-base font-semibold leading-6 text-gray-900 my-2">
							Modern Portfolio Theory
						</h3>
						<div className="flex flex-row items-center space-x-3">
							<div className="cursor-pointer">
								<BackwardIcon className="h-5 w-5 text-gray-400" />
							</div>
							<div className="flex flex-col items-center justify-center rounded-full bg-gray-100 p-2 cursor-pointer">
								<PlayIcon className="h-5 w-5 text-gray-400" />
							</div>
							<div className="cursor-pointer">
								<ForwardIcon className="h-5 w-5 text-gray-400" />
							</div>
						</div>
					</div>

					<div className="flex flex-col w-full scrollbar-none">
						<div className="relative pb-[56.25%] h-0 overflow-hidden">
							<iframe
								className="absolute top-0 left-0 w-full h-full rounded"
								src="https://www.youtube.com/embed/ufLZpuiMNh0"
								title="YouTube video player"
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowFullScreen={true}
							></iframe>
						</div>
					</div>

					<div className="flex flex-col w-full mt-4 sticky top-[60px] z-10 bg-white">
						<CourseTabs />
					</div>

					<div className="">
						<CourseDescription />
						<CourseDescription />
					</div>
				</div>
			</div>
			<div className="flex flex-col w-[30%]">
				<div className="flex flex-col bg-white border rounded overflow-scroll scrollbar-none">
					<div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 sticky top-0 z-10">
						<h3 className="text-base font-semibold leading-6 text-gray-900 my-2">
							Portfolio Manager
						</h3>

						<div className="flex flex-col w-full space-y-5">
							<p className="mt-1 text-sm text-gray-500">
								Deep dive into the portfolio management process
								& earn your certification with new topics on the
								latest trends in ESG, active vs passive
								investing, and more!
							</p>

							<p className="mt-1 text-sm text-gray-500">
								New content – discover our expert interview with
								a wealth manager!
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
