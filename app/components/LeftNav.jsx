import { useEffect, useState } from "react";
import { useLocation, Link, useFetcher } from "@remix-run/react";
import { useNavStore } from "~/stores/useNavStore";
import { defaultTo, flatten, head, map, pipe, values } from "ramda";
import { to_group_pathname, get_entity_id, get_group_id, mapIndexed } from "~/utils/helpers";
import { filter } from "shades";
import { BanknotesIcon, UserCircleIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";

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
			<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
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
			<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
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
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
		</svg>
	);
};

let DeleteIcon = () => {
	let [color, setColor] = useState("currentColor");
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke={color}
			className="w-3 h-3"
			onMouseEnter={(e) => setColor("red")}
			onMouseLeave={(e) => setColor("currentColor")}
		>
			<path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
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
					<Icon className="w-6" />
				</div>
			)}
			{!collapsed && (
				<>
					<div className="mr-1 p-2 flex flex-col items-center justify-center">
						<Icon className="w-6" />
					</div>
					<div>
						<div>{title}</div>
					</div>
				</>
			)}
		</div>
	);
};

export default function LeftNav({ data = {}, can_manage_roles } = {}) {
	let collapesedNavClasses = `w-[60px]`;
	let expandedNavClasses = `w-[220px]`;
	let collapsed = useNavStore((state) => state.collapsed);
	let setCollapsed = useNavStore((state) => state.set_collapsed);
	let navClasses = collapsed ? collapesedNavClasses : expandedNavClasses;
	let location = useLocation();
	let fetcher = useFetcher();
	let is_admin = Cookies.get("is_cookie_monster") === "true";

	useEffect(() => {
		setCollapsed(collapsed);
	}, []);

	const onToggleNav = () => {
		setCollapsed(!collapsed);
	};

	const onDelete = async (file_id, e) => {
		// console.log("onDeleteReport");
		e.preventDefault();
		let entity_id = get_entity_id(location.pathname);
		let group_id = get_group_id(location.pathname);

		// console.log("data");
		// console.log(data);
		// console.log("file_id");
		// console.log(file_id);

		let file = pipe(values, flatten, filter({ id: file_id }), head)(data);
		// console.log("file");
		// console.log(file);

		let { model, resource_id } = file;

		// console.log("entity_id");
		// console.log(entity_id);
		// console.log("file_id");
		// console.log(file_id);
		// let is_owner = await is_resource_owner_p({
		// 	entity_id,
		// 	file_id,
		// });

		let delete_resource_url = "/credit/report/delete" + to_group_pathname(location.pathname) + "/" + file_id;

		fetcher.submit(
			{ file_id, group_id, model, resource_id },
			{
				method: "post",
				action: delete_resource_url,
			}
		);

		// console.log("delete_resource_url");
		// console.log(delete_resource_url);

		// console.log("is_owner");
		// console.log(is_owner);
	};

	// console.log("leftnavdata");
	// console.log(data);

	return (
		<div
			className={`hidden sm:flex sm:flex-col h-full border-r relative ${navClasses} transition-[var(--tran-05)] p-2 pt-1 `}
		>
			<div
				className="collapse_toggle absolute -right-[10px] top-[20px] bg-[#55CF9E] rounded-full p-[3px] text-white cursor-pointer"
				onClick={onToggleNav}
			>
				{collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
			</div>

			<div className="overflow-y-scroll mb-[20px] scrollbar-hide">
				<NavCategory
					title="Personal reports"
					icon={UserCircleIcon}
					onToggleNav={onToggleNav}
					collapsed={collapsed}
				/>

				{!collapsed && (
					<div className="pl-2 whitespace-nowrap">
						<Link
							className="border-gray-200 cursor-pointer flex flex-row border rounded-md hover:border-indigo-400"
							to={"/credit/personal/new" + to_group_pathname(location.pathname)}
						>
							<div className="text-sm mx-2 text-gray-700 justify-start w-full ">
								<div className="flex flex-row items-center justify-between py-1 rounded">
									<div>Add new</div>
									<div>
										<PlusIcon />
									</div>
								</div>
							</div>
						</Link>
						{pipe(
							defaultTo([]),
							mapIndexed((report, idx) => (
								<Link
									key={idx}
									to={
										"/credit/report/personal/personal" +
										to_group_pathname(location.pathname) +
										`/f/${report.id}` +
										`?rand=${Math.random()}`
									}
									className="border rounded-md text-sm py-1 px-2 cursor-pointer hover:border-indigo-400 flex flex-row justify-between my-2 text-gray-700 min-h-[30px]"
								>
									<div className="flex flex-col w-full">
										<div className="flex flex-row font-semibold my-1 justify-between items-center">
											<div className="flex flex-row">
												<div>{report.last_name}</div>
												<div className="mr-1">,</div>
												<div>{report.first_name}</div>
											</div>
											<div onClick={(e) => onDelete(report.id, e)}>
												<DeleteIcon />
											</div>
										</div>
										<div className="flex flex-row justify-between text-xs text-gray-500">
											<div>{report.city}</div>
											<div>{report.state}</div>
										</div>
									</div>
								</Link>
							))
						)(data.personal_credit_reports)}
					</div>
				)}

				<NavCategory
					title="Business reports"
					icon={BriefcaseIcon}
					onToggleNav={onToggleNav}
					collapsed={collapsed}
				/>

				{!collapsed && (
					<div className="pl-2">
						<Link
							className="border-gray-200 cursor-pointer flex flex-row border rounded-md hover:border-indigo-400"
							to={"/credit/business/new" + to_group_pathname(location.pathname)}
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
								<Link
									key={report.id}
									to={
										"/credit/report/business/experian/status" +
										to_group_pathname(location.pathname) +
										`/f/${report.id}` +
										`?rand=${Math.random()}`
									}
									className="border rounded-md text-sm py-1 px-2 cursor-pointer hover:border-indigo-400 flex flex-row justify-between items-center my-2 text-gray-700"
								>
									{/* <div>{report.resource_id}</div> */}
									<div>{report.business_legal_name}</div>
									<div onClick={(e) => onDelete(report.id, e)}>
										<DeleteIcon />
									</div>
								</Link>
							))
						)(data.business_credit_reports)}
					</div>
				)}

				{is_admin && (
					<>
						<NavCategory
							title="Cashflow"
							icon={BanknotesIcon}
							onToggleNav={onToggleNav}
							collapsed={collapsed}
						/>

						{!collapsed && (
							<div className="pl-2">
								<Link
									className="border-gray-200 cursor-pointer flex flex-row border rounded-md hover:border-indigo-400"
									to={"/plaid/oauth" + to_group_pathname(location.pathname) + location.search}
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
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
