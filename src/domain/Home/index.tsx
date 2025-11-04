import React from 'react';
import { View ,Text as RNText } from 'react-native';
import Right from '../../../assets/svgs/ChevronRight.svg';
import { Background } from '../../shared/components/Background';
import { Text } from '../../shared/components/Text';

export function HomeScreen() {
  return (
    <Background isStatusBarGap={true}>
      <Right width={48} height={48} color="white" />
      <RNText className='text-xl mt-4'>Pretendard Regular 한들테슴ㄴ(none)</RNText>
      <RNText className='text-xl mt-4' style={{fontFamily: 'KyoboHandwriting2024psw',fontWeight: '400'}}>Pretendard Regular 한들테슴ㄴ(none)</RNText>
      <RNText className='text-xl mt-4' style={{fontFamily: 'MemomentKkukkukkR',fontWeight: '400'}}>Pretendard Regular 한들테슴ㄴ(none)</RNText>
      <RNText className='text-xl mt-4' style={{fontFamily: 'MemomentKkukkukkR',fontWeight: '600'}}>Pretendard Regular 한들테슴ㄴ(none)</RNText>
      <RNText className='text-xl mt-4' style={{fontFamily: 'MemomentKkukkukkR',fontWeight: '700'}}>Pretendard Regular 한들테슴ㄴ(none)</RNText>
      <RNText className='text-xl mt-4' style={{fontFamily: 'MemomentKkukkukkR',fontWeight: '400'}}>Pretendard Regular 한들테슴ㄴ(none)</RNText>



    </Background>
  );
}