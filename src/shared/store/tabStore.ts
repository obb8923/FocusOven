import { create } from "zustand";

export type TabKey = "AppMain" | "Backery" | "ETC" | "Onboarding";

type TabStore = {
  currentTab: TabKey;
  setTab: (next: TabKey) => void;
};

export const useTabStore = create<TabStore>((set) => ({
  currentTab: "Onboarding",
  setTab: (next) => set({ currentTab: next }),
}));

export const useGetCurrentTab = () => useTabStore((state) => state.currentTab);
export const useSetTab = () => useTabStore((state) => state.setTab);


