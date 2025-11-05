import { useCallback, useEffect, useRef, useState } from 'react';

// 단일 카운트다운 타이머 훅
// - 제어 함수: start/pause/resume/reset, 외부에서 초기 초 변경(setInitialSeconds)

export type CountdownStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface UseCountdownTimerParams {
  initialSeconds: number;
  tickMs?: number;
}

export interface UseCountdownTimerReturn {
  secondsLeft: number;
  status: CountdownStatus;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setInitialSeconds: (seconds: number) => void;
}

// 음수/NaN 방지용 보정 유틸
function clampToNonNegativeInteger(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  return Math.floor(value);
}

export function useCountdownTimer(
  { initialSeconds, tickMs = 1000 }: UseCountdownTimerParams,
): UseCountdownTimerReturn {
  const [secondsLeft, setSecondsLeft] = useState<number>(
    clampToNonNegativeInteger(initialSeconds),
  );
  const [status, setStatus] = useState<CountdownStatus>('idle');

  // 정밀 타이밍 및 정리용 가변 ref
  // initialSecondsRef: reset 시 복구할 기준값
  const initialSecondsRef = useRef<number>(clampToNonNegativeInteger(initialSeconds));
  // intervalIdRef: 인터벌 핸들 저장 및 정리
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // endAtEpochMsRef: 종료 예정 시각(UTC epoch ms). 이 값을 기준으로 남은 시간을 계산
  const endAtEpochMsRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  // 현재 시점 기준 남은 초를 계산 (드리프트 보정 핵심)
  const computeRemainingSeconds = useCallback(() => {
    if (endAtEpochMsRef.current == null) return secondsLeft;
    const now = Date.now();
    const remainingMs = Math.max(0, endAtEpochMsRef.current - now);
    // 깜빡임 방지를 위해 반올림하여 초 단위로 변환
    return Math.max(0, Math.round(remainingMs / 1000));
  }, [secondsLeft]);

  // 주기적으로 남은 시간을 갱신하고, 0초 도달 시 finished로 전환
  const tick = useCallback(() => {
    const remaining = computeRemainingSeconds();
    setSecondsLeft(remaining);
    if (remaining <= 0) {
      clearTimer();
      endAtEpochMsRef.current = null;
      setStatus('finished');
    }
  }, [clearTimer, computeRemainingSeconds]);

  // idle/finished 상태에서 현재 표시된 secondsLeft 기준으로 타이머 시작
  // 이미 running이면 무시, 0초 이하면 시작하지 않음
  const start = useCallback(() => {
    // Allow start from idle/finished with current secondsLeft
    if (status === 'running') return;

    const startFrom = secondsLeft;
    if (startFrom <= 0) return; // no-op when zero

    clearTimer();
    const now = Date.now();
    endAtEpochMsRef.current = now + startFrom * 1000;
    setStatus('running');
    intervalIdRef.current = setInterval(tick, tickMs);
    // run an immediate tick to sync display quickly
    tick();
  }, [clearTimer, secondsLeft, status, tick, tickMs]);

  // running -> paused 전이: 남은 시간을 스냅샷으로 저장하고 인터벌 해제
  const pause = useCallback(() => {
    if (status !== 'running') return;
    // snapshot remaining, stop interval
    const remaining = computeRemainingSeconds();
    clearTimer();
    endAtEpochMsRef.current = null;
    setSecondsLeft(remaining);
    setStatus('paused');
  }, [clearTimer, computeRemainingSeconds, status]);

  // paused -> running 전이: 남은 시간을 기준으로 종료 예정 시각 재설정
  const resume = useCallback(() => {
    if (status !== 'paused') return;
    if (secondsLeft <= 0) {
      setStatus('finished');
      return;
    }
    clearTimer();
    endAtEpochMsRef.current = Date.now() + secondsLeft * 1000;
    setStatus('running');
    intervalIdRef.current = setInterval(tick, tickMs);
    tick();
  }, [clearTimer, secondsLeft, status, tick, tickMs]);

  // 어느 상태에서도 가능: 인터벌 정리, 종료시각 초기화, idle로 복귀
  const reset = useCallback(() => {
    clearTimer();
    endAtEpochMsRef.current = null;
    setSecondsLeft(clampToNonNegativeInteger(initialSecondsRef.current));
    setStatus('idle');
  }, [clearTimer]);

  // 외부에서 초기 초를 변경할 때 사용
  // running/paused 중에는 보이는 값은 바꾸지 않고 기준값만 갱신
  const setInitialSecondsPublic = useCallback((seconds: number) => {
    const clamped = clampToNonNegativeInteger(seconds);
    initialSecondsRef.current = clamped;
    if (status === 'idle' || status === 'finished') {
      // only sync visible time when not actively counting
      setSecondsLeft(clamped);
    }
  }, [status]);

  // props.initialSeconds가 바뀔 때 동기화
  // 단, running/paused 동안에는 표시값을 건드리지 않음
  useEffect(() => {
    const clamped = clampToNonNegativeInteger(initialSeconds);
    initialSecondsRef.current = clamped;
    if (status === 'idle' || status === 'finished') {
      setSecondsLeft(clamped);
    }
    // Do not auto-reset during running/paused
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSeconds]);

  // 언마운트 시 인터벌 정리
  useEffect(() => () => clearTimer(), [clearTimer]);

  return {
    secondsLeft,
    status,
    start,
    pause,
    resume,
    reset,
    setInitialSeconds: setInitialSecondsPublic,
  };
}


