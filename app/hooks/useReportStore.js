import { create } from "zustand";

export const useReportStore = create((set) => ({
	report: {},
	set_report: (report) => set((state) => ({ report })),
}));
