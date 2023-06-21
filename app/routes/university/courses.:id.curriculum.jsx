import { FolderIcon, PlayIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import {
	DocumentIcon,
	ListBulletIcon,
	PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";
import { classNames } from "~/utils/helpers";
import { Disclosure } from "@headlessui/react";

const UniversityHeader = () => {
	return (
		<div className="px-5 mb-5">
			<div className="mx-auto max-w-2xl lg:mx-0">
				<h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
					Portfolio Manager
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

const CurriculumAccordion = () => {
	return (
		<div className="flex flex-col w-full rounded-2xl bg-white p-2 space-y-3 ">
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
							<Link
								to={`/university/courses/1`}
								className="flex flex-row w-full border p-2 rounded"
							>
								<div className="flex flex-row w-full space-x-2 items-center space-between cursor-pointer">
									<div>
										<PlayCircleIcon className="h-5 w-5 text-gray-500" />
									</div>
									<div>Modern Portfolio Theory</div>
								</div>
								<div>2:45</div>
							</Link>
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

export default function Courses() {
	return (
		<div className="flex flex-row w-full h-full p-5 overflow-hiddens space-x-3 overflow-hidden">
			<div className="flex flex-col w-[70%] h-full rounded px-5  overflow-scroll scrollbar-none">
				<UniversityHeader />
				<div className="flex flex-col w-full h-fit bg-white rounded pt-5">
					<CurriculumAccordion />
				</div>
			</div>
			<div className="flex flex-col w-[30%]">
				<div className="flex flex-col bg-white border rounded overflow-scroll scrollbar-none">
					<div className="p-3">
						<img
							src="https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80"
							className="w-full rounded"
						/>
					</div>

					<div className="border-gray-200 bg-white px-6 border-b pb-5">
						<div className="flex flex-col w-full">
							<div className="flex flex-row w-full justify-between my-2 text-sm text-gray-400">
								<div>45%</div>
								<div>4/20 lessons</div>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
								<div className="bg-blue-600 h-2.5 rounded-full w-[45%]"></div>
							</div>
						</div>
					</div>

					<div className="flex flex-col w-full h-[90px] px-5 justify-center">
						<div className="flex flex-col w-full py-4 items-center justify-center bg-blue-600 text-white rounded cursor-pointer">
							Resume
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
