import { useEffect, useRef, useState } from "react";
import { default as accordion_style } from "~/styles/accordion.css";
import PersonalCreditTabs, { TabsTwo } from "~/components/PersonalCreditTabs";
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

const PersonalInfoCard = () => {
	return (
		<div className="overflow-hidden bg-white shadow rounded-lg border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-lg font-medium leading-6 text-gray-900">
					Personal Information
				</h3>
				<p className="mt-1 max-w-2xl text-sm text-gray-500">
					Below is your personal information as it appears in your
					credit file. This information includes your legal name,
					current and previous addresses, employment information and
					other details.
				</p>
			</div>
			<div className="border-t border-gray-200 px-4 py-1">
				<dl className="divide-y divide-gray-200">
					<div className="py-4 flex flex-col sm:flex-row sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500 w-[200px]">
							Name
						</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							Margot Foster
						</dd>
					</div>
					<div className="py-4 flex flex-col sm:flex-row sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500 w-[200px]">
							Aliases
						</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							Date of birth
						</dd>
					</div>
					<div className="py-4 flex flex-col sm:flex-row sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500 w-[200px]">
							Address
						</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							margotfoster@example.com
						</dd>
					</div>
					<div className="py-4 flex flex-col sm:flex-row sm:py-5 sm:px-6">
						<dt className="text-sm font-medium text-gray-500 w-[200px]">
							Employers
						</dt>
						<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							$120,000
						</dd>
					</div>
				</dl>
			</div>
		</div>
	);
};

export default function BusinessCreditReport() {
	return (
		<div className="flex flex-col w-full">
			<CreditNav />
			<CreditHeroGradient />

			<div className="flex flex-col w-full p-[10px] max-w-5xl mx-auto">
				<MobileCreditScoreHero />
				<div className="mt-3 mb-1">
					<PersonalCreditTabs />
				</div>
				<div className="py-3">
					<PersonalInfoCard />
				</div>
			</div>
		</div>
	);
}
