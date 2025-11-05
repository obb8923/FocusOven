import { create } from "zustand";
import AsyncStorageService from "@service/asyncStorageService";
import { STORAGE_KEYS } from "@shared/constant/STORAGE_KEYS";

type FirstVisitState = {
  isFirstVisit: boolean | null;
  loading: boolean;
  load: () => Promise<void>;
  markVisited: () => Promise<void>;
};

const STORAGE_KEY = STORAGE_KEYS.IS_FIRST_VISIT;

export const useFirstVisitStore = create<FirstVisitState>((set, get) => ({
  isFirstVisit: null,
  loading: false,
  load: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const raw = await AsyncStorageService.getJSONItem<boolean>(STORAGE_KEY);
      // 저장된 값이 없으면 첫 방문(true)로 간주
      const isFirst = raw == null ? true : Boolean(raw);
      set({ isFirstVisit: isFirst });
    } finally {
      set({ loading: false });
    }
  },
  markVisited: async () => {
    await AsyncStorageService.setJSONItem<boolean>(STORAGE_KEY, false);
    set({ isFirstVisit: false });
  },
}));

export const useGetIsFirstVisit = () => useFirstVisitStore((state) => state.isFirstVisit);
export const useGetFirstVisitLoading = () => useFirstVisitStore((state) => state.loading);

export const useSetFirstVisitLoad = () => useFirstVisitStore((state) => state.load);
export const useSetFirstVisitMarkVisited = () => useFirstVisitStore((state) => state.markVisited);


