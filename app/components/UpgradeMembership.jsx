import { Link } from "@remix-run/react";

export default function UpgradeBanner() {
	return (
		<div className="bg-white border shadow sm:rounded-lg mx-2 mt-5">
			<div className="px-4 py-5 sm:p-6">
				<div className="sm:flex sm:items-start sm:justify-between">
					<div>
						<h3 className="text-base font-semibold leading-6 text-gray-900">
							Manage subscription
						</h3>
						<div className="mt-2 max-w-xl text-sm text-gray-500">
							<p>
								Unlock your full business credit reports and
								scores to help you build credit faster and open
								the door to better options for your business
							</p>
						</div>
					</div>
					<div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
						<Link
							to="/plans"
							type="button"
							className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Upgrade Plan
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
