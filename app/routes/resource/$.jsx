import { useLoaderData } from "@remix-run/react";
import { validate_action } from "~/utils/resource.server";
import { redirect } from "@remix-run/node";
import { get_file_id } from "~/utils/helpers";
import { get_resource_type } from "~/utils/resource.server";

export const loader = async ({ request }) => {
	console.log("resource_loader");
	let has_permission = await validate_action(request);

	if (!has_permission) {
		return redirect("/signin");
	}

	let file_id = get_file_id(request.url);
	console.log("file_id", file_id);

	let resource_type = await get_resource_type({ resource_id: file_id });

	if (resource_type === "credit_report") {
		return redirect(`/credit/personal/resource/${file_id}`);
	}

	return null;
};

export default function Resource() {
	return <div>Resource</div>;
}
