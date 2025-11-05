import { View } from 'react-native';

export const Oven = () => {
  return (

    <View className="w-full" >
        {/* 몸통 */}
        <View className="w-full items-center justify-evenly bg-[##FFFFE3] rounded-xl" style={{aspectRatio: 23/14}}>
            {/* 손잡이 */}
            <View className="w-1/2 bg-gray-700 rounded" style={{aspectRatio: 9/1}}>
                
            </View>
            {/* 유리창 */}
            <View className="w-5/6 bg-red-700 rounded-3xl" style={{aspectRatio: 2/1}}>
                
            </View>
        </View>
        {/* 다리와 밑 */}
        <View className="w-full flex-row justify-evenly" style={{aspectRatio: 23/2}}>
            <View 
            className="h-full bg-gray-700" 
            style={{aspectRatio: 6/7,transform: [{ skewX: '-3deg'}],borderBottomLeftRadius: 5,borderBottomRightRadius: 5}}>

            </View>
            <View className="h-1/3 bg-gray-700" style={{aspectRatio: 25/1,borderBottomLeftRadius: 20,borderBottomRightRadius: 20}}>
                
            </View>
            <View 
            className="h-full bg-gray-700" 
            style={{aspectRatio: 6/7,transform: [{ skewX: '3deg' }],borderBottomLeftRadius: 5,borderBottomRightRadius: 5}}>
                
            </View>
        </View>
    </View>
  );
};