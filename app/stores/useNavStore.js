import { create } from "zustand";

export const useNavStore = create((set) => ({
	collapsed: true,
	set_collapsed: (collapsed) => set((state) => ({ collapsed })),
}));
