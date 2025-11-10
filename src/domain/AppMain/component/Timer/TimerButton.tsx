import React from 'react';
import { Button } from '@shared/component/Button';
export type TimerButtonProps = {
  timeLabel: string; // "MM:SS"
  onPress: () => void;
};

export const TimerButton = ({ timeLabel, onPress }: TimerButtonProps) => {
  const displayLabel = __DEV__ && timeLabel === '포기' ? '완료' : timeLabel;

  return (
   <Button text={displayLabel} onPress={onPress} />
  );
};

