import { useSettingsStore } from '../src/shared/store/settingsStore';

jest.mock('../src/shared/service/asyncStorageService', () => {
  const memory = new Map<string, unknown>();
  return {
    __esModule: true,
    default: {
      setJSONItem: jest.fn(async (key: string, value: unknown) => {
        memory.set(key, value);
      }),
      getJSONItem: jest.fn(async (key: string) => memory.get(key) ?? null),
    },
    setJSONItem: jest.fn(async (key: string, value: unknown) => {
      memory.set(key, value);
    }),
    getJSONItem: jest.fn(async (key: string) => memory.get(key) ?? null),
  };
});

describe('useSettingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      notificationsEnabled: true,
      soundEnabled: true,
      dailyFocusGoalMinutes: 100,
    });
    jest.clearAllMocks();
  });

  it('updates notification and sound toggles', () => {
    const { setNotificationsEnabled, setSoundEnabled } = useSettingsStore.getState();

    setNotificationsEnabled(false);
    setSoundEnabled(false);

    const state = useSettingsStore.getState();
    expect(state.notificationsEnabled).toBe(false);
    expect(state.soundEnabled).toBe(false);
  });

  it('clamps daily focus goal within valid range', () => {
    const { setDailyFocusGoalMinutes } = useSettingsStore.getState();

    setDailyFocusGoalMinutes(10);
    expect(useSettingsStore.getState().dailyFocusGoalMinutes).toBe(25);

    setDailyFocusGoalMinutes(750);
    expect(useSettingsStore.getState().dailyFocusGoalMinutes).toBe(600);
  });
});

