import { create } from "zustand";

export const useModalStore = create((set) => ({
	id: null,
	is_open: false,
	set_open: (is_open) => set({ is_open }),
	set_modal: (state) => set(state),
}));
