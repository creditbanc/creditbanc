import { useLoaderData, useLocation, useSubmit } from "@remix-run/react";
import axios from "axios";

const create_form_from_object = (payload) => {
	let data = new FormData();

	for (let key in payload) {
		data.append(key, payload[key]);
	}

	return data;
};

export default function UpdatePersonalReport() {
	const loader_data = useLoaderData();
	const location = useLocation();
	const submit = useSubmit();

	let { report } = loader_data;
	let { id: report_id } = report;

	console.log("UpdatePersonalReport");
	console.log(loader_data);

	const onUpdateReport = async (e) => {
		e.preventDefault();

		let payload = JSON.stringify({
			report_id,
			redirect_to: location.pathname,
		});

		var options = {
			method: "post",
			maxBodyLength: Infinity,
			url: "/credit/personal/update",
			data: create_form_from_object({ payload }),
			headers: { "Content-Type": "multipart/form-data" },
		};

		let response = await axios(options);
	};

	return (
		<div className="bg-white border shadow sm:rounded-lg mx-2 mt-5">
			<div className="px-4 py-5 sm:p-6">
				<div className="sm:flex sm:items-start sm:justify-between">
					<div>
						<h3 className="text-base font-semibold leading-6 text-gray-900">
							Update available
						</h3>
						<div className="mt-2 max-w-xl text-sm text-gray-500">
							<p>
								Click update report to download the latest
								version
							</p>
						</div>
					</div>
					<div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center cursor-pointer">
						<div
							onClick={onUpdateReport}
							type="button"
							className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Update Report
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
