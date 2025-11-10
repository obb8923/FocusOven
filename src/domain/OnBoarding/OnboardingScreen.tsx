import { useMemo, useState } from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import { Text } from '@component/Text';
import { useSetFirstVisitMarkVisited } from '@store/firstVisitStore';
import { useSetTab } from '@store/tabStore';
import { Background } from '@component/Background';

type OnboardingStep = {
  key: string;
  title: string;
  description: string;
  image: any;
};

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    key: 'focus',
    title: '25분 집중으로 오븐 가동',
    description:
      '원하는 시간을 설정하고 집중을 시작하세요. 타이머가 끝날 때까지 오븐이 뜨겁게 달궈집니다.',
    image: require('@assets/pngs/oven_on.png'),
  },
  {
    key: 'bread',
    title: '완료하면 빵 보상 획득',
    description:
      '타이머가 종료되면 선택한 빵을 얻을 수 있어요. 레벨이 오를수록 더 다양한 빵이 기다리고 있습니다.',
    image: require('@assets/pngs/Croissant.png'),
  },
  {
    key: 'bakery',
    title: 'Bakery에서 나만의 진열장 완성',
    description:
      '모은 빵을 Bakery에서 한눈에 확인해 보세요. 집중 기록도 함께 저장되어 성장 과정을 되돌아볼 수 있어요.',
    image: require('@assets/pngs/PlainBread.png'),
  },
];

export const OnboardingScreen = () => {
  const markVisited = useSetFirstVisitMarkVisited();
  const setTab = useSetTab();
  const [stepIndex, setStepIndex] = useState(0);
  const isLastStep = stepIndex >= ONBOARDING_STEPS.length - 1;
  const currentStep = useMemo(() => ONBOARDING_STEPS[stepIndex], [stepIndex]);

  const handleComplete = async () => {
    await markVisited();
    setTab('AppMain');
  };

  const handleNext = () => {
    if (isLastStep) {
      void handleComplete();
      return;
    }
    setStepIndex((prev) => Math.min(prev + 1, ONBOARDING_STEPS.length - 1));
  };

  const handleSkip = () => {
    void handleComplete();
  };

  return (
    <Background className="justify-between px-6 py-8">
      <View className="flex-row justify-between items-center">
        <View className="flex-1" />
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
          <Text text="건너뛰기" type="body2" className="text-gray-500" />
        </TouchableOpacity>
      </View>

      <View className="items-center gap-y-6 mt-6">
        <Image
          source={currentStep.image}
          resizeMode="contain"
          className="w-56 h-56"
        />
        <View className="gap-y-3">
          <Text text={currentStep.title} type="title1" className="text-center" />
          <Text
            text={currentStep.description}
            type="body2"
            className="text-center text-gray-600"
          />
        </View>
      </View>

      <View className="gap-y-8">
        <View className="flex-row justify-center items-center gap-x-2">
          {ONBOARDING_STEPS.map((step, idx) => (
            <View
              key={step.key}
              className={`h-2 rounded-full ${
                idx <= stepIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              style={{ width: idx === stepIndex ? 28 : 8 }}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.85}
          className="rounded-full bg-blue-500 py-4 items-center"
        >
          <Text
            text={isLastStep ? '시작하기' : '다음'}
            type="body1"
            className="text-white font-semibold"
          />
        </TouchableOpacity>
      </View>
    </Background>
  );
};