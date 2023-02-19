import { useEffect } from "react";
import { useSearchParams } from "@remix-run/react";
import { useNavStore } from "~/stores/useNavStore";

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

export default function LeftNav() {
	let [searchParams, setSearchParams] = useSearchParams();
	let setCollapsed = useNavStore((state) => state.set_collapsed);
	let collapesedNavClasses = `w-[80px]`;
	let expandedNavClasses = `w-[220px]`;
	let collapsed_param = searchParams.get("collapsed");
	let collapsed = collapsed_param == "true" ? true : false;
	let navClasses = collapsed ? collapesedNavClasses : expandedNavClasses;

	useEffect(() => {
		setCollapsed(collapsed);
	}, []);

	const onToggleNav = () => {
		setCollapsed(!collapsed);
		setSearchParams({ collapsed: !collapsed });
	};

	return (
		<div
			className={`hidden sm:flex sm:flex-col h-full border-r relative ${navClasses} transition-[var(--tran-05)]`}
		>
			<div
				className="collapse_toggle absolute -right-[10px] top-[20px] bg-indigo-500 rounded-full p-[3px] text-white cursor-pointer"
				onClick={onToggleNav}
			>
				{collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
			</div>
		</div>
	);
}
