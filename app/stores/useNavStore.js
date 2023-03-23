import { create } from "zustand";

export const useNavStore = create((set) => ({
	collapsed: false,
	set_collapsed: (collapsed) => set((state) => ({ collapsed })),
}));
