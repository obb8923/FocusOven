import { View } from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context'; 
import { Text } from '@component/Text';
export const AppMain = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{paddingTop: insets.top}}>
      <Text text='AppMain' className='text-xl mt-4 text-red-500'/>
    </View>
  );
};