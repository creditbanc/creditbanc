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
import { appKey, array_script_tag, kba_script_tag } from "./data/array";
import { get_session_entity_id } from "./utils/auth.server";
import { is_location } from "./utils/helpers";
import SimpleNavSignedIn from "~/components/SimpleNavSignedIn";
import Spinner from "./components/LoadingSpinner";
import { lastValueFrom } from "rxjs";
import { fold } from "~/utils/operators";
import Entity from "./api/client/Entity";

const log_route = `root`;

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

const load_intercom = () => {
	window.intercomSettings = {
		api_base: "https://api-iam.intercom.io",
		app_id: "lh4nbwaz",
	};

	var w = window;
	var ic = w.Intercom;
	if (typeof ic === "function") {
		ic("reattach_activator");
		ic("update", w.intercomSettings);
	} else {
		var d = document;
		var i = function () {
			i.c(arguments);
		};
		i.q = [];
		i.c = function (args) {
			i.q.push(args);
		};
		w.Intercom = i;
		var l = function () {
			var s = d.createElement("script");
			s.type = "text/javascript";
			s.async = true;
			s.src = "https://widget.intercom.io/widget/lh4nbwaz";
			var x = d.getElementsByTagName("script")[0];
			x.parentNode.insertBefore(s, x);
		};
		if (document.readyState === "complete") {
			l();
		} else if (w.attachEvent) {
			w.attachEvent("onload", l);
		} else {
			w.addEventListener("load", l, false);
		}
	}
};

const on_success = (response) => {
	console.log(`${log_route}.success`);
	return response;
};

const on_error = (error) => {
	console.log(`${log_route}.error`);
	console.log(error);
	return error;
};

export const loader = async ({ request }) => {
	let entity_id = await get_session_entity_id(request);
	let entity = new Entity(entity_id);
	let payload = entity.roles.identity.companies.fold;
	let response = await lastValueFrom(payload.pipe(fold(on_success, on_error)));
	return response;
};

export default function App() {
	let { pathname } = useLocation();
	const transition = useTransition();
	const show_spinner = useSpinner((state) => state.show_spinner);
	const setSpinner = useSpinner((state) => state.setSpinner);
	let loader_data = useLoaderData();
	let { identity, roles, companies } = loader_data;

	let is_resource_path = is_location("/resource", pathname);

	useEffect(() => {
		if (transition.state !== "idle") {
			setSpinner(true);
		} else {
			setSpinner(false);
		}
	}, [transition.state]);

	useEffect(() => {
		load_intercom();
	}, []);

	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
				<script src={kba_script_tag}></script>
				<script src={array_script_tag}></script>
				<script src={`https://embed.array.io/cms/array-credit-report.js?appKey=${appKey}`}></script>
			</head>
			<body className="flex flex-col relative">
				{show_spinner && <Spinner />}
				{!show_spinner && (
					<div className="flex flex-col w-full h-full relative overflow-hidden">
						{is_resource_path && (
							<div className="flex flex-col w-full border-b bg-white sticky top-0 z-[99]">
								<SimpleNavSignedIn entity_id={identity?.id} roles={roles} companies={companies} />
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
