import { useEffect, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";

export const useElmSize = (target) => {
	const [size, setSize] = useState();

	useEffect(() => {
		target && setSize(target.getBoundingClientRect());
	}, [target]);

	// Where the magic happens
	useResizeObserver(target, (entry) => setSize(entry.contentRect));
	return size;
};
