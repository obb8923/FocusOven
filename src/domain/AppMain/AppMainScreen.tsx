import React, { useState, useEffect } from 'react';
import { View , Image} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@component/Text';
import { Timer } from '@domain/AppMain/component/Timer';
import { Oven } from '@domain/AppMain/component/Oven';
import { Background } from '@shared/component/Background';
import Svg, { Path } from 'react-native-svg';
import Animated, { Easing, useAnimatedProps, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);
export const AppMainScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <Background>
      {/* <View className="mt-6 w-full items-center justify-center">
        <Text text="집중 타이머" className="text-2xl font-bold" />
      </View> */}
      
      <View className="my-6 w-full items-center justify-center">
      <Text text="Baking Time" type="title1" className="text-2xl" />
      </View>
      <View className="w-full items-center justify-center">
      <View className="w-2/3 items-center justify-center" style={{aspectRatio: 23/27}}>
        <Image source={require('@assets/pngs/oven.png')} className="w-full h-full" />
      </View>
      </View>


      <View className="w-full h-full bg-red-500">
        <View className="w-full">
          <AnimatedCasinoLights />
        </View>
      </View>
      {/* <View className="mt-6 w-[50%] items-center justify-center">

      <Timer />
    </View> */}

      {/* <View className="w-full justify-center items-center mt-8">
        <Oven />
      </View> */}
    </Background>
  );
};

const AnimatedCasinoLights = () => {
  const dashOffset = useSharedValue(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    dashOffset.value = withRepeat(
      withTiming(28, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
  }, [dashOffset]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  // 컨테이너 크기에 맞춘 호 경로 계산 (더 평평하게)
  const w = containerSize.width;
  const h = containerSize.height;
  const effectiveH = Math.max(h, 0);
  const margin = 0 ;
  const y = effectiveH * 0.6; // 아래로 조금 내림 → 더 평평해 보임
  const rx = (w - margin * 2) * 0.6; // 가로 반지름 크게
  const ry = effectiveH * 0.5; // 세로 반지름 작게 → 평평
  const arcPath = w > 0 && effectiveH > 0 ? `M ${margin} ${y} A ${rx} ${ry} 0 0 1 ${w - margin} ${y}` : 'M 0 0';

  return (
    <View className="w-full items-center justify-center">
      <View
        className="w-full bg-black"
        style={{ aspectRatio: 5 }}
        onLayout={({ nativeEvent }) => setContainerSize(nativeEvent.layout)}
      >
        {w > 0 && h > 0 && (
          <Svg width={w} height={h}>
            <AnimatedPath
              animatedProps={animatedProps}
              d={arcPath}
              stroke="white"
              strokeWidth={20}
              strokeDasharray={[2, 26]}
              strokeLinecap="butt"
              fill="none"
            />
          </Svg>
        )}
      </View>
    </View>
  );
};