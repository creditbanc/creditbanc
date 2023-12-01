import { redirect } from "@remix-run/node";
import {
	difference,
	dissoc,
	head,
	includes,
	intersection,
	isEmpty,
	join,
	keys,
	map,
	mapObjIndexed,
	pipe,
	set,
	sort,
	toPairs,
	values,
} from "ramda";

import { from, lastValueFrom, map as rxmap } from "rxjs";
import { filter } from "shades";
import { create_user_session, get_session_entity_id } from "~/utils/auth.server";
import { get_doc, update_doc } from "~/utils/firebase";
import {
	capitalize,
	create_axios_form,
	formData,
	form_params,
	get,
	get_entity_id,
	get_group_id,
	mapIndexed,
	store,
} from "~/utils/helpers";
import { Link, useLoaderData, useLocation, useSubmit } from "@remix-run/react";
import { navigation } from "./navigation";
import { useEffect, useState } from "react";
// import useStore from "./store";
import moment from "moment";
import { unformat, formatMoney } from "accounting-js";
import ApplicationProgress from "~/components/ApplicationProgress";
import { flatten } from "flat";

export const action = async ({ request }) => {
	console.log("request.url");
	console.log(request.url);
	let url = new URL(request.url);
	console.log(url);
	let { pathname, origin } = url;
	let group_id = get_group_id(pathname);
	let entity_id = get_entity_id(pathname);
	let params = await form_params(request);

	console.log("params");
	console.log(params);
	console.log(group_id);
	console.log(entity_id);

	let step = pipe(filter({ id: "review" }), head, get("step"))(navigation);
	let { data: form_data } = params;
	let data = JSON.parse(form_data);
	// console.log("dataaaaa");
	// console.log(data);
	let payload = { ...data, step };

	let response = from(update_doc(["application", entity_id], payload)).pipe(rxmap(() => ({ entity_id, group_id })));

	await lastValueFrom(response);
	let next = pipe(filter({ id: "review" }), head, get("next"))(navigation);
	return redirect(next({ entity_id, group_id }));
	// return create_user_session(entity_id, next({ entity_id, group_id }));

	// let post_url = `${origin}/credit/business/new/form/resource/e/${entity_id}/g/${group_id}`;

	// let { business_start_date, ...business } = test_identity_three;
	// let business_start_date_string = `${business_start_date.year}-${business_start_date.month}-${business_start_date.day}`;

	// var formdata = new FormData();
	// formdata.append("payload", JSON.stringify({ ...business, business_start_date: business_start_date_string }));
	// formdata.append("response_type", JSON.stringify("json"));

	// let config = {
	// 	method: "post",
	// 	maxBodyLength: Infinity,
	// 	data: formdata,
	// 	headers: { "Content-Type": "multipart/form-data" },
	// 	url: post_url,
	// };

	// let report_response = await axios(config);

	// console.log("report_response");
	// console.log(report_response.data);

	// return Response.redirect(report_response.data);
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
		<div className="mx-auto max-w-2xl text-center">
			<h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Review Loan Application</h2>
			<p className="mt-6 text-lg leading-8 text-gray-600">
				Make sure that all the informatiion is accurate and correct
			</p>
		</div>
	);
};

const BusinessInfo = () => {
	let { application } = useLoaderData();
	const { legal_name, dba, business_address, phone, business_entity, ein, industry, set_path } = useStore();

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
							<input
								type="text"
								className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2 outline-none w-full"
								value={legal_name}
								onChange={(e) => set_path(["legal_name"], e.target.value)}
							/>
						</div>
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Business DBA Name</dt>
							{/* <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.dba}</dd> */}
							<input
								type="text"
								className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2 outline-none w-full"
								value={dba}
								onChange={(e) => set_path(["dba"], e.target.value)}
							/>
						</div>
					</div>
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Address</dt>
							{/* <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_address?.street}
							</dd> */}
							<input
								type="text"
								className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2 outline-none w-full"
								value={business_address?.street}
								onChange={(e) => set_path(["business_address", "street"], e.target.value)}
							/>
						</div>
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">City</dt>
							{/* <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_address?.city}
							</dd> */}
							<input
								type="text"
								className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2 outline-none w-full"
								value={business_address?.city}
								onChange={(e) => set_path(["business_address", "city"], e.target.value)}
							/>
						</div>
					</div>
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Phone Number</dt>
							{/* <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.phone}</dd> */}
							<input
								type="text"
								className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2 outline-none w-full"
								value={phone}
								onChange={(e) => set_path(["phone"], e.target.value)}
							/>
						</div>
						<div className="py-6 w-1/4">
							<dt className="text-sm font-medium leading-6 text-gray-900">State</dt>
							{/* <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_address?.state}
							</dd> */}
							<input
								type="text"
								className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2 outline-none w-full"
								value={business_address?.state}
								onChange={(e) => set_path(["business_address", "state"], e.target.value)}
							/>
						</div>
						<div className="py-6 w-1/4">
							<dt className="text-sm font-medium leading-6 text-gray-900">Zip</dt>
							{/* <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_address?.zip}
							</dd> */}
							<input
								type="text"
								className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2 outline-none w-full"
								value={business_address?.zip}
								onChange={(e) => set_path(["business_address", "zip"], e.target.value)}
							/>
						</div>
					</div>
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Legal Entity</dt>
							{/* <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
								{application?.business_entity}
							</dd> */}
							<input
								type="text"
								className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2 outline-none w-full"
								value={business_entity}
								onChange={(e) => set_path(["business_entity"], e.target.value)}
							/>
						</div>
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Federal Tax ID (EIN)</dt>
							{/* <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.ein}</dd> */}
							<input
								type="text"
								className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2 outline-none w-full"
								value={ein}
								onChange={(e) => set_path(["ein"], e.target.value)}
							/>
						</div>
					</div>
					<div className="flex flex-row w-full flex-wrap">
						<div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Merchant Type</dt>
							{/* <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.industry}</dd> */}
							<input
								type="text"
								className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2 outline-none w-full"
								value={industry}
								onChange={(e) => set_path(["industry"], e.target.value)}
							/>
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
						{/* <div className="py-6 w-1/2">
							<dt className="text-sm font-medium leading-6 text-gray-900">Reason</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{application?.dba}</dd>
						</div> */}
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
	const { set_path, owners } = useStore();

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
									{/* <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
										{capitalize(owner?.first_name)} {capitalize(owner?.last_name)}
									</dd> */}
									<div className="flex flex-row w-full gap-x-2 text-sm">
										<div className="flex flex-col justify-center pb-0.5">First Name:</div>
										<div>
											<input
												type="text"
												className="flex flex-col justify-end text-sm leading-6 text-gray-700 outline-none"
												value={capitalize(owner?.first_name)}
												onChange={(e) =>
													set_path(["owners", owner.id, "first_name"], e.target.value)
												}
											/>
										</div>
									</div>
									<div className="flex flex-row w-full gap-x-2 text-sm">
										<div className="flex flex-col justify-end pb-0.5">Last Name:</div>
										<div>
											<input
												type="text"
												className="flex flex-col justify-end text-sm leading-6 text-gray-700 outline-none"
												value={capitalize(owner?.last_name)}
												onChange={(e) =>
													set_path(["owners", owner.id, "last_name"], e.target.value)
												}
											/>
										</div>
									</div>
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
									{/* <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
										{owner?.address?.city}
									</dd> */}
									<input
										type="text"
										className="flex flex-col text-sm leading-6 text-gray-700 outline-none"
										value={owner?.address?.city}
										onChange={(e) =>
											set_path(["owners", owner.id, "address", "city"], e.target.value)
										}
									/>
								</div>
								<div className="py-6 w-1/2">
									<dt className="text-sm font-medium leading-6 text-gray-900">Sate</dt>
									{/* <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
										{owner?.address?.state}
									</dd> */}
									<input
										type="text"
										className="flex flex-col text-sm leading-6 text-gray-700 outline-none"
										value={owner?.address?.state}
										onChange={(e) =>
											set_path(["owners", owner.id, "address", "state"], e.target.value)
										}
									/>
								</div>
							</div>
							<div className="flex flex-row w-full flex-wrap">
								<div className="py-6 w-1/2">
									<dt className="text-sm font-medium leading-6 text-gray-900">Zip</dt>
									{/* <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
										{owner?.address?.zip}
									</dd> */}
									<input
										type="text"
										className="flex flex-col text-sm leading-6 text-gray-700 outline-none"
										value={owner?.address?.zip}
										onChange={(e) =>
											set_path(["owners", owner.id, "address", "zip"], e.target.value)
										}
									/>
								</div>
								<div className="py-6 w-1/4">
									<dt className="text-sm font-medium leading-6 text-gray-900">Phone Number</dt>

									<input
										type="text"
										className="flex flex-col text-sm leading-6 text-gray-700 outline-none"
										value={owner?.phone}
										onChange={(e) => set_path(["owners", owner.id, "phone"], e.target.value)}
									/>
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
									{/* <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
										{`${owner?.ownership_percentage} %`}
									</dd> */}
									<input
										type="text"
										className="flex flex-col text-sm leading-6 text-gray-700 outline-none"
										value={owner?.ownership_percentage}
										onChange={(e) =>
											set_path(["owners", owner.id, "ownership_percentage"], e.target.value)
										}
									/>
								</div>
							</div>
							<div className="flex flex-row w-full flex-wrap">
								{/* <div className="py-6 w-1/2">
									<dt className="text-sm font-medium leading-6 text-gray-900">Date of Birth</dt>
									<dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2"></dd>
								</div> */}
								<div className="py-6 w-1/2">
									<dt className="text-sm font-medium leading-6 text-gray-900">SSN#</dt>
									{/* <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{owner?.ssn}</dd> */}
									<input
										type="text"
										className="flex flex-col text-sm leading-6 text-gray-700 outline-none"
										value={owner?.ssn}
										onChange={(e) => set_path(["owners", owner.id, "ssn"], e.target.value)}
									/>
								</div>
							</div>
						</div>
					))
				)(owners)}
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

