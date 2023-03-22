import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import { redirect } from "@remix-run/node";
import styles from "./styles/app.css";
import {
	create as create_group,
	delete_docs as delete_groups,
	delete_all as delete_all_groups,
} from "~/utils/group.server";
// import {
// 	delete_docs as delete_resources,
// 	validate_user,
// 	delete_all as delete_all_resources,
// } from "~/utils/resource.server";
import {
	create as create_credit_report,
	delete_all as delete_all_credit_reports,
} from "~/utils/personal_credit_report.server";
import {
	delete_docs as delete_roles,
	delete_all as delete_all_roles,
} from "~/utils/role.server";
import { delete_all as delete_all_entities } from "~/utils/entity.server";
import { delete_all as delete_all_links } from "~/utils/link.server";
import { delete_all as delete_all_settings } from "~/utils/settings.server";
import { Link, useTransition } from "@remix-run/react";
import { create } from "zustand";
import { useEffect } from "react";
const cb_logo_3 = "/images/logos/cb_logo_3.png";

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

export default function App() {
	const transition = useTransition();
	const show_spinner = useSpinner((state) => state.show_spinner);
	const setSpinner = useSpinner((state) => state.setSpinner);

	const Spinner = () => {
		return (
			<div className="h-full w-full flex flex-col items-center justify-center">
				<div className="w-[200px] flex flex-col">
					<div className="flex flex-col items-center my-5">
						<img src={cb_logo_3} />
					</div>
					<div className="flex flex-col items-center">Loading...</div>
				</div>
			</div>
		);
	};

	useEffect(() => {
		if (transition.state !== "idle") {
			console.log("set_spinner_true");
			setSpinner(true);
		} else {
			console.log("set_spinner_false");
			setSpinner(false);
		}
	}, [transition.state]);

	// if (show_spinner) {
	// 	return <Spinner />;
	// }

	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body className="flex flex-col">
				{show_spinner && <Spinner />}
				{!show_spinner && <Outlet />}
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
