import { create } from "zustand";

export type TimerStatus = "idle" | "running" | "paused" | "finished" | "resting";
export type TimerMode = "focus" | "rest";

type TimerState = {
  secondsLeft: number;
  status: TimerStatus;
  initialSeconds: number;
  lastSessionSeconds: number;
  mode: TimerMode;
  restInitialSeconds: number;
  restSecondsLeft: number;
  // actions
  setInitialSeconds: (seconds: number) => void;
  setRestInitialSeconds: (seconds: number) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  complete: () => void;
  skipRest: () => void;
  transitionToRest: () => void;
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
  mode: "focus",
  restInitialSeconds: 5 * 60,
  restSecondsLeft: 5 * 60,

  setInitialSeconds: (seconds: number) => {
    const clamped = clampToNonNegativeInteger(seconds);
    const { status, mode } = get();
    if (mode === "focus") {
      set({ initialSeconds: clamped });
      if (status === "idle" || status === "finished") {
        set({ secondsLeft: clamped, lastSessionSeconds: clamped });
      }
    }
  },

  setRestInitialSeconds: (seconds: number) => {
    const clamped = clampToNonNegativeInteger(seconds);
    const { status, mode } = get();
    if (mode === "rest") {
      set({ restInitialSeconds: clamped });
      if (status === "idle" || status === "finished") {
        set({ restSecondsLeft: clamped });
      }
    } else {
      set({ restInitialSeconds: clamped });
    }
  },

  start: () => {
    const { status, mode, secondsLeft, restSecondsLeft } = get();
    if (status === "running" || status === "resting") return;
    
    const currentSeconds = mode === "focus" ? secondsLeft : restSecondsLeft;
    if (currentSeconds <= 0) return;

    clearTimer();
    endAtEpochMs = Date.now() + currentSeconds * 1000;
    if (mode === "focus") {
      set({ status: "running", lastSessionSeconds: secondsLeft });
    } else {
      set({ status: "resting" });
    }
    intervalId = setInterval(() => {
      if (endAtEpochMs == null) return;
      const { mode: currentMode } = get();
      const remainingMs = Math.max(0, endAtEpochMs - Date.now());
      const remaining = Math.max(0, Math.round(remainingMs / 1000));
      
      if (currentMode === "focus") {
        set({ secondsLeft: remaining });
      } else {
        set({ restSecondsLeft: remaining });
      }
      
      if (remaining <= 0) {
        clearTimer();
        endAtEpochMs = null;
        const { mode: finishedMode } = get();
        if (finishedMode === "focus") {
          set({ status: "finished" });
        } else {
          set({ status: "finished", restSecondsLeft: 0 });
        }
      }
    }, 1000);
    // 즉시 1회 반영
    const remainingMs = Math.max(0, (endAtEpochMs ?? Date.now()) - Date.now());
    const remaining = Math.max(0, Math.round(remainingMs / 1000));
    if (mode === "focus") {
      set({ secondsLeft: remaining });
    } else {
      set({ restSecondsLeft: remaining });
    }
  },

  pause: () => {
    const { status, mode, secondsLeft, restSecondsLeft } = get();
    if (status !== "running" && status !== "resting") return;
    clearTimer();
    endAtEpochMs = null;
    if (mode === "focus") {
      set({ status: "paused", secondsLeft });
    } else {
      set({ status: "paused", restSecondsLeft });
    }
  },

  resume: () => {
    const { status, mode, secondsLeft, restSecondsLeft } = get();
    if (status !== "paused") return;
    const currentSeconds = mode === "focus" ? secondsLeft : restSecondsLeft;
    if (currentSeconds <= 0) {
      set({ status: "finished" });
      return;
    }
    clearTimer();
    endAtEpochMs = Date.now() + currentSeconds * 1000;
    if (mode === "focus") {
      set({ status: "running" });
    } else {
      set({ status: "resting" });
    }
    intervalId = setInterval(() => {
      if (endAtEpochMs == null) return;
      const { mode: currentMode } = get();
      const remainingMs = Math.max(0, endAtEpochMs - Date.now());
      const remaining = Math.max(0, Math.round(remainingMs / 1000));
      
      if (currentMode === "focus") {
        set({ secondsLeft: remaining });
      } else {
        set({ restSecondsLeft: remaining });
      }
      
      if (remaining <= 0) {
        clearTimer();
        endAtEpochMs = null;
        const { mode: finishedMode } = get();
        if (finishedMode === "focus") {
          set({ status: "finished" });
        } else {
          set({ status: "finished", restSecondsLeft: 0 });
        }
      }
    }, 1000);
    const remainingMs = Math.max(0, (endAtEpochMs ?? Date.now()) - Date.now());
    const remaining = Math.max(0, Math.round(remainingMs / 1000));
    if (mode === "focus") {
      set({ secondsLeft: remaining });
    } else {
      set({ restSecondsLeft: remaining });
    }
  },

  reset: () => {
    clearTimer();
    endAtEpochMs = null;
    const { mode, initialSeconds, restInitialSeconds } = get();
    if (mode === "focus") {
      const clamped = clampToNonNegativeInteger(initialSeconds);
      set({ secondsLeft: clamped, status: "idle", lastSessionSeconds: clamped });
    } else {
      const clamped = clampToNonNegativeInteger(restInitialSeconds);
      set({ restSecondsLeft: clamped, status: "idle" });
    }
  },
  
  complete: () => {
    clearTimer();
    endAtEpochMs = null;
    const { mode, lastSessionSeconds } = get();
    if (mode === "focus") {
      set({ secondsLeft: 0, status: "finished", lastSessionSeconds });
    } else {
      set({ restSecondsLeft: 0, status: "finished" });
    }
  },

  transitionToRest: () => {
    const { restInitialSeconds } = get();
    const clamped = clampToNonNegativeInteger(restInitialSeconds);
    set({ 
      mode: "rest", 
      status: "idle", 
      restSecondsLeft: clamped,
      secondsLeft: 0 
    });
  },

  skipRest: () => {
    const { initialSeconds } = get();
    const clamped = clampToNonNegativeInteger(initialSeconds);
    set({ 
      mode: "focus", 
      status: "idle", 
      secondsLeft: clamped,
      restSecondsLeft: 0 
    });
  },
}));

export const useGetTimerSecondsLeft = () => useTimerStore((s) => s.mode === "focus" ? s.secondsLeft : s.restSecondsLeft);
export const useGetTimerStatus = () => useTimerStore((s) => s.status);
export const useGetTimerMode = () => useTimerStore((s) => s.mode);
export const useSetTimerStart = () => useTimerStore((s) => s.start);
export const useSetTimerPause = () => useTimerStore((s) => s.pause);
export const useSetTimerResume = () => useTimerStore((s) => s.resume);
export const useSetTimerReset = () => useTimerStore((s) => s.reset);
export const useSetTimerInitialSeconds = () => useTimerStore((s) => s.setInitialSeconds);
export const useSetRestInitialSeconds = () => useTimerStore((s) => s.setRestInitialSeconds);
export const useGetTimerLastSessionSeconds = () => useTimerStore((s) => s.lastSessionSeconds);
export const useGetTimerInitialSeconds = () => useTimerStore((s) => s.mode === "focus" ? s.initialSeconds : s.restInitialSeconds);
export const useSetTimerComplete = () => useTimerStore((s) => s.complete);
export const useSetTransitionToRest = () => useTimerStore((s) => s.transitionToRest);
export const useSetSkipRest = () => useTimerStore((s) => s.skipRest);


