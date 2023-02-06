// import { validate_action } from "~/utils/resource.server";
import { redirect } from "@remix-run/node";

// export const loader = async ({ request }) => {
// 	// return null;
// 	// let has_permission = await validate_action(request);
// 	// console.log("has_permission", has_permission);

// 	return has_permission ? null : redirect("/");
// };

export default function PersonalCreditReport() {
	return <div>Personal Credit Report</div>;
}
