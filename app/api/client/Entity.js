import { curry, head, identity, pickAll, pipe, values } from "ramda";
import { get_doc, get_collection } from "~/utils/firebase";
import { forkJoin, from, merge, of as rxof, zip } from "rxjs";
import { map as rxmap, concatMap, catchError, reduce as rxreduce, filter as rxfilter, tap } from "rxjs/operators";
import { get, inspect } from "~/utils/helpers";
import { is_authorized_f } from "../auth";

const merge_with_current = curry((current, data) => {
	return current.pipe(
		rxmap((response) => {
			return { ...response, ...data };
		})
	);
});

let shared_config_query = (entity_id) => {
	return {
		path: ["roles"],
		queries: [
			{
				param: "entity_id",
				predicate: "==",
				value: entity_id,
			},
		],
	};
};

let entity_config_query = (entity_id) => {
	return {
		path: ["role_configs"],
		queries: [
			{
				param: "entity_id",
				predicate: "==",
				value: entity_id,
			},
		],
		limit: [1],
	};
};

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

const get_group_entity = (group_id) => {
	return from(get_collection(group_config_query(group_id))).pipe(
		rxmap(pipe(head, get("entity_id"))),
		concatMap((entity_id) => from(get_doc(["entity", entity_id])))
	);
};

let edit_roles = (group_id) =>
	rxof(group_id).pipe(
		rxfilter((group_id) => group_id !== undefined),
		concatMap((group_id) =>
			from(
				get_collection({
					path: ["role_configs"],
					queries: [
						{
							param: "group_id",
							predicate: "==",
							value: group_id,
						},
					],
				})
			)
		)
	);

let read_roles = (group_id) =>
	rxof(group_id).pipe(
		rxfilter((group_id) => group_id !== undefined),
		concatMap((group_id) =>
			from(
				get_collection({
					path: ["role_configs"],
					queries: [
						{
							param: "group_id",
							predicate: "==",
							value: group_id,
						},
						{
							param: "name",
							predicate: "==",
							value: "@default",
						},
					],
				})
			)
		)
	);

export default class Entity {
	constructor(entity_id) {
		let entity = from(get_doc(["entity", entity_id]));
		this._entity_id = entity_id;
		this.response = rxof({});
		this.entity = entity;
	}

	get identity() {
		this.response = this.entity.pipe(
			rxmap((entity) => ({ identity: entity })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get plan_id() {
		this.response = this.entity.pipe(
			rxmap((entity) => ({ plan_id: entity.plan_id })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get _group_id_() {
		return this.entity.pipe(
			rxmap(pipe(get("id"))),
			concatMap(pipe(entity_config_query, get_collection)),
			rxmap(pipe(head, get("group_id")))
		);
	}

	get group_id() {
		this.response = this._group_id_.pipe(
			rxmap((group_id) => ({ group_id })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get _entity_id_() {
		return rxof(this._entity_id);
	}

	get entity_id() {
		this.response = rxof(this._entity_id).pipe(
			rxmap((entity_id) => ({ entity_id })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get _owner_companies_() {
		const get_entity_props = pipe(pickAll(["first_name", "last_name", "id", "email"]));
		const with_group_id = (group_id) => (entity) => ({ ...entity, group_id });

		return this.entity.pipe(
			concatMap((entity) =>
				from(get_collection(entity_config_query(entity.id))).pipe(
					concatMap(identity),
					concatMap((group) =>
						get_group_entity(group.group_id).pipe(
							rxmap(pipe(get_entity_props, with_group_id(group.group_id)))
						)
					)
				)
			),
			rxreduce((acc, curr) => [...acc, curr], []),
			concatMap(merge_with_current(this.response))
		);
	}

	get owner_companies() {
		this.response = this._owner_companies_.pipe(concatMap(merge_with_current(this.response)));
		return this;
	}

	get _shared_companies_() {
		const get_entity_props = pipe(pickAll(["first_name", "last_name", "id", "email"]));
		const with_group_id = (group_id) => (entity) => ({ ...entity, group_id });

		return this.entity.pipe(
			concatMap((entity) =>
				from(get_collection(shared_config_query(entity.id))).pipe(
					concatMap(identity),
					concatMap((group) =>
						get_group_entity(group.group_id).pipe(
							rxmap(pipe(get_entity_props, with_group_id(group.group_id)))
						)
					)
				)
			),
			rxreduce((acc, curr) => [...acc, curr], []),
			concatMap(merge_with_current(this.response))
		);
	}

	get shared_companies() {
		this.response = this._shared_companies_.pipe(concatMap(merge_with_current(this.response)));
		return this;
	}

	get companies() {
		this.response = zip([this._owner_companies_, this._shared_companies_]).pipe(
			rxmap(([owner_companies, shared_companies]) => ({
				companies: {
					owner_companies: values(owner_companies),
					shared_companies: values(shared_companies),
				},
			})),
			concatMap(merge_with_current(this.response))
		);
		return this;
	}

	get roles() {
		let entity_id = this._entity_id_;
		let group_id = this._group_id_;

		const can_edit = forkJoin({ entity_id, group_id }).pipe(
			concatMap(({ entity_id, group_id }) => from(is_authorized_f(entity_id, group_id, "share", "edit")))
		);

		const can_read = forkJoin({ entity_id, group_id }).pipe(
			concatMap(({ entity_id, group_id }) => from(is_authorized_f(entity_id, group_id, "share", "read")))
		);

		let is_authorized = forkJoin({ can_edit, can_read });

		let edit_permissions = is_authorized.pipe(
			rxfilter((value) => value.can_edit == true),
			concatMap(() => group_id),
			concatMap(edit_roles)
		);

		let read_permissions = is_authorized.pipe(
			rxfilter((value) => value.can_edit == false && value.can_read == true),
			concatMap(() => group_id),
			concatMap(read_roles)
		);

		let no_permissions = is_authorized.pipe(
			rxfilter((value) => value.can_edit == false && value.can_read == false),
			rxmap(() => false)
		);

		let roles = merge(edit_permissions, read_permissions, no_permissions);

		this.response = roles.pipe(
			rxmap((roles) => ({ roles })),
			concatMap(merge_with_current(this.response))
		);

		return this;
	}

	get fold() {
		return this.response.pipe(
			catchError((error) => {
				console.log("api.client.Entity.fold.error");
				console.log(error);
			})
		);
	}
}
