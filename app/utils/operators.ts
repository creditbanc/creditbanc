import { curry } from "ramda";
import { Observable, iif, of, throwError } from "rxjs";

export const fold = (successFn, errorFn) => {
	return function (source) {
		return new Observable((subscriber) => {
			source.subscribe({
				next(value) {
					subscriber.next(successFn(value));
				},
				error(error) {
					subscriber.next(errorFn(error));
				},
				complete() {
					subscriber.complete();
				},
			});
		});
	};
};

export const ifFalse = curry((ifFalseObservable, predicate) => {
	return iif(() => predicate, of(true), ifFalseObservable);
});
