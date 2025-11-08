import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@component/Text';
import { Background } from '@shared/component/Background';
import { Timer } from '@domain/AppMain/component/Timer/Timer';
import { Oven } from '@domain/AppMain/component/Oven';
import MenuIcon from '@assets/svgs/Menu.svg';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { AppMainDrawerParamList } from '@/shared/nav/drawer/AppMainDrawer';
import { useGetTimerStatus, useSetTimerStart } from '@store/timerStore';
import { useGetBakerLevel } from '@store/bakerStore';
import { OvenSettingsModal } from '@domain/AppMain/component/OvenSettingsModal';
export const AppMainScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<AppMainDrawerParamList>>();
  const startTimer = useSetTimerStart();
  const timerStatus = useGetTimerStatus();
  const level = useGetBakerLevel();
  const [showSettings, setShowSettings] = useState(false);

  const handleStart = () => {
    if (timerStatus === 'running') return;
    startTimer();
  };
  return (
    <Background>

      <View className="px-4 flex-row my-6 w-full items-center justify-between">
        <TouchableOpacity className="p-3 bg-gray-100 rounded-full" onPress={() => navigation.openDrawer()}>
          <MenuIcon width={18} height={18} color="#666666"/>
        </TouchableOpacity>
        <Text text="Baking Time" type="title1" className="text-2xl" />
        <View className="px-3 py-1 rounded-full bg-white/70 border border-gray-200">
          <Text text={`Lv.${level}`} type="body2" className="font-semibold" />
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.85} onPress={() => setShowSettings(true)}>
        <Oven/>
      </TouchableOpacity>

        {/* 타이머와 오븐 설정 */}
      <View className="flex-1">
          <Timer />
          <View></View>
        <View className="flex-1 px-4">
          <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 50}}>
            <View className="w-full items-center justify-center py-10">
              <Text text="오븐을 눌러 설정을 열어보세요." type="body2" className="text-gray-500" />
            </View>
          </ScrollView>

        </View>
      </View>
      <OvenSettingsModal
        visible={showSettings}
        status={timerStatus}
        onStartPress={handleStart}
        onRequestClose={() => setShowSettings(false)}
      />
    </Background>
  );
};