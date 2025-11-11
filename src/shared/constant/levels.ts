// 레벨 0~10까지 각 레벨에 도달하기 위한 누적 집중 시간(분)
// 주석은 해당 레벨까지 도달하는데 필요한 실제 집중 시간(분)을 나타냄
export const LEVEL_MINUTES_THRESHOLDS = [
  0,      // 레벨 0: 0분
  20,     // 레벨 1: 20분
  60,     // 레벨 2: 60분
  180,    // 레벨 3: 180분 (3시간)
  360,    // 레벨 4: 360분 (6시간)
  600,    // 레벨 5: 600분 (10시간)
  900,    // 레벨 6: 900분 (15시간)
  1200,   // 레벨 7: 1200분 (20시간)
  1500,   // 레벨 8: 1500분 (25시간)
  1800,   // 레벨 9: 1800분 (30시간)
  2100,   // 레벨 10: 2100분 (35시간)
] as const;

/**
 * 집중 시간(분)을 경험치로 변환하는 함수
 * @param minutes 집중 시간(분)
 * @returns 획득 경험치
 */
export function experienceFromMinutes(minutes: number): number {
  if (minutes <= 0) return 0;
  const normalized = minutes / 25;
  const gain = Math.pow(normalized, 1.2) * 10;
  return Math.max(0, Math.round(gain));
}

/**
 * 각 레벨에 도달하기 위한 필요 경험치 배열
 */
export const LEVEL_THRESHOLDS: number[] = LEVEL_MINUTES_THRESHOLDS.map(experienceFromMinutes);

/**
 * 최대 레벨
 */
export const MAX_LEVEL = LEVEL_THRESHOLDS.length - 1;

/**
 * 경험치를 기반으로 현재 레벨을 계산하는 함수
 * @param experience 현재 경험치
 * @returns 현재 레벨 (0~MAX_LEVEL)
 */
export function computeLevel(experience: number): number {
  let level = 0;
  for (let idx = LEVEL_THRESHOLDS.length - 1; idx >= 0; idx -= 1) {
    if (experience >= LEVEL_THRESHOLDS[idx]) {
      level = idx;
      break;
    }
  }
  return Math.min(level, MAX_LEVEL);
}

/**
 * 집중 시간(초)을 경험치로 변환하는 함수
 * @param durationSeconds 집중 시간(초)
 * @returns 획득 경험치
 */
export function calculateExperienceGain(durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
  const minutes = durationSeconds / 60;
  return experienceFromMinutes(minutes);
}

