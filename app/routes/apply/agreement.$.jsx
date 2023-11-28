import { classNames, form_params, get, get_entity_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { pipe, map, head } from "ramda";
import { Fragment, useState } from "react";
import { Listbox, Transition, RadioGroup } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import useStore from "./store";
import { Link, useLocation, useSubmit } from "@remix-run/react";
import { from, lastValueFrom, map as rxmap } from "rxjs";
import { update_doc } from "~/utils/firebase";
import { redirect } from "@remix-run/node";
import { navigation } from "./navigation";
import { filter } from "shades";
import { unformat, formatMoney } from "accounting-js";

const steps = [
	{ id: "Financing Needs", name: "Job details", href: "#", status: "complete" },
	{ id: "About your business", name: "Application form", href: "#", status: "current" },
	{ id: "About your owners", name: "Preview", href: "#", status: "upcoming" },
];

const Progress = () => {
	return (
		<nav aria-label="Progress">
			<ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
				<li className="md:flex-1">
					<div className="group flex flex-col items-center border-l-4 border-blue-600 py-2 pl-4 hover:border-blue-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"></div>
				</li>
			</ol>
		</nav>
	);
};

export default function Agreement() {
	return (
		<div className="flex flex-col items-center w-full h-full overflow-y-scroll absolute">
			<div className="flex flex-col w-full">
				<Progress />
			</div>
			<div className="flex flex-col w-full  scrollbar-none items-center relative pt-10">
				<div className="flex flex-col h-fit items-center max-w-5xl py-10 absolute ">
					<div className="flex flex-col">
						<p>
							THIS AGREEMENT, made this day of _____________, by and between SAG Advisors LLC having its
							main office at 9315 Trinana Circle, Winter Garden, Florida (heretofore the Advisor); and
							whose main business address is (heretofore the Client).
						</p>
						<p>
							WHEREAS, the Advisor is hereby engaged to arrange financing or cause financing to be
							provided to the client, via a Third-Party Lender. The Client has engaged the Advisor to
							arrange financing for the Client. While procuring this financing, it became apparent Client
							required a global consultancy service to facilitate the underwriting of said financing. This
							consultancy includes, but is not limited to: financial analysis of bookkeeping and records,
							review of business tax returns, payroll audits, review of any pending litigation and
							corporate structures, These services may be provided by Advisor or by third party
							professionals that Advisor may procure for the purposes of providing consultancy.
						</p>
						<p>NOW, THEREFORE IT IS AGREED AS FOLLOWS;</p>
						<p>
							The Client retains the services of the Advisor and appoints the Advisor to act as the
							Client's Agent in all negotiations with potential Lenders introduced to the Client by the
							Advisor.
						</p>
						<p>
							The Client agrees to pay the Advisor a Success Fee (The Success Fee). The Success Fee shall
							be equal to 5% Five Percent) of funding or Line obtained. The Success Fee will be made
							payable to SAG Advisors LLC, via Certified Bank Check, ACH or via Wire Transfer (below
							instruction), if the Lender does not do so on your behalf. You further authorize the lender
							or closing agent to SAG Advisors LLC directly upon closing. By signing this agreement, you
							unconditionally agree to this Success Fee and to pay such SAG Advisors LLC within 3 business
							days of funding.
						</p>
						<div>
							<p>Chase Bank</p>
							<p>ABA # 021000021</p>
							<p>Acct # 661261203</p>
							<p>Payable: SAG Advisors LLC</p>
						</div>

						<p>
							IT IS UNDERSTOOD AND AGREED that the Advisor will have earned this fee or commission at the
							time the service is rendered, and benefit rendered unto the Client.
						</p>

						<p>
							Client agrees to defend the Advisor against any claim(s) made by any third- p a r t y
							service providers, not affiliated with the Advisor, for any part of the Success Fee earned
							by the Advisor as it relates to this transaction. Client gives the Advisor and any potential
							lender the right to perform and all investigations necessary to evaluate the Client's credit
							worthiness. The Client represents that all information submitted to the Advisor is
							substantially true and accurate. However, should it be determined that the information
							provided is materially false; the Success Fee delineated above shall become immediately due
							and payable.
						</p>

						<p>
							Client agrees that neither he/she nor any of their associated entities or agents will enter
							into any transaction(s) with any Lender, introduced by the Advisor to the Client, for a
							period of Tweleve (12) months from the date of said introduction or Closing, whichever
							occurs last, without recognizing SAG Advisors LLC as the Advisor of Record and as such
							entitled to a Success Fee. Unless renegotiated, via a new Brokerage Agreement, the fee(s)
							set forward in this Agreement shall apply
						</p>
						<p>
							The Client agrees to reimburse the Advisor for any and all reasonable costs incurred, by the
							Advisor, in effectuating collection of said Success Fee and/or Fee(s), including but not
							limited to, legal and court costs. Client will be responsible for said costs only if a
							Florida court or arbiter finds the Client culpable.
						</p>

						<p>
							Facsimile signatures will be deemed acceptable, as original, by all parties of this
							Agreement. The Law's of the State of Florida shall govern this contract.
						</p>
						<div>
							<p>By:</p>
							<p>Name:</p>
							<p>Title:</p>
							<p>Date:</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
