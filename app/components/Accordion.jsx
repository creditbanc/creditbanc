import { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import useWindowSize from "~/hooks/useWindowSize";

export default function Accordion({
	title = "",
	value = "",
	weight = "",
	grade = "",
	children,
	sticky = true,
}) {
	const [open, setOpen] = useState(false);
	const size = useWindowSize();
	const [maxHeight, setMaxHeight] = useState(0);
	let contentRef = useRef(null);

	useEffect(() => {
		setMaxHeight(contentRef.current.clientHeight + 140);
	}, [size]);
	//toggle accordion function
	let toggleHandler = (e) => {
		//switch state
		setOpen(!open);
	};
	//conditional styling
	const styles = {
		//if open is true, show content
		accordionTitle: {
			color: open ? "#10d6f5" : "#000",
		},
	};
	//open animation with react spring
	const openAnimation = useSpring({
		from: { opacity: "0", maxHeight: "105px" },
		to: {
			opacity: "1",
			maxHeight: open ? `${maxHeight}px` : "105px",
		},
		config: { duration: "150" },
	});
	//rotate animation
	const iconAnimation = useSpring({
		from: {
			transform: "rotate(0deg)",
		},
		to: {
			transform: open ? "rotate(180deg)" : "rotate(0deg)",
		},
		config: { duration: "100" },
	});
	return (
		<animated.div
			className="accordion__item border rounded-lg flex flex-col w-full my-[5px] shadow"
			style={openAnimation}
		>
			<div
				className={`accordion__header text-black p-[10px]`}
				onClick={toggleHandler}
			>
				<div className={`flex flex-col w-full `}>
					<div className="flex flex-row w-full justify-between items-center h-[30px] mb-[10px]">
						<div className="flex flex-col">
							<div className={`${open && "text-black"}`}>
								{title}
							</div>
						</div>
						<div className="flex flex-col">
							<div className="flex flex-row text-xs">
								<div className="flex flex-col mx-[10px] bg-gray-100 text-gray-600 rounded-full px-[10px] py-[3px] ">
									{weight}
								</div>
								<div className="flex flex-col ml-[10px] bg-green-100 text-green-600 rounded-full px-[10px] py-[3px] ">
									{grade}
								</div>
							</div>
						</div>
					</div>
					<div className="flex flex-row w-full justify-between items-center mb-[10px]">
						<div className="flex flex-col">
							<div className="text-4xl">{value}</div>
						</div>
						<div className="flex flex-col">
							<animated.i
								className={`${open && "text-black"}`}
								style={iconAnimation}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="w-5 h-5"
								>
									<path
										fillRule="evenodd"
										d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
										clipRule="evenodd"
									/>
								</svg>
							</animated.i>
						</div>
					</div>
				</div>
			</div>

			<div className={`accordion__content`} ref={contentRef}>
				{children}
			</div>
		</animated.div>
	);
}
