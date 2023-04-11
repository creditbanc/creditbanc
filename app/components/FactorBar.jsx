export const FactorBar = ({ index = 0 }) => {
	return (
		<div className="flex flex-row w-full h-[25px] my-2">
			<div
				className={`flex flex-col w-[35%] h-full mr-1 font-semibold justify-center items-center text-sm ${
					index == 0 ? "bg-[#55CF9E]" : "bg-gray-200"
				}`}
			>
				35%
			</div>
			<div
				className={`flex flex-col w-[30%] h-full bg-[#55CF9E] mx-1 font-semibold justify-center items-center text-sm  ${
					index == 1 ? "bg-[#55CF9E]" : "bg-gray-200"
				}`}
			>
				30%
			</div>
			<div
				className={`flex flex-col w-[15%] h-full bg-[#55CF9E] mx-1 font-semibold justify-center items-center text-sm  ${
					index == 2 ? "bg-[#55CF9E]" : "bg-gray-200"
				}`}
			>
				15%
			</div>
			<div
				className={`flex flex-col w-[10%] h-full bg-[#55CF9E] mx-1 font-semibold justify-center items-center text-sm  ${
					index == 3 ? "bg-[#55CF9E]" : "bg-gray-200"
				}`}
			>
				10%
			</div>
			<div
				className={`flex flex-col w-[10%] h-full bg-[#55CF9E] ml-1 font-semibold justify-center items-center text-sm  ${
					index == 4 ? "bg-[#55CF9E]" : "bg-gray-200"
				}`}
			>
				10%
			</div>
		</div>
	);
};
