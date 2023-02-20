import PersonalCreditTabs from "~/components/PersonalCreditTabs";
import CreditScoreHero from "~/components/CreditScoreHero";
import CreditHeroGradient from "~/components/CreditHeroGradient";
import { validate_action } from "~/utils/resource.server";
import { redirect } from "@remix-run/node";
import { get_user } from "~/utils/auth.server";

export const loader = async ({ request }) => {
	let user = await get_user(request);
	// console.log("user");
	// console.log(user);

	if (!user) {
		let has_permission = await validate_action(request);
		console.log("has_permission", has_permission);
		return has_permission ? null : redirect("/");
	}

	return null;
};

const PersonalInfoCard = () => {
	return (
		<div className="overflow-hidden bg-white rounded-lg border">
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

export default function Personal() {
	return (
		<div className="flex flex-col w-full">
			<PersonalInfoCard />
		</div>
	);
}
