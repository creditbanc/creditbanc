import { get, all, mod, filter } from "shades";
import {
	pipe,
	map,
	splitWhenever,
	head,
	pick,
	tryCatch,
	always,
	uniqBy,
	flatten,
} from "ramda";
import { inspect, currency } from "~/utils/helpers";
import axios from "axios";
import { mapIndexed } from "~/utils/helpers";

export const is_sandbox = false;

export const appKey = is_sandbox
	? "F5C7226A-4F96-43BF-B748-09278FFE0E36"
	: "F5C7226A-4F96-43BF-B748-09278FFE0E36";

export const report_url = is_sandbox
	? "https://sandbox.array.io/api/report/v2"
	: "https://array.io/api/report/v2";

export class ArrayExternal {
	static refreshDisplayToken = async (clientKey, reportKey) => {
		console.log("refreshDisplayToken");
		const options = {
			method: "PUT",
			maxBodyLength: Infinity,
			url: "https://array.io/api/report/v2",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json",
				"x-credmo-client-token": "8241960C-7A8B-4389-BB6C-1AAF99E7873C",
			},
			data: { clientKey, reportKey },
		};

		let resposne = await axios.request(options);
		return resposne?.data;
		// .then(function (response) {
		// 	console.log("refreshDisplayToken___response___");
		// 	console.log(response.data);
		// })
		// .catch(function (error) {
		// 	console.error(error);
		// });
	};

	static get_credit_report = async (reportKey, displayToken) => {
		console.log("get_credit_report");
		var options = {
			method: "get",
			maxBodyLength: Infinity,
			url: `${report_url}?reportKey=${reportKey}&displayToken=${displayToken}`,
			headers: {
				"Content-Type": "application/json",
			},
		};

		let response = await axios(options);

		// console.log("response");
		// console.log(response);

		let retry = async (delay_time_in_milliseconds) => {
			// console.log("retry_____");
			return new Promise((resolve, reject) => {
				setTimeout(async () => {
					let response = await get_credit_report(
						reportKey,
						displayToken
					);
					resolve(response);
				}, delay_time_in_milliseconds);
			});
		};

		if (response?.data) {
			return response.data;
		} else {
			let response = await retry(3000);
			return response;
		}
	};
}
