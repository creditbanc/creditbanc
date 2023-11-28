import { capitalize, classNames, form_params, get, get_entity_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { pipe, map, head } from "ramda";
import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition, RadioGroup } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import useStore from "./store";
import { Link, useLoaderData, useLocation, useSubmit } from "@remix-run/react";
import { from, lastValueFrom, map as rxmap } from "rxjs";
import { get_doc, update_doc } from "~/utils/firebase";
import { redirect } from "@remix-run/node";
import { navigation } from "./navigation";
import { filter } from "shades";
import { unformat, formatMoney } from "accounting-js";
import { get_session_entity_id } from "~/utils/auth.server";
import moment from "moment";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	// let group_id = get_group_id(url.pathname);

	let application_entity_id = "dd947710-075d-4e68-8cb2-3726851a6ed1";
	let application = await lastValueFrom(from(get_doc(["application", application_entity_id])));

	console.log("applicationddfdsf");
	console.log(application);

	return { application };
};

const steps = [
	{ id: "Financing Needs", name: "Job details", href: "#", status: "complete" },
	{ id: "About your business", name: "Application form", href: "#", status: "current" },
	{ id: "About your owners", name: "Preview", href: "#", status: "upcoming" },
];

const Progress = () => {
	return (
		<nav aria-label="Progress" className="relative">
			<ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
				<li className="md:flex-1">
					<div className="group flex flex-col items-center border-l-4 border-blue-600 py-2 pl-4 hover:border-blue-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"></div>
				</li>
			</ol>
		</nav>
	);
};

