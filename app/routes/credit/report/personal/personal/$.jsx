import { useLoaderData } from "@remix-run/react";
import { get_group_id, inspect } from "~/utils/helpers";
import { concatMap, from, lastValueFrom, map as rxmap, tap } from "rxjs";
import { fold } from "~/utils/operators";
import PersonalReport from "~/api/client/PersonalReport";
import { useEffect, useState } from "react";
import { on_success } from "~/routes/credit/report/personal/success";
import { is_authorized } from "../authorized";
import { redirect } from "@remix-run/node";
import { appKey } from "~/data/array";
import moment from "moment";

const log_route = `credit.report.personal.personal`;

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const loader = async ({ request }) => {
	// if (!(await is_authorized(request))) return redirect("/home");
	let url = new URL(request.url);
	let group_id = get_group_id(url.pathname);
	let report = new PersonalReport(group_id);
	let payload = report.user_token.first_name.last_name.fold;
	let response = await lastValueFrom(payload.pipe(fold(on_success(request), on_error)));
	return response;
};

export default function Personal() {
	let loader_data = useLoaderData();
	let { user_token, first_name, last_name } = loader_data;

	console.log("loader_data_____");
	console.log(loader_data);

	return (
		<div>
			<div className="flex flex-col w-full items-center my-10 px-5">
				<div className="flex flex-col max-w-4xl text-center">
					<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
						{first_name} {last_name}
					</h1>
					<div className="flex flex-row w-full justify-center gap-x-2 mt-6 text-lg leading-8 text-gray-600">
						<div>Personal:</div>
						<div className="font-semibold">{moment().format("MM-DD-YYYY")}</div>
					</div>
				</div>
			</div>

			<array-credit-report appKey={appKey} userToken={user_token}></array-credit-report>
		</div>
	);
}
