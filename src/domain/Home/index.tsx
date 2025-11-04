import React from 'react';
import { View ,Text as RNText } from 'react-native';
import Right from '../../../assets/svgs/ChevronRight.svg';
import { Background } from '../../shared/components/Background';
import { Text } from '../../shared/components/Text';

export function HomeScreen() {
  return (
    <Background isStatusBarGap={true}>
      <Right width={48} height={48} color="white" />
      <RNText className='text-black text-xl mt-4'>Pretendard (none)</RNText>
      <Text text='Pretendard Regular' type='regular' className='text-black text-xl mt-4'/>
      <Text text='Pretendard SemiBold' type='semibold' className='text-black text-xl mt-4'/>
      <Text text='Pretendard ExtraBold' type='extrabold' className='text-black text-xl mt-4'/>
      <Text text='Pretendard Black' type='black' className='text-black text-xl mt-4'/>
    </Background>
  );
}