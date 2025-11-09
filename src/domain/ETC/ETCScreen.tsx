import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from '@shared/component/Text';
import { Background } from '@shared/component/Background';
import MenuIcon from '@assets/svgs/Menu.svg';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppMainDrawerParamList } from '@/shared/nav/drawer/AppMainDrawer';
import {
  useGetDailyFocusGoalMinutes,
  useGetNotificationsEnabled,
  useGetSoundEnabled,
  useSetDailyFocusGoalMinutes,
  useSetNotificationsEnabled,
  useSetSettingsLoad,
  useSetSoundEnabled,
} from '@store/settingsStore';
import { useGetFocusLogs } from '@store/bakerStore';
import { BREADS } from '@constant/breads';
import { ETCStackParamList } from '@nav/stack/ETCStack';
import ChevronRightIcon from '@assets/svgs/ChevronRight.svg';

type ResourceLink = {
  title: string;
  description: string;
  url: string;
};

const RESOURCE_LINKS: ResourceLink[] = [
  {
    title: '📚 집중력 향상 가이드',
    description: '짧은 시간에도 몰입을 돕는 팁과 루틴을 정리했어요.',
    url: 'https://www.notion.so/focusoven/tips',
  },
  {
    title: '🎯 뽀모도로 활용법',
    description: '25분 집중, 5분 휴식 사이클을 최대한 활용해 보세요.',
    url: 'https://www.notion.so/focusoven/pomodoro',
  },
  {
    title: '🍞 빵 레벨 해금 조건',
    description: '레벨별로 어떤 빵이 열리는지 한눈에 확인하세요.',
    url: 'https://www.notion.so/focusoven/breads',
  },
];

const FAQ_ITEMS = [
  {
    question: '알림이 울리지 않아요.',
    answer: '설정에서 집중 알림을 켰는지 확인하고, 시스템 알림 권한을 허용해주세요.',
  },
  {
    question: '다음 타이머를 자동으로 시작하고 싶어요.',
    answer: '현재는 수동 시작만 지원합니다. 설정에서 자동 시작 옵션을 준비 중이에요.',
  },
  {
    question: '빵을 잘못 선택했어요.',
    answer: '타이머 시작 전에 다시 빵을 선택하면 그 세션부터 반영돼요.',
  },
];

const formatMinutes = (minutes: number) => `${minutes}분`;

type NavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<AppMainDrawerParamList>,
  NativeStackNavigationProp<ETCStackParamList>
>;

