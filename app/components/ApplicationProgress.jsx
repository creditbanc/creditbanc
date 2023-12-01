import { useLocation } from "@remix-run/react";
import { findIndex, nth, pipe, split } from "ramda";
import { mapIndexed, trim } from "~/utils/helpers";
import { navigation } from "~/routes/apply/navigation";

export default function ApplicationProgress() {
	let { pathname } = useLocation();
	let step_id = pipe(split("/"), trim, nth(1))(pathname);
	let num_of_steps = navigation.length - 2;
	let step_index_id = pipe(findIndex((step) => step.id == step_id))(navigation);
	let percentage_completed = Math.round((step_index_id / num_of_steps) * 100);

	return (
		<div className="flex flex-col w-full" aria-label="Progress">
			<div className="flex flex-col bg-[#56cf9e] h-[4px]" style={{ width: `${percentage_completed}%` }}></div>
		</div>
	);
}
