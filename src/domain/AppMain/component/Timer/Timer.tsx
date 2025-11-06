import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import Svg, { Path, Line } from 'react-native-svg';
import Animated, { Easing, useAnimatedProps, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { TimerButton } from "@/domain/AppMain/component/Timer/TimerButton";
import { TimeInputModal } from "@/domain/AppMain/component/Timer/TimeInputModal";
import { useGetTimerSecondsLeft, useGetTimerStatus, useSetTimerInitialSeconds } from "@/shared/store/timerStore";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const Timer = () => {
    const dashOffset = useSharedValue(0);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [minutesInput, setMinutesInput] = useState<string>('25');
    const [secondsInput, setSecondsInput] = useState<string>('00');

    const secondsLeft = useGetTimerSecondsLeft();
    const status = useGetTimerStatus();
    const setInitialSeconds = useSetTimerInitialSeconds();

    useEffect(() => {
      if (status === 'running') {
        dashOffset.value = withRepeat(
          withTiming(19, { duration: 1000, easing: Easing.linear }),
          -1,
          false
        );
      } else {
        dashOffset.value = withTiming(0, { duration: 150, easing: Easing.linear });
      }
    }, [dashOffset, status]);

    const animatedProps = useAnimatedProps(() => ({
      strokeDashoffset: dashOffset.value,
    }));

    const minutesLeft = Math.floor(secondsLeft / 60);
    const secondsLeftRemainder = secondsLeft % 60;
    const timeLabel = `${String(minutesLeft).padStart(2, '0')}:${String(secondsLeftRemainder).padStart(2, '0')}`;

    const handleConfirmTime = (m: string, s: string) => {
      setMinutesInput(m);
      setSecondsInput(s);
      const mm = Math.max(0, Math.floor(Number(m.replace(/[^0-9]/g, '')) || 0));
      let ss = Math.max(0, Math.floor(Number(s.replace(/[^0-9]/g, '')) || 0));
      if (ss > 59) ss = 59;
      setInitialSeconds(mm * 60 + ss);
    };

    // 컨테이너 크기에 맞춘 호 경로 계산 (더 평평하게)
    const w = containerSize.width;
    const h = containerSize.height;
    const effectiveH = Math.max(h, 0);
    const margin = 0 ;
    const y = effectiveH * 0.8; // 아래로 조금 내림 → 더 평평해 보임
    const rx = (w - margin * 2) * 0.6; // 가로 반지름 크게
    const ry = effectiveH * 0.8; // 세로 반지름 작게 → 평평
    const arcPath = w > 0 && effectiveH > 0 ? `M ${margin} ${y} A ${rx} ${ry} 0 0 1 ${w - margin} ${y}` : 'M 0 0';
  
    return (
      <View className="w-full items-center justify-center my-4">
        <View
          className="w-full"
          style={{ aspectRatio: 7 }}
          onLayout={({ nativeEvent }) => setContainerSize(nativeEvent.layout)}
        >
          {w > 0 && h > 0 && (
            <Svg width={w} height={h}>
              <AnimatedPath
                animatedProps={animatedProps}
                d={arcPath}
                stroke="black"
                strokeWidth={20}
                strokeDasharray={[1, 18]}
                strokeLinecap="butt"
                fill="none"
              />
              <Line
                x1={w / 2}
                y1={h * 0.15}
                x2={w / 2}
                y2={h * 0.75}
                stroke="#0763F6"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </Svg>
          )}
        </View>
        <View className="w-full items-center justify-center">
          <TimerButton timeLabel={timeLabel} onPress={() => setIsModalVisible(true)} />
        </View>
        <TimeInputModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          initialMinutes={minutesInput}
          initialSeconds={secondsInput}
          onConfirm={handleConfirmTime}
        />
      </View>
    );
  };