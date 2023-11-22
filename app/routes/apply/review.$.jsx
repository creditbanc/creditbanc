import { redirect } from "@remix-run/node";
import { head, isEmpty, pipe } from "ramda";
import { from, lastValueFrom } from "rxjs";
import { filter } from "shades";
import { get_session_entity_id } from "~/utils/auth.server";
import { get_doc } from "~/utils/firebase";
import { get, get_group_id } from "~/utils/helpers";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	// let group_id = get_group_id(url.pathname);

	let application = await lastValueFrom(from(get_doc(["application", entity_id])));

	return { application };
};

const Header = () => {
	return (
		<div className="mx-auto max-w-2xl text-center">
			<h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Review Loan Application</h2>
			<p className="mt-6 text-lg leading-8 text-gray-600">
				Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
				fugiat veniam occaecat fugiat aliqua.
			</p>
		</div>
	);
};

const BusinessInfo = () => {
	let { application } = useLoaderData();

	console.log("application");
	console.log(application);

	return (
		<div>
			<div className="px-4 sm:px-0">
				<h3 className="text-base font-semibold leading-7 text-gray-900">Business Information</h3>
				<p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>
			</div>
			<div className="mt-6 border-t border-gray-100">
				<div className="flex flex-col  divide-y divide-gray-100">
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Business Legal Name</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.legal_name}</dd>
						</div>
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Business DBA Name</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.dba}</dd>
						</div>
					</div>
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Address</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_address?.street}
							</dd>
						</div>
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">City</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_address?.city}
							</dd>
						</div>
					</div>
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Phone Number</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.phone}</dd>
						</div>
						<div className="py-6 w-1/4">
							<dt className="text-sm font-medium leading-6 text-gray-900">State</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_address?.state}
							</dd>
						</div>
						<div className="py-6 w-1/4">
							<dt className="text-sm font-medium leading-6 text-gray-900">Zip</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_address?.zip}
							</dd>
						</div>
					</div>
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Legal Entity</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_entity}
							</dd>
						</div>
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Federal Tax ID (EIN)</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.ein}</dd>
						</div>
					</div>
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Merchant Type</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.industry}</dd>
						</div>
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Business Start Date</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{`${application?.month}-${application?.day}-${application?.year}`}</dd>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const FinancialInfo = () => {
	let { application } = useLoaderData();

	console.log("application");
	console.log(application);

	return (
		<div>
			<div className="px-4 sm:px-0">
				<h3 className="text-base font-semibold leading-7 text-gray-900">Financial Information</h3>
				<p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>
			</div>
			<div className="mt-6 border-t border-gray-100">
				<div className="flex flex-col  divide-y divide-gray-100">
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Business Legal Name</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.legal_name}</dd>
						</div>
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Business DBA Name</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.dba}</dd>
						</div>
					</div>
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Address</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_address?.street}
							</dd>
						</div>
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">City</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_address?.city}
							</dd>
						</div>
					</div>
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Phone Number</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.phone}</dd>
						</div>
						<div className="py-6 w-1/4">
							<dt className="text-sm font-medium leading-6 text-gray-900">State</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_address?.state}
							</dd>
						</div>
						<div className="py-6 w-1/4">
							<dt className="text-sm font-medium leading-6 text-gray-900">Zip</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_address?.zip}
							</dd>
						</div>
					</div>
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Legal Entity</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_entity}
							</dd>
						</div>
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Federal Tax ID (EIN)</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.ein}</dd>
						</div>
					</div>
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Merchant Type</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.industry}</dd>
						</div>
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Business Start Date</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{`${application?.month}-${application?.day}-${application?.year}`}</dd>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function Review() {
	return (
		<div className="flex flex-col w-full h-full overflow-y-scroll items-center">
			<div className="flex flex-col w-[1200px] my-10">
				<div>
					<Header />
				</div>
				<div className="flex flex-col w-full mt-10 gap-y-8">
					<div className="flex flex-col w-full border rounded p-10 ">
						<BusinessInfo />
					</div>
					<div className="flex flex-col w-full border rounded p-10 ">
						<FinancialInfo />
					</div>
				</div>
			</div>
		</div>
	);
}
