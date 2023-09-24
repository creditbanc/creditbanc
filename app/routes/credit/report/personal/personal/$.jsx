import { useLoaderData } from "@remix-run/react";
import { get_group_id } from "~/utils/helpers";
import { lastValueFrom } from "rxjs";
import { fold } from "~/utils/operators";
import PersonalReport from "~/api/client/PersonalReport";
import { cache } from "~/utils/helpers.server";
import { use_cache } from "~/components/CacheLink";
import { useEffect } from "react";

const log_route = `credit.report.personal.personal`;

const on_success = (response) => {
	console.log(`${log_route}.success`);
	return response;
};

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const loader = async ({ request }) => {
	let url = new URL(request.url);

	let cache_dependencies = [
		{
			name: "personal_credit_report",
			value: 1,
		},
	];

	let group_id = get_group_id(url.pathname);
	let report = new PersonalReport(group_id);
	let response = report.first_name.last_name.street.city.state.zip.dob.fold;
	let payload = await lastValueFrom(response.pipe(fold(on_success, on_error)));

	let with_cache = cache(request);
	return with_cache({ ...payload, cache_dependencies });
};

const PersonalInfoCard = () => {
	let { plan_id, first_name, last_name, street, city, state, zip, dob } = useLoaderData();

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
				<p className="mt-1 max-w-2xl text-sm text-gray-500">
					Below is your personal information as it appears in your credit file. This information includes your
					legal name, current and previous addresses, employment information and other details.
				</p>
			</div>
			<div className="border-t border-gray-200 px-4 py-1">
				<dl className="divide-y divide-gray-200">
					<div className="py-4 flex flex-col sm:flex-row sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500 w-[200px]">Name</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							{first_name} {last_name}
						</dd>
					</div>
					<div className="py-4 flex flex-col sm:flex-row sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500 w-[200px]">Date of birth</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{dob}</dd>
					</div>
					<div className="py-4 flex flex-col sm:flex-row sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500 w-[200px]">Address</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							<div className="flex flex-col">
								<div>{street}</div>
								<div className="flex flex-row space-x-1">
									<div>{city},</div>
									<div>{state}</div>
									<div>{zip}</div>
								</div>
							</div>
						</dd>
					</div>
				</dl>
			</div>
		</div>
	);
};

export default function Personal() {
	let { cache_dependencies } = useLoaderData();
	let use_cache_client = use_cache((state) => state.set_dependencies);

	useEffect(() => {
		if (cache_dependencies !== undefined) {
			use_cache_client({ path: `/credit/report/personal`, dependencies: cache_dependencies });
		}
	}, [cache_dependencies]);

	return (
		<div className="flex flex-col w-full">
			<PersonalInfoCard />
		</div>
	);
}
