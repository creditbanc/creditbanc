import SimpleNav from "~/components/SimpleNav";
import { get_collection, get_doc, set_doc, update_doc } from "~/utils/firebase";
import {
	head,
	pipe,
	identity,
	curry,
	defaultTo,
	pick,
	pickAll,
	keys,
	map,
	isEmpty,
	not,
	set,
	tryCatch,
	always,
} from "ramda";
import { get, filter, all, mod } from "shades";
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
	ReplaySubject,
	BehaviorSubject,
	firstValueFrom,
} from "rxjs";
import { fold, ifFalse, ifEmpty } from "~/utils/operators";
import { Link, useLoaderData } from "@remix-run/react";
import { create } from "zustand";
import { truncate } from "~/utils/helpers";
import { useEffect } from "react";

const useStateStore = create((set) => ({
	entities: [],
	entity: {},
	set_state: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));

const subject = new ReplaySubject(1);

const loader_data = subject.pipe(
	rxfilter((message) => message.id == "load"),
	concatMap(({ args: { request } }) => {
		let entities = from(
			get_collection({
				path: ["entity"],
			})
		).pipe(
			rxmap(
				map(
					pickAll([
						"id",
						"first_name",
						"last_name",
						"email",
						"plan_id",
						"roles",
					])
				)
			),
			rxmap((entities) => ({ entities }))
		);

		return entities.pipe(
			tap((value) => {
				console.log("admin.entities.tap");
				console.log(value);
			})
		);
	})
);

export const loader = async ({ request }) => {
	subject.next({ id: "load", args: { request } });

	const on_success = async (response) => {
		console.log("admin.entities.success");
		// console.log(response);

		subject.next({
			id: "response",
			next: () => response,
		});
	};

	const on_error = (error) => {
		console.log("admin.entities.error");
		console.log(error);

		subject.next({
			id: "response",
			next: () => error,
		});
	};

	const on_complete = (value) => value.id === "response";

	loader_data.pipe(fold(on_success, on_error)).subscribe();

	let response = await lastValueFrom(
		subject.pipe(rxfilter(on_complete), take(1))
	);

	return response.next();
};

const EntitiesTableHeader = () => {
	return (
		<div className="header flex flex-row sticky top-0 bg-white font-semibold">
			<div className="flex flex-col min-w-[150px] border-b pb-3 bg-white ">
				first name
			</div>
			<div className="flex flex-col min-w-[150px] border-b pb-3 bg-white ">
				last name
			</div>
			<div className="flex flex-col min-w-[300px] border-b pb-3 bg-white ">
				id
			</div>
			<div className="flex flex-col min-w-[100px] border-b pb-3 bg-white ">
				plan
			</div>
			<div className="flex flex-col min-w-[200px] border-b pb-3 bg-white ">
				email
			</div>
		</div>
	);
};

const EntitiesTable = () => {
	let { entities } = useLoaderData();
	let set_state = useStateStore((state) => state.set_state);

	const onSelectEntity = (entity) => {
		set_state(["entity"], entity);
	};

	return (
		<div className="flex flex-col w-full h-full">
			{pipe(
				map((entity) => (
					<div
						key={entity.id}
						className="flex flex-row text-sm cursor-pointer group"
						onClick={() => onSelectEntity(entity)}
					>
						<div className="flex flex-col min-w-[150px] border-b py-2 group-hover:bg-gray-100">
							{truncate(20, entity.first_name)}
						</div>
						<div className="flex flex-col min-w-[150px] border-b py-2 group-hover:bg-gray-100">
							{truncate(20, entity.last_name)}
						</div>
						<div className="flex flex-col min-w-[300px] border-b py-2 group-hover:bg-gray-100">
							{truncate(30, entity.id)}
						</div>
						<div className="flex flex-col min-w-[100px] border-b py-2 group-hover:bg-gray-100">
							{entity.plan_id}
						</div>
						<div className="flex flex-col min-w-[200px] border-b py-2 group-hover:bg-gray-100">
							{entity.email}
						</div>
					</div>
				))
			)(entities)}
		</div>
	);
};

const RoleAction = () => {
	let entity = useStateStore((state) => state.entity);
	let role = tryCatch(pipe(get("roles"), head), always(""))(entity);

	const onSelectRole = async (event) => {
		if (entity.id) {
			await update_doc(["entity", entity.id], {
				roles: [event.target.value],
			});
		}
	};

	return (
		<div className="flex flex-col">
			<div className="flex flex-row gap-x-2">
				<div>role:</div>
				<div>{role}</div>
			</div>

			<div>
				<select
					className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
					onChange={onSelectRole}
					defaultValue="none"
				>
					<option disabled value="none">
						Select a role
					</option>

					<option value="admin">Admin</option>
				</select>
			</div>
		</div>
	);
};

const Entity = () => {
	let entity = useStateStore((state) => state.entity);
	let set_state = useStateStore((state) => state.set_state);

	const group_id = rxof(entity).pipe(
		rxfilter((entity) => entity.id),
		concatMap((entity) => {
			let group_id = from(
				get_collection({
					path: ["group"],
					queries: [
						{
							param: "entity_id",
							predicate: "==",
							value: entity.id,
						},
						{
							param: "type",
							predicate: "==",
							value: "partition",
						},
					],
				})
			).pipe(rxfilter(pipe(isEmpty, not)), rxmap(pipe(head, get("id"))));

			return group_id.pipe(
				tap((value) => {
					console.log("admin.entities.group.tap");
					console.log(value);
				})
			);
		})
	);

	useEffect(() => {
		group_id.subscribe((group_id) =>
			set_state(["entity", "group_id"], group_id)
		);
	}, [entity.id]);

	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-col w-full border-b px-2">
				<div className="font-semibold">User</div>
				<div className="flex flex-col text-sm gap-y-2 py-2">
					<div className="flex flex-row gap-x-2">
						<div className="font-semibold">entity_id:</div>
						<div>{entity.id}</div>
					</div>

					<div className="flex flex-row gap-x-2">
						<div className="font-semibold">group_id:</div>
						<div>{entity.group_id}</div>
					</div>

					<div className="flex flex-row gap-x-2">
						<div className="font-semibold">name:</div>
						<div>
							{entity.first_name} {entity.last_name}
						</div>
					</div>

					<div className="flex flex-row gap-x-2">
						<div className="font-semibold">email:</div>
						<div>{entity.email}</div>
					</div>

					<div className="flex flex-row gap-x-2">
						<div className="font-semibold">plan:</div>
						<div>{entity.plan_id}</div>
					</div>

					<div className="flex flex-row gap-x-2">
						<div className="font-semibold">next billing date:</div>
						<div>{}</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col w-full border-b px-2">
				<div className="font-semibold">Status</div>
				<div className="flex flex-col text-sm gap-y-2 py-2">
					<div className="flex flex-row gap-x-2">
						<div>business credit report:</div>
						<div>true</div>
					</div>
					<div className="flex flex-row gap-x-2">
						<div>personal credit report:</div>
						<div>false</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col w-full border-b px-2">
				<div className="font-semibold">Quick Links</div>
				<div className="flex flex-col text-sm gap-y-2 py-2">
					<div className="flex flex-row gap-x-2">
						<div>business credit report</div>
					</div>
					<div className="flex flex-row gap-x-2">
						<Link
							to={`/credit/report/personal/personal/resource/e/${entity.id}/g/${entity.group_id}`}
						>
							personal credit report
						</Link>
					</div>
				</div>
			</div>
			<div className="flex flex-col w-full border-b px-2">
				<div className="font-semibold">Actions</div>
				<div className="flex flex-col text-sm gap-y-2 py-2">
					<RoleAction />
				</div>
			</div>
		</div>
	);
};

export default function Entities() {
	return (
		<div className="flex flex-col w-full h-full overflow-hidden">
			<div className="flex flex-col border-b">
				<SimpleNav />
			</div>
			<div className="flex flex-col w-full h-full py-2 px-3 overflow-hidden">
				<div className="flex flex-col w-full h-full  overflow-y-auto">
					<div className="flex flex-row w-full h-full gap-x-2">
						<div className="flex flex-col h-full flex-1 px-3 overflow-scroll scrollbar-hide ">
							<EntitiesTableHeader />
							<EntitiesTable />
						</div>
						<div className="flex flex-col w-[30%] border">
							<Entity />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
