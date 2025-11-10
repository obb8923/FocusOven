import { useMemo } from "react";
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { BarChart } from "react-native-chart-kit";
import { Background } from "@shared/component/Background";
import { Text } from "@shared/component/Text";
import MenuIcon from "@assets/svgs/Menu.svg";
import { useGetFocusLogs } from "@store/bakerStore";
import type { FocusLog } from "@store/bakerStore";
import { AppMainDrawerParamList } from "@nav/drawer/AppMainDrawer";

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
    title: string;
    description: string;
    limit: number;
  }
> = {
  day: {
    title: "일간 통계",
    description: "최근 7일 집중 시간을 그래프로 보여줘요.",
    limit: 7,
  },
  month: {
    title: "월간 통계",
    description: "최근 6개월 동안의 집중 추이를 확인하세요.",
    limit: 6,
  },
  year: {
    title: "연간 통계",
    description: "최근 5년 동안의 집중 추이를 확인하세요.",
    limit: 5,
  },
};

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

function formatDuration(totalSeconds: number): string {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`;
  }
  return `${minutes}분`;
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

  const effectiveFocusLogs = __DEV__ ? DEV_FOCUS_LOGS : focusLogs;

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
              labels: ["없음"],
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
        config,
        displayedEntries,
        totalSeconds,
        totalSessions,
        chartData,
        chartWidth,
      };
    });
  }, [chartBaseWidth, groupedEntries]);

  return (
    <Background>
      <View className="px-4 flex-row my-6 w-full items-center justify-between">
        <TouchableOpacity className="p-3 bg-gray-100 rounded-full" onPress={() => navigation.openDrawer()}>
          <MenuIcon width={18} height={18} color="#666666" />
        </TouchableOpacity>
        <Text text="Statistics" type="title1" className="text-2xl" />
        <View className="p-3 rounded-full" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48, gap: 24 }}>
        <View className="bg-gray-200 p-6 flex-row items-center justify-between">
            <Text text="총 집중 시간" type="title3"/>
            <Text text={formatDuration(totalSecondsAll)} type="body2" className="text-gray-600" />
        </View>

        {sections.map(({ periodKey, config, chartData, chartWidth }) => (
          <View key={periodKey} className="gap-y-4 bg-gray-200 p-6">
            <View className="gap-y-1">
              <Text text={config.title} type="title3"/>
              <Text text={config.description} type="caption1" className=" text-gray-500" />
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
                  yAxisSuffix="분"
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
    </Background>
  );
};


