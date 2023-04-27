import {
	UserIcon,
	ClockIcon,
	BeakerIcon,
	BookOpenIcon,
	ChartPieIcon,
	ClipboardIcon,
	ScaleIcon,
	TrophyIcon,
	Bars3Icon,
} from "@heroicons/react/24/outline";
import { to_resource_pathname } from "~/utils/helpers";

export const tabs = [
	{
		name: "Overview",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/personal/personal" +
			to_resource_pathname(pathname) +
			search,
		icon: Bars3Icon,
		current: true,
		id: "overview",
	},
	{
		name: "Personal",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/personal/personal" +
			to_resource_pathname(pathname) +
			search,
		icon: UserIcon,
		current: false,
		id: "personal",
	},
	{
		name: "History",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/personal/history" +
			to_resource_pathname(pathname) +
			search,
		icon: BookOpenIcon,
		current: false,
		id: "history",
	},
	{
		name: "Debt Usage",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/personal/usage" +
			to_resource_pathname(pathname) +
			search,
		icon: BeakerIcon,
		current: false,
		id: "usage",
	},
	{
		name: "Credit Age",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/personal/age" +
			to_resource_pathname(pathname) +
			search,
		icon: ClockIcon,
		current: false,
		id: "age",
	},
	{
		name: "Account Mix",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/personal/mix" +
			to_resource_pathname(pathname) +
			search,
		icon: ChartPieIcon,
		current: false,
		id: "mix",
	},
	{
		name: "Inquiries",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/personal/inquiries" +
			to_resource_pathname(pathname) +
			search,
		icon: ClipboardIcon,
		current: false,
		id: "inquiries",
	},
	{
		name: "Debt vs Income",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/personal/debtvsincome" +
			to_resource_pathname(pathname) +
			search,
		icon: ScaleIcon,
		current: false,
		id: "debtvsincome",
	},
	{
		name: "Score Factors",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/personal/factors" +
			to_resource_pathname(pathname) +
			search,
		icon: TrophyIcon,
		current: false,
		id: "factors",
	},
];