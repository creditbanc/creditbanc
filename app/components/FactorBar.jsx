import { Link, useLocation } from "@remix-run/react";
import { to_resource_pathname } from "~/utils/helpers";

export const FactorBar = ({ index = 0 }) => {
	let location = useLocation();

	return (
		<div className="flex flex-row w-full h-[25px] my-2">
			<Link
				to={`/credit/report/personal/history${to_resource_pathname(
					location.pathname
				)}`}
				className={`flex flex-col w-[35%] h-full mr-1 font-semibold justify-center items-center text-sm ${
					index == 0 ? "bg-[#55CF9E]" : "bg-gray-200"
				}`}
			>
				35%
			</Link>
			<Link
				to={`/credit/report/personal/usage${to_resource_pathname(
					location.pathname
				)}`}
				className={`flex flex-col w-[30%] h-full bg-[#55CF9E] mx-1 font-semibold justify-center items-center text-sm  ${
					index == 1 ? "bg-[#55CF9E]" : "bg-gray-200"
				}`}
			>
				30%
			</Link>
			<Link
				to={`/credit/report/personal/age${to_resource_pathname(
					location.pathname
				)}`}
				className={`flex flex-col w-[15%] h-full bg-[#55CF9E] mx-1 font-semibold justify-center items-center text-sm  ${
					index == 2 ? "bg-[#55CF9E]" : "bg-gray-200"
				}`}
			>
				15%
			</Link>
			<Link
				to={`/credit/report/personal/mix${to_resource_pathname(
					location.pathname
				)}`}
				className={`flex flex-col w-[10%] h-full bg-[#55CF9E] mx-1 font-semibold justify-center items-center text-sm  ${
					index == 3 ? "bg-[#55CF9E]" : "bg-gray-200"
				}`}
			>
				10%
			</Link>
			<Link
				to={`/credit/report/personal/inquiries${to_resource_pathname(
					location.pathname
				)}`}
				className={`flex flex-col w-[10%] h-full bg-[#55CF9E] ml-1 font-semibold justify-center items-center text-sm  ${
					index == 4 ? "bg-[#55CF9E]" : "bg-gray-200"
				}`}
			>
				10%
			</Link>
		</div>
	);
};
