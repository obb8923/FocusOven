import { Image, View } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type OvenProps = {
  isOn?: boolean;
};

export const Oven = ({ isOn = false }: OvenProps) => {
  const overlayOpacity = useSharedValue(isOn ? 0 : 1);

  useEffect(() => {
    overlayOpacity.value = withTiming(isOn ? 0 : 1, { duration: 250 });
  }, [isOn, overlayOpacity]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <View className="w-full items-center justify-center">
      <View
        className="w-1/2 items-center justify-center"
        style={{
          aspectRatio: 1,
          boxShadow: isOn
            ? [
                {
                  offsetX: 0,
                  offsetY: 0,
                  blurRadius: 100,
                  spreadDistance: 7,
                  color: '#FFA6214d',
                },
              ]
            : undefined,
        }}>
        <Image
          source={require('@assets/pngs/oven_on.png')}
          className="absolute inset-0 w-full h-full"
          resizeMode="contain"
        />
        <Animated.View
          pointerEvents="none"
          className="absolute top-[60] left-[21] right-0 w-[160] h-[103] rounded bg-black"
          style={overlayAnimatedStyle}
        />
      </View>
    </View>
  );
};