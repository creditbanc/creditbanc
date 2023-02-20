import { useEffect, useRef, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import useWindowSize from "~/hooks/useWindowSize";
import { useNavStore } from "~/stores/useNavStore";
import { useLayoutStore } from "~/stores/useLayoutStore";

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
	// labels: ["Red", "Green", "Orange"],
	datasets: [
		{
			// label: "# of Votes",
			data: [33, 33, 33],
			backgroundColor: [
				"rgba(231, 76, 60, 1)",
				"rgba(255, 164, 46, 1)",
				"rgba(46, 204, 113, 1)",
			],
			// borderColor: [
			// 	"rgba(255, 255, 255 ,1)",
			// 	"rgba(255, 255, 255 ,1)",
			// 	"rgba(255, 255, 255 ,1)",
			// ],
			borderWidth: 5,
		},
	],
};

export const data2 = {
	// labels: ["Red", "Green", "Orange"],
	datasets: [
		{
			// label: "# of Votes",
			data: [90, 3.5, 6.5],
			backgroundColor: [
				"rgba(0,0,0,0)",
				// "rgba(255,255,255,1)",
				"rgba(46, 204, 113, 1)",
				"rgba(0,0,0,0)",
			],
			borderColor: [
				"rgba(0, 0, 0 ,0)",
				"rgba(255,255,255,1)",
				// "rgba(46, 204, 113, 1)",
				"rgba(0, 0, 0 ,0)",
			],
			borderWidth: 2,
			borderRadius: 0,
		},
	],
};

let options = {
	rotation: -90,
	circumference: 180,
	cutout: "80%",
	plugins: {
		tooltip: {
			enabled: false,
		},
	},
	events: [],
	responsive: true,
};

export default function CreditScoreDoughnut({
	bureau = "",
	classNames = "",
	scoreClassNames = "",
	bureauTitleClassNames = "",
}) {
	const chartContainerRef = useRef(null);
	const size = useWindowSize();
	const [chartStyle, setChartStyle] = useState({});
	const content_width = useLayoutStore((state) => state.content_width);
	const doughnutRef = useRef(null);

	useEffect(() => {
		if (content_width < 640) {
			setChartStyle({
				width: content_width,
				height: content_width * 0.7,
				paddingBottom: content_width * 0.13,
			});
		} else {
			setChartStyle({
				width: content_width / 3.1,
				height: content_width / 3.4,
				paddingBottom: content_width * 0.13,
				marginTop: 70,
			});
		}
	}, [content_width, size]);

	return (
		<div
			className={`px-[5px] w-full relative flex flex-col items-center ${classNames}`}
			ref={chartContainerRef}
			style={{ height: chartStyle.height }}
		>
			<Doughnut
				className="absolute"
				data={data}
				options={options}
				ref={doughnutRef}
			/>
			<Doughnut className="absolute" data={data2} options={options} />
			<div
				className="absolute flex flex-col items-center justify-end"
				style={chartStyle}
			>
				<div className={`font-bold ${scoreClassNames}`}>500</div>
				<div className={`${bureauTitleClassNames}`}>{bureau}</div>
			</div>
		</div>
	);
}
