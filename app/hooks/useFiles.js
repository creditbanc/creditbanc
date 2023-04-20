import { create } from "zustand";

export const useFilesStore = create((set) => ({
	files: [],
	set_files: (override) => set((state) => ({ ...state, ...override })),
}));