export const ETCScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const loadSettings = useSetSettingsLoad();
  const notificationsEnabled = useGetNotificationsEnabled();
  const soundEnabled = useGetSoundEnabled();
  const dailyFocusGoal = useGetDailyFocusGoalMinutes();
  const setNotificationsEnabled = useSetNotificationsEnabled();
  const setSoundEnabled = useSetSoundEnabled();
  const setDailyFocusGoalMinutes = useSetDailyFocusGoalMinutes();
  const focusLogs = useGetFocusLogs();
  const [goalInput, setGoalInput] = useState<string>('');

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    setGoalInput(String(dailyFocusGoal));
  }, [dailyFocusGoal]);

  const breadMap = useMemo(() => {
    const map = new Map<string, string>();
    BREADS.forEach((bread) => map.set(bread.key, bread.koName));
    return map;
  }, []);

  const recentLogs = focusLogs.slice(0, 3);

  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('링크를 열 수 없어요', '잠시 후 다시 시도해주세요.');
      }
    } catch (error) {
      Alert.alert('링크 오류', '연결 중 문제가 발생했어요.');
    }
  };

  const handleGoalSubmit = () => {
    const numeric = parseInt(goalInput, 10);
    if (Number.isNaN(numeric)) {
      setGoalInput(String(dailyFocusGoal));
      return;
    }
    setDailyFocusGoalMinutes(numeric);
  };

  return (
    <Background>
      <View className="px-4 flex-row my-6 w-full items-center justify-between">
        <TouchableOpacity className="p-3 bg-gray-100 rounded-full" onPress={() => navigation.openDrawer()}>
          <MenuIcon width={18} height={18} color="#666666" />
        </TouchableOpacity>
        <Text text="Settings" type="title1" className="text-2xl" />
        <View className="p-3 rounded-full" />
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 48, gap: 24 }}>
        <View className="gap-y-4 bg-gray-100 rounded-3xl px-4 py-6">
          <Text text="집중 설정" type="title1" className="text-xl font-semibold" />
          <View className="gap-y-4">
            <SettingRow
              title="집중 알림"
              description="타이머 종료 시 푸시 알림을 받아요."
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
            <SettingRow
              title="타이머 사운드"
              description="타이머 종료 시 효과음을 재생합니다."
              value={soundEnabled}
              onValueChange={setSoundEnabled}
            />
            <View className="rounded-2xl bg-white px-4 py-4 border border-gray-200 gap-y-2">
              <Text text="하루 집중 목표" type="title3" className="text-base font-semibold" />
              <Text text="목표를 달성하면 특별한 빵이 등장할지도 몰라요!" type="body2" className="text-sm text-gray-500" />
              <View className="flex-row items-center gap-x-3 mt-2">
                <TextInput
                  value={goalInput}
                  onChangeText={setGoalInput}
                  onBlur={handleGoalSubmit}
                  keyboardType="number-pad"
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-base bg-white"
                />
                <Text text={formatMinutes(dailyFocusGoal)} type="body2" className="text-gray-600" />
              </View>
            </View>
          </View>
        </View>

        <View className="gap-y-4 bg-gray-100 rounded-3xl px-4 py-6">
          <Text text="통계" type="title1" className="text-xl font-semibold" />
          <TouchableOpacity
            activeOpacity={0.85}
            className="rounded-2xl bg-white px-4 py-4 border border-gray-200 flex-row items-center justify-between"
            onPress={() => navigation.navigate('Statistics')}
          >
            <View className="flex-1 pr-4">
              <Text text="집중 시간 통계" type="title3" className="text-base font-semibold" />
              <Text text="일/월/년 단위로 누적 시간을 확인해요." type="body2" className="text-sm text-gray-500" />
            </View>
            <ChevronRightIcon width={18} height={18} color="#666666" />
          </TouchableOpacity>
        </View>

        <View className="gap-y-4 bg-gray-100 rounded-3xl px-4 py-6">
          <Text text="학습 자료" type="title1" className="text-xl font-semibold" />
          <View className="gap-y-3">
            {RESOURCE_LINKS.map((link) => (
              <TouchableOpacity
                key={link.title}
                className="rounded-2xl bg-white px-4 py-4 border border-gray-200"
                activeOpacity={0.85}
                onPress={() => handleOpenLink(link.url)}
              >
                <Text text={link.title} type="title3" className="text-base font-semibold mb-1" />
                <Text text={link.description} type="body2" className="text-sm text-gray-500" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="gap-y-4 bg-gray-100 rounded-3xl px-4 py-6">
          <Text text="최근 집중 기록" type="title1" className="text-xl font-semibold" />
          {recentLogs.length === 0 ? (
            <Text text="아직 집중 기록이 없어요. 첫 빵을 구워볼까요?" type="body2" className="text-gray-500" />
          ) : (
            <View className="gap-y-3">
              {recentLogs.map((log) => {
                const breadName = breadMap.get(log.breadKey) ?? '미상';
                const finishedAt = new Date(log.finishedAt);
                return (
                  <View key={log.id} className="rounded-2xl bg-white px-4 py-4 border border-gray-200 gap-y-1">
                    <Text text={`${breadName} 획득`} type="title3" className="text-base font-semibold" />
                    <Text
                      text={`${finishedAt.toLocaleDateString()} ${finishedAt.toLocaleTimeString()} · ${
                        Math.round(log.durationSeconds / 60)
                      }분 집중`}
                      type="body2"
                      className="text-sm text-gray-500"
                    />
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View className="gap-y-4 bg-gray-100 rounded-3xl px-4 py-6">
          <Text text="자주 묻는 질문" type="title1" className="text-xl font-semibold" />
          <View className="gap-y-3">
            {FAQ_ITEMS.map((faq) => (
              <View key={faq.question} className="rounded-2xl bg-white px-4 py-4 border border-gray-200 gap-y-1">
                <Text text={faq.question} type="title3" className="text-base font-semibold" />
                <Text text={faq.answer} type="body2" className="text-sm text-gray-500" />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Background>
  );
};

type SettingRowProps = {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

const SettingRow = ({ title, description, value, onValueChange }: SettingRowProps) => (
  <View className="rounded-2xl bg-white px-4 py-4 border border-gray-200 flex-row items-center justify-between">
    <View className="flex-1 pr-4">
      <Text text={title} type="title3" className="text-base font-semibold" />
      <Text text={description} type="body2" className="text-sm text-gray-500 mt-1" />
    </View>
    <Switch value={value} onValueChange={onValueChange} />
  </View>
);
