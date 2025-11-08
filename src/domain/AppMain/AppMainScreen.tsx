import React from 'react';
import { View , Image, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@component/Text';
import { Background } from '@shared/component/Background';
import { Timer } from '@domain/AppMain/component/Timer/Timer';
import { Oven } from '@domain/AppMain/component/Oven';
import { BreadImage } from '@component/BreadImage';
import { BREADS } from '@constant/breads';
import MenuIcon from '@assets/svgs/Menu.svg';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { AppMainDrawerParamList } from '@/shared/nav/drawer/AppMainDrawer';
export const AppMainScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<AppMainDrawerParamList>>();
  return (
    <Background>

      <View className="px-4 flex-row my-6 w-full items-center justify-between">
        <TouchableOpacity className="p-3 bg-gray-100 rounded-full" onPress={() => navigation.openDrawer()}>
          <MenuIcon width={18} height={18} color="#666666"/>
        </TouchableOpacity>
        <Text text="Baking Time" type="title1" className="text-2xl" />
        <View className="p-3 rounded-full" />
      </View>

      <Oven/>

        {/* 타이머와 오븐 설정 */}
      <View className="flex-1">
          <Timer />
          <View></View>
        <View className="flex-1 px-4">
          <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 50}}>
            <View className="w-full  bg-gray-100 gap-y-4 rounded-3xl px-4 py-8" >
              {/* 헤더 - 제목과 시작 버튼 */}
              <View className="w-full flex-row items-center justify-between">
                <Text text="오븐 설정" type="title1" className="text-2xl font-bold" />
                <TouchableOpacity onPress={() => {}} className="px-2 py-1 bg-white rounded-full">
                  <Text text="시작하기" type="body1" className="font-semibold" />
                </TouchableOpacity>
              </View>
              {/* 빵 선택 */}
              <View className="w-full gap-y-2">
              <Text text="빵 선택" type="title4" className="w-full" />
              <ScrollView
                className="w-full h-16"
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4 }}
              >
                <View className="flex-row gap-x-2">
                  {BREADS.map((bread, index) => (
                    <BreadImage key={bread.key} source={bread.source} selected={index === 0} />
                  ))}
                </View>
              </ScrollView>
              </View>
              {/* 시간 설정 */}
              <Text text="시간 설정" type="title4" className="text-2xl font-bold" />

            </View>
          </ScrollView>

        </View>
      </View>
    </Background>
  );
};