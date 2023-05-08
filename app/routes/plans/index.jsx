import CreditNav from "~/components/CreditNav";
import { plans } from "~/data/upgrade_plans";
import { Plans as SubscriptionPlans } from "~/components/Plans";

export default function Plans() {
	return (
		<div>
			<div className="border-b">
				<CreditNav />
			</div>
			<div>
				<SubscriptionPlans plans={plans} />
			</div>
		</div>
	);
}
