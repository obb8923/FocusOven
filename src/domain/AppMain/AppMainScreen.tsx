import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@component/Text';
import { Background } from '@shared/component/Background';
import { Timer } from '@domain/AppMain/component/Timer/Timer';
import { Oven } from '@domain/AppMain/component/Oven';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import MenuIcon from '@assets/svgs/Menu.svg';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { AppMainDrawerParamList } from '@/shared/nav/drawer/AppMainDrawer';
import { useGetTimerStatus, useSetTimerReset, useSetTimerStart } from '@store/timerStore';
import { useAwardBread, useGetBakerLevel, useGetSelectedBreadKey } from '@store/bakerStore';
import { OvenSettingsModal } from '@domain/AppMain/component/OvenSettingsModal';
import { Portal } from '@gorhom/portal';
import { BREADS, Bread } from '@shared/constant/breads';
import { FocusCompleteModal } from './component/FocusCompleteModal';
import { FocusGiveUpModal } from './component/FocusGiveUpModal';
import { LevelStatusModal } from '@domain/AppMain/component/LevelStatusModal';
export const AppMainScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<AppMainDrawerParamList>>();
  const startTimer = useSetTimerStart();
  const timerStatus = useGetTimerStatus();
  const level = useGetBakerLevel();
  const [showSettings, setShowSettings] = useState(false);
  const [showBreadModal, setShowBreadModal] = useState(false);
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [gainedExperience, setGainedExperience] = useState<number | null>(null);
  const [completedBread, setCompletedBread] = useState<Bread | null>(null);
  const selectedBreadKey = useGetSelectedBreadKey();
  const resetTimer = useSetTimerReset();
  const awardBread = useAwardBread();
  const isRunning = timerStatus === 'running';
  const backgroundFade = useSharedValue(isRunning ? 1 : 0);

  useEffect(() => {
    backgroundFade.value = withTiming(isRunning ? 1 : 0, { duration: 300 });
  }, [backgroundFade, isRunning]);

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(backgroundFade.value, [0, 1], ['rgba(0,0,0,0)', 'rgba(0, 0, 0, 0.3)']),
  }));

  const buttonContainerStyle = useAnimatedStyle(() => ({
    opacity: 1 - backgroundFade.value,
  }));

  const selectedBread = useMemo(
    () => BREADS.find((bread) => bread.key === selectedBreadKey) ?? null,
    [selectedBreadKey]
  );

  const handleStart = () => {
    if (timerStatus === 'running') return;
    startTimer();
  };

  const handleTimerFinished = async (durationSeconds: number) => {
    const bakedBread = selectedBread;
    setCompletedBread(bakedBread ?? null);
    let xp: number | null = null;
    if (selectedBreadKey && durationSeconds > 0) {
      try {
        xp = await awardBread(selectedBreadKey, durationSeconds);
      } catch (error) {
        console.error("Failed to award bread", error);
      }
    }
    setGainedExperience(xp);
    setShowBreadModal(true);
  };

  const handleCloseBreadModal = () => {
    setShowBreadModal(false);
    setGainedExperience(null);
    setCompletedBread(null);
    resetTimer();
  };

  const handleGiveUp = () => {
    const bakedBread = selectedBread;
    setCompletedBread(bakedBread ?? null);
    setShowGiveUpModal(true);
  };

  const handleCloseGiveUpModal = () => {
    setShowGiveUpModal(false);
    setCompletedBread(null);
    resetTimer();
  };
  return (
    <Background isStatusBarGap={false}>
      <View style={{ flex: 1, paddingTop: insets.top }}>
      <Animated.View style={[{ flex: 1 }, backgroundStyle]}>
      <Animated.View style={buttonContainerStyle} pointerEvents={isRunning ? 'none' : 'auto'} className="px-4 flex-row my-6 w-full items-center justify-between">
        <TouchableOpacity className="p-3 bg-gray-100 rounded-full" onPress={() => navigation.openDrawer()}>
          <MenuIcon width={18} height={18} stroke="#666666"/>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setShowLevelModal(true)}
          className="px-3 py-1 rounded-full bg-white/70 border border-gray-200"
        >
          <Text text={`Lv.${level}`} type="body2" className="font-semibold" />
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity disabled={timerStatus === 'running'} activeOpacity={0.85} onPress={() => setShowSettings(true)}>
        <Oven isOn={isRunning}/>
      </TouchableOpacity>

        {/* 타이머와 오븐 설정 */}
      <View className="flex-1 items-center justify-end" style={{paddingBottom: insets.bottom + 50}}>
          <Timer onFinished={handleTimerFinished} onCancelOrGiveUp={handleGiveUp} />

      </View>
      <OvenSettingsModal
        visible={showSettings}
        status={timerStatus}
        onStartPress={handleStart}
        onRequestClose={() => setShowSettings(false)}
      />
      <Portal>
        <FocusCompleteModal
          visible={showBreadModal}
          onRequestClose={handleCloseBreadModal}
          selectedBread={completedBread ?? selectedBread}
          gainedExperience={gainedExperience}
        />
        <FocusGiveUpModal
          visible={showGiveUpModal}
          onRequestClose={handleCloseGiveUpModal}
          selectedBread={completedBread ?? selectedBread}
        />
        <LevelStatusModal
          visible={showLevelModal}
          onRequestClose={() => setShowLevelModal(false)}
        />
      </Portal>
      </Animated.View>
      </View>
    </Background>
  );
};