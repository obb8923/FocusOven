import { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Background } from '@component/Background';
import { Text } from '@component/Text';
import { Button } from '@shared/component/Button';
import { useSetFirstVisitMarkVisited } from '@store/firstVisitStore';
import { useSetTab } from '@store/tabStore';
import { Oven } from '@domain/AppMain/component/Oven';
import { BREADS } from '@shared/constant/breads';
import { FocusCompleteModal } from '@domain/AppMain/component/FocusCompleteModal';
import { OvenSettingsModal } from '@domain/AppMain/component/OvenSettingsModal';
import { Timer } from '@domain/AppMain/component/Timer/Timer';
import { TimeInputModal } from '@domain/AppMain/component/Timer/TimeInputModal';
import {
  useGetTimerStatus,
  useSetTimerInitialSeconds,
  useSetTimerReset,
  useSetSkipRest,
} from '@store/timerStore';
import { useGetSelectedBreadKey, useAwardBread } from '@store/bakerStore';
import { Portal } from '@gorhom/portal';

type OnboardingStage =
  | 'intro'
  | 'timerGuide'
  | 'timeReady'
  | 'countdown'
  | 'completeModal'
  | 'final';

const ONBOARDING_TIMER_SECONDS = 3;
const DEFAULT_TIMER_SECONDS = 25 * 60; // 25분
const ANIMATION_DURATION = 300;
const PLAIN_BREAD_KEY = 'PlainBread';

const plainBread = BREADS.find((bread) => bread.key === PLAIN_BREAD_KEY) ?? null;

type StageConfig = {
  title: string;
  description: string;
  opacity: {
    oven: number;
    breadImage: number;
    timer: number;
    finalButton: number;
  };
  canOpenTimeModal: boolean;
  showTimerButton: boolean;
};

const getStageConfig = (stage: OnboardingStage, t: (key: string) => string): StageConfig => {
  const baseConfig = {
    intro: {
      opacity: { oven: 1, breadImage: 0, timer: 0, finalButton: 0 },
      canOpenTimeModal: false,
      showTimerButton: false,
    },
    timerGuide: {
      opacity: { oven: 1, breadImage: 0, timer: 1, finalButton: 0 },
      canOpenTimeModal: true,
      showTimerButton: false,
    },
    timeReady: {
      opacity: { oven: 1, breadImage: 0, timer: 1, finalButton: 0 },
      canOpenTimeModal: true,
      showTimerButton: true,
    },
    countdown: {
      opacity: { oven: 1, breadImage: 0, timer: 1, finalButton: 0 },
      canOpenTimeModal: false,
      showTimerButton: false,
    },
    completeModal: {
      opacity: { oven: 1, breadImage: 0, timer: 1, finalButton: 0 },
      canOpenTimeModal: false,
      showTimerButton: false,
    },
    final: {
      opacity: { oven: 0, breadImage: 1, timer: 0, finalButton: 1 },
      canOpenTimeModal: false,
      showTimerButton: false,
    },
  };

  return {
    title: t(`onboarding.stages.${stage}.title`),
    description: t(`onboarding.stages.${stage}.description`),
    ...baseConfig[stage],
  };
};

