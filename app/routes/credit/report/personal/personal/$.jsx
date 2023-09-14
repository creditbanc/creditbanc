import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { Array } from "~/data/array";
import { get_file_id, get_group_id, inspect } from "~/utils/helpers";
import { get_session_entity_id, get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { plans } from "~/data/plans";
import { all, get } from "shades";
import { flatten, pipe, uniqBy, head } from "ramda";
import { get_collection, get_doc } from "~/utils/firebase";

import {
	map as rxmap,
	filter as rxfilter,
	concatMap,
	tap,
	take,
} from "rxjs/operators";
import {
	from,
	lastValueFrom,
	forkJoin,
	Subject,
	of as rxof,
	iif,
	throwError,
} from "rxjs";
import { fold } from "~/utils/operators";
import { is_authorized_f } from "~/api/auth";

const subject = new Subject();

const credit_report = subject.pipe(
	rxfilter((message) => message.id == "get_credit_report"),
	concatMap(({ args: { request } }) => {
		let entity_id = from(get_session_entity_id(request));
		let url = new URL(request.url);
		let group_id = get_group_id(url.pathname);

		let personal_credit_report_queries = [
			{
				param: "group_id",
				predicate: "==",
				value: group_id,
			},
			{
				param: "type",
				predicate: "==",
				value: "personal_credit_report",
			},
		];

		let is_authorized = forkJoin({
			entity_id,
			group_id: rxof(group_id),
		}).pipe(
			concatMap(({ entity_id, group_id }) =>
				is_authorized_f(entity_id, group_id, "credit", "read")
			),
			concatMap((is_authorized) =>
				iif(() => is_authorized, rxof(true), throwError("unauthorized"))
			)
		);

		let report = from(
			get_collection({
				path: ["credit_reports"],
				queries: personal_credit_report_queries,
			})
		).pipe(rxmap(pipe(head, get_personal_data)));

		return is_authorized.pipe(
			concatMap(() => report),
			tap((value) => {
				console.log("___tap___");
				console.log(value);
			})
		);
	})
);

const get_personal_data = (report) => {
	let { plan_id } = report;

	if (plan_id == "essential") {
		let { first_name, last_name, street, city, state, zip, dob } = report;

		let payload = {
			first_name,
			last_name,
			street,
			city,
			state,
			zip,
			dob,
		};

		return payload;
	}

	if (plan_id !== "essential") {
		let { data } = report;

		// console.log("data");
		// console.log(data);

		let first_name = Array.first_name(data);
		let last_name = Array.last_name(data);
		let residence = Array.residence(data);
		let dob = Array.dob(data);

		let street = residence["@_StreetAddress"];
		let city = residence["@_City"];
		let state = residence["@_State"];
		let zip = residence["@_PostalCode"];

		let payload = {
			first_name,
			last_name,
			street,
			city,
			state,
			zip,
			dob,
		};

		return payload;
	}
};

export const loader = async ({ request }) => {
	const on_success = async (response) => {
		console.log("___success___");
		let entity_id = await get_session_entity_id(request);
		let { plan_id } = await get_doc(["entity", entity_id]);

		let payload = { ...response, plan_id };

		subject.next({
			id: "credit_report_response",
			next: () => payload,
		});
	};

	const on_error = (error) => {
		console.log("___error___");
		console.log(error);

		subject.next({
			id: "credit_report_response",
			next: () => error,
		});
	};

	const on_complete = (value) => value.id === "credit_report_response";

	credit_report.pipe(fold(on_success, on_error)).subscribe();

	subject.next({ id: "get_credit_report", args: { request } });

	let response = await lastValueFrom(
		subject.pipe(rxfilter(on_complete), take(1))
	);

	return response.next();

	// let url = new URL(request.url);
	// let entity_id = await get_session_entity_id(request);
	// let group_id = get_group_id(url.pathname);

	// let personal_credit_report_queries = [
	// 	{
	// 		param: "group_id",
	// 		predicate: "==",
	// 		value: group_id,
	// 	},
	// 	{
	// 		param: "type",
	// 		predicate: "==",
	// 		value: "personal_credit_report",
	// 	},
	// ];

	// let report_response = await get_collection({
	// 	path: ["credit_reports"],
	// 	queries: personal_credit_report_queries,
	// });

	// let report = pipe(head)(report_response);

	// let is_owner = report.entity_id == entity_id;

	// let { plan_id } = await get_doc(["entity", entity_id]);

	// let personal_data = get_personal_data(report);

	// return { plan_id, ...personal_data };
};

const PersonalInfoCard = () => {
	let { plan_id, first_name, last_name, street, city, state, zip, dob } =
		useLoaderData();

	return (
		<div className="overflow-hidden bg-white rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Personal Information
				</h3>
				<p className="mt-1 max-w-2xl text-sm text-gray-500">
					Below is your personal information as it appears in your
					credit file. This information includes your legal name,
					current and previous addresses, employment information and
					other details.
				</p>
			</div>
			<div className="border-t border-gray-200 px-4 py-1">
				<dl className="divide-y divide-gray-200">
					<div className="py-4 flex flex-col sm:flex-row sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500 w-[200px]">
							Name
						</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							{first_name} {last_name}
						</dd>
					</div>
					<div className="py-4 flex flex-col sm:flex-row sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500 w-[200px]">
							Date of birth
						</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							{dob}
						</dd>
					</div>
					<div className="py-4 flex flex-col sm:flex-row sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500 w-[200px]">
							Address
						</dt>
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
	return (
		<div className="flex flex-col w-full">
			<PersonalInfoCard />
		</div>
	);
}
