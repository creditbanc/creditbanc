import { useEffect, useRef, useState } from "react";
import { default as accordion_style } from "~/styles/accordion.css";
import PersonalCreditTabs from "~/components/PersonalCreditTabs";
import CreditNav from "~/components/CreditNav";
import MobileCreditScoreHero from "~/components/MobileCreditScoreHero";
import CreditHeroGradient from "~/components/CreditHeroGradient";

export function links() {
	return [{ rel: "stylesheet", href: accordion_style }];
}

export const loader = async ({ request }) => {
	// let has_permission = await validate_action(request);
	// console.log("has_permission", has_permission);
	// return has_permission ? null : redirect("/");
	return null;
};

export default function BusinessCreditReport() {
	return (
		<div className="flex flex-col w-full">
			<CreditNav />
			<CreditHeroGradient />

			<div className="flex flex-col w-full p-[10px] max-w-5xl mx-auto">
				<MobileCreditScoreHero />
				<div className="mt-3 mb-1">
					<PersonalCreditTabs selected="Accounts" />
				</div>
				<div className="py-3"></div>
			</div>
		</div>
	);
}
