import React from 'react';
import { View , Image, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@component/Text';
import { Background } from '@shared/component/Background';
import { Timer } from '@/domain/AppMain/component/Timer/Timer';
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

        {/* 타이머와 오븐 설정 */}
      <View className="flex-1">
          <Timer />
          <View></View>
        <View className="flex-1 px-4">
          <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 50}}>
            <View className="w-full  bg-gray-200 gap-y-8 rounded-3xl p-4" >
              <Text text="시간 설정" type="title1" className="text-2xl font-bold" />
            </View>
          </ScrollView>

        </View>
      </View>
    </Background>
  );
};