import { curry } from "ramda";
import { get_doc } from "~/utils/firebase";
import { from, of as rxof } from "rxjs";
import { map as rxmap, concatMap, catchError } from "rxjs/operators";

const merge_with_current = curry((current, data) => {
	return current.pipe(
		rxmap((response) => {
			return { ...response, ...data };
		})
	);
});

export default class Entity {
	constructor(entity_id) {
		let entity = from(get_doc(["entity", entity_id]));
		this._entity_id = entity_id;
		this.response = rxof({});
		this.entity = entity;
	}

	get plan_id() {
		this.response = this.entity.pipe(
			rxmap((entity) => ({ plan_id: entity.plan_id })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get identity() {
		this.response = this.entity.pipe(
			rxmap((entity) => ({ identity: entity })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get entity_id() {
		this.response = this.entity.pipe(
			rxmap(() => ({ entity_id: this._entity_id })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get fold() {
		return this.response.pipe(
			catchError((error) => {
				console.log("api.client.Entity.fold");
				console.log(error);
			})
		);
	}
}
