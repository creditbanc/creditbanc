import { get_session_entity_id } from "~/utils/auth.server";
import { redirect } from "@remix-run/node";
import Subscription from "~/api/client/Subscription";

export const loader = async ({ request }) => {
	let plan = { plan_id: "essential", plan_name: "essential" };
	let entity_id = await get_session_entity_id(request);
	let _subscription_ = new Subscription(entity_id);
	let subscription = await _subscription_.create({ plan, stripe_customer_id: "", stripe_subscription_id: "" });
	return redirect("/home");
};
