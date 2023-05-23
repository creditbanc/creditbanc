import { useLoaderData, useLocation, useSubmit } from "@remix-run/react";

export default function UpgradeCard() {
	const loader_data = useLoaderData();
	const location = useLocation();
	const submit = useSubmit();

	const onUpdateReport = (e) => {
		e.preventDefault();

		submit(
			{ ...loader_data, redirect_to: location.pathname },
			{
				method: "post",
				action: "/credit/report/business",
			}
		);
	};

	return (
		<div className="bg-white border shadow sm:rounded-lg mx-2 mt-5">
			<div className="px-4 py-5 sm:p-6">
				<div className="sm:flex sm:items-start sm:justify-between">
					<div>
						<h3 className="text-base font-semibold leading-6 text-gray-900">
							Download the full report
						</h3>
						<div className="mt-2 max-w-xl text-sm text-gray-500">
							<p>
								Click to download the full report and to see all
								the details.
							</p>
						</div>
					</div>
					<div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center cursor-pointer">
						<div
							onClick={onUpdateReport}
							type="button"
							className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Download Report
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
