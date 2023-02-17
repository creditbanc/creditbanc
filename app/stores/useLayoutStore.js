import { create } from "zustand";

export const useLayoutStore = create((set) => ({
	content_width: 0,
	set_content_width: (content_width) => set(() => ({ content_width })),
}));
