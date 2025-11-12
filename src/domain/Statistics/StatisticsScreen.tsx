import { useMemo, useEffect } from "react";
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { BarChart } from "react-native-chart-kit";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Background } from "@component/Background";
import { Text } from "@component/Text";
import MenuIcon from "@assets/svgs/Menu.svg";
import { useGetFocusLogs } from "@store/bakerStore";
import type { FocusLog } from "@store/bakerStore";
import { AppMainDrawerParamList } from "@nav/drawer/AppMainDrawer";
import { AdmobNativeAd } from '@component/ads/AdmobNativeAd';
type PeriodKey = "day" | "month" | "year";

type StatEntry = {
  key: string;
  label: string;
  shortLabel: string;
  totalSeconds: number;
  sessionCount: number;
};

const PERIOD_CONFIG: Record<
  PeriodKey,
  {
    titleKey: string;
    descriptionKey: string;
    limit: number;
  }
> = {
  day: {
    titleKey: "statistics.period.day.title",
    descriptionKey: "statistics.period.day.description",
    limit: 7,
  },
  month: {
    titleKey: "statistics.period.month.title",
    descriptionKey: "statistics.period.month.description",
    limit: 6,
  },
  year: {
    titleKey: "statistics.period.year.title",
    descriptionKey: "statistics.period.year.description",
    limit: 5,
  },
};

// 개발 모드에서 mock 데이터 사용 제어
// true: mock 데이터 사용
// false: 실제 데이터 사용
const DEV_USE_MOCK_DATA = false;

const DEV_FOCUS_LOGS: FocusLog[] =
  __DEV__
    ? (() => {
        const now = new Date();
        const logs: FocusLog[] = [];
        let counter = 0;
        const addLog = (date: Date, minutes: number) => {
          const safeMinutes = Math.max(1, minutes);
          const instance = new Date(date);
          instance.setHours(9, 0, 0, 0);
          logs.push({
            id: `dev-${counter}`,
            breadKey: "mock-bread",
            durationSeconds: Math.round(safeMinutes * 60),
            finishedAt: instance.toISOString(),
          });
          counter += 1;
        };

        for (let i = 0; i < 14; i += 1) {
          const date = new Date(now);
          date.setDate(now.getDate() - i);
          addLog(date, 20 + (i % 4) * 10);
        }

        for (let i = 1; i <= 6; i += 1) {
          const date = new Date(now);
          date.setMonth(now.getMonth() - i, 15);
          addLog(date, 45 + i * 5);
        }

        for (let i = 1; i <= 5; i += 1) {
          const date = new Date(now);
          date.setFullYear(now.getFullYear() - i, 5, 1);
          addLog(date, 90 + i * 12);
        }

        return logs;
      })()
    : [];

