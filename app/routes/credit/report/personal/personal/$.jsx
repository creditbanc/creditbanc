import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { Array } from "~/data/array";
import { get_file_id, inspect } from "~/utils/helpers";
import { get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { plans } from "~/data/plans";
import { get } from "shades";
import { pipe } from "ramda";

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

		console.log("data");
		console.log(data);

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
	let url = new URL(request.url);
	let file_id = get_file_id(url.pathname);
	let entity_id = await get_user_id(request);

	let report = await prisma.personal_credit_report.findUnique({
		where: {
			id: file_id,
		},
	});

	let is_owner = report.entity_id == entity_id;

	let { plan_id } = await prisma.entity.findUnique({
		where: { id: is_owner ? entity_id : report.entity_id },
		select: {
			plan_id: true,
		},
	});

	let personal_data = get_personal_data(report);

	return { plan_id, ...personal_data };
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
	return <div className="flex flex-col w-full">{<PersonalInfoCard />}</div>;
}
