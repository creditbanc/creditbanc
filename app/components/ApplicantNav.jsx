import { Link } from "@remix-run/react";

const cb_logo = "/images/logos/cb_logo_3.png";

export default function Nav() {
	return (
		<div className="flex flex-col w-full border-b h-[65px] justify-center px-5">
			<div className="flex flex-row justify-between">
				<div className="flex flex-col justify-center">
					<Link to={"/"}>
						<img
							src={cb_logo}
							className="hidden sm:block h-5 w-auto"
						/>
					</Link>
				</div>
				<div className="flex flex-col sm:-ml-[150px]">
					<div
						type="button"
						className="text-blue-700 border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800 flex flex-row items-center justify-center cursor-pointer"
						// onClick={onModalToggle}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-5 h-5 mr-2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
							/>
						</svg>
						<div>Send To Applicant</div>
					</div>
				</div>
				<div></div>
			</div>
		</div>
	);
}
