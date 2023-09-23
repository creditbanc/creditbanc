import { get_group_id } from "~/utils/helpers";
import { lastValueFrom } from "rxjs";
import { fold } from "~/utils/operators";
import BusinessReport from "~/api/client/BusinessReport";

const log_route = `credit.report.business.api.company`;

const on_success = (response) => {
	console.log(`${log_route}.success`);
	return response;
};

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let group_id = get_group_id(url.pathname);
	let report = new BusinessReport(group_id);
	return await lastValueFrom(report.business_info.fold.pipe(fold(on_success, on_error)));
};
