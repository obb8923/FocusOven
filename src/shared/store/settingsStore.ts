import { create } from "zustand";
import AsyncStorageService from "@service/asyncStorageService";
import { STORAGE_KEYS } from "@constant/STORAGE_KEYS";

type AppSettings = {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  dailyFocusGoalMinutes: number;
};

type SettingsState = AppSettings & {
  loading: boolean;
  loaded: boolean;
  load: () => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setDailyFocusGoalMinutes: (minutes: number) => void;
};

const DEFAULT_SETTINGS: AppSettings = {
  notificationsEnabled: true,
  soundEnabled: true,
  dailyFocusGoalMinutes: 100,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULT_SETTINGS,
  loading: false,
  loaded: false,

  load: async () => {
    if (get().loading || get().loaded) return;
    set({ loading: true });
    try {
      const stored = await AsyncStorageService.getJSONItem<AppSettings>(STORAGE_KEYS.USER_SETTINGS);
      if (stored) {
        set({
          notificationsEnabled:
            typeof stored.notificationsEnabled === "boolean"
              ? stored.notificationsEnabled
              : DEFAULT_SETTINGS.notificationsEnabled,
          soundEnabled:
            typeof stored.soundEnabled === "boolean"
              ? stored.soundEnabled
              : DEFAULT_SETTINGS.soundEnabled,
          dailyFocusGoalMinutes:
            typeof stored.dailyFocusGoalMinutes === "number" && stored.dailyFocusGoalMinutes > 0
              ? stored.dailyFocusGoalMinutes
              : DEFAULT_SETTINGS.dailyFocusGoalMinutes,
        });
      }
      set({ loaded: true });
    } finally {
      set({ loading: false });
    }
  },

  setNotificationsEnabled: (enabled: boolean) => {
    set({ notificationsEnabled: enabled });
    void persistSettings();
  },

  setSoundEnabled: (enabled: boolean) => {
    set({ soundEnabled: enabled });
    void persistSettings();
  },

  setDailyFocusGoalMinutes: (minutes: number) => {
    const clamped = Math.max(25, Math.min(600, Math.round(minutes)));
    set({ dailyFocusGoalMinutes: clamped });
    void persistSettings();
  },
}));

async function persistSettings() {
  const { notificationsEnabled, soundEnabled, dailyFocusGoalMinutes } = useSettingsStore.getState();
  await AsyncStorageService.setJSONItem<AppSettings>(STORAGE_KEYS.USER_SETTINGS, {
    notificationsEnabled,
    soundEnabled,
    dailyFocusGoalMinutes,
  });
}

export const useGetNotificationsEnabled = () =>
  useSettingsStore((state) => state.notificationsEnabled);
export const useGetSoundEnabled = () => useSettingsStore((state) => state.soundEnabled);
export const useGetDailyFocusGoalMinutes = () =>
  useSettingsStore((state) => state.dailyFocusGoalMinutes);
export const useSetSettingsLoad = () => useSettingsStore((state) => state.load);
export const useSetNotificationsEnabled = () =>
  useSettingsStore((state) => state.setNotificationsEnabled);
export const useSetSoundEnabled = () => useSettingsStore((state) => state.setSoundEnabled);
export const useSetDailyFocusGoalMinutes = () =>
  useSettingsStore((state) => state.setDailyFocusGoalMinutes);

