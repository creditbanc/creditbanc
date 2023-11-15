import useStore from "./store";

const Header = () => {
	return (
		<div className="flex flex-col w-full bg-[#2C81AB] items-center text-white">
			<div className="flex flex-col w-[1100px] items-center my-10 mb-20 gap-y-5 text-center">
				<div className="flex flex-col text-3xl">
					The right financing. The right bank loan. One fast and simple application
				</div>
				<div className="flex flex-col text-xl">
					Our online lending network matches you with the right bank or lending partner to meet your business
					needs. See if you pre-qualify for up to $500,000 in 5 minutes. No impact to your credit score
				</div>
			</div>
		</div>
	);
};

export default function Container() {
	return (
		<div className="flex flex-col items-center w-full h-full">
			<Header />
		</div>
	);
}
