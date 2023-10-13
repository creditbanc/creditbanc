import StripeClient from "stripe";
let stripe_token = process.env.STRIPE;

export default class Stripe {
	constructor(entity_id) {
		this.entity_id = entity_id;
		this.stripe = new StripeClient(stripe_token);
	}

	async create_token(card) {
		card = {
			number: "4242424242424242",
			exp_month: 5,
			exp_year: 2024,
			cvc: "314",
		};

		const token = await this.stripe.tokens.create({ card });
		return token;
	}

	async create_customer() {
		let token = await this.create_token();
		let { id: token_id } = token;
		let entity_id = this.entity_id;

		const customer = await this.stripe.customers.create({
			name: entity_id,
			metadata: {
				entity_id,
			},
			source: token_id,
		});

		return customer;
	}

	async subscribe_customer(customer_id) {
		let entity_id = this.entity_id;

		const subscription = await this.stripe.subscriptions.create({
			customer: customer_id,
			items: [{ price: "price_1N61DjJlRXkfyebsWDaUadR0" }],
			metadata: {
				entity_id,
				customer_id,
			},
		});

		return subscription;
	}

	// other methods...
}
