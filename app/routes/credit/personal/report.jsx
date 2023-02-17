import { useEffect, useRef, useState } from "react";
import { Outlet } from "@remix-run/react";
import CreditNav from "~/components/CreditNav";
import { useNavStore } from "~/stores/useNavStore";
import { useLayoutStore } from "~/stores/useLayoutStore";
import useWindowSize from "~/hooks/useWindowSize";

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

const LeftNav = () => {
	let collapsed = useNavStore((state) => state.collapsed);
	let setCollapsed = useNavStore((state) => state.set_collapsed);
	let collapesedNavClasses = `w-[80px]`;
	let expandedNavClasses = `w-[220px]`;
	let navClasses = collapsed ? collapesedNavClasses : expandedNavClasses;

	const onToggleNav = () => {
		setCollapsed(!collapsed);
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
};

export default function Credit() {
	let contentRef = useRef(0);
	let setContentWidth = useLayoutStore((state) => state.set_content_width);
	let contentWidth = useLayoutStore((state) => state.content_width);
	setContentWidth(contentRef.current.offsetWidth);
	let collapsed = useNavStore((state) => state.collapsed);
	const size = useWindowSize();

	useEffect(() => {
		setTimeout(() => {
			setContentWidth(contentRef.current.offsetWidth);
		}, 200);
	}, [collapsed]);

	useEffect(() => {
		let width = size.width;

		if (collapsed) {
			setContentWidth(width - 80);
		} else {
			setContentWidth(width - 200);
		}
	}, [size]);

	return (
		<div className="flex flex-col w-full h-full">
			<CreditNav />
			<div className="flex flex-row h-full overflow-hidden">
				<LeftNav />
				<div
					className="flex flex-col flex-1 overflow-scroll"
					ref={contentRef}
				>
					<Outlet />
				</div>
			</div>
		</div>
	);
}
