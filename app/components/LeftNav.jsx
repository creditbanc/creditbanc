import { useEffect } from "react";
import { useSearchParams, useLocation, Link } from "@remix-run/react";
import { useNavStore } from "~/stores/useNavStore";
import { defaultTo, map, pipe } from "ramda";
import {
	truncate,
	to_group_pathname,
	to_resource_pathname,
} from "~/utils/helpers";

let ChevronLeftIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeLinecap="1.5"
			stroke="currentColor"
			className="w-3 h-3"
			strokeWidth="3"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M15.75 19.5L8.25 12l7.5-7.5"
			/>
		</svg>
	);
};

let ChevronRightIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeLinecap="1.5"
			stroke="currentColor"
			className="w-3 h-3"
			strokeWidth="3"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M8.25 4.5l7.5 7.5-7.5 7.5"
			/>
		</svg>
	);
};

let PersonalIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className="w-6 h-6"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
	);
};

let BusinessIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className="w-6 h-6"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
			/>
		</svg>
	);
};

let PlusIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className="w-4 h-4"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 4.5v15m7.5-7.5h-15"
			/>
		</svg>
	);
};

const NavCategory = ({ title, onToggleNav, icon: Icon, collapsed }) => {
	return (
		<div className="text-gray-700 font-medium mb-1 text-sm flex flex-row items-center whitespace-nowrap mt-1">
			{collapsed && (
				<div
					className="p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:rounded"
					onClick={onToggleNav}
				>
					<Icon />
				</div>
			)}
			{!collapsed && (
				<>
					<div className="mr-1 p-2 flex flex-col items-center justify-center">
						<Icon />
					</div>
					<div className="">
						<div>{title}</div>
					</div>
				</>
			)}
		</div>
	);
};

export default function LeftNav({ data = {} } = {}) {
	let [searchParams, setSearchParams] = useSearchParams();
	let setCollapsed = useNavStore((state) => state.set_collapsed);
	let collapesedNavClasses = `w-[60px]`;
	let expandedNavClasses = `w-[220px]`;
	let collapsed_param = searchParams.get("collapsed");
	let collapsed = collapsed_param == "true" ? true : false;
	let navClasses = collapsed ? collapesedNavClasses : expandedNavClasses;
	let location = useLocation();

	useEffect(() => {
		setCollapsed(collapsed);
	}, []);

	const onToggleNav = () => {
		setCollapsed(!collapsed);
		setSearchParams({ collapsed: !collapsed });
	};

	return (
		<div
			className={`hidden sm:flex sm:flex-col h-full border-r relative ${navClasses} transition-[var(--tran-05)] p-2 pt-1 `}
		>
			<div
				className="collapse_toggle absolute -right-[10px] top-[20px] bg-indigo-500 rounded-full p-[3px] text-white cursor-pointer"
				onClick={onToggleNav}
			>
				{collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
			</div>

			<NavCategory
				title="Personal reports"
				icon={PersonalIcon}
				onToggleNav={onToggleNav}
				collapsed={collapsed}
			/>

			{!collapsed && (
				<div className="pl-5 whitespace-nowrap">
					<Link
						className="border-l border-gray-200 cursor-pointer flex flex-row"
						to={
							"/credit/personal/new" +
							to_group_pathname(location.pathname)
						}
					>
						<div className="text-sm mx-2 pb-1 text-gray-700 flex flex-col justify-start w-full">
							<div className="hover:bg-slate-100 flex flex-row items-center justify-between py-1 pl-2 rounded">
								<div>Add new</div>
								<div className="pr-1">
									<PlusIcon />
								</div>
							</div>
						</div>
					</Link>
					{pipe(
						defaultTo([]),
						map((report) => (
							<Link
								className="border-l border-gray-200 cursor-pointer flex flex-row"
								key={report.id}
								to={
									"/credit/personal/report/personal" +
									to_resource_pathname(location.pathname) +
									location.search
								}
							>
								<div className="text-sm mx-2 px-2 py-1 hover:bg-slate-100 rounded text-gray-700">
									{truncate(17, report.id)}
								</div>
							</Link>
						))
					)(data.personal_credit_reports)}
				</div>
			)}

			<NavCategory
				title="Business reports"
				icon={BusinessIcon}
				onToggleNav={onToggleNav}
				collapsed={collapsed}
			/>

			{!collapsed && (
				<div className="pl-5">
					<Link
						className="border-l border-gray-200 cursor-pointer flex flex-row"
						to={
							"/credit/business/new" +
							to_group_pathname(location.pathname)
						}
					>
						<div className="text-sm mx-2 pb-1 text-gray-700 flex flex-col justify-start w-full">
							<div className="hover:bg-slate-100 flex flex-row items-center justify-between py-1 pl-2 rounded">
								<div>Add new</div>
								<div className="pr-1">
									<PlusIcon />
								</div>
							</div>
						</div>
					</Link>
					{pipe(
						defaultTo([]),
						map((report) => (
							<Link
								className="border-l border-gray-200 cursor-pointer flex flex-row"
								key={report.id}
								to={
									"/credit/business/report" +
									to_resource_pathname(location.pathname) +
									location.search
								}
							>
								<div className="text-sm mx-2 px-2 py-1 hover:bg-slate-100 rounded text-gray-700">
									{truncate(17, report.id)}
								</div>
							</Link>
						))
					)(data.business_credit_reports)}
				</div>
			)}
		</div>
	);
}
