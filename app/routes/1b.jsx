import { useLocation } from "@remix-run/react";
import { appKey } from "~/data/array";
import { use_client_search_params } from "~/utils/helpers";

export default function Score() {
	let { search } = useLocation();
	let params = use_client_search_params(search);
	let { user_token, bureau } = params;

	return (
		<div className="flex flex-col w-full h-full">
			<array-credit-score
				appKey={appKey}
				userToken={user_token}
				bureau={bureau}
				scoreTracker="true"
			></array-credit-score>
		</div>
	);
}
