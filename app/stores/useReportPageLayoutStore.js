import { create } from "zustand";
import { pipe } from "ramda";
import { mod } from "shades";

export const useReportPageLayoutStore = create((set) => ({
	coordinates: {},
	set_coordinates: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));
