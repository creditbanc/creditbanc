import SimpleNav from "~/components/SimpleNav";
import { delete_doc, get_collection, get_doc, set_doc, update_doc } from "~/utils/firebase";
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
	isNil,
	sortBy,
	sortWith,
	descend,
	ascend,
} from "ramda";
import { get, filter, all, mod } from "shades";
import { map as rxmap, filter as rxfilter, concatMap, tap, take, catchError } from "rxjs/operators";
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
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { create } from "zustand";
import { truncate, classNames, form_params, store } from "~/utils/helpers";
import { useEffect, useState } from "react";
import moment from "moment";
import { EllipsisHorizontalCircleIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

const useStateStore = create((set) => ({
	entities: [],
	entity: {},
	set_state: (path, value) => set((state) => pipe(mod(...path)(() => value))(state)),
}));

let use_entites = store({ entities: [] });

const subject = new ReplaySubject(1);

const loader_data = subject.pipe(
	rxfilter((message) => message.id == "load"),
	concatMap(({ args: { request } }) => {
		console.log("admin.entities.load");
		let entities = from(
			get_collection({
				path: ["entity"],
			})
		).pipe(
			rxmap(map(pickAll(["id", "first_name", "last_name", "email", "plan_id", "roles", "created_at"]))),
			rxmap(filter((value) => value.created_at)),
			rxmap((entities) => ({ entities }))
		);

		return entities
			.pipe
			// tap((value) => {
			// 	console.log("admin.entities.tap");
			// 	console.log(value);
			// })
			();
	})
);

export const action = async ({ request }) => {
	let { data } = await form_params(request);
	let { action, args } = JSON.parse(data);
	switch (action) {
		case "delete":
			let { entiy_id } = args;
			await delete_doc(["entity", entiy_id]);
			break;
		default:
			break;
	}
	return null;
};

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
			next: () => error ?? null,
		});
	};

	const on_complete = (value) => value.id === "response";

	loader_data.pipe(fold(on_success, on_error)).subscribe();

	let response = await lastValueFrom(subject.pipe(rxfilter(on_complete), take(1)));

	return response.next();
};

const EntitiesTableHeader = () => {
	let { entities, set_path } = use_entites();
	let [sort_order, set_sort_order] = useState("ascend");

	const onSortCreated = () => {
		let sort_on = pipe(get("created_at", "seconds"));
		let sorter = sort_order == "ascend" ? ascend(sort_on) : descend(sort_on);
		let res = pipe(sortWith([sorter]))(entities);
		set_sort_order(sort_order == "ascend" ? "descend" : "ascend");
		set_path(["entities"], res);
	};

	return (
		<div className="flex flex-col w-full h-[40px]">
			<div className="flex flex-row bg-white font-semibold h-full">
				<div className="flex flex-col min-w-[150px] border-b pb-3 bg-white ">first name</div>
				<div className="flex flex-col min-w-[150px] border-b pb-3 bg-white ">last name</div>
				<div className="flex flex-col min-w-[100px] border-b pb-3 bg-white ">plan</div>
				<div className="flex flex-col min-w-[250px] border-b pb-3 bg-white ">email</div>
				<div
					className="flex flex-col min-w-[200px] border-b pb-3 bg-white cursor-pointer"
					onClick={onSortCreated}
				>
					created
				</div>
				<div className="flex flex-col flex-1 border-b justify-center items-end min-w-[50px]"></div>
			</div>
		</div>
	);
};

