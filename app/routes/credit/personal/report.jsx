import { useEffect, useState } from "react";
import { Outlet, useLoaderData } from "@remix-run/react";
import CreditNav from "~/components/CreditNav";
import { useLayoutStore } from "~/stores/useLayoutStore";
import LeftNav from "~/components/LeftNav";
import { useElmSize } from "~/hooks/useElmSize";
import { get_group_id } from "~/utils/helpers";
import { get_docs as get_group_docs } from "~/utils/group.server";
import { defaultTo, pick, pipe } from "ramda";
import { mod, all, filter } from "shades";
import PersonalCreditTabs from "~/components/PersonalCreditTabs";
import CreditScoreHero from "~/components/CreditScoreHero";
import CreditHeroGradient from "~/components/CreditHeroGradient";

export const loader = async ({ request }) => {
	let url = new URL(request.url);
	let group_id = get_group_id(url.pathname);
	let group_docs = await get_group_docs({ resource_id: group_id });

	let reports = pipe(
		mod(all)(pick(["id", "resource_id", "model"])),
		(resources) => ({
			personal_credit_reports: pipe(
				filter({ model: "personal_credit_report" }),
				defaultTo([])
			)(resources),
			business_credit_reports: pipe(
				filter({ model: "business_credit_report" }),
				defaultTo([])
			)(resources),
		})
	)(group_docs);

	return { reports };
};

export default function CreditReport() {
	const [target, setTarget] = useState();
	const elmSize = useElmSize(target);
	let setContentWidth = useLayoutStore((state) => state.set_content_width);
	let { reports } = useLoaderData();

	useEffect(() => {
		if (elmSize) {
			setContentWidth(elmSize.width);
		}
	}, [elmSize]);

	return (
		<div className="flex flex-col w-full h-full">
			<CreditNav />
			<div className="flex flex-row h-full overflow-hidden">
				<LeftNav data={reports} />
				<div className="flex flex-col flex-1 overflow-scroll">
					<div className="flex flex-col w-full">
						<CreditHeroGradient />

						<div
							className="flex flex-col w-full p-[10px] max-w-5xl mx-auto"
							ref={setTarget}
						>
							<CreditScoreHero />
							<div className="mt-3 mb-1">
								<PersonalCreditTabs />
							</div>
							<div className="py-3">
								<Outlet />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
