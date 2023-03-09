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

let SettingsIcon = () => {
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
				d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
			/>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
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

export default function LeftNav({ data = {}, can_manage_roles } = {}) {
	let [searchParams, setSearchParams] = useSearchParams();
	let setCollapsed = useNavStore((state) => state.set_collapsed);
	let collapesedNavClasses = `w-[60px]`;
	let expandedNavClasses = `w-[220px]`;
	let collapsed_param = searchParams.get("collapsed");
	let collapsed = collapsed_param == "true" ? true : false;
	let navClasses = collapsed ? collapesedNavClasses : expandedNavClasses;
	let location = useLocation();
	const urlParams = new URLSearchParams(location.search.substring(1));
	const params = Object.fromEntries(urlParams);

	// console.log("data");
	// console.log(data);

	useEffect(() => {
		setCollapsed(collapsed);
	}, []);

	const onToggleNav = () => {
		setCollapsed(!collapsed);
		setSearchParams({ ...params, collapsed: !collapsed });
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

			{can_manage_roles && (
				<Link
					className={`flex flex-col absolute bottom-0 cursor-pointer ${
						collapsed ? "w-[45px]" : "w-[200px]"
					}`}
					to={"/roles" + to_resource_pathname(location.pathname)}
				>
					<div className="flex flex-col border-t" />
					<NavCategory
						title="Settings"
						icon={SettingsIcon}
						onToggleNav={onToggleNav}
						collapsed={collapsed}
					/>
				</Link>
			)}

			<NavCategory
				title="Personal reports"
				icon={PersonalIcon}
				onToggleNav={onToggleNav}
				collapsed={collapsed}
			/>

			{!collapsed && (
				<div className="pl-2 whitespace-nowrap">
					<a
						className="border-gray-200 cursor-pointer flex flex-row border rounded-md hover:border-indigo-400"
						href={
							"/credit/personal/new" +
							to_group_pathname(location.pathname)
						}
					>
						<div className="text-sm mx-2 text-gray-700 justify-start w-full ">
							<div className="flex flex-row items-center justify-between py-1 rounded">
								<div>Add new</div>
								<div className="pr-1">
									<PlusIcon />
								</div>
							</div>
						</div>
					</a>
					{pipe(
						defaultTo([]),
						map((report) => (
							<a
								key={report.id}
								href={
									"/credit/personal/report/personal" +
									to_group_pathname(location.pathname) +
									`/f/${report.id}` +
									location.search
								}
								className="border rounded-md text-sm py-1 px-2 cursor-pointer hover:border-indigo-400 flex flex-row justify-between my-2 text-gray-700"
							>
								<div>Margot F</div>
								<div>FL</div>
								{/* <a
									className="border-l border-gray-200 cursor-pointer flex flex-row"
									key={report.id}
									href={
										"/credit/personal/report/personal" +
										to_group_pathname(location.pathname) +
										`/f/${report.id}` +
										location.search
									}
								>
									<div className="text-sm mx-2 px-2 py-1 hover:bg-slate-100 rounded text-gray-700">
										{truncate(17, report.id)}
									</div>
								</a> */}
							</a>
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
				<div className="pl-2">
					<Link
						className="border-gray-200 cursor-pointer flex flex-row border rounded-md hover:border-indigo-400"
						to={
							"/credit/business/new" +
							to_group_pathname(location.pathname)
						}
					>
						<div className="text-sm mx-2 text-gray-700 justify-start w-full ">
							<div className="flex flex-row items-center justify-between py-1 rounded">
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
							<a
								key={report.id}
								href={
									"/credit/business/report" +
									to_resource_pathname(location.pathname) +
									location.search
								}
								className="border rounded-md text-sm py-1 px-2 cursor-pointer hover:border-indigo-400 flex flex-row justify-between my-2 text-gray-700"
							>
								<div>Margot F</div>
								<div>FL</div>
							</a>
							// <Link
							// 	className="border-l border-gray-200 cursor-pointer flex flex-row"
							// 	key={report.id}
							// 	to={
							// 		"/credit/business/report" +
							// 		to_resource_pathname(location.pathname) +
							// 		location.search
							// 	}
							// >
							// 	<div className="text-sm mx-2 px-2 py-1 hover:bg-slate-100 rounded text-gray-700">
							// 		{truncate(17, report.id)}
							// 	</div>
							// </Link>
						))
					)(data.business_credit_reports)}
				</div>
			)}
		</div>
	);
}
