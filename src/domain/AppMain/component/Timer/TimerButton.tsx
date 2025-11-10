import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/component/Button';

export type TimerButtonProps = {
  labelKey: string;
  labelParams?: Record<string, unknown>;
  devOverrideKey?: string;
  onPress: () => void;
};

export const TimerButton = ({ labelKey, labelParams, devOverrideKey, onPress }: TimerButtonProps) => {
  const { t } = useTranslation();

  const baseLabel = t(labelKey, labelParams);
  const displayLabel = baseLabel;

  return <Button text={displayLabel} onPress={onPress} />;
};