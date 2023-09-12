import { Observable } from "rxjs";

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
