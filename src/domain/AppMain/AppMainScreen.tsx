import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@component/Text';
import { Timer } from '@domain/AppMain/component/Timer';
import { Oven } from '@domain/AppMain/component/Oven';
import { Background } from '@shared/component/Background';
export const AppMainScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <Background>
    <View className="px-6">
      {/* <View className="mt-6 w-full items-center justify-center">
        <Text text="집중 타이머" className="text-2xl font-bold" />
      </View> */}

      {/* <View className="mt-6 w-[50%] items-center justify-center">

      <Timer />
    </View> */}

      {/* <View className="w-full justify-center items-center mt-8">
        <Oven />
      </View> */}
    </View>
    </Background>
  );
};