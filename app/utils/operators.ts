import { curry, isEmpty } from "ramda";
import { Observable, concatMap, iif, of, throwError, withLatestFrom } from "rxjs";

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

export const ifTrue = (successFn) => {
	return function (source) {
		return new Observable((subscriber) => {
			source.subscribe({
				next(value) {
					value == true ? subscriber.next(successFn()) : subscriber.next(value);
				},
				error(error) {
					subscriber.next(error);
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

export const ifEmpty = curry((ifEmptyObservable, value) => {
	return iif(() => isEmpty(value), ifEmptyObservable, of(value));
});
