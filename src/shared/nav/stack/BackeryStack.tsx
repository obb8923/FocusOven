import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BakeryScreen } from "@domain/Bakery/BackeryScreen";
const Stack = createNativeStackNavigator<BackeryStackParamList>();
export type BackeryStackParamList = {
  Backery:undefined,
}

export const BackeryStack = () => {
  return (
    <Stack.Navigator 
    screenOptions={{headerShown:false}}
    initialRouteName="Backery">
            <Stack.Screen name="Backery" component={BakeryScreen}/>
           </Stack.Navigator>
  );
};