import { useEffect, useState } from "react";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { useLayoutStore } from "~/stores/useLayoutStore";
import { useElmSize } from "~/hooks/useElmSize";
import {
	get_group_id,
	get_route_endpoint,
	capitalize,
	get_file_id,
} from "~/utils/helpers";
import { get_docs as get_group_docs } from "~/utils/group.server";
import { head, pipe } from "ramda";
import { filter } from "shades";
// import PersonalCreditTabs from "~/components/PersonalCreditTabs";
import CreditScoreHero from "~/components/CreditScoreHero";
import CreditHeroGradient from "~/components/CreditHeroGradient";
import { get_user_id } from "~/utils/auth.server";
import { validate_action, is_resource_owner_p } from "~/utils/resource.server";
import { redirect } from "@remix-run/node";

export default function BusinessReport() {
	const [target, setTarget] = useState();
	const elmSize = useElmSize(target);
	let setContentWidth = useLayoutStore((state) => state.set_content_width);

	let location = useLocation();

	useEffect(() => {
		if (elmSize) {
			setContentWidth(elmSize.width);
		}
	}, [elmSize]);

	return (
		<div className="flex flex-col flex-1 overflow-scroll">
			<div className="flex flex-col w-full">
				{/* <CreditHeroGradient /> */}
				<div
					className="flex flex-col w-full p-[10px] max-w-5xl mx-auto"
					ref={setTarget}
				>
					<div className="mt-3 mb-1">
						{/* <PersonalCreditTabs
							selected={capitalize(
								get_route_endpoint(location.pathname)
							)}
						/> */}
					</div>
					<div className="py-3">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
}
