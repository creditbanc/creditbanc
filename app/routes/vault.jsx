import { Outlet, useLoaderData } from "@remix-run/react";
import SimpleNav from "~/components/SimpleNav";
import { get_user_id } from "~/utils/auth.server";

export const loader = async ({ request }) => {
	let entity_id = get_user_id(request);

	return { entity_id };
};

export default function Vault() {
	let { entity_id } = useLoaderData();
	return (
		<div className="flex flex-col w-full h-full bg-gray-50">
			<div className="flex flex-col w-full border-b bg-white">
				<SimpleNav user_id={entity_id} />
			</div>

			<Outlet />
		</div>
	);
}
