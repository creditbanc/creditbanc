import { FolderIcon, PlayIcon } from "@heroicons/react/20/solid";
import { ListBulletIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";
import { classNames } from "~/utils/helpers";

const Members = () => {
	return (
		<div className="flex -space-x-2 overflow-hidden">
			<img
				className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
				src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt=""
			/>
			<img
				className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
				src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt=""
			/>
			<img
				className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
				src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
				alt=""
			/>
			<img
				className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
				src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt=""
			/>
		</div>
	);
};

const Account = ({ img_src }) => {
	return (
		<div
			className="flex flex-col w-full lg:min-w-[47%] lg:max-w-[47%] xl:min-w-[30%] xl:max-w-[30%] justify-between rounded-lg border cursor-pointer relative"
			onClick={() => console.log("single cick")}
			onDoubleClick={() => console.log("double click")}
		>
			<div className="flex flex-col w-full rounded-t items-center h-[150px] overflow-hidden">
				<div className="flex flex-col items-center justify-center -mt-[50px] h-full absolute overflow-hidden">
					<PlayIcon className="h-10 w-10 text-white" />
				</div>
				<div className="flex flex-col w-[130%]">
					<img src={img_src} className="" />
				</div>
			</div>
			<div className="flex flex-col flex-1 px-3">
				<div className="flex flex-col flex-1 py-2">
					<div className="flex flex-col text-gray-400">
						Portfolio Manager
					</div>
					<div className="flex flex-col text-sm">
						Deep dive into the portfolio management process & earn
						your certification with new topics on the latest trends
						in ESG, active vs passive investing, and more!
					</div>
				</div>
				<div className="flex flex-col w-full h-[55px] justify-center">
					<div className="flex flex-row w-full py-2 bg-blue-600 rounded text-white justify-center items-center cursor-pointer gap-x-3">
						<div>
							<ListBulletIcon className="h-5 w-5 text-white" />
						</div>
						<div className="flex flex-col">Course Details</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const UniversityHeader = () => {
	return (
		<div className="px-5 mb-5">
			<div className="mx-auto max-w-2xl lg:mx-0">
				<p className="text-base font-semibold leading-7 text-blue-600">
					Online Finance Courses
				</p>
				<h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
					Credit Banc University
				</h2>
				<p className="mt-6 text-lg leading-8 text-gray-600">
					Gain instant access to a library of online finance courses
					utilized by top global banks and financial institutions.
					Develop a comprehensive understanding of practical skills to
					enhance your career or excel in interviews, whether you’re
					an intern, analyst or associate.
				</p>
			</div>
		</div>
	);
};

const HeaderFilters = () => {
	// let files = useFilesStore((state) => state.files);
	// let set_files = useFilesStore((state) => state.set_files);

	const onFilterFiles = (tag_id) => {
		// set_files(
		// 	["files"],
		// 	pipe(
		// 		mod(all, "visible")(() => true),
		// 		mod(matching({ tags: pipe(filter({ id: tag_id }), isEmpty) }))(
		// 			(value) => ({ ...value, visible: false })
		// 		)
		// 	)(files)
		// );
	};

	const onShowAllFiles = () => {
		// set_files(["files"], pipe(mod(all, "visible")(() => true))(files));
	};

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
							onClick={onShowAllFiles}
						>
							All
						</div>
						<div
							className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[100px] mr-3"
							onClick={() => onFilterFiles("1040")}
						>
							Form 1040
						</div>
						<div
							className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[100px] mr-3"
							onClick={() => onFilterFiles("1065")}
						>
							Form 1065
						</div>
						<div
							className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[100px] mr-3"
							onClick={() => onFilterFiles("1099")}
						>
							Form 1099
						</div>
						<div
							className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[100px] mr-3"
							onClick={() => onFilterFiles("1120")}
						>
							Form 1120
						</div>
						<div
							className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[100px] mr-3"
							onClick={() => onFilterFiles("W-2")}
						>
							Form W-2
						</div>
						<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[50px] mr-3">
							2021
						</div>
						<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[50px] mr-3">
							2022
						</div>
						<div className="flex flex-col px-3 py-1 border rounded-full text-gray-500 bg-gray-50 cursor-pointer text-center min-w-[50px] mr-3">
							2023
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const posts = [
	{
		id: 1,
		title: "Boost your conversion rate",
		href: "#",
		description:
			"Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
		imageUrl:
			"https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80",
		date: "Mar 16, 2020",
		datetime: "2020-03-16",
		category: { title: "Marketing", href: "#" },
		author: {
			name: "Michael Foster",
			role: "Co-Founder / CTO",
			href: "#",
			imageUrl:
				"https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
	},
	{
		id: 1,
		title: "Boost your conversion rate",
		href: "#",
		description:
			"Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
		imageUrl:
			"https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80",
		date: "Mar 16, 2020",
		datetime: "2020-03-16",
		category: { title: "Marketing", href: "#" },
		author: {
			name: "Michael Foster",
			role: "Co-Founder / CTO",
			href: "#",
			imageUrl:
				"https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
	},
	{
		id: 1,
		title: "Boost your conversion rate",
		href: "#",
		description:
			"Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
		imageUrl:
			"https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80",
		date: "Mar 16, 2020",
		datetime: "2020-03-16",
		category: { title: "Marketing", href: "#" },
		author: {
			name: "Michael Foster",
			role: "Co-Founder / CTO",
			href: "#",
			imageUrl:
				"https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
	},
	{
		id: 1,
		title: "Boost your conversion rate",
		href: "#",
		description:
			"Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
		imageUrl:
			"https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80",
		date: "Mar 16, 2020",
		datetime: "2020-03-16",
		category: { title: "Marketing", href: "#" },
		author: {
			name: "Michael Foster",
			role: "Co-Founder / CTO",
			href: "#",
			imageUrl:
				"https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
		},
	},
];

const Accounts = () => {
	return (
		<div className="mx-auto  grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
			{posts.map((post) => (
				<article
					key={post.id}
					className="flex flex-col items-start justify-between"
				>
					<div className="relative w-full">
						<img
							src={post.imageUrl}
							alt=""
							className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
						/>
						<div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
					</div>
					<div className="flex flex-col w-full my-3">
						<div className="flex flex-row w-full py-2 border border-gray-600 text-gray-600 rounded-lg justify-center items-center cursor-pointer gap-x-3">
							<div>
								<ListBulletIcon className="h-5 w-5 text-white" />
							</div>
							<div className="flex flex-col">Course Details</div>
						</div>
					</div>
					<div className="max-w-xl">
						<div className="mt-2 flex items-center gap-x-4 text-xs">
							<time
								dateTime={post.datetime}
								className="text-gray-500"
							>
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
							<p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
								{post.description}
							</p>
						</div>
						<div className="relative mt-8 flex items-center gap-x-4">
							<img
								src={post.author.imageUrl}
								alt=""
								className="h-10 w-10 rounded-full bg-gray-100"
							/>
							<div className="text-sm leading-6">
								<p className="font-semibold text-gray-900">
									<a href={post.author.href}>
										<span className="absolute inset-0" />
										{post.author.name}
									</a>
								</p>
								<p className="text-gray-600">
									{post.author.role}
								</p>
							</div>
						</div>
					</div>
				</article>
			))}
		</div>
	);
};

export default function Courses() {
	return (
		<div className="flex flex-row w-full h-full p-5 overflow-hiddens space-x-3 overflow-hidden">
			<div className="flex flex-col w-[70%] h-full rounded px-5  overflow-scroll scrollbar-none">
				<UniversityHeader />
				<div className="flex flex-col w-full h-fit bg-white rounded px-5 pt-5">
					<div className="border-b border-gray-200 pb-3 flex flex-col sticky top-0 bg-white z-10">
						<div>
							<h3 className="mt-2 text-base font-semibold leading-6 text-gray-900">
								Courses
							</h3>
						</div>
						<div>
							<HeaderFilters />
						</div>
					</div>

					<div className="flex flex-col w-full py-5 scrollbar-none">
						<Accounts />

						{/* <div className="flex flex-row w-full items-center flex-wrap gap-y-10 justify-between gap-x-5">
							<Account
								img_src={
									"https://i.insider.com/5e0a2283855cc25cc63f2066"
								}
							/>
							<Account
								img_src={
									"https://image.cnbcfm.com/api/v1/image/107236898-1683383558883-1683383202227-WarrenBuffettsopeningstatementat2023BerkshireHathawayannualmeeting.jpg?v=1683383580"
								}
							/>
							<Account
								img_src={
									"https://image.cnbcfm.com/api/v1/image/107236898-1683383558883-1683383202227-WarrenBuffettsopeningstatementat2023BerkshireHathawayannualmeeting.jpg?v=1683383580"
								}
							/>
							<Account
								img_src={
									"https://image.cnbcfm.com/api/v1/image/107236898-1683383558883-1683383202227-WarrenBuffettsopeningstatementat2023BerkshireHathawayannualmeeting.jpg?v=1683383580"
								}
							/>
							<Account
								img_src={
									"https://image.cnbcfm.com/api/v1/image/107236898-1683383558883-1683383202227-WarrenBuffettsopeningstatementat2023BerkshireHathawayannualmeeting.jpg?v=1683383580"
								}
							/>
							<Account
								img_src={
									"https://image.cnbcfm.com/api/v1/image/107236898-1683383558883-1683383202227-WarrenBuffettsopeningstatementat2023BerkshireHathawayannualmeeting.jpg?v=1683383580"
								}
							/>
							<Account
								img_src={
									"https://image.cnbcfm.com/api/v1/image/107236898-1683383558883-1683383202227-WarrenBuffettsopeningstatementat2023BerkshireHathawayannualmeeting.jpg?v=1683383580"
								}
							/>
						</div> */}
					</div>
				</div>
			</div>
			<div className="flex flex-col w-[30%]">
				<div className="flex flex-col bg-white border rounded overflow-hidden">
					<div className="p-5">
						<div className="flex flex-row space-x-3 items-center">
							<div>
								<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
									<span className="text-lg font-medium leading-none text-white">
										C
									</span>
								</span>
							</div>
							<div>Credit Banc</div>
						</div>
					</div>

					<div></div>
				</div>
			</div>
		</div>
	);
}