export const OnboardingScreen = () => {
  const { t } = useTranslation();
  const markVisited = useSetFirstVisitMarkVisited();
  const setTab = useSetTab();
  const [stage, setStage] = useState<OnboardingStage>('intro');
  const [showBreadModal, setShowBreadModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const timerStatus = useGetTimerStatus();
  const setInitialSeconds = useSetTimerInitialSeconds();
  const resetTimer = useSetTimerReset();
  const skipRest = useSetSkipRest();
  const selectedBreadKey = useGetSelectedBreadKey();
  const awardBread = useAwardBread();

  const selectedBread = useMemo(
    () => BREADS.find((bread) => bread.key === selectedBreadKey) ?? null,
    [selectedBreadKey]
  );

  const isOvenOn = timerStatus === 'running' || timerStatus === 'finished';
  const stageConfig = useMemo(() => getStageConfig(stage, t), [stage, t]);

  // Opacity shared values
  const ovenOpacity = useSharedValue(stageConfig.opacity.oven);
  const breadImageOpacity = useSharedValue(stageConfig.opacity.breadImage);
  const timerOpacity = useSharedValue(stageConfig.opacity.timer);
  const finalButtonOpacity = useSharedValue(stageConfig.opacity.finalButton);

  // 통합된 opacity 업데이트
  useEffect(() => {
    const config = getStageConfig(stage, t);
    ovenOpacity.value = withTiming(config.opacity.oven, { duration: ANIMATION_DURATION });
    breadImageOpacity.value = withTiming(config.opacity.breadImage, { duration: ANIMATION_DURATION });
    timerOpacity.value = withTiming(config.opacity.timer, { duration: ANIMATION_DURATION });
    finalButtonOpacity.value = withTiming(config.opacity.finalButton, { duration: ANIMATION_DURATION });
  }, [stage, t, ovenOpacity, breadImageOpacity, timerOpacity, finalButtonOpacity]);

  const ovenAnimatedStyle = useAnimatedStyle(() => ({
    opacity: ovenOpacity.value,
  }));

  const breadImageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: breadImageOpacity.value,
  }));

  const timerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: timerOpacity.value,
  }));

  const finalButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: finalButtonOpacity.value,
  }));

  // 타이머 초기화
  useEffect(() => {
    if (stage === 'intro') {
      setInitialSeconds(ONBOARDING_TIMER_SECONDS);
      resetTimer();
    }
  }, [stage, setInitialSeconds, resetTimer]);

  // 타이머 상태에 따른 stage 전환
  useEffect(() => {
    if (timerStatus === 'running' && stage === 'timeReady') {
      setStage('countdown');
    } else if (timerStatus === 'finished' && stage === 'countdown') {
      setStage('completeModal');
      setShowCompleteModal(true);
    }
  }, [timerStatus, stage]);

  const handleComplete = async () => {
    // 온보딩 완료 시 타이머를 25분으로 초기화하고 집중 모드로 설정
    setInitialSeconds(DEFAULT_TIMER_SECONDS);
    skipRest(); // 모드를 focus로 명시적으로 설정하여 휴식 모드로 전환되는 것을 방지
    await markVisited();
    setTab('AppMain');
  };

  const handleOvenPress = () => {
    if (stage !== 'intro') return;
    setShowBreadModal(true);
  };

  const handleBreadModalClose = () => {
    setShowBreadModal(false);
    if (selectedBreadKey === PLAIN_BREAD_KEY) {
      setInitialSeconds(ONBOARDING_TIMER_SECONDS);
      resetTimer();
      setStage('timerGuide');
    }
  };

  const handleTimeModalConfirm = () => {
    setInitialSeconds(ONBOARDING_TIMER_SECONDS);
    resetTimer();
    setShowTimeModal(false);
    setStage('timeReady');
  };

  const handleTimerTimePress = () => {
    if (stageConfig.canOpenTimeModal) {
      setShowTimeModal(true);
    }
  };

  const handleTimerFinished = async (durationSeconds: number) => {
    if (selectedBreadKey && durationSeconds > 0) {
      try {
        await awardBread(selectedBreadKey, durationSeconds);
      } catch (error) {
        console.error('Failed to award bread', error);
      }
    }
  };

  const handleCloseCompleteModal = () => {
    setShowCompleteModal(false);
    resetTimer();
    setStage('final');
  };

  return (
    <Background className="flex-1 py-10">
      <View className="flex-1">
        <View className="flex-1 justify-between">
          <View className="items-center gap-y-2 px-16">
            <Text text={stageConfig.title} type="title3" className="text-center text-gray-900 mt-8" />
            <Text text={stageConfig.description} type="body2" className="text-center text-gray-500" />
          </View>
          <View className="items-center gap-y-10 relative">
            <View className="w-full items-center">
              <Animated.View
                style={ovenAnimatedStyle}
                className="w-full items-center absolute"
                pointerEvents={stage === 'final' ? 'none' : 'auto'}
              >
                <TouchableOpacity
                  onPress={handleOvenPress}
                  activeOpacity={0.85}
                  disabled={stage !== 'intro'}
                  className="w-full items-center"
                >
                  <Oven isOn={isOvenOn} />
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={breadImageAnimatedStyle}
                className="w-full items-center"
                pointerEvents={stage === 'final' ? 'auto' : 'none'}
              >
                {plainBread && (
                  <View className="w-1/2 aspect-square items-center justify-center">
                    <Image
                      source={plainBread.source}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </View>
                )}
              </Animated.View>
            </View>

            <Animated.View
              style={timerAnimatedStyle}
              className="w-full"
              pointerEvents={stageConfig.opacity.timer > 0 ? 'auto' : 'none'}
            >
              <Timer
                onFinished={handleTimerFinished}
                enableTimeInput={stageConfig.canOpenTimeModal}
                onRequestTimeInput={handleTimerTimePress}
                startDisabled={!stageConfig.showTimerButton}
                showActionButton={stageConfig.showTimerButton}
                disableAutoTransitionToRest={true}
              />
            </Animated.View>
          </View>

          <Animated.View
            style={[{ marginHorizontal: 64 ,marginBottom: 64}, finalButtonAnimatedStyle]}
            pointerEvents={stage === 'final' ? 'auto' : 'none'}
          >
            <Button text={t('onboarding.startButton')} onPress={() => void handleComplete()} />
          </Animated.View>
        </View>
      </View>

      <OvenSettingsModal
        visible={showBreadModal}
        status={timerStatus}
        onStartPress={() => {}}
        onRequestClose={handleBreadModalClose}
      />
      <TimeInputModal
        visible={showTimeModal}
        onClose={() => setShowTimeModal(false)}
        initialMinutes="0"
        initialSeconds="03"
        onConfirm={handleTimeModalConfirm}
        isOnboarding={true}
      />
      <Portal>
        <FocusCompleteModal
          visible={showCompleteModal}
          onRequestClose={handleCloseCompleteModal}
          selectedBread={selectedBread ?? plainBread}
          gainedExperience={ONBOARDING_TIMER_SECONDS}
        />
      </Portal>
    </Background>
  );
};
