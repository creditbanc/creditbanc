import {
	Bars3Icon,
	CheckCircleIcon,
	BellIcon,
	Battery50Icon,
	ArrowTrendingUpIcon,
	InformationCircleIcon,
	QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { to_resource_pathname } from "~/utils/helpers";

export const tabs = [
	{
		name: "Overview",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/business/experian/overview" +
			to_resource_pathname(pathname) +
			search,
		icon: Bars3Icon,
		current: true,
		id: "overview",
	},
	{
		name: "Payment Status",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/business/experian/status" +
			to_resource_pathname(pathname) +
			search,
		icon: CheckCircleIcon,
		current: false,
		id: "status",
	},
	{
		name: "Derogatories",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/business/experian/derogatories" +
			to_resource_pathname(pathname) +
			search,
		icon: BellIcon,
		current: false,
		id: "derogatories",
	},
	{
		name: "Credit Utilization",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/business/experian/utilization" +
			to_resource_pathname(pathname) +
			search,
		icon: Battery50Icon,
		current: false,
		id: "utilization",
	},
	{
		name: "Payment Trends",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/business/experian/trends" +
			to_resource_pathname(pathname) +
			search,
		icon: ArrowTrendingUpIcon,
		current: false,
		id: "trends",
	},
	{
		name: "Company Info",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/business/experian/info" +
			to_resource_pathname(pathname) +
			search,
		icon: InformationCircleIcon,
		current: false,
		id: "info",
	},
	{
		name: "Score Factors",
		href: ({ pathname = "", search = "" } = {}) =>
			"/credit/report/business/experian/factors" +
			to_resource_pathname(pathname) +
			search,
		icon: QuestionMarkCircleIcon,
		current: false,
		id: "factors",
	},
];