const useStore = store();

export default function Review() {
	let { application } = useLoaderData();
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let [signature, set_signature] = useState(undefined);
	let store = useStore();
	let { set_props, signed_date } = store;
	const submit = useSubmit();
	// const [has_changes, set_has_changes] = useState(false);

	let back = pipe(filter({ id: "review" }), head, get("back"))(navigation);

	useEffect(() => {
		if (signature) {
			set_props({ signed_date: new Date() });
		}
	}, [signature]);

	useEffect(() => {
		// console.log("override");
		// console.log(application);
		set_props(application);
	}, [application]);

	const onSignLoanApplication = () => {
		console.log("onSignLoanApplication");
		// console.log(application);
		set_signature(application?.signature_base_64_img);
	};

	const onSubmit = () => {
		console.log("onSubmit");
		let { set_props, set_state, set_path, ...form } = store;
		let payload = { ...form };

		// console.log("payload");
		// console.log(form);

		submit(
			{ data: JSON.stringify(payload) },
			{
				action: `/apply/review/resource/e/${entity_id}/g/${group_id}`,
				method: "post",
			}
		);
	};

	// useEffect(() => {
	// 	if (application && store) {
	// 		let flat_application = pipe(flatten)(application);
	// 		let application_keys = pipe(keys)(flat_application);
	// 		let applicaton_values = pipe(dissoc("signed_date"), toPairs, map(join("")))(flat_application);

	// 		let flat_store = pipe(
	// 			flatten,
	// 			mapObjIndexed((value, key) => (includes(key, application_keys) ? value : "ekur")),
	// 			dissoc("signed_date"),
	// 			filter((value) => value !== "ekur"),
	// 			toPairs,
	// 			map(join(""))
	// 		)(store);

	// 		let is_same = difference(applicaton_values, flat_store);

	// 		if (is_same.length > 0) {
	// 			set_has_changes(true);
	// 		} else {
	// 			set_has_changes(false);
	// 		}
	// 	}
	// }, [store]);

	// const onUpdateApplication = () => {
	// 	let response = from(update_doc(["application", entity_id], payload)).pipe(
	// 		rxmap(() => ({ entity_id, group_id }))
	// 	);
	// 	set_has_changes(false);
	// };

	return (
		<div className="relative flex flex-col w-full h-full overflow-y-scroll items-center">
			<div className="flex flex-col w-full">
				<ApplicationProgress />
			</div>

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
				{!signature && (
					<div className="flex flex-col w-full items-center gap-y-4 mt-10">
						<Link
							to={back({ entity_id, group_id })}
							className="flex flex-col py-3 px-4 rounded-full text-[#56CF9E] w-1/2 items-center cursor-pointer border-2 border-[#56CF9E]"
						>
							Back
						</Link>
					</div>
				)}
			</div>

			{/* {has_changes && (
				<div className="flex flex-col w-full h-[70px] fixed bottom-0 bg-red-400 py-3 items-center justify-center">
					<div className="flex flex-col w-[900px] items-center justify-center">
						<div
							className="flex flex-col bg-white px-5 py-3 cursor-pointer rounded-full"
							onClick={onUpdateApplication}
						>
							Update Loan Application
						</div>
					</div>
				</div>
			)} */}

			{signature && (
				<div className="flex flex-col w-full h-[70px] fixed bottom-0 bg-green-400 py-3 items-center justify-center">
					<div className="flex flex-col w-[900px] items-center justify-center">
						<div
							className="flex flex-col bg-white px-5 py-3 cursor-pointer rounded-full"
							onClick={onSubmit}
						>
							Submit Loan Application
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
