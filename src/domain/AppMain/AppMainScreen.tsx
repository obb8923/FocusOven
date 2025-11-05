import React, { useMemo, useState } from 'react';
import { View, TextInput, TouchableOpacity,Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@component/Text';
import { useCountdownTimer } from '@shared/lib/useCountdownTimer';
import { Oven } from '@domain/AppMain/component/Oven';
function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export const AppMainScreen = () => {
  const insets = useSafeAreaInsets();

  const [minutesInput, setMinutesInput] = useState<string>('25');
  const [secondsInput, setSecondsInput] = useState<string>('00');

  const totalInitialSeconds = useMemo(() => {
    const m = Math.max(0, Math.floor(Number(minutesInput.replace(/[^0-9]/g, '')) || 0));
    let s = Math.max(0, Math.floor(Number(secondsInput.replace(/[^0-9]/g, '')) || 0));
    if (s > 59) s = 59;
    return m * 60 + s;
  }, [minutesInput, secondsInput]);

  const { secondsLeft, status, start, pause, resume, reset, setInitialSeconds } = useCountdownTimer({
    initialSeconds: totalInitialSeconds,
  });

  // 입력이 바뀔 때 idle/finished 상태에서는 초기 초를 동기화
  React.useEffect(() => {
    setInitialSeconds(totalInitialSeconds);
  }, [setInitialSeconds, totalInitialSeconds]);

  const minutesLeft = Math.floor(secondsLeft / 60);
  const secondsLeftRemainder = secondsLeft % 60;

  const canStart = status !== 'running' && totalInitialSeconds > 0 && secondsLeft > 0;
  const canPause = status === 'running';
  const canResume = status === 'paused' && secondsLeft > 0;
  const canReset = true;

  const handleStart = () => {
    // 입력값으로 리셋 후 시작 보장
    reset();
    setInitialSeconds(totalInitialSeconds);
    start();
  };

  const handleReset = () => {
    setInitialSeconds(totalInitialSeconds);
    reset();
  };

  return (
    <View style={{ paddingTop: insets.top }} className="px-6">
      <View className="mt-6">
        <Text text="집중 타이머" className="text-2xl font-bold" />
      </View>

      {/* 입력 영역 */}
      <View className="mt-6 flex-row items-center">
        <View className="flex-1 mr-3">
          <Text text="분" className="mb-2 text-neutral-500" />
          <TextInput
            value={minutesInput}
            onChangeText={setMinutesInput}
            keyboardType="number-pad"
            placeholder="분"
            className="border border-neutral-300 rounded-lg px-4 py-3 text-lg"
          />
        </View>
        <View className="w-24">
          <Text text="초" className="mb-2 text-neutral-500" />
          <TextInput
            value={secondsInput}
            onChangeText={setSecondsInput}
            keyboardType="number-pad"
            placeholder="초"
            maxLength={2}
            className="border border-neutral-300 rounded-lg px-4 py-3 text-lg"
          />
        </View>
      </View>

      {/* 남은 시간 표시 */}
      <View className="items-center mt-10">
        <Text
          text={`${pad2(minutesLeft)}:${pad2(secondsLeftRemainder)}`}
          className="text-5xl font-extrabold"
        />
        <Text text={
          status === 'running' ? '진행 중' : status === 'paused' ? '일시정지' : status === 'finished' ? '완료' : '대기'
        } className="mt-2 text-neutral-500" />
      </View>

      {/* 컨트롤 버튼 */}
      <View className="mt-10 flex-row justify-between">
        <TouchableOpacity
          disabled={!canStart}
          onPress={handleStart}
          className={`flex-1 mr-3 rounded-lg px-4 py-3 items-center ${canStart ? 'bg-emerald-600' : 'bg-emerald-300'}`}
        >
          <Text text="시작" className="text-white font-semibold" />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canPause}
          onPress={pause}
          className={`flex-1 mx-1 rounded-lg px-4 py-3 items-center ${canPause ? 'bg-amber-600' : 'bg-amber-300'}`}
        >
          <Text text="일시정지" className="text-white font-semibold" />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canResume}
          onPress={resume}
          className={`flex-1 mx-1 rounded-lg px-4 py-3 items-center ${canResume ? 'bg-indigo-600' : 'bg-indigo-300'}`}
        >
          <Text text="재시작" className="text-white font-semibold" />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canReset}
          onPress={handleReset}
          className={`flex-1 ml-3 rounded-lg px-4 py-3 items-center ${canReset ? 'bg-rose-600' : 'bg-rose-300'}`}
        >
          <Text text="리셋" className="text-white font-semibold" />
        </TouchableOpacity>
      </View>

      {/* <View className="w-full justify-center items-center mt-8">
      <Image source={require('@assets/pngs/b3.png')} className="w-80 h-80" resizeMode="contain" />
      </View> */}
       <View className="w-full justify-center items-center mt-8">

      <Oven/>
      </View>
    </View>
  );
};