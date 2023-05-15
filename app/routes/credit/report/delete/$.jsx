import {
	is_resource_owner_p,
	unsubscribe_entity_from_shared_resource,
	unsubscribe_entity_from_resource,
} from "~/utils/resource.server";
import { get_user_id } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { redirect } from "@remix-run/node";

export const action = async ({ request }) => {
	console.log("delete_personal_report");
	const entity_id = await get_user_id(request);
	const form = await request.formData();
	const file_id = form.get("file_id");
	const group_id = form.get("group_id");
	const model = form.get("model");
	const resource_id = form.get("resource_id");

	const is_resource_owner = await is_resource_owner_p({
		group_id,
		entity_id,
		file_id,
	});

	if (!is_resource_owner) {
		console.log("!is_resource_owner");
		await unsubscribe_entity_from_shared_resource({
			entity_id,
			file_id,
			group_id,
		});
	}

	if (is_resource_owner) {
		console.log("is_resource_owner");
		let file = await prisma[model].delete({
			where: {
				id: file_id,
			},
		});

		let resource = await prisma.resource.delete({
			where: {
				id: resource_id,
			},
		});

		// console.log("file");
		// console.log(file);

		// console.log("resource");
		// console.log(resource);

		// return { file, resource };
	}
	return redirect(`/home`);
};
