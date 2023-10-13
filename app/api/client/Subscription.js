import { server_timestamp, set_doc } from "~/utils/firebase";

export default class Subscription {
	constructor(entity_id) {
		this.entity_id = entity_id;
	}

	async create({ plan, stripe_customer_id, stripe_subscription_id }) {
		let entity_id = this.entity_id;

		let payload = {
			...plan,
			entity_id,
			stripe_customer_id,
			stripe_subscription_id,
			created_at: server_timestamp(),
		};

		await set_doc(["subscriptions", entity_id], payload);

		return payload;
	}
}