function formatLogEntry(log: FocusLog): string {
  const date = new Date(log.finishedAt);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const focusMinutes = Math.round(log.durationSeconds / 60);
  
  return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분에 ${focusMinutes}분 집중`;
}

function formatDuration(totalSeconds: number, t: TFunction<"translation">): string {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return minutes > 0
      ? t("statistics.duration.hoursAndMinutes", { hours, minutes })
      : t("statistics.duration.hoursOnly", { hours });
  }
  return t("statistics.duration.minutesOnly", { minutes });
}

function getLabelsFromKey(key: string, period: PeriodKey): { label: string; shortLabel: string } {
  if (period === "day") {
    const [year, month, day] = key.split("-").map((value) => Number(value));
    return {
      label: `${year}년 ${month}월 ${day}일`,
      shortLabel: `${month}/${day}`,
    };
  }
  if (period === "month") {
    const [year, month] = key.split("-").map((value) => Number(value));
    return {
      label: `${year}년 ${month}월`,
      shortLabel: `${month}월`,
    };
  }
  const year = Number(key);
  return {
    label: `${year}년`,
    shortLabel: `${year}`,
  };
}

function aggregateLogs(logs: FocusLog[], period: PeriodKey): StatEntry[] {
  const map = new Map<string, { totalSeconds: number; sessionCount: number }>();
  logs.forEach((log) => {
    const date = new Date(log.finishedAt);
    if (Number.isNaN(date.getTime())) return;

    let key = "";
    if (period === "day") {
      const month = `${date.getMonth() + 1}`.padStart(2, "0");
      const day = `${date.getDate()}`.padStart(2, "0");
      key = `${date.getFullYear()}-${month}-${day}`;
    } else if (period === "month") {
      const month = `${date.getMonth() + 1}`.padStart(2, "0");
      key = `${date.getFullYear()}-${month}`;
    } else {
      key = `${date.getFullYear()}`;
    }

    const prev = map.get(key) ?? { totalSeconds: 0, sessionCount: 0 };
    map.set(key, {
      totalSeconds: prev.totalSeconds + Math.max(0, log.durationSeconds),
      sessionCount: prev.sessionCount + 1,
    });
  });

  return Array.from(map.entries())
    .map(([key, value]) => {
      const { label, shortLabel } = getLabelsFromKey(key, period);
      return {
        key,
        label,
        shortLabel,
        totalSeconds: value.totalSeconds,
        sessionCount: value.sessionCount,
      };
    })
    .sort((a, b) => (a.key < b.key ? 1 : -1));
}

export const StatisticsScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<AppMainDrawerParamList>>();
  const focusLogs = useGetFocusLogs();
  const { t } = useTranslation();

  const effectiveFocusLogs = __DEV__ && DEV_USE_MOCK_DATA ? DEV_FOCUS_LOGS : focusLogs;

  // 통계 조회 시 집중 기록 로그 출력
  useEffect(() => {
    if (effectiveFocusLogs.length > 0) {
      console.log("=== 집중 기록 ===");
      effectiveFocusLogs.forEach((log) => {
        console.log(formatLogEntry(log));
      });
      console.log(`총 ${effectiveFocusLogs.length}개의 기록`);
      console.log("================");
    } else {
      console.log("집중 기록이 없습니다.");
    }
  }, [effectiveFocusLogs]);

  const groupedEntries = useMemo(() => {
    const dayEntries = aggregateLogs(effectiveFocusLogs, "day");
    const monthEntries = aggregateLogs(effectiveFocusLogs, "month");
    const yearEntries = aggregateLogs(effectiveFocusLogs, "year");
    return {
      day: dayEntries,
      month: monthEntries,
      year: yearEntries,
    };
  }, [effectiveFocusLogs]);

  const totalSecondsAll = useMemo(
    () => effectiveFocusLogs.reduce((acc, log) => acc + Math.max(0, log.durationSeconds), 0),
    [effectiveFocusLogs]
  );
  const chartBaseWidth = Dimensions.get("window").width - 48; // padding 고려
  const chartHeight = 220;

  const sections = useMemo(() => {
    return (Object.keys(PERIOD_CONFIG) as PeriodKey[]).map((periodKey) => {
      const config = PERIOD_CONFIG[periodKey];
      const entries = groupedEntries[periodKey];
      const displayedEntries = entries.slice(0, config.limit);
      const totalSeconds = entries.reduce((acc, entry) => acc + entry.totalSeconds, 0);
      const totalSessions = entries.reduce((acc, entry) => acc + entry.sessionCount, 0);

      const chartData =
        displayedEntries.length === 0
          ? {
              labels: [t("statistics.chart.emptyLabel")],
              datasets: [{ data: [0], color: () => "#E5E7EB", strokeWidth: 2 }],
            }
          : (() => {
              const reversed = [...displayedEntries].reverse();
              return {
                labels: reversed.map((entry) => entry.shortLabel),
                datasets: [
                  {
                    data: reversed.map((entry) => Math.round(entry.totalSeconds / 60)),
                    color: () => "#0763F6",
                    strokeWidth: 2,
                  },
                ],
              };
            })();

      const chartWidth =
        Math.max(chartBaseWidth, Math.max(1, displayedEntries.length) * 72) ?? chartBaseWidth;

      return {
        periodKey,
        title: t(config.titleKey),
        description: t(config.descriptionKey),
        displayedEntries,
        totalSeconds,
        totalSessions,
        chartData,
        chartWidth,
      };
    });
  }, [chartBaseWidth, groupedEntries, t]);

  return (
    <Background>
      <View className="px-4 flex-row my-6 w-full items-center justify-between">
        <TouchableOpacity className="p-3 bg-gray-100 rounded-full" onPress={() => navigation.openDrawer()}>
          <MenuIcon width={18} height={18} stroke="#666666" />
        </TouchableOpacity>
        <Text text={t("statistics.title")} type="title1" className="text-2xl" />
        <View className="p-3 rounded-full" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48, gap: 24 }}>
        <View className="bg-gray-200 p-6 flex-row items-center justify-between">
          <Text text={t("statistics.totalFocusTime")} type="title3" />
          <Text text={formatDuration(totalSecondsAll, t)} type="body2" className="text-gray-600" />
        </View>

        {sections.map(({ periodKey, title, description, chartData, chartWidth }) => (
          <View key={periodKey} className="gap-y-4 bg-gray-200 p-6">
            <View className="gap-y-1">
              <Text text={title} type="title3" />
              <Text text={description} type="caption1" className=" text-gray-500" />
            </View>

            <View className="rounded-2xl bg-white px-2 py-4 border border-gray-200">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              >
                <BarChart
                  data={chartData}
                  width={chartWidth}
                  height={chartHeight}
                  yAxisLabel=""
                  yAxisSuffix={t("statistics.chart.minuteSuffix")}
                  chartConfig={{
                    backgroundColor: "#FFFFFF",
                    backgroundGradientFrom: "#FFFFFF",
                    backgroundGradientTo: "#FFFFFF",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(7, 99, 246, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                  }}
                  fromZero
                  showValuesOnTopOfBars={false}
                  style={{ borderRadius: 16 }}
                />
              </ScrollView>
            </View>

          </View>
        ))}
      </ScrollView>
      <AdmobNativeAd />
    </Background>
  );
};


