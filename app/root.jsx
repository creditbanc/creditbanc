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
import { get_partition_id } from "./utils/group.server";
import { isEmpty } from "ramda";
import axios from "axios";
import SimpleNavSignedIn from "~/components/SimpleNavSignedIn";

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
	let entity_id = await get_session_entity_id(request);
	let entity = await get_entity(request);

	if (entity_id) {
		return { entity_id, entity };
	}
};

export default function App() {
	let { pathname } = useLocation();
	const transition = useTransition();
	const show_spinner = useSpinner((state) => state.show_spinner);
	const setSpinner = useSpinner((state) => state.setSpinner);
	let { entity_id } = useLoaderData();

	const Spinner = () => {
		return (
			<div className="h-full w-full flex flex-col items-center justify-center">
				<div className="w-[200px] flex flex-col">
					<div className="flex flex-col items-center my-5">
						<img src={cb_logo_3} />
					</div>
					<div className="flex flex-row items-center justify-center">
						<div>
							<svg
								className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="green"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="green"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						</div>
						<div>Loading...</div>
					</div>
				</div>
			</div>
		);
	};

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
								<SimpleNavSignedIn entity_id={entity_id} />
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
