import { create } from "zustand";
import { pipe } from "ramda";
import { mod } from "shades";

export const useCashflowStore = create((set) => ({
	financials: {},
	set_state: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));
