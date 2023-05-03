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
import { fb_credit_report } from "~/data/lendflow";
import { VerticalNav } from "~/components/BusinessCreditNav";

export default function BusinessReport() {
	let report = fb_credit_report;
	let location = useLocation();
	const [target, setTarget] = useState();
	const elmSize = useElmSize(target);
	let setContentWidth = useLayoutStore((state) => state.set_content_width);
	let content_width = useLayoutStore((state) => state.content_width);
	let [isMobile, setIsMobile] = useState(true);

	useEffect(() => {
		if (content_width > 640) {
			setIsMobile(false);
		} else {
			setIsMobile(true);
		}
	}, [content_width]);

	useEffect(() => {
		if (elmSize) {
			setContentWidth(elmSize.width);
		}
	}, [elmSize]);

	return (
		<div className="flex flex-col flex-1 overflow-scroll">
			<div className="flex flex-col w-full">
				<div
					className="flex flex-col w-full p-[10px] max-w-5xl mx-auto"
					ref={setTarget}
				>
					<div
						className={`py-3 mb-10 flex ${
							isMobile ? "flex-col" : "flex-row"
						}`}
					>
						{!isMobile && (
							<div className="sm:flex flex-col w-1/5 mr-2 border rounded-lg h-fit">
								<VerticalNav
									selected={get_route_endpoint(
										location.pathname
									)}
								/>
							</div>
						)}
						<div className="flex flex-col flex-1">
							<Outlet />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
