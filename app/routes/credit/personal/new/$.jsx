// import { json, redirect } from "@remix-run/node";
// import { get_user_id } from "~/utils/auth.server";
// import { create as create_report } from "~/utils/credit_report.server";
// import {
// 	resource_splat_path_array,
// 	get_splat_resource,
// 	get_redirect_url,
// } from "~/utils/helpers";
// import {
// 	keys,
// 	last,
// 	pipe,
// 	includes,
// 	equals,
// 	reject,
// 	slice,
// 	ifElse,
// 	always,
// 	filter,
// 	count,
// 	length,
// 	indexOf,
// 	join,
// } from "ramda";
// import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";

// export const action = async ({ request }) => {
// 	console.log("create_credit_report");
// 	var form = await request.formData();
// 	const root_resource_id = form.get("root_resource_id");
// 	const entity_id = form.get("entity_id");
// 	const redirect_url = form.get("redirect_url");

// 	const credit_report = await create_report({
// 		root_resource_id,
// 		entity_id,
// 	});

// 	console.log("redirect_url: ", redirect_url);

// 	return redirect(redirect_url);
// };

// export const loader = async ({ request }) => {
// 	console.log("loader");
// 	const entity_id = await get_user_id(request);
// 	const splat_array = pipe(resource_splat_path_array)(request.url);
// 	const splat_resource = pipe(get_splat_resource)(request.url);
// 	const redirect_url = get_redirect_url(splat_array);
// 	return json({ entity_id, root_resource_id: splat_resource, redirect_url });
// };

// export default function NewCreditReport() {
// 	let { entity_id, root_resource_id, redirect_url } = useLoaderData();
// 	let actionData = useActionData();
// 	let submit = useSubmit();

// 	console.log(actionData);

// 	const onCreateReport = () => {
// 		console.log("onCreateReport");
// 		const formData = new FormData();
// 		formData.append("root_resource_id", root_resource_id);
// 		formData.append("redirect_url", redirect_url);
// 		formData.append("entity_id", entity_id);

// 		submit(formData, {
// 			method: "post",
// 			action: "credit/personal/new",
// 		});
// 	};

// 	return (
// 		<div>
// 			<div>New Credit Report</div>
// 			<button onClick={onCreateReport}>Create Report</button>
// 		</div>
// 	);
// }
