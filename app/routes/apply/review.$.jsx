import { redirect } from "@remix-run/node";
import { head, isEmpty, pipe } from "ramda";
import { from, lastValueFrom } from "rxjs";
import { filter } from "shades";
import { get_session_entity_id } from "~/utils/auth.server";
import { get_doc } from "~/utils/firebase";
import { get, get_entity_id, get_group_id } from "~/utils/helpers";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { navigation } from "./navigation";
import { useEffect, useState } from "react";
import useStore from "./store";
import moment from "moment";

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
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.legal_name}</dd>
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
								{application?.business_address?.street}
							</dd>
						</div>
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Company</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_address?.city}
							</dd>
						</div>
					</div>
					<div className="flex flex-row w-full flex-wrap">
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
					</div>
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
				<div className="flex flex-col  divide-y divide-gray-100">
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Name</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.legal_name}</dd>
						</div>
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Address</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.dba}</dd>
						</div>
					</div>
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">City</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_address?.street}
							</dd>
						</div>
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Sate</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_address?.city}
							</dd>
						</div>
					</div>
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Zip</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.phone}</dd>
						</div>
						<div className="py-6 w-1/4">
							<dt className="text-sm font-medium leading-6 text-gray-900">Phone Number</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_address?.state}
							</dd>
						</div>
					</div>
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Email</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_entity}
							</dd>
						</div>
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">% of ownership</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.ein}</dd>
						</div>
					</div>
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Date of Birth</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.industry}</dd>
						</div>
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">SSN#</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{`${application?.month}-${application?.day}-${application?.year}`}</dd>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const Agreement = () => {
	return (
		<div className="flex flex-col w-full">
			By Signing below, each of the above-listed business and business owners/officers/members (individually and
			collectively, the 'Applicant') certifies that Applicant is authorized to submit this application on behalf
			of the above-named business. Applicant certifies that all information and documents submitted in connection
			with this Application are true, correct and complete and may be relied upon by SAG Advisors LLC. Applicant
			authorizes SAG Advisors LLC to request a personal credit report on any individual listed above and to
			request business credit reports on the above-named business. Applicant understands that SAG Advisors LLC
			will keep this application whether or not it is approved. Applicant agrees to notify SAG Advisors LLC
			immediately in writing of any material change in any information or documentation submitted in connection
			with this Application. Applicant authorizes SAG Advisors LLC to share this application and all supporting
			documentation with each of its representatives, successors, assignees, affiliates and designees, including
			third-party lenders (collective "Assignees") that may be involved with the acquiring of commercial loans
			and/or other products. Applicant futher authorizes SAG Advisors LLC and all Assignees to request, receive,
			and review any investigative or credit reports, including comprehensive business and personal credit
			histories of hard credit pulls, and any other information regarding the Applicant and its owners and/or
			principals from third parties deemed necessary by SAG Advisors LLC to arrive at a credit decision. Applicant
			hereby authorizes SAG Advisors LLC and all Assignees, to utilize this information in any manner deemed
			necessary by SAG Advisors LLC or Assignees to verify any information provided on the Application including
			without limitation credit card processor statements and bank statments, from one or more consumer reporting
			agencies, such as TransUnion, Experian and Equifax, and from other credit bureaus, banks, creditors and
			other third parties. SAG Advisors LLC shall not disclose information in your credit report to third parties.
			Applicant also consents to the release by any credit or financial institution, of any information relating
			to Applicant, to SAG Advisors LLC and to each of its Assignees, on its own behalf. Applicant also consents
			to email and/or text/SMS/fax messages at the phone number(s) provided above, including your wireless number,
			using an automated telephone dialing system for marketing purposes by SAG Advisors LLC and/or third party
			lenders, as well as their respective affiliates or agents acting on their behalf. Futrthermore, Applicant
			hereby waives and releases any claims against SAG Advisors LLC, all Assignees and any information-providers
			arising from any act or omission relating to the requesting, receiving or release of information obtained in
			connection with this Application.
		</div>
	);
};

export default function Review() {
	let { application } = useLoaderData();
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let [signature, set_signature] = useState(undefined);
	let { set_props, signed_date } = useStore();

	let back = pipe(filter({ id: "review" }), head, get("back"))(navigation);

	useEffect(() => {
		if (signature) {
			set_props({ signed_date: new Date() });
		}
	}, [signature]);

	const onSignLoanApplication = () => {
		set_signature(application?.base_64_img);
	};

	return (
		<div className="relative flex flex-col w-full h-full overflow-y-scroll items-center">
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

					<div className="flex flex-col w-full border rounded p-10 ">
						<OwnerInfo />
					</div>
				</div>
				<div className="flex flex-col text-sm my-8 px-2">
					<Agreement />
				</div>
				<div className="flex flex-row justify-between gap-x-10">
					<div className="flex flex-row justify-between border-b border-dashed border-gray-700 w-1/2 px-2 py-2 items-end">
						<div>By:</div>
						<div>
							{!signature && (
								<div
									className="flex flex-col px-4 py-2 cursor-pointer rounded-full bg-green-400 text-white text-sm"
									onClick={onSignLoanApplication}
								>
									Sign Loan Application
								</div>
							)}
							{signature && <img src={signature} style={{ height: 100 }} />}
						</div>
					</div>
					<div className="flex flex-row justify-between items-end border-b border-dashed border-gray-700 w-1/2 px-2 py-2">
						<div>Date:</div>
						<div>{signature && moment(signed_date).format("MM-DD-YYYY")}</div>
					</div>
				</div>
				<div className="flex flex-col w-full items-center gap-y-4 mt-10">
					<Link
						to={back({ entity_id, group_id })}
						className="flex flex-col py-3 px-4 rounded-full text-blue-600 w-1/2 items-center cursor-pointer border-2 border-blue-600"
					>
						Back
					</Link>
					{/* <div
					onClick={onSubmit}
					className="flex flex-col bg-blue-600 py-3 px-4 rounded-full text-white w-[450px] items-center cursor-pointer"
				>
					Continue to pre-qualify
				</div> */}
				</div>
			</div>

			{/* <div className="flex flex-col w-full h-[70px] fixed bottom-0 bg-green-400 py-3 items-center justify-center">
				<div className="flex flex-col w-[900px] items-center justify-center">
					<div className="flex flex-col bg-white px-5 py-3 cursor-pointer rounded-full">
						Sign & Submit Loan Application
					</div>
				</div>
			</div> */}
		</div>
	);
}
