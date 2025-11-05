export const STORAGE_KEYS = {
  IS_FIRST_VISIT: "IS_FIRST_VISIT",
} as const;

export type StorageKeyName = keyof typeof STORAGE_KEYS;
