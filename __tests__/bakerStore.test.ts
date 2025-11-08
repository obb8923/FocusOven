import { useBakerStore } from '../src/shared/store/bakerStore';

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

describe('useBakerStore', () => {
  beforeEach(() => {
    useBakerStore.setState({
      level: 1,
      experience: 0,
      selectedBreadKey: 'PlainBread',
      breadCounts: {},
      focusLogs: [],
      loading: false,
      loaded: false,
    });
    jest.clearAllMocks();
  });

  it('increments bread count, experience, and focus logs when awarding bread', async () => {
    await useBakerStore.getState().awardBread('PlainBread', 1500);

    const state = useBakerStore.getState();
    expect(state.breadCounts['PlainBread']).toBe(1);
    expect(state.experience).toBeGreaterThan(0);
    expect(state.level).toBe(1);
    expect(state.focusLogs.length).toBe(1);
    expect(state.focusLogs[0].breadKey).toBe('PlainBread');
  });

  it('promotes baker level when experience threshold is reached', async () => {
    useBakerStore.setState({ experience: 9, level: 1 });

    await useBakerStore.getState().awardBread('Baguette', 1500);

    const state = useBakerStore.getState();
    expect(state.experience).toBe(11);
    expect(state.level).toBe(2);
  });

  it('does not change selection when trying to select locked bread', () => {
    useBakerStore.setState({ selectedBreadKey: 'PlainBread', level: 1 });

    useBakerStore.getState().setSelectedBread('Croissant');

    const state = useBakerStore.getState();
    expect(state.selectedBreadKey).toBe('PlainBread');
  });
});

