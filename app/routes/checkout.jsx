import { Outlet } from "@remix-run/react";
import Nav from "~/components/CreditNav";

export default function CheckoutLayout() {
	return (
		<div className="flex flex-col w-full h-full">
			<Outlet />
		</div>
	);
}
