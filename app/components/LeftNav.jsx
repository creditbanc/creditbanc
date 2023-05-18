import { useEffect, useState } from "react";
import { useLocation, Link, useFetcher } from "@remix-run/react";
import { useNavStore } from "~/stores/useNavStore";
import { defaultTo, flatten, head, map, pipe, values } from "ramda";
import {
	to_group_pathname,
	get_entity_id,
	get_group_id,
	mapIndexed,
} from "~/utils/helpers";
import { filter } from "shades";

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
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
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

	// console.log("data");
	// console.log(data);

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

		let delete_resource_url =
			"/credit/report/delete" +
			to_group_pathname(location.pathname) +
			"/" +
			file_id;

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
					icon={PersonalIcon}
					onToggleNav={onToggleNav}
					collapsed={collapsed}
				/>

				{!collapsed && (
					<div className="pl-2 whitespace-nowrap">
						<Link
							className="border-gray-200 cursor-pointer flex flex-row border rounded-md hover:border-indigo-400"
							to={
								"/credit/personal/new" +
								to_group_pathname(location.pathname)
							}
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
											<div
												onClick={(e) =>
													onDelete(report.id, e)
												}
											>
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
								<Link
									key={report.id}
									to={
										"/credit/report/business/experian/overview" +
										to_group_pathname(location.pathname) +
										`/f/${report.id}` +
										`?rand=${Math.random()}`
									}
									className="border rounded-md text-sm py-1 px-2 cursor-pointer hover:border-indigo-400 flex flex-row justify-between items-center my-2 text-gray-700"
								>
									{/* <div>{report.resource_id}</div> */}
									<div>{report.business_legal_name}</div>
									<div
										onClick={(e) => onDelete(report.id, e)}
									>
										<DeleteIcon />
									</div>
								</Link>
							))
						)(data.business_credit_reports)}
					</div>
				)}
			</div>
		</div>
	);
}
