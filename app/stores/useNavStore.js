import { create } from "zustand";

export const useNavStore = create((set) => ({
	collapsed: false,
	set_collapsed: () => set((state) => ({ collapsed: !state.collapsed })),
}));
