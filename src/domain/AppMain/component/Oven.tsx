import { View, Image } from 'react-native';

export const Oven = () => {
  return (

    <View className="w-full items-center justify-center">
    <View className="w-1/2 items-center justify-center" style={{aspectRatio: 23/27}}>
      <Image source={require('@assets/pngs/oven_off.png')} className="w-full h-full" />
    </View>
    </View>
  );
};