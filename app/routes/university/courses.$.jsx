import { FolderIcon, PlayIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { DocumentIcon, ListBulletIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "@remix-run/react";
import { Disclosure } from "@headlessui/react";
import { course as curriculum } from "./data";
import { pipe, map, prop } from "ramda";
import { classNames, get, get_entity_id, get_group_id } from "~/utils/helpers";

const UniversityHeader = () => {
	return (
		<div className="px-5 mb-5">
			<div className="mx-auto max-w-2xl lg:mx-0">
				<p className="text-base font-semibold leading-7 text-blue-600">Online Finance Courses</p>
				<h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
					Credit Banc University
				</h2>
				<p className="mt-6 text-lg leading-8 text-gray-600">
					Gain instant access to a library of online finance courses utilized by top global banks and
					financial institutions. Develop a comprehensive understanding of practical skills to enhance your
					career or excel in interviews, whether you’re an intern, analyst or associate.
				</p>
			</div>
		</div>
	);
};

const HeaderFilters = () => {
	return (
		<div className="flex flex-col w-full py-5 bg-white z-10">
			<div className="flex flex-row w-full items-center text-xs ">
				<div className="flex flex-row w-full  space-x-3">
					<div className="mt-1">
						<div className="text-gray-400">Show</div>
					</div>
					<div className="flex flex-row w-full flex-wrap gap-y-3">
						<div
							className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[50px] mr-3"
							// onClick={onShowAllFiles}
						>
							All
						</div>
						<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[50px] mr-3">
							Credit
						</div>
						<div
							className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[100px] mr-3"
							// onClick={() => onFilterFiles("1040")}
						>
							Accounting
						</div>
						<div
							className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[100px] mr-3"
							// onClick={() => onFilterFiles("1065")}
						>
							Asset Management
						</div>
						<div
							className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[100px] mr-3"
							// onClick={() => onFilterFiles("1099")}
						>
							Corporate Finance
						</div>
						{/* <div
							className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[100px] mr-3"
							// onClick={() => onFilterFiles("1120")}
						>
							Financial Statement Analysis
						</div> */}
						{/* <div
							className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[100px] mr-3"
							// onClick={() => onFilterFiles("W-2")}
						>
							Financial Modeling
						</div> */}
						<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[50px] mr-3">
							Mergers & Acquisitions
						</div>
						<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[50px] mr-3">
							Private Equity
						</div>
						{/* <div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[50px] mr-3">
							Valuation
						</div> */}
					</div>
				</div>
			</div>
		</div>
	);
};

const posts = [
	{
		id: 1,
		title: "Credit Builder",
		href: `/university/creditbuilder/1`,
		description: "",
		imageUrl:
			"https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80",
		date: "Nov 1, 2023",
		datetime: "2023-11-01",
		category: { title: "Credit", href: "#" },
		author: {
			name: "Credit Banc University",
			// role: "Co-Founder / CTO",
			// href: "#",
			// imageUrl: "http://creditbanc.io/images/logos/cb_logo_3.png",
		},
	},
	// {
	// 	id: 1,
	// 	title: "Boost your conversion rate",
	// 	href: "#",
	// 	description:
	// 		"Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
	// 	imageUrl:
	// 		"https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80",
	// 	date: "Mar 16, 2020",
	// 	datetime: "2020-03-16",
	// 	category: { title: "Marketing", href: "#" },
	// 	author: {
	// 		name: "Michael Foster",
	// 		role: "Co-Founder / CTO",
	// 		href: "#",
	// 		imageUrl:
	// 			"https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	// 	},
	// },
	// {
	// 	id: 1,
	// 	title: "Boost your conversion rate",
	// 	href: "#",
	// 	description:
	// 		"Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
	// 	imageUrl:
	// 		"https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80",
	// 	date: "Mar 16, 2020",
	// 	datetime: "2020-03-16",
	// 	category: { title: "Marketing", href: "#" },
	// 	author: {
	// 		name: "Michael Foster",
	// 		role: "Co-Founder / CTO",
	// 		href: "#",
	// 		imageUrl:
	// 			"https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	// 	},
	// },
	// {
	// 	id: 1,
	// 	title: "Boost your conversion rate",
	// 	href: "#",
	// 	description:
	// 		"Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
	// 	imageUrl:
	// 		"https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80",
	// 	date: "Mar 16, 2020",
	// 	datetime: "2020-03-16",
	// 	category: { title: "Marketing", href: "#" },
	// 	author: {
	// 		name: "Michael Foster",
	// 		role: "Co-Founder / CTO",
	// 		href: "#",
	// 		imageUrl:
	// 			"https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	// 	},
	// },
];

const Accounts = () => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	return (
		<div className="mx-auto  grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
			{posts.map((post) => (
				<article key={post.id} className="flex flex-col items-start justify-between">
					<div className="relative w-full">
						<img
							src={post.imageUrl}
							className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
						/>
						<div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
					</div>

					<div className="flex flex-col w-full my-3">
						<Link
							to={`/university/course/curriculum/1`}
							className="flex flex-row w-full py-2 border border-gray-600 text-gray-600 rounded-lg justify-center items-center cursor-pointer gap-x-3"
						>
							<div>
								<ListBulletIcon className="h-5 w-5 text-white" />
							</div>
							<div className="flex flex-col">Course Details</div>
						</Link>
					</div>
					<div className="max-w-xl">
						<div className="mt-2 flex items-center gap-x-4 text-xs">
							<time dateTime={post.datetime} className="text-gray-500">
								{post.date}
							</time>
							<a
								href={post.category.href}
								className="relative z-5 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
							>
								{post.category.title}
							</a>
						</div>
						<div className="group relative">
							<h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
								<a href={post.href}>
									<span className="absolute inset-0" />
									{post.title}
								</a>
							</h3>
							<p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post.description}</p>
						</div>

						{/* <div className="my-2 flex flex-col w-full">
							<div className="flex flex-row w-full justify-between my-2 text-sm text-gray-400">
								<div>45%</div>
								<div>4/20 lessons</div>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
								<div className="bg-blue-600 h-2.5 rounded-full w-[45%]"></div>
							</div>
						</div> */}

						<div className="relative mt-6 flex items-center gap-x-4">
							{/* <img src={post.author.imageUrl} className="h-10 w-10 rounded-full bg-gray-100" /> */}
							<div className="text-sm leading-6">
								<p className="font-semibold text-gray-900">
									<a href={post.author.href}>
										<span className="absolute inset-0" />
										{post.author.name}
									</a>
								</p>
								<p className="text-gray-600">{post?.author?.role}</p>
							</div>
						</div>
					</div>
				</article>
			))}
		</div>
	);
};

