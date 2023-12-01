import { redirect } from "@remix-run/node";
import { head, isEmpty, map, pipe, values } from "ramda";
import { from, lastValueFrom, map as rxmap } from "rxjs";
import { filter } from "shades";
import { get_session_entity_id } from "~/utils/auth.server";
import { get_doc, update_doc } from "~/utils/firebase";
import { capitalize, form_params, get, get_entity_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { Link, useLoaderData, useLocation, useSubmit } from "@remix-run/react";
import { navigation } from "./navigation";
import { useEffect, useState } from "react";
import useStore from "./store";
import moment from "moment";
import { unformat, formatMoney } from "accounting-js";

export const action = async ({ request }) => {
	console.log("request.url");
	console.log(request.url);
	let url = new URL(request.url);
	let { pathname } = url;
	let group_id = get_group_id(pathname);
	let entity_id = get_entity_id(pathname);
	let params = await form_params(request);

	console.log("params");
	console.log(params);
	console.log(group_id);
	console.log(entity_id);

	let step = pipe(filter({ id: "preview" }), head, get("step"))(navigation);
	let { signed_date } = params;
	let payload = { signed_date, step };

	let response = from(update_doc(["application", entity_id], payload)).pipe(rxmap(() => ({ entity_id, group_id })));

	await lastValueFrom(response);
	let next = pipe(filter({ id: "preview" }), head, get("next"))(navigation);

	return redirect(next({ entity_id, group_id }));
};

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	// let group_id = get_group_id(url.pathname);

	let application = await lastValueFrom(from(get_doc(["application", entity_id])));

	return { application };
};

const Header = () => {
	return (
		<div className="mx-auto text-center">
			<h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Preview of Loan Application</h2>
			{/* <p className="mt-6 text-lg leading-8 text-gray-600">
				Make sure that all the informatiion is accurate and correct
			</p> */}
		</div>
	);
};

const BusinessInfo = () => {
	let { application } = useLoaderData();

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
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{`${application?.business_start_date?.month}-${application?.business_start_date?.day}-${application?.business_start_date?.year}`}</dd>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const FinancialInfo = () => {
	let { application } = useLoaderData();

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
							<dt className="text-sm font-medium leading-6 text-gray-900">Amount Requested</dt>

							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{formatMoney(application?.loan_amount, { symbol: "$", precision: 0 })}
							</dd>
						</div>
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Reason</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.dba}</dd>
						</div>
					</div>
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Existing Cash Advance</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.loans?.value === true ? "Yes" : "No"}
							</dd>
						</div>
						{/* <div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Company</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_address?.city}
							</dd>
						</div> */}
					</div>
					{/* <div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Average Gross Monthly Sales</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.phone}</dd>
						</div>
						<div className="py-6 w-1/4">
							<dt className="text-sm font-medium leading-6 text-gray-900">Average Monthly Deposits</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_address?.state}
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
					</div> */}
				</div>
			</div>
		</div>
	);
};

const OwnerInfo = () => {
	let { application } = useLoaderData();

	return (
		<div>
			<div className="px-4 sm:px-0">
				<h3 className="text-base font-semibold leading-7 text-gray-900">Owners Information</h3>
				<p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>
			</div>
			<div className="mt-6 border-t border-gray-100">
				{pipe(
					values,
					mapIndexed((owner, index) => (
						<div className="flex flex-col  divide-y divide-gray-100" key={index}>
							<div className="flex flex-row w-full flex-wrap">
								<div className="py-6 w-1/2">
									<dt className="text-sm font-medium leading-6 text-gray-900">Name</dt>
									<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
										{capitalize(owner?.first_name)} {capitalize(owner?.last_name)}
									</dd>
								</div>
								<div className="py-6 w-1/2">
									<dt className="text-sm font-medium leading-6 text-gray-900">Address</dt>
									<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
										{owner?.address?.street}
									</dd>
								</div>
							</div>
							<div className="flex flex-row w-full flex-wrap">
								<div className="py-6 w-1/2">
									<dt className="text-sm font-medium leading-6 text-gray-900">City</dt>
									<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
										{owner?.address?.city}
									</dd>
								</div>
								<div className="py-6 w-1/2">
									<dt className="text-sm font-medium leading-6 text-gray-900">Sate</dt>
									<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
										{owner?.address?.state}
									</dd>
								</div>
							</div>
							<div className="flex flex-row w-full flex-wrap">
								<div className="py-6 w-1/2">
									<dt className="text-sm font-medium leading-6 text-gray-900">Zip</dt>
									<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
										{owner?.address?.zip}
									</dd>
								</div>
								<div className="py-6 w-1/4">
									<dt className="text-sm font-medium leading-6 text-gray-900">Phone Number</dt>
									<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
										{/* {application?.business_address?.state} */}
									</dd>
								</div>
							</div>
							<div className="flex flex-row w-full flex-wrap">
								<div className="py-6 w-1/2">
									<dt className="text-sm font-medium leading-6 text-gray-900">Email</dt>
									<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{owner?.email}</dd>
								</div>
								<div className="py-6 w-1/2">
									<dt className="text-sm font-medium leading-6 text-gray-900">
										Percentage of ownership
									</dt>
									<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
										{`${owner?.ownership_percentage} %`}
									</dd>
								</div>
							</div>
							<div className="flex flex-row w-full flex-wrap">
								{/* <div className="py-6 w-1/2">
									<dt className="text-sm font-medium leading-6 text-gray-900">Date of Birth</dt>
									<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2"></dd>
								</div> */}
								<div className="py-6 w-1/2">
									<dt className="text-sm font-medium leading-6 text-gray-900">SSN#</dt>
									<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{owner?.ssn}</dd>
								</div>
							</div>
						</div>
					))
				)(application?.owners)}
			</div>
		</div>
	);
};

export default function Review() {
	return (
		<div className="relative flex flex-col w-full h-full overflow-y-scroll items-center">
			<div className="flex flex-col w-[1200px] mt-10 mb-[100px]">
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

					<div className="flex flex-col w-full border rounded p-10 ">
						<OwnerInfo />
					</div>
				</div>
			</div>
		</div>
	);
}
