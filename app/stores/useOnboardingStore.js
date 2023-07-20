import { create } from "zustand";
import { pipe } from "ramda";
import { mod } from "shades";

export const default_onboard_state = [
	{
		id: "welcome_video",
		text: "Watch the welcome video",
		completed: false,
		category: "account",
	},
	{
		id: "personal_credit_report",
		text: "Run a personal credit report",
		completed_text: "View personal credit report",
		completed: false,
		category: "credit",
		href: ({ entity_id, group_id }) =>
			`/credit/personal/new/resource/e/${entity_id}/g/${group_id}`,
		completed_href: ({ entity_id, group_id }) =>
			`/credit/report/personal/personal/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "business_credit_report",
		text: "Run a business credit report",
		completed_text: "View business credit report",
		completed: false,
		category: "credit",
		href: ({ entity_id, group_id }) =>
			`/credit/business/new/resource/e/${entity_id}/g/${group_id}?cookie=monster`,
		completed_href: ({ entity_id, group_id }) =>
			`/credit/report/business/experian/overview/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "connect_bank_account",
		text: "Connect your bank account",
		completed: false,
		category: "financial",
		href: ({ entity_id, group_id }) =>
			`/financial/accounts/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "upload_tax_returns",
		text: "Upload your tax returns",
		completed: false,
		category: "vault",
		href: ({ entity_id, group_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "upload_drivers_license",
		text: "Upload your driver's license",
		completed: false,
		category: "vault",
		href: ({ entity_id, group_id }) =>
			`/vault/files/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "create_role",
		text: "Create a role",
		completed: false,
		category: "social",
		href: ({ entity_id, group_id }) =>
			`/roles/resource/e/${entity_id}/g/${group_id}`,
	},
	{
		id: "invite_team_members",
		text: "Invite a team member",
		completed: false,
		category: "social",
		href: ({ entity_id, group_id }) =>
			`/roles/resource/e/${entity_id}/g/${group_id}`,
	},
];

export const useOnboardingStore = create((set) => ({
	onboard: default_onboard_state,
	set_state: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));
