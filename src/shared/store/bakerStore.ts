import { create } from "zustand";
import AsyncStorageService from "@service/asyncStorageService";
import { STORAGE_KEYS } from "@constant/STORAGE_KEYS";
import { BREADS, Bread } from "@constant/breads";
import {
  computeLevel,
  calculateExperienceGain,
  MAX_LEVEL,
} from "@constant/levels";

type BreadCounts = Record<string, number>;

export type FocusLog = {
  id: string;
  breadKey: string;
  durationSeconds: number;
  finishedAt: string; // ISO string
};

type BakerState = {
  level: number;
  experience: number;
  selectedBreadKey: string | null;
  breadCounts: BreadCounts;
  focusLogs: FocusLog[];
  loading: boolean;
  loaded: boolean;
  load: () => Promise<void>;
  setSelectedBread: (breadKey: string) => void;
  awardBread: (breadKey: string, durationSeconds: number) => Promise<number | null>;
};

type PersistedProgress = {
  experience: number;
  selectedBreadKey: string | null;
  breadCounts: BreadCounts;
};


const BREAD_MAP: Map<string, Bread> = new Map(BREADS.map((bread) => [bread.key, bread]));


function getDefaultSelectableBread(level: number, fallback: string | null = null): string | null {
  const unlocked = BREADS.find((bread) => bread.level <= level);
  if (unlocked) return unlocked.key;
  return fallback;
}

function isBreadUnlocked(level: number, breadKey: string | null): boolean {
  if (!breadKey) return false;
  const bread = BREAD_MAP.get(breadKey);
  if (!bread) return false;
  return level >= bread.level;
}

export const useBakerStore = create<BakerState>((set, get) => ({
  level: 0,
  experience: 0,
  selectedBreadKey: getDefaultSelectableBread(0),
  breadCounts: {},
  focusLogs: [],
  loading: false,
  loaded: false,

  load: async () => {
    if (get().loading || get().loaded) return;
    set({ loading: true });
    try {
      const [progress, focusLogs] = await Promise.all([
        AsyncStorageService.getJSONItem<PersistedProgress>(STORAGE_KEYS.BAKER_PROGRESS),
        AsyncStorageService.getJSONItem<FocusLog[]>(STORAGE_KEYS.FOCUS_LOGS),
      ]);

      const experience = progress?.experience ?? 0;
      const level = computeLevel(experience);
      const breadCounts = progress?.breadCounts ?? {};
      const rawSelected = progress?.selectedBreadKey ?? null;
      const selectedBreadKey =
        rawSelected && isBreadUnlocked(level, rawSelected)
          ? rawSelected
          : getDefaultSelectableBread(level);

      set({
        experience,
        level,
        breadCounts,
        selectedBreadKey,
        focusLogs: focusLogs ?? [],
        loaded: true,
      });
    } finally {
      set({ loading: false });
    }
  },

  setSelectedBread: (breadKey: string) => {
    const { level } = get();
    if (!isBreadUnlocked(level, breadKey)) return;
    set({ selectedBreadKey: breadKey });
    void persistProgress();
  },

  awardBread: async (breadKey: string, durationSeconds: number) => {
    const bread = BREAD_MAP.get(breadKey);
    if (!bread) return null;
    const xpGain = calculateExperienceGain(durationSeconds);

    set((state) => {
      const nextCounts = { ...state.breadCounts };
      nextCounts[breadKey] = (nextCounts[breadKey] ?? 0) + 1;

      const experience = state.experience + xpGain;
      const level = computeLevel(experience);
      const focusLog: FocusLog = {
        id: `${Date.now()}`,
        breadKey,
        durationSeconds,
        finishedAt: new Date().toISOString(),
      };
      const focusLogs = [focusLog, ...state.focusLogs].slice(0, 100);
      const selectedBreadKey = isBreadUnlocked(level, state.selectedBreadKey)
        ? state.selectedBreadKey
        : getDefaultSelectableBread(level, state.selectedBreadKey);

      return {
        ...state,
        breadCounts: nextCounts,
        experience,
        level,
        focusLogs,
        selectedBreadKey,
      };
    });

    await persistProgress();
    await persistFocusLogs();
    return xpGain;
  },
}));

async function persistProgress() {
  const { experience, selectedBreadKey, breadCounts } = useBakerStore.getState();
  await AsyncStorageService.setJSONItem<PersistedProgress>(STORAGE_KEYS.BAKER_PROGRESS, {
    experience,
    selectedBreadKey,
    breadCounts,
  });
}

async function persistFocusLogs() {
  const { focusLogs } = useBakerStore.getState();
  await AsyncStorageService.setJSONItem<FocusLog[]>(STORAGE_KEYS.FOCUS_LOGS, focusLogs);
}


export const useGetBakerLevel = () => useBakerStore((state) => state.level);
export const useGetBakerExperience = () => useBakerStore((state) => state.experience);
export const useGetSelectedBreadKey = () => useBakerStore((state) => state.selectedBreadKey);
export const useGetBreadCounts = () => useBakerStore((state) => state.breadCounts);
export const useGetFocusLogs = () => useBakerStore((state) => state.focusLogs);
export const useSetSelectedBread = () => useBakerStore((state) => state.setSelectedBread);
export const useAwardBread = () => useBakerStore((state) => state.awardBread);
export const useSetBakerLoad = () => useBakerStore((state) => state.load);

