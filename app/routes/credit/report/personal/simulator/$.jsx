import { TrophyIcon } from "@heroicons/react/24/outline";
import { pipe } from "ramda";
import { get_group_id, mapIndexed } from "~/utils/helpers";
import { useLoaderData } from "@remix-run/react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { lastValueFrom } from "rxjs";
import { fold } from "~/utils/operators";
import PersonalReport from "~/api/client/PersonalReport";
import { use_cache } from "~/components/CacheLink";
import { useEffect } from "react";
import { on_success } from "~/routes/credit/report/personal/success";
import { is_authorized } from "../authorized";
import { redirect } from "@remix-run/node";
import { appKey } from "~/data/array";

const log_route = `credit.report.personal.mix`;

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const loader = async ({ request }) => {
	if (!(await is_authorized(request))) return redirect("/home");
	let url = new URL(request.url);
	let group_id = get_group_id(url.pathname);
	let report = new PersonalReport(group_id);
	let payload = report.user_token.fold;
	let response = await lastValueFrom(payload.pipe(fold(on_success(request), on_error)));
	return response;
};

export default function Factors() {
	let loader_data = useLoaderData();
	let { cache_dependencies, user_token } = loader_data;

	return (
		<div>
			<array-credit-score-simulator appKey={appKey} userToken={user_token}></array-credit-score-simulator>
		</div>
	);
}
