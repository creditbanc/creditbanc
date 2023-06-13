import { create } from "zustand";
import { pipe } from "ramda";
import { mod } from "shades";

export const useFilesStore = create((set) => ({
	files: [],
	set_files: (path, value) =>
		set((state) => pipe(mod(...path)(() => value))(state)),
}));
