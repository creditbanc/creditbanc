import { useEffect, useRef, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import useWindowSize from "~/hooks/useWindowSize";
import { useNavStore } from "~/stores/useNavStore";
import { useLayoutStore } from "~/stores/useLayoutStore";

ChartJS.register(ArcElement, Tooltip, Legend);

let options = {
	// rotation: -90,
	// circumference: 180,
	cutout: "80%",
	// plugins: {
	// 	tooltip: {
	// 		enabled: false,
	// 	},
	// },
	events: [],
	responsive: true,
};

export const data = (dataset) => ({
	datasets: [
		{
			data: [...dataset],
			backgroundColor: [
				// "rgba(231, 76, 60, 1)",
				"rgba(255, 164, 46, 1)",
				"rgba(46, 204, 113, 1)",
			],
			borderWidth: 1,
			borderRadius: 1,
		},
	],
});

export default function DoughnutChart({ children, dataset }) {
	return (
		<div className="flex flex-col items-center w-full">
			<div className="flex flex-col w-[200px] h-[200px] relative">
				{children}
				<Doughnut
					key={Math.random()}
					data={data(dataset)}
					options={options}
				/>
			</div>
		</div>
	);
}
