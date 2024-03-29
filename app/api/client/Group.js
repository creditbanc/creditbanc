import { get, inspect, normalize_id } from "~/utils/helpers";
import { always, curry, equals, filter, gt, head, ifElse, length, pickAll, pipe, __ } from "ramda";
import { get_collection, get_doc, server_timestamp, set_doc, update_doc } from "~/utils/firebase";
import { map as rxmap, filter as rxfilter, concatMap, catchError, tap, take } from "rxjs/operators";
import { from, of as rxof, forkJoin, ReplaySubject, throwError } from "rxjs";
import { ArrayExternal } from "~/api/external/Array";
import { ArrayInternal } from "~/api/internal/Array";
import { appKey } from "~/data/array";
import moment from "moment";

const log_route = `api.client.Group`;

const merge_with_current = curry((current, data) => {
	return current.pipe(
		rxmap((response) => {
			return { ...response, ...data };
		})
	);
});

const catch_with_default = curry((default_value, fn_name, error) => {
	console.log(`${log_route}.error.${fn_name}`);
	console.log(error);
	console.log(default_value);
	return rxof(default_value);
});

let group_config_query = (group_id) => {
	return {
		path: ["role_configs"],
		queries: [
			{
				param: "group_id",
				predicate: "==",
				value: group_id,
			},
		],
		limit: [1],
	};
};

export default class Group {
	constructor(group_id) {
		this.group_id = group_id;
		this.response = rxof({});
	}

	get has_reports() {
		let reports_queries = (group_id) => [
			{
				param: "group_id",
				predicate: "==",
				value: group_id,
			},
		];

		let get_credit_reports = async (group_id) =>
			await get_collection({ path: ["credit_reports"], queries: reports_queries(group_id) });

		let personal_filter = (report) => report.type == "personal_credit_report";
		let business_filter = (report) => report.type == "business_credit_report";

		this.response = from(get_credit_reports(this.group_id)).pipe(
			rxmap((reports) => ({
				personal_report: pipe(filter(personal_filter), length, gt(__, 0))(reports),
				business_report: pipe(filter(business_filter), length, gt(__, 0))(reports),
			})),
			catchError(catch_with_default({ personal: false, business: false }, "has_reports")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get entity() {
		let group_id = this.group_id;
		this.response = from(get_collection(group_config_query(group_id))).pipe(
			rxmap(pipe(head, get("entity_id"))),
			concatMap((entity_id) => from(get_doc(["entity", entity_id]))),
			catchError(catch_with_default({}, "entity")),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get fold() {
		return this.response.pipe(
			catchError((error) => {
				console.log("Group.error");
				console.log(error);
				return throwError(() => error);
			}),
			tap(() => console.log(`Group.fold`)),
			tap(inspect)
		);
	}
}