const CurriculumAccordion = ({ sections = [] }) => {
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);

	return (
		<div className="flex flex-col w-full rounded-2xl bg-white p-2 space-y-3 ">
			{pipe(
				get("sections"),
				map((section) => (
					<Disclosure defaultOpen={true}>
						{({ open }) => (
							<>
								<Disclosure.Button className="flex w-full justify-between rounded-lg  px-4 py-2 text-left text-sm font-medium   focus:outline-none focus-visible:ring  focus-visible:ring-opacity-75">
									<span>{section?.title}</span>
									<ChevronUpIcon
										className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-gray-500`}
									/>
								</Disclosure.Button>
								<Disclosure.Panel className="px-4  pb-2 text-gray-500 space-y-3 text-sm">
									{pipe(
										map((resource) => (
											<Link
												to={`${resource.href}/resource/e/${entity_id}/g/${group_id}/f/${resource.id}`}
												className="flex flex-row w-full border p-2 rounded"
											>
												<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
													<div>
														{resource.type == "video" && (
															<PlayCircleIcon className="h-5 w-5 text-gray-500" />
														)}
														{resource.type !== "video" && (
															<DocumentIcon className="h-4 w-4 text-gray-500" />
														)}
													</div>
													<div>{resource?.title}</div>
												</div>
												<div>{resource?.duration}</div>
											</Link>
										))
									)(section?.resources)}
								</Disclosure.Panel>
							</>
						)}
					</Disclosure>
				))
			)(curriculum)}
		</div>
	);
};

export default function Courses() {
	return (
		<div className="flex flex-row w-full h-full overflow-hiddens gap-x-5 overflow-hidden">
			<div className="hidden lg:flex flex-col w-[30%]">
				<div className="flex flex-col bg-white border rounded overflow-scroll scrollbar-none">
					<div className="p-3">
						<img
							src="https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80"
							className="w-full rounded"
						/>
					</div>

					<div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 sticky top-0 z-10">
						<h3 className="text-base font-semibold leading-6 text-gray-900 my-2">Credit Builder</h3>

						{/* <div className="flex flex-col w-full space-y-5">
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
						</div> */}
					</div>

					<div className="flex flex-col w-full my-3">
						<CurriculumAccordion />
					</div>
				</div>
			</div>
			<div className="flex flex-col w-full lg:w-[70%] h-full rounded overflow-scroll scrollbar-none">
				<UniversityHeader />
				<div className="flex flex-col w-full h-fit bg-white rounded px-5 pt-5">
					<div className="border-b border-gray-200 pb-3 flex flex-col sticky top-0 bg-white z-10">
						<div>
							<h3 className="mt-2 text-base font-semibold leading-6 text-gray-900">Courses</h3>
						</div>
						<div>
							<HeaderFilters />
						</div>
					</div>

					<div className="flex flex-col w-full py-5 scrollbar-none">
						<Accounts />
					</div>
				</div>
			</div>
		</div>
	);
}
