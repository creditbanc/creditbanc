import { get_group_id, inspect } from "~/utils/helpers";
import { get, mod } from "shades";
import { head, pipe } from "ramda";
import { Lendflow } from "~/data/lendflow";
import { get_collection, get_doc, set_doc } from "~/utils/firebase";
import { LendflowExternal, LendflowInternal } from "~/utils/lendflow.server";
import {
	map as rxmap,
	filter as rxfilter,
	concatMap,
	tap,
	take,
	catchError,
} from "rxjs/operators";
import {
	from,
	lastValueFrom,
	forkJoin,
	Subject,
	of as rxof,
	iif,
	throwError,
	merge,
	ReplaySubject,
} from "rxjs";
import { fold, ifEmpty, ifFalse } from "~/utils/operators";
import { is_authorized_f } from "~/api/auth";
import { get_session_entity_id } from "~/utils/auth.server";
import { json } from "@remix-run/node";
import { eventStream } from "remix-utils";

const subject = new ReplaySubject(1);

// export const action = async ({ request }) => {
// 	console.log("credit.report.ssescores.action");

// 	subject.next({ id: "get_credit_report", args: { request } });
// 	return json({ message: "test1" });
// };

// export async function loader({ request }) {
// 	console.log("credit.report.ssescores.loader");

// 	return eventStream(request.signal, function setup(send) {
// 		subject.pipe(concatMap(() => credit_report)).subscribe((value) => {
// 			console.log("credit.report.ssescores.subject.subscribe");

// 			send({ event: "time", data: JSON.stringify(value) });
// 		});

// 		return function clear() {
// 			// subject.complete();
// 		};
// 	});
// }
