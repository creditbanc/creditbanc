// import { redirect } from "@remix-run/node";
// import { Form, useSubmit } from "@remix-run/react";
// import { pipe, join } from "ramda";
// import { create_group, create as create_directory } from "~/utils/group.server";
// import {
// 	is_root_path_p,
// 	resource_splat_path_array,
// 	get_directory_splat_array,
// 	get_root_resource_id,
// } from "~/utils/helpers";

// export const action = async ({ request }) => {
// 	console.log("create_group");
// 	var form = await request.formData();

// 	const name = form.get("name");
// 	const root_resource_id = form.get("root_resource_id");
// 	const entity_id = form.get("entity_id");
// 	const redirect_url = form.get("redirect_url");

// 	await create_group({ root_resource_id, name, entity_id });

// 	return redirect(redirect_url);
// };

// export default function NewResource({ entity_id }) {
// 	const submit = useSubmit();

// 	function onCreateGroup(event) {
// 		console.log("onCreateGroup");
// 		event.preventDefault();
// 		const splat_array = pipe(resource_splat_path_array)(window.location);
// 		const directory_splat_array = pipe(get_directory_splat_array)(
// 			splat_array
// 		);

// 		let root_resource_id = get_root_resource_id(window.location);
// 		let redirect_url = pipe(
// 			join("/"),
// 			(value) => "/resource/" + value
// 		)(directory_splat_array);
// 		const is_root_path = is_root_path_p(directory_splat_array);

// 		console.log("directory_splat_array", directory_splat_array);
// 		console.log("root_resource_id", root_resource_id);
// 		console.log("redirect_url", redirect_url);
// 		console.log("entity_id", entity_id);
// 		console.log("is_root_path", is_root_path);

// 		if (is_root_path) {
// 			// create a group
// 			const formData = new FormData(event.currentTarget);
// 			formData.append("root_resource_id", root_resource_id);
// 			formData.append("redirect_url", redirect_url);
// 			formData.append("entity_id", entity_id);
// 			submit(formData, {
// 				method: "post",
// 				action: "resource/new",
// 			});
// 		}

// 		if (!is_root_path_p(window.location)) {
// 			// create a directory
// 		}
// 	}

// 	return (
// 		<div>
// 			<Form onSubmit={onCreateGroup}>
// 				<div>
// 					<div>
// 						<label htmlFor="name">Name</label>
// 					</div>
// 					<div>
// 						<input
// 							type="text"
// 							id="name"
// 							name="name"
// 							className="border"
// 						/>
// 					</div>
// 					<div>
// 						<button>Create</button>
// 					</div>
// 				</div>
// 			</Form>
// 		</div>
// 	);
// }
