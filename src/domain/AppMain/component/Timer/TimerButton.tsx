import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@component/Text';

export type TimerButtonProps = {
  timeLabel: string; // "MM:SS"
  onPress: () => void;
};

export const TimerButton = ({ timeLabel, onPress }: TimerButtonProps) => {
  const displayLabel = __DEV__ && timeLabel === '포기' ? '완료' : timeLabel;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="px-4 h-[37] w-[100] items-center justify-center bg-[#0763F6] rounded-full relative"
    >
      <View
        className="absolute top-0 left-0 right-0 bottom-0 rounded-full"
        style={{
          boxShadow: [
            {
              inset: true,
              offsetX: 0,
              offsetY: 0,
              blurRadius: 7.5,
              spreadDistance: 0,
              color: 'rgba(255, 255, 255, 0.7)',
            },
          ],
        }}
      />
      <View
        className="absolute top-0 left-0 right-0 bottom-0 rounded-full"
        style={{
          boxShadow: [
            {
              inset: true,
              offsetX: 0,
              offsetY: 0,
              blurRadius: 2.5,
              spreadDistance: 0,
              color: 'rgba(255, 255, 255, 0.7)',
            },
          ],
        }}
      />
      <Text text={displayLabel} className="text-white" type="body1" numberOfLines={1} />
    </TouchableOpacity>
  );
};

