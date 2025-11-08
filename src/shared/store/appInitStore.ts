import { create } from "zustand";
import { useFirstVisitStore } from "@store/firstVisitStore";
import { useTabStore } from "@store/tabStore";
import { useBakerStore } from "@store/bakerStore";
import { useSettingsStore } from "@store/settingsStore";

type AppInitState = {
  initialized: boolean;
  initializing: boolean;
  initialize: () => Promise<void>;
};

export const useAppInitStore = create<AppInitState>((set, get) => ({
  initialized: false,
  initializing: false,
  initialize: async () => {
    if (get().initialized || get().initializing) return;
    set({ initializing: true });
    try {
      // 1) 첫 방문 여부 로드
      await useFirstVisitStore.getState().load();
      const isFirst = useFirstVisitStore.getState().isFirstVisit;

      // 2) 탭 초기 진입 스택 설정
      const nextTab = isFirst ? "Onboarding" : "AppMain";
      useTabStore.getState().setTab(nextTab);

      // 3) 제빵사 진행도 로드
      await useBakerStore.getState().load();

      // 4) 사용자 설정 로드
      await useSettingsStore.getState().load();

      // 추후 다른 초기화 작업들을 이곳에 연결 가능
    } finally {
      set({ initializing: false, initialized: true });
    }
  },
}));

export const useGetAppInitInitialized = () => useAppInitStore((state) => state.initialized);
export const useGetAppInitInitializing = () => useAppInitStore((state) => state.initializing);

export const useSetAppInitialize = () =>
  useAppInitStore((state) => state.initialize);