export default function Agreement() {
	let { application } = useLoaderData();

	let application_day = moment(application.created_at).format("DD");
	let application_month = moment(application.created_at).format("MMMM");
	let business_legal_name = application.legal_name;
	let address = application?.business_address;
	let street = address?.street;
	let city = address?.city;
	let state = address?.state;
	let zip = address?.zip;
	let business_address = `${street}, ${city}, ${state}, ${zip}`;
	let applicant = `${application.first_name} ${application.last_name}`;

	return (
		<div className="flex flex-col items-center w-full h-full overflow-y-scroll relative">
			<div className="flex flex-col w-full sticky top-0">
				<Progress />
			</div>
			<div className="flex flex-col w-full  scrollbar-none items-center relative">
				<div className="flex flex-col h-fit items-center max-w-5xl pb-10 absolute">
					<div className="flex flex-col">
						<img
							src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/SMYDdopw3PXGAPMBQSmE/media/624f39de40dc5d557cd3777a.png"
							className="h-[200px]"
						/>
					</div>
					<div className="flex flex-col gap-y-5">
						<div>
							<b>THIS AGREEMENT</b>, made this {application_day} day of {application_month}, by and
							between <b>SAG Advisors LLC</b> having its main office at 9315 Trinana Circle, Winter
							Garden, Florida (heretofore the <b>Advisor</b>); and {capitalize(business_legal_name)} whose
							main business address is {business_address} (heretofore the <b>Client</b> ).
						</div>
						<div>
							<b>WHEREAS</b>, the <b>Advisor</b> is hereby engaged to arrange financing or cause financing
							to be provided to the client, via a Third-Party Lender. The <b>Client</b> has engaged the{" "}
							<b>Advisor</b> to arrange financing for the <b>Client</b>. While procuring this financing,
							it became apparent
							<b>Client</b> required a global consultancy service to facilitate the underwriting of said
							financing. This consultancy includes, but is not limited to: financial analysis of
							bookkeeping and records, review of business tax returns, payroll audits, review of any
							pending litigation and corporate structures, These services may be provided by{" "}
							<b>Advisor</b> or by third party professionals that <b>Advisor</b> may procure for the
							purposes of providing consultancy.
						</div>
						<div>
							<b>NOW, THEREFORE IT IS AGREED AS FOLLOWS;</b>
						</div>
						<div>
							The <b>Client</b> retains the services of the <b>Advisor</b> and appoints the <b>Advisor</b>{" "}
							to act as the Client's Agent in all negotiations with potential Lenders introduced to the
							<b>Client</b> by the <b>Advisor</b>.
						</div>
						<div>
							The <b>Client</b> agrees to pay the <b>Advisor</b> a <b>Success Fee (The Success Fee)</b>.{" "}
							<b>The Success Fee</b> shall be equal to <b>5% Five Percent</b> ) of funding or Line
							obtained. The <b>Success Fee</b> will be made payable to <b>SAG Advisors LLC</b>, via
							Certified Bank Check, ACH or via Wire Transfer (below instruction), if the Lender does not
							do so on your behalf. You further authorize the lender or closing agent to{" "}
							<b>SAG Advisors LLC</b> directly upon closing. By signing this agreement, you
							unconditionally agree to this <b>Success Fee</b> and to pay such <b>SAG Advisors LLC</b>
							within <b>3</b> business days of funding.
						</div>
						<div>
							<div>Chase Bank</div>
							<div>ABA#: 021000021</div>
							<div>Acct#: 661261203</div>
							<div>Payable: SAG Advisors LLC</div>
						</div>

						<div>
							IT IS UNDERSTOOD AND AGREED that the <b>Advisor</b> will have earned this fee or commission
							at the time the service is rendered, and benefit rendered unto the <b>Client</b>.
						</div>

						<div>
							<b>Client</b> agrees to defend the <b>Advisor</b> against any claim(s) made by any third-
							party service providers, not affiliated with the <b>Advisor</b>, for any part of the
							<b>Success Fee</b>
							earned by the <b>Advisor</b> as it relates to this transaction. <b>Client</b> gives the{" "}
							<b>Advisor</b> and any potential lender the right to perform and all investigations
							necessary to evaluate the <b>Client</b>'s credit worthiness. The <b>Client</b> represents
							that all information submitted to the <b>Advisor</b> is substantially true and accurate.
							However, should it be determined that the information provided is materially false; the{" "}
							<b>Success Fee</b>
							delineated above shall become immediately due and payable.
						</div>

						<div>
							<b>Client</b> agrees that neither he/she nor any of their associated entities or agents will
							enter into any transaction(s) with any Lender, introduced by the <b>Advisor</b> to the{" "}
							<b>Client</b>, for a period of <b>Tweleve (12)</b> months from the date of said introduction
							or Closing, whichever occurs last, without recognizing <b>SAG Advisors LLC</b> as the{" "}
							<b>Advisor</b> of Record and as such entitled to a <b>Success Fee</b>. Unless renegotiated,
							via a new Brokerage Agreement, the fee(s) set forward in this Agreement shall apply
						</div>
						<div>
							The <b>Client</b> agrees to reimburse the <b>Advisor</b> for any and all reasonable costs
							incurred, by the <b>Advisor</b>, in effectuating collection of said <b>Success Fee</b>{" "}
							and/or Fee(s), including but not limited to, legal and court costs. <b>Client</b> will be
							responsible for said costs only if a Florida court or arbiter finds the <b>Client</b>{" "}
							culpable.
						</div>

						<div>
							Facsimile signatures will be deemed acceptable, as original, by all parties of this
							Agreement. The Law's of the <b>State of Florida</b> shall govern this contract.
						</div>
						<div className="flex flex-col gap-y-2">
							<div className="flex flex-row gap-x-2 items-end">
								<div>By:</div>
								<div className="flex flex-col border-b">
									<img src={application.signature_base_64_img} className="h-[70px]" />
								</div>
							</div>
							<div className="flex flex-row gap-x-2 items-end">
								<div>Name:</div>
								<div>{applicant}</div>
							</div>
							{/* <div className="flex flex-row gap-x-2 items-end">
								<div>Title:</div>
							</div> */}
							<div className="flex flex-row gap-x-2 items-end">
								<div>Date:</div>
								<div>{moment().format("MM-DD-YYYY")}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
