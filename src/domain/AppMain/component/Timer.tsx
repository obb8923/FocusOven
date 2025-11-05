import React, { useMemo, useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@component/Text';
import { TimeInputModal } from '@/domain/AppMain/component/TimeInputModal';
import { useCountdownTimer } from '@shared/lib/useCountdownTimer';


function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export const Timer = () => {
  const [minutesInput, setMinutesInput] = useState<string>('25');
  const [secondsInput, setSecondsInput] = useState<string>('00');
  const [isModalVisible, setIsModalVisible] = useState(false);

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
  useEffect(() => {
    setInitialSeconds(totalInitialSeconds);
  }, [setInitialSeconds, totalInitialSeconds]);

  const minutesLeft = Math.floor(secondsLeft / 60);
  const secondsLeftRemainder = secondsLeft % 60;

  const minutesStr = pad2(minutesLeft);
  const secondsStr = pad2(secondsLeftRemainder);

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

  const handleTimeClick = () => {
    if (status === 'idle' || status === 'finished') {
      setIsModalVisible(true);
    }
  };

  const handleModalConfirm = (minutes: string, seconds: string) => {
    setMinutesInput(minutes);
    setSecondsInput(seconds);
  };

  return (
    <>
    <View className="w-full bg-white border border-2 border-gray-300 rounded-xl items-center justify-between p-4" style={{aspectRatio: 20/17}}>
      {/* 남은 시간 표시 */}
      <View className="items-center justify-center w-[80%] bg-[#757371] rounded-3xl" style={{aspectRatio: 20/11}}>
        <TouchableOpacity
          onPress={handleTimeClick}
          disabled={status === 'running' || status === 'paused'}
          className="w-full items-center justify-center"
        >
          <View className="w-full h-full items-center justify-center flex-row">
            {/* 분의 10의 자리 */}
            <View className="items-center justify-center" style={{ width: '20%' }}>
              <Text
                text={minutesStr[0]}
                className={`text-center text-3xl text-[#141518] ${status === 'idle' || status === 'finished' ? 'opacity-100' : 'opacity-100'}`}
                type="number"
                numberOfLines={1}
                // adjustsFontSizeToFit={true}
                // minimumFontScale={0.1}
              />
            </View>
            {/* 분의 1의 자리 */}
            <View className="items-center justify-center" style={{ width: '20%' }}>
              <Text
                text={minutesStr[1]}
                className={`text-center text-3xl text-[#141518] ${status === 'idle' || status === 'finished' ? 'opacity-100' : 'opacity-100'}`}
                type="number"
                numberOfLines={1}
                // adjustsFontSizeToFit={true}
                // minimumFontScale={0.1}
              />
            </View>
            {/* 콜론 */}
            <View className="items-center justify-center" style={{ width: '10%' }}>
              <Text
                text=":"
                className={`text-center text-3xl text-[#141518] ${status === 'idle' || status === 'finished' ? 'opacity-100' : 'opacity-100'}`}
                type="number"
                numberOfLines={1}
                // adjustsFontSizeToFit={true}
                // minimumFontScale={0.1}
              />
            </View>
            {/* 초의 10의 자리 */}
            <View className="items-center justify-center" style={{ width: '20%' }}>
              <Text
                text={secondsStr[0]}
                className={`text-center text-3xl text-[#141518] ${status === 'idle' || status === 'finished' ? 'opacity-100' : 'opacity-100'}`}
                type="number"
                numberOfLines={1}
                // adjustsFontSizeToFit={true}
                // minimumFontScale={0.1}
              />
            </View>
            {/* 초의 1의 자리 */}
            <View className="items-center justify-center" style={{ width: '20%' }}>
              <Text
                text={secondsStr[1]}
                className={`text-center text-3xl text-[#141518] ${status === 'idle' || status === 'finished' ? 'opacity-100' : 'opacity-100'}`}
                type="number"
                numberOfLines={1}
                // adjustsFontSizeToFit={true}
                // minimumFontScale={0.1}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* 컨트롤 버튼 */}
      <View className='w-full flex-row justify-center items-center'>
        <TouchableOpacity
          disabled={!canStart}
          onPress={handleStart}
          className='flex-1 rounded-3xl px-4 py-3 items-center bg-[#7D7C7F]'
        >
          <Text text="시작" className="text-[#646367] font-semibold" />
        </TouchableOpacity>
        </View>
    </View>
    <TimeInputModal
      visible={isModalVisible}
      onClose={() => setIsModalVisible(false)}
      initialMinutes={minutesInput}
      initialSeconds={secondsInput}
      onConfirm={handleModalConfirm}
    />
    </>
  );
};

