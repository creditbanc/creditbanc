import { get_session_entity_id } from "~/utils/auth.server";
import { get_group_id } from "~/utils/helpers";

export const loader = async ({ request }) => {
	let entity_id = await get_session_entity_id(request);
	let group_id = get_group_id(request.url);

	return null;
};

const Heading = () => {
	return (
		<div>
			<h2 className="text-base font-semibold leading-7 text-gray-900">
				Plaid
			</h2>
			<p className="mt-1 text-sm leading-6 text-gray-500">
				This is your bank information.
			</p>
		</div>
	);
};

export default function PlaidSettings() {
	return (
		<div className="flex flex-col w-full">
			<Heading />
			<div className="flex flex-col"></div>
		</div>
	);
}
