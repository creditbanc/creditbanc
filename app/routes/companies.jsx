import { Outlet } from "@remix-run/react";

export default function Cashflow() {
	return (
		<div className="flex flex-col w-full h-full bg-gray-50">
			<Outlet />
		</div>
	);
}
