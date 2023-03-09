import { create } from "zustand";

export const useModalStore = create((set) => ({
	is_open: false,
	set_open: (is_open) => set({ is_open }),
}));
