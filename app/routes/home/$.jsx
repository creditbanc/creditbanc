import {
	ChevronRightIcon,
	PlayIcon,
	EllipsisVerticalIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

const profile = {
	name: "Ricardo Cooper",
	business_name: "Apple Inc.",
	email: "ricardo.cooper@example.com",
	avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
	backgroundImage:
		"https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
	fields: [
		["Phone", "(555) 123-4567"],
		["Email", "ricardocooper@example.com"],
		["Title", "Senior Front-End Developer"],
		["Team", "Product Development"],
		["Location", "San Francisco"],
		["Sits", "Oasis, 4th floor"],
		["Salary", "$145,000"],
		["Birthday", "June 8, 1990"],
	],
};

function Banner() {
	return (
		<div className="w-full mb-7">
			<div>
				<img
					className="h-32 w-full object-cover lg:h-48"
					src={profile.backgroundImage}
					alt=""
				/>
			</div>
			<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
				<div className="-mt-12 sm:-mt-16 flex flex-row sm:items-end sm:space-x-5">
					<div className="flex flex-col">
						<img
							className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
							src={profile.avatar}
							alt=""
						/>
					</div>
					<div className="mt-14 ml-5 flex flex-col">
						<h1 className="truncate text-2xl font-bold text-gray-900">
							{profile.name}s
						</h1>
						<div>{profile.business_name}</div>
					</div>
					{/* <div className="mt-6 hidden min-w-0 sm:flex sm:flex-col">
						<h1 className="truncate text-2xl font-bold text-gray-900">
							{profile.name}f
						</h1>
						<div>{profile.business_name}</div>
					</div> */}
				</div>
			</div>
		</div>
	);
}

function Heading() {
	return (
		<div className="border-b border-gray-200 pb-3">
			<div className="sm:flex sm:items-baseline sm:justify-between">
				<div className="sm:w-0 sm:flex-1">
					<h1
						id="message-heading"
						className="text-base font-semibold leading-6 text-gray-900"
					>
						Credit Banc University
					</h1>
					<p className="mt-1 truncate text-sm text-gray-500">
						Checkout and Payments Team
					</p>
				</div>

				<div className="mt-4 flex items-center justify-between sm:ml-6 sm:mt-0 sm:flex-shrink-0 sm:justify-start">
					<span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
						18 Videos
					</span>
				</div>
			</div>
		</div>
	);
}

const VideoCard = () => {
	return (
		<div className="border my-4 rounded flex flex-row">
			<div className="flex flex-col w-[150px] border-r h-auto">
				<div className="flex flex-col w-full h-full items-center justify-center">
					<div className="w-[30px] text-[#55CF9E]">
						<PlayIcon />
					</div>
				</div>
			</div>
			<div className="flex flex-col p-4 w-full h-full leading-6">
				<div className="flex flex-col font-semibold">Video Title</div>
				<div className="flex flex-col mt-1">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Etiam cursus enim sed rutrum dignissim. Proin vel tincidunt
					libero, sed pharetra neque. Proin molestie tincidunt neque
					sed hendrerit. Phasellus nec vulputate erat. Aliquam vitae
					nunc consectetur, varius ex sed, finibus ante.
				</div>
			</div>
		</div>
	);
};

const BusinessCredit = () => {
	return (
		<div className="flex flex-col border mx-2 shadow-sm rounded px-4">
			<div className="border-b border-gray-200">
				<h3 className="text-base font-semibold leading-6 text-gray-900 py-3">
					Business Credit
				</h3>
			</div>

			<div className="flex flex-col w-full py-3 border-b border-gray-200">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-2/3">
						<div className="font-semibold">Dun & Bradstreet ®</div>
						<div className="text-gray-400 text-sm">
							PAYDEX Score
						</div>
					</div>
					<div className="flex flex-col w-1/3 font-semibold text-blue-700 text-sm cursor-pointer items-end mr-2 justify-center">
						Upgrade Account
					</div>
				</div>
			</div>

			<div className="flex flex-col w-full py-3">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-2/3">
						<div className="font-semibold">Experian ®</div>
						<div className="text-gray-400 text-sm">
							Intelliscore
						</div>
					</div>
					<div className="flex flex-col w-1/3 font-semibold text-blue-700 text-sm cursor-pointer items-end mr-2 justify-center">
						Upgrade Account
					</div>
				</div>
			</div>
		</div>
	);
};

const PersonalCredit = () => {
	return (
		<div className="flex flex-col border mx-2 shadow-sm rounded px-4">
			<div className="border-b border-gray-200">
				<h3 className="text-base font-semibold leading-6 text-gray-900 py-3">
					Personal Credit
				</h3>
			</div>

			<div className="flex flex-col w-full py-3 border-b border-gray-200">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-2/3">
						<div className="font-semibold">Experian Personal ®</div>
						<div className="text-gray-400 text-sm">
							VantageScore® 3.0
						</div>
					</div>

					<div className="flex flex-col w-1/3 text-2xl font-bold justify-center">
						<div className="flex flex-row w-full justify-end items-center">
							<div className="flex flex-col">800</div>
							<div className="flex flex-col w-[30px] cursor-pointer">
								<ChevronRightIcon />
							</div>
						</div>
					</div>

					{/* <div className="flex flex-col w-1/3 font-semibold text-blue-700 text-sm cursor-pointer">
					Upgrade Account
				</div> */}
				</div>
			</div>

			<div className="flex flex-col w-full py-3 border-b border-gray-200">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-2/3">
						<div className="font-semibold">TransUnion ®</div>
						<div className="text-gray-400 text-sm">
							VantageScore® 3.0
						</div>
					</div>
					<div className="flex flex-col w-1/3 font-semibold text-blue-700 text-sm cursor-pointer items-end mr-2 justify-center">
						Upgrade Account
					</div>
				</div>
			</div>

			<div className="flex flex-col w-full py-3">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-2/3">
						<div className="font-semibold">Equifax ®</div>
						<div className="text-gray-400 text-sm">
							VantageScore® 3.0
						</div>
					</div>
					<div className="flex flex-col w-1/3 font-semibold text-blue-700 text-sm cursor-pointer items-end mr-2 justify-center">
						Upgrade Account
					</div>
				</div>
			</div>
		</div>
	);
};

const HeadingTwo = () => {
	return (
		<div className="flex flex-col w-full px-3 mt-3 mb-6">
			<div className="mx-auto flex items-center justify-between gap-x-8 lg:mx-0">
				<div className="flex items-center gap-x-6">
					<img
						src="https://tailwindui.com/img/logos/48x48/tuple.svg"
						alt=""
						className="h-16 w-16 flex-none rounded-full ring-1 ring-gray-900/10"
					/>
					<h1>
						<div className="text-sm leading-6 text-gray-500">
							Invoice{" "}
							<span className="text-gray-700">#00011</span>
						</div>
						<div className="mt-1 text-base font-semibold leading-6 text-gray-900">
							Tuple, Inc
						</div>
					</h1>
				</div>
			</div>
		</div>
	);
};

export default function Home() {
	return (
		<div className="w-full h-full flex flex-col items-center mb-3 p-5">
			<HeadingTwo />
			<div className="flex flex-col h-full max-w-7xl">
				<div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0">
					<div className="flex flex-col w-full">
						<BusinessCredit />
					</div>
					<div className="flex flex-col w-full">
						<PersonalCredit />
					</div>
				</div>

				<div className="flex flex-col  h-full px-2 mt-8">
					<Heading />
					<div className="my-1">
						<VideoCard />
						<VideoCard />
						<VideoCard />
					</div>
				</div>
			</div>
		</div>
	);
}