const ActionsDropdown = () => {
	let fetcher = useFetcher();
	let entity = useStateStore((state) => state.entity);

	const onDelete = () => {
		console.log("onDelete");

		let data = JSON.stringify({
			action: "delete",
			args: { entiy_id: entity.id },
		});

		fetcher.submit({ data }, { method: "POST" });
		// delete_doc(["entity", entity.id]);
	};

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex w-full justify-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-gray-900">
					<EllipsisHorizontalCircleIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<div
									onClick={onDelete}
									className={classNames(
										active ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"block px-4 py-2 text-sm"
									)}
								>
									Delete
								</div>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

const EntitiesTable = () => {
	// let { entities } = useLoaderData();
	let { entities } = use_entites();
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
						<div className="flex flex-col min-w-[150px] border-b p-2 group-hover:bg-gray-100">
							{truncate(15, entity.first_name)}
						</div>
						<div className="flex flex-col min-w-[150px] border-b p-2 group-hover:bg-gray-100">
							{truncate(15, entity.last_name)}
						</div>
						<div className="flex flex-col min-w-[100px] border-b p-2 group-hover:bg-gray-100">
							{entity.plan_id}
						</div>
						<div className="flex flex-col min-w-[250px] border-b p-2 group-hover:bg-gray-100">
							{entity.email}
						</div>
						<div className="flex flex-col min-w-[200px] border-b p-2 group-hover:bg-gray-100">
							{entity.created_at &&
								moment(new Date(entity.created_at.seconds * 1000)).format("MM-DD-YYYY")}
						</div>
						<div className="flex flex-col flex-1 border-b justify-center items-end group-hover:bg-gray-100 min-w-[50px]">
							<ActionsDropdown />
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

const BusinessReportStatus = () => {
	let entity = useStateStore((state) => state.entity);
	let { group_id, has_business_credit_report = false } = entity;
	let set_state = useStateStore((state) => state.set_state);

	useEffect(() => {
		let business_credit_report_queries = (group_id) => [
			{
				param: "group_id",
				predicate: "==",
				value: group_id,
			},
			{
				param: "type",
				predicate: "==",
				value: "business_credit_report",
			},
		];

		let get_business_credit_report = (group_id) =>
			from(
				get_collection({
					path: ["credit_reports"],
					queries: business_credit_report_queries(group_id),
				})
			);

		rxof(group_id)
			.pipe(rxfilter(pipe(isNil, not)), concatMap(get_business_credit_report))
			.subscribe((response) => {
				if (response.length > 0) {
					set_state(["entity", "has_business_credit_report"], true);
				} else {
					set_state(["entity", "has_business_credit_report"], false);
				}
			});
	}, [group_id]);

	return (
		<div className="flex flex-row gap-x-2">
			<div>business credit report:</div>
			<div>{`${has_business_credit_report}`}</div>
		</div>
	);
};

const PersonalReportStatus = () => {
	let entity = useStateStore((state) => state.entity);
	let { group_id, has_personal_credit_report = false } = entity;
	let set_state = useStateStore((state) => state.set_state);

	useEffect(() => {
		let personal_credit_report_queries = (group_id) => [
			{
				param: "group_id",
				predicate: "==",
				value: group_id,
			},
			{
				param: "type",
				predicate: "==",
				value: "personal_credit_report",
			},
		];

		let get_personal_credit_report = (group_id) =>
			from(
				get_collection({
					path: ["credit_reports"],
					queries: personal_credit_report_queries(group_id),
				})
			);

		rxof(group_id)
			.pipe(rxfilter(pipe(isNil, not)), concatMap(get_personal_credit_report))
			.subscribe((response) => {
				if (response.length > 0) {
					set_state(["entity", "has_personal_credit_report"], true);
				} else {
					set_state(["entity", "has_personal_credit_report"], false);
				}
			});
	}, [group_id]);

	return (
		<div className="flex flex-row gap-x-2">
			<div>personal credit report:</div>
			<div>{`${has_personal_credit_report}`}</div>
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
		group_id.subscribe((group_id) => set_state(["entity", "group_id"], group_id));
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
					<BusinessReportStatus />
					<PersonalReportStatus />
				</div>
			</div>

			<div className="flex flex-col w-full border-b px-2">
				<div className="font-semibold">Quick Links</div>
				<div className="flex flex-col text-sm gap-y-2 py-2">
					<div className="flex flex-row gap-x-2">
						<Link to={`/home/resource/e/${entity.id}/g/${entity.group_id}`}>Dashboard</Link>
					</div>

					<div className="flex flex-row gap-x-2">
						<Link
							to={`/credit/report/business/experian/status/resource/e/${entity.id}/g/${entity.group_id}`}
						>
							Intelliscore business credit report
						</Link>
					</div>

					<div className="flex flex-row gap-x-2">
						<Link
							to={`/credit/report/business/experian/status/resource/e/${entity.id}/g/${entity.group_id}`}
						>
							Dun & Bradstreet business credit report
						</Link>
					</div>
					<div className="flex flex-row gap-x-2">
						<Link to={`/credit/report/personal/personal/resource/e/${entity.id}/g/${entity.group_id}`}>
							Personal credit report
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
	let { set_path } = use_entites();
	let { entities: loader_entities = [] } = useLoaderData();

	useEffect(() => {
		if (loader_entities.length > 0) {
			set_path(["entities"], loader_entities);
		}
	}, [loader_entities]);

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
