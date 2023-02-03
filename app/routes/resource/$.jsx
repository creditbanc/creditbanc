import { useLoaderData } from "@remix-run/react";
import { validate_action } from "~/utils/resource.server";
import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
	console.log("resource_loader");
	let has_permission = await validate_action(request);

	if (!has_permission) {
		return redirect("/signin");
	}

	return null;
};

export default function Resource() {
	return <div>Resource</div>;
}
