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

const run = async () => {
	console.log("run");
	// create_group({ name: "0" });
	// create_group({ name: "1" });
	// create_credit_report({})
	// delete_groups();
	// delete_resources();
	// delete_roles();
	// validate_user();

	// await delete_all_resources();
	// await delete_all_roles();
	// await delete_all_groups();
	// await delete_all_credit_reports();
	// await delete_all_entities();
	// await delete_all_links();
};

// run();

export function links() {
	return [{ rel: "stylesheet", href: styles }];
}

export const meta = () => ({
	charset: "utf-8",
	title: "Credit Banc",
	viewport: "width=device-width,initial-scale=1",
});

// export const loader = async () => {
// 	console.log("hisss");
// 	return null;
// };

export default function App() {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body className="flex flex-col">
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
