import { lastValueFrom } from "rxjs";
import BusinessReport from "~/api/client/BusinessReport";
import { get_group_id } from "~/utils/helpers";
import { fold } from "~/utils/operators";

const log_route = `credit.report.api.business.shas.$`;

const on_success = (response) => {
	console.log(`${log_route}.success`);
	return response;
};

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const action = async ({ request }) => {
	console.log(`${log_route}.action`);
	let url = new URL(request.url);
	let group_id = get_group_id(url.pathname);
	let report = new BusinessReport(group_id);
	let response = report.application_id.shas.fold;

	let payload = await lastValueFrom(response.pipe(fold(on_success, on_error)));
	return payload;
};
