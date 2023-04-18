import {
	EnvelopeIcon,
	PhoneIcon,
	ChevronRightIcon,
} from "@heroicons/react/20/solid";

const profile = {
	name: "Ricardo Cooper",
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
				<div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
					<div className="flex">
						<img
							className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
							src={profile.avatar}
							alt=""
						/>
					</div>
					<div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
						<div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
							<h1 className="truncate text-2xl font-bold text-gray-900">
								{profile.name}
							</h1>
						</div>
					</div>
				</div>
				<div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
					<h1 className="truncate text-2xl font-bold text-gray-900">
						{profile.name}
					</h1>
				</div>
			</div>
		</div>
	);
}

export default function Home() {
	return (
		<div className="w-full h-full flex flex-col items-center mb-3">
			<Banner />
			<div className="flex flex-col w-[64rem] h-full">
				<div className="flex flex-row w-full">
					<div className="flex flex-col w-1/2 border mx-2 shadow-sm rounded px-4">
						<div className="border-b border-gray-200">
							<h3 className="text-base font-semibold leading-6 text-gray-900 py-3">
								Business Credit
							</h3>
						</div>

						<div className="flex flex-col w-full py-3 border-b border-gray-200">
							<div className="flex flex-row w-full">
								<div className="flex flex-col w-2/3">
									<div className="font-semibold">
										Dun & Bradstreet ®
									</div>
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
									<div className="font-semibold">
										Experian ®
									</div>
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
					<div className="flex flex-col w-1/2 border mx-2 shadow-sm rounded px-4">
						<div className="border-b border-gray-200">
							<h3 className="text-base font-semibold leading-6 text-gray-900 py-3">
								Personal Credit
							</h3>
						</div>

						<div className="flex flex-col w-full py-3 border-b border-gray-200">
							<div className="flex flex-row w-full">
								<div className="flex flex-col w-2/3">
									<div className="font-semibold">
										Experian Personal ®
									</div>
									<div className="text-gray-400 text-sm">
										VantageScore® 3.0
									</div>
								</div>

								<div className="flex flex-col w-1/3 text-2xl font-bold justify-center">
									<div className="flex flex-row w-full items-center justify-between">
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
									<div className="font-semibold">
										TransUnion ®
									</div>
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
									<div className="font-semibold">
										Equifax ®
									</div>
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
				</div>
			</div>
		</div>
	);
}