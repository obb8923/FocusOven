import { create } from "zustand";

export type TimerStatus = "idle" | "running" | "paused" | "finished";

type TimerState = {
  secondsLeft: number;
  status: TimerStatus;
  initialSeconds: number;
  lastSessionSeconds: number;
  // actions
  setInitialSeconds: (seconds: number) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
};

// 내부 인터벌/종료시각은 모듈 스코프에서 관리 (store 인스턴스와 동일 라이프사이클)
let intervalId: ReturnType<typeof setInterval> | null = null;
let endAtEpochMs: number | null = null;

function clearTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function clampToNonNegativeInteger(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  return Math.floor(value);
}

export const useTimerStore = create<TimerState>((set, get) => ({
  secondsLeft: 25 * 60,
  status: "idle",
  initialSeconds: 25 * 60,
  lastSessionSeconds: 25 * 60,

  setInitialSeconds: (seconds: number) => {
    const clamped = clampToNonNegativeInteger(seconds);
    const { status } = get();
    set({ initialSeconds: clamped });
    if (status === "idle" || status === "finished") {
      set({ secondsLeft: clamped, lastSessionSeconds: clamped });
    }
  },

  start: () => {
    const { status, secondsLeft } = get();
    if (status === "running") return;
    if (secondsLeft <= 0) return;

    clearTimer();
    endAtEpochMs = Date.now() + secondsLeft * 1000;
    set({ status: "running", lastSessionSeconds: secondsLeft });
    intervalId = setInterval(() => {
      if (endAtEpochMs == null) return;
      const remainingMs = Math.max(0, endAtEpochMs - Date.now());
      const remaining = Math.max(0, Math.round(remainingMs / 1000));
      set({ secondsLeft: remaining });
      if (remaining <= 0) {
        clearTimer();
        endAtEpochMs = null;
        set({ status: "finished" });
      }
    }, 1000);
    // 즉시 1회 반영
    const remainingMs = Math.max(0, (endAtEpochMs ?? Date.now()) - Date.now());
    const remaining = Math.max(0, Math.round(remainingMs / 1000));
    set({ secondsLeft: remaining });
  },

  pause: () => {
    const { status, secondsLeft } = get();
    if (status !== "running") return;
    clearTimer();
    endAtEpochMs = null;
    set({ status: "paused", secondsLeft });
  },

  resume: () => {
    const { status, secondsLeft } = get();
    if (status !== "paused") return;
    if (secondsLeft <= 0) {
      set({ status: "finished" });
      return;
    }
    clearTimer();
    endAtEpochMs = Date.now() + secondsLeft * 1000;
    set({ status: "running" });
    intervalId = setInterval(() => {
      if (endAtEpochMs == null) return;
      const remainingMs = Math.max(0, endAtEpochMs - Date.now());
      const remaining = Math.max(0, Math.round(remainingMs / 1000));
      set({ secondsLeft: remaining });
      if (remaining <= 0) {
        clearTimer();
        endAtEpochMs = null;
        set({ status: "finished" });
      }
    }, 1000);
    const remainingMs = Math.max(0, (endAtEpochMs ?? Date.now()) - Date.now());
    const remaining = Math.max(0, Math.round(remainingMs / 1000));
    set({ secondsLeft: remaining });
  },

  reset: () => {
    clearTimer();
    endAtEpochMs = null;
    const { initialSeconds } = get();
    const clamped = clampToNonNegativeInteger(initialSeconds);
    set({ secondsLeft: clamped, status: "idle", lastSessionSeconds: clamped });
  },
}));

export const useGetTimerSecondsLeft = () => useTimerStore((s) => s.secondsLeft);
export const useGetTimerStatus = () => useTimerStore((s) => s.status);
export const useSetTimerStart = () => useTimerStore((s) => s.start);
export const useSetTimerPause = () => useTimerStore((s) => s.pause);
export const useSetTimerResume = () => useTimerStore((s) => s.resume);
export const useSetTimerReset = () => useTimerStore((s) => s.reset);
export const useSetTimerInitialSeconds = () => useTimerStore((s) => s.setInitialSeconds);
export const useGetTimerLastSessionSeconds = () => useTimerStore((s) => s.lastSessionSeconds);
export const useGetTimerInitialSeconds = () => useTimerStore((s) => s.initialSeconds);


