import { useEffect, useState } from "react";
import { Outlet } from "@remix-run/react";
import CreditNav from "~/components/CreditNav";
import { useLayoutStore } from "~/stores/useLayoutStore";
import LeftNav from "~/components/LeftNav";
import { useElmSize } from "~/hooks/useElmSize";

export default function CreditReport() {
	const [target, setTarget] = useState();
	const elmSize = useElmSize(target);
	let setContentWidth = useLayoutStore((state) => state.set_content_width);

	useEffect(() => {
		if (elmSize) {
			setContentWidth(elmSize.width);
		}
	}, [elmSize]);

	return (
		<div className="flex flex-col w-full h-full">
			<CreditNav />
			<div className="flex flex-row h-full overflow-hidden">
				<LeftNav />
				<div
					className="flex flex-col flex-1 overflow-scroll"
					ref={setTarget}
				>
					<Outlet />
				</div>
			</div>
		</div>
	);
}
