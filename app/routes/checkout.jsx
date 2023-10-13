import { Outlet } from "@remix-run/react";

export default function CheckoutLayout() {
	return (
		<div className="flex flex-col w-full h-full overflow-y-scroll">
			<Outlet />
		</div>
	);
}
