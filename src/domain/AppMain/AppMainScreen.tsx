import React, { useEffect, useMemo, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
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
import { useTranslation } from 'react-i18next';
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
  const [pendingLevelUp, setPendingLevelUp] = useState<{ level: number } | null>(null);
  const selectedBreadKey = useGetSelectedBreadKey();
  const resetTimer = useSetTimerReset();
  const awardBread = useAwardBread();
  const isRunning = timerStatus === 'running' || timerStatus === 'resting';
  const isFocusRunning = timerStatus === 'running';
  const backgroundFade = useSharedValue(isFocusRunning ? 1 : 0);
  const { t } = useTranslation();

  useEffect(() => {
    backgroundFade.value = withTiming(isFocusRunning ? 1 : 0, { duration: 300 });
  }, [backgroundFade, isFocusRunning]);

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
    if (timerStatus === 'running' || timerStatus === 'resting') return;
    startTimer();
  };

  const handleTimerFinished = async (durationSeconds: number) => {
    const bakedBread = selectedBread;
    setCompletedBread(bakedBread ?? null);
    let experienceGained: number | null = null;
    if (selectedBreadKey && durationSeconds > 0) {
      try {
        const result = await awardBread(selectedBreadKey, durationSeconds);
        experienceGained = result?.experienceGained ?? null;
        if (result?.leveledUp && typeof result.newLevel === "number") {
          setPendingLevelUp({ level: result.newLevel });
        }
      } catch (error) {
        console.error("Failed to award bread", error);
      }
    }
    setGainedExperience(experienceGained);
    setShowBreadModal(true);
  };

  const handleCloseBreadModal = () => {
    setShowBreadModal(false);
    const levelUpInfo = pendingLevelUp;
    setPendingLevelUp(null);
    setGainedExperience(null);
    setCompletedBread(null);
    resetTimer();
    if (levelUpInfo) {
      Alert.alert(
        t("alerts.levelUp.title", { level: levelUpInfo.level }),
        t("alerts.levelUp.message", { level: levelUpInfo.level })
      );
    }
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
      <Animated.View style={[{ flex: 1 ,paddingTop: insets.top}, backgroundStyle]}>
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

      <TouchableOpacity disabled={timerStatus === 'running' || timerStatus === 'resting'} activeOpacity={0.85} onPress={() => setShowSettings(true)}>
        <Oven isOn={isFocusRunning}/>
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
    </Background>
  );
};