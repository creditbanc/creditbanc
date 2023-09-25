import { useLoaderData } from "@remix-run/react";
import { currency, get_group_id, mapIndexed } from "~/utils/helpers";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import Entity from "~/api/internal/entity";
import BusinessReport from "~/api/client/BusinessReport";
import { on_success } from "../../success";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(url.pathname);

	let entity = new Entity(entity_id);
	let business_report = new BusinessReport(group_id);

	let entity_response = entity.plan_id.fold;
	let payload = business_report.business_info.report_sha.fold;
	let response = await lastValueFrom(payload.pipe(fold(on_success(request), on_error)));
	return response;
};

const CompanyInfo = () => {
	let { credit_utilization: data } = useLoaderData();

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">Derogatories</h3>
			</div>
			<div className="border-t border-gray-200 p-5 space-y-5">
				<div className="flex flex-col w-full [&>*:nth-child(odd)]:bg-gray-50 border rounded">
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">First Credit Account</div>
						<div>N/A</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">First Credit Account</div>
						<div>N/A</div>
					</div>
					<div className="flex flex-row py-2 px-3">
						<div className="flex flex-col w-3/4">First Credit Account</div>
						<div>N/A</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const ExplanationCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">How is Payment Status Important?</h3>
			</div>
			<div className="border-t border-gray-200 space-y-8 p-6">
				<div className="flex flex-col w-full">
					Payment status on commercial accounts is treated much differently than personal accounts. On the
					personal side, a consumer has 30 days after a payment is due to pay before a late payment can be
					reported on their credit. It's not the same with business credit. A creditor can report a late or
					slow payment the day after it's due. So if your business is only 1 day late making a payment, it can
					be reported as late or slow on your business credit. The more promptly you make your payments, the
					better your business credit score can be.
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	let { trade_lines, plan_id } = useLoaderData();

	return (
		<div className="flex flex-col w-full space-y-5">
			<div>
				<ExplanationCard />
			</div>
			<div>
				<CompanyInfo />
			</div>
		</div>
	);
}
