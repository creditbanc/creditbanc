import { omit, pipe } from "ramda";
import { get_entity, get_session_entity_id } from "~/utils/auth.server";

export const loader = async ({ request }) => {
	let entity = await get_entity(request);
	return pipe(
		omit([
			"password",
			"plan_id",
			"stripe_customer_id",
			"stripe_subscription_id",
		])
	)(entity);
};
