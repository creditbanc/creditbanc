import axios from "axios";
import { head, pipe, map } from "ramda";
import { get } from "shades";
import {
	get_group_id,
	formData,
	json_response,
	inspect,
	search_params,
	get_entity_id,
	store,
	formatPhoneNumber,
} from "~/utils/helpers";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";
import { map as rxmap, tap, filter as rxfilter, concatMap, take, delay, repeat } from "rxjs/operators";
import { from, of as rxof, Subject, zip, lastValueFrom, throwError, forkJoin } from "rxjs";
import Entity from "~/api/client/Entity";
import { fold } from "~/utils/operators";
import { useLoaderData, useLocation, useNavigate, useSubmit } from "@remix-run/react";
import BusinessReport from "~/api/client/BusinessReport";
import { set_doc } from "~/utils/firebase";
import { v4 as uuidv4 } from "uuid";

let route_logger = `credit.business.match`;
let action_start = "credit.business.match.action.start";
let action_response = "action.response";
let loader_start = "credit.business.match.loader.start";
let loader_response = "loader.response";

let use_view_store = store();
const subject = new Subject();

const update_onboarding = async ({ entity_id, group_id }) => {
	return set_doc(["onboarding", group_id], { entity_id, group_id, business_credit_report: true }, true);
};

const new_notification = async ({ entity_id, group_id, type }) => {
	let id = uuidv4();
	return set_doc(["notification", id], { type, id, entity_id, group_id });
};

const action_subject = subject.pipe(
	rxfilter((event) => event.id === action_start),
	concatMap(({ args: { request } }) => {
		console.log(`${route_logger}.action_subject`);
		let url = new URL(request.url);
		let form = from(formData(request)).pipe(rxmap((form) => form));

		let report = new BusinessReport(get_group_id(url.pathname));
		let report_response = report.application_id.fold;

		let data = report_response.pipe(
			concatMap((application) => from(form).pipe(rxmap((form) => ({ ...application, ...form }))))
		);

		return data.pipe(
			concatMap((data) =>
				from(LendflowExternal.update_application_bin(data.application_id, data.bin_id)).pipe(
					concatMap((bin_update_response) => {
						return from(LendflowExternal.update_lendflow_report(data.application_id));
					}),
					concatMap((application_response) =>
						from(LendflowExternal.get_lendflow_report(data.application_id)).pipe(rxmap(get("data", "data")))
					),
					concatMap((report) =>
						LendflowInternal.update_application({ application_id: data.application_id, ...report })
					),
					delay(10000)
				)
			),
			tap(() => console.log(`${route_logger}.application_bin_update_response`)),
			tap(inspect)
		);
	})
);

const loader_subject = subject.pipe(
	rxfilter((event) => event.id === loader_start),
	concatMap(({ args: { request } }) => {
		console.log(`${route_logger}.loader_subject`);
		let { application_id } = search_params(request);

		let application = rxof(null).pipe(
			// delay(10000),
			concatMap(() => from(LendflowExternal.get_lendflow_report(application_id))),
			rxmap(get("data", "data")),
			rxfilter((application) => application?.statuses?.experian?.business_match === "Success"),
			rxmap((application) => new LendflowInternal(application)),
			rxmap((application) => ({ application_id, business_match: application.business_match() })),
			take(1)
		);

		return application.pipe(
			tap(() => console.log(`${route_logger}.get_lendflow_report`)),
			tap(inspect)
		);
	})
);

export const action = async ({ request }) => {
	console.log(route_logger);

	const on_success = async (value) => {
		console.log(`${route_logger}.action.success`);
		let { origin } = new URL(request.url);

		let entity_id = await get_session_entity_id(request);
		let group_id = get_group_id(request.url);
		// let redirect_url = `${origin}/credit/report/business/experian/status/resource/e/${entity_id}/g/${group_id}`;
		let redirect_url = `${origin}/home/resource/e/${entity_id}/g/${group_id}`;

		await update_onboarding({ entity_id, group_id });
		await new_notification({ entity_id, group_id, type: "new_business_credit_report" });

		subject.next({
			id: action_response,
			next: () => Response.redirect(redirect_url),
		});
	};

	const on_error = (error) => {
		console.log(`${route_logger}.action.error`);
		console.log(error);

		subject.next({
			id: action_response,
			next: () => json_response(error),
		});
	};

	const on_complete = (value) => value.id === action_response;

	action_subject.pipe(fold(on_success, on_error)).subscribe();
	subject.next({ id: action_start, args: { request } });
	let response = await lastValueFrom(subject.pipe(rxfilter(on_complete), take(1)));
	return response.next();
};

export const loader = async ({ request }) => {
	console.log(route_logger);

	const on_success = async (value) => {
		console.log(`${route_logger}.loader.success`);
		let { origin } = new URL(request.url);

		subject.next({
			id: loader_response,
			next: () => value,
		});
	};

	const on_error = (error) => {
		console.log(`${route_logger}.loader.error`);
		console.log(error);

		subject.next({
			id: loader_response,
			next: () => json_response(error),
		});
	};

	const on_complete = (value) => value.id === loader_response;

	loader_subject.pipe(fold(on_success, on_error)).subscribe();
	subject.next({ id: loader_start, args: { request } });

	let response = await lastValueFrom(subject.pipe(rxfilter(on_complete), take(1)));
	return response.next();
};

const BusinessMatchSelect = () => {
	let { business_match = [] } = useLoaderData();
	let { pathname } = useLocation();
	let entity_id = get_entity_id(pathname);
	let group_id = get_group_id(pathname);
	let submit = useSubmit();

	const onSelectBusiness = (business) => {
		console.log("onSelectBusiness");
		// console.log(business);
		let post_url = `/credit/business/match/resource/e/${entity_id}/g/${group_id}`;
		submit({ bin_id: business.bin }, { method: "post", action: post_url });
	};

	return (
		<div className="flex flex-col my-2 p-3 bg-white text-sm w-full">
			<div className="flex flex-col space-y-3">
				{pipe(
					map((business) => (
						<div
							className="flex flex-col rounded bg-white px-3 text-sm cursor-pointer hover:border-green-300 border-2 hover:border-2"
							key={business.bin}
							onClick={() => onSelectBusiness(business)}
						>
							<div className="flex flex-row border-b py-2 font-semibold justify-between items-end mb-2">
								<div>{business?.businessName}</div>
								<div className="flex flex-col px-3 py-1 bg-gray-100 hover:bg-green-300 text-gray-700 hover:text-white rounded cursor-pointer">
									Select
								</div>
							</div>
							<div className="flex flex-col space-y-1 my-1 pb-1">
								<div className="flex flex-col">{business?.address?.street}</div>
								<div className="flex flex-row space-x-1">
									<div>{business?.address?.city},</div>
									<div> {business?.address?.state} </div>
									<div> {business?.address?.zip} </div>
								</div>
								<div className="flex flex-col">{formatPhoneNumber(business?.phone)}</div>
							</div>
						</div>
					))
				)(business_match)}
			</div>
		</div>
	);
};

export default function View() {
	return (
		<div className="flex flex-col w-full items-center overflow-y-scroll">
			<div className="flex flex-col w-full lg:w-[900px] items-center">
				<div className="bg-white px-6 py-10">
					<div className="mx-auto text-center">
						<h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
							Verify and select your business
						</h2>
					</div>
				</div>
				<div className="flex flex-col w-full mb-5">
					<BusinessMatchSelect />
				</div>
			</div>
		</div>
	);
}
