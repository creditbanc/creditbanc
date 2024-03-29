import { useLoaderData } from "@remix-run/react";
import { get_group_id, inspect } from "~/utils/helpers";
import { lastValueFrom, map as rxmap, tap } from "rxjs";
import { fold } from "~/utils/operators";
import PersonalReport from "~/api/client/PersonalReport";
import { use_cache } from "~/components/CacheLink";
import { useEffect } from "react";
import { on_success } from "~/routes/credit/report/personal/success";
import { is_authorized } from "../authorized";
import { redirect } from "@remix-run/node";
import { appKey } from "~/data/array";

const log_route = `credit.report.personal.debtanalysis`;

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
	let payload = report.user_token.fold;
	let response = await lastValueFrom(payload.pipe(fold(on_success(request), on_error)));
	return response;
};

export default function Personal() {
	let loader_data = useLoaderData();
	let { user_token } = loader_data;
	let use_cache_client = use_cache((state) => state.set_dependencies);

	return (
		<div>
			<array-credit-debt-analysis appKey={appKey} userToken={user_token}></array-credit-debt-analysis>
		</div>
	);
}
