import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useLocation,
} from "@remix-run/react";
import styles from "./styles/app.css";
import { useTransition } from "@remix-run/react";
import { create } from "zustand";
import { useEffect } from "react";
const cb_logo_3 = "/images/logos/cb_logo_3.png";
import { array_script_tag, kba_script_tag } from "./data/array";
import { get_entity, get_session_entity_id } from "./utils/auth.server";
import { get_group_id, is_location } from "./utils/helpers";
import SimpleNavSignedIn from "~/components/SimpleNavSignedIn";
import Spinner from "./components/LoadingSpinner";
import { get_collection } from "~/utils/firebase";
import {
	map as rxmap,
	filter as rxfilter,
	concatMap,
	tap,
	take,
} from "rxjs/operators";
import {
	from,
	lastValueFrom,
	forkJoin,
	Subject,
	of as rxof,
	merge,
} from "rxjs";
import { fold } from "~/utils/operators";
import { is_authorized_f } from "~/api/auth";

const log_route = `root`;

const subject = new Subject();

const $loader = subject.pipe(
	rxfilter((message) => message.id == "load"),
	concatMap(({ args: { request } }) => {
		let url = new URL(request.url);
		let group_id = rxof(get_group_id(url.pathname));
		let entity_id = from(get_session_entity_id(request));
		let entity = from(get_entity(request));

		const can_edit = forkJoin({ entity_id, group_id }).pipe(
			concatMap(({ entity_id, group_id }) =>
				from(is_authorized_f(entity_id, group_id, "share", "edit"))
			)
		);

		const can_read = forkJoin({ entity_id, group_id }).pipe(
			concatMap(({ entity_id, group_id }) =>
				from(is_authorized_f(entity_id, group_id, "share", "read"))
			)
		);

		let is_authorized = forkJoin({ can_edit, can_read });

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

		let edit_permissions = is_authorized.pipe(
			rxfilter((value) => value.can_edit == true),
			concatMap(() => group_id),
			concatMap(edit_roles)
		);

		let read_permissions = is_authorized.pipe(
			rxfilter(
				(value) => value.can_edit == false && value.can_read == true
			),
			concatMap(() => group_id),
			concatMap(read_roles)
		);

		let no_permissions = is_authorized.pipe(
			rxfilter(
				(value) => value.can_edit == false && value.can_read == false
			),
			rxmap(() => false)
		);

		let $roles = merge(edit_permissions, read_permissions, no_permissions);

		return $roles.pipe(
			concatMap((roles) => {
				return forkJoin({
					roles: rxof(roles),
					entity_id,
					entity,
				});
			}),
			tap((value) => {
				console.log("root.tap");
				console.log(value);
			})
		);
	})
);

export const useSpinner = create((set) => ({
	show_spinner: false,
	setSpinner: (show_spinner) => set((state) => ({ show_spinner })),
}));

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const meta = () => ({
	charset: "utf-8",
	title: "Credit Banc",
	viewport: "width=device-width,initial-scale=1",
});

export const loader = async ({ request }) => {
	const on_success = async (response) => {
		console.log(`${log_route}.success`);

		subject.next({
			id: "response",
			next: () => response,
		});
	};

	const on_error = (error) => {
		console.log(`${log_route}.error`);
		console.log(error);

		subject.next({
			id: "response",
			next: () => error,
		});
	};

	const on_complete = (value) => value.id === "response";

	$loader.pipe(fold(on_success, on_error)).subscribe();

	subject.next({ id: "load", args: { request } });

	let response = await lastValueFrom(
		subject.pipe(rxfilter(on_complete), take(1))
	);

	return response.next();
};

export default function App() {
	let { pathname } = useLocation();
	const transition = useTransition();
	const show_spinner = useSpinner((state) => state.show_spinner);
	const setSpinner = useSpinner((state) => state.setSpinner);
	let { entity_id, roles } = useLoaderData();

	useEffect(() => {
		if (transition.state !== "idle") {
			setSpinner(true);
		} else {
			setSpinner(false);
		}
	}, [transition.state]);

	let is_resource_path = is_location("/resource", pathname);

	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
				<script src={kba_script_tag}></script>
				<script src={array_script_tag}></script>
			</head>
			<body className="flex flex-col relative">
				{show_spinner && <Spinner />}
				{!show_spinner && (
					<div className="flex flex-col w-full h-full relative overflow-hidden">
						{is_resource_path && (
							<div className="flex flex-col w-full border-b bg-white sticky top-0 z-[99]">
								<SimpleNavSignedIn
									entity_id={entity_id}
									roles={roles}
								/>
							</div>
						)}
						<Outlet />
					</div>
				)}
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
