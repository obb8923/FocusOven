import React from 'react';
import { View ,Text as RNText} from 'react-native';
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
      <RNText className="text-3xl">집중 타이머 abcdpgfz</RNText>
      <RNText className="text-3xl" style={{fontFamily: 'Pretendard-Regular'}}>집중 타이머 abcdpgfz</RNText>

      <Text text="집중 타이머 abcdpgfz" type="title1" className="text-2xl" />
      <Text text="집중 타이머 abcdpgfz" type="title2" className="text-2xl" />
      <Text text="집중 타이머 abcdpgfz" type="title3" className="text-2xl" />
      <Text text="집중 타이머 abcdpgfz" type="title4" className="text-2xl" />
      <Text text="집중 타이머 abcdpgfz" type="body1" className="text-2xl" />
      <Text text="집중 타이머 abcdpgfz" type="body2" className="text-2xl" />
      <Text text="집중 타이머 abcdpgfz" type="body3" className="text-2xl" />
      <Text text="집중 타이머 abcdpgfz" type="caption1" className="text-2xl" />
      <Text text="집중 타이머 abcdpgfz" type="number" className="text-2xl" />



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