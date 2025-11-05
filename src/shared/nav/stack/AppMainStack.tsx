import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppMainScreen } from "@domain/AppMain/AppMainScreen";
const Stack = createNativeStackNavigator<AppMainStackParamList>();
export type AppMainStackParamList = {
  AppMain:undefined,
}

export const AppMainStack = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="AppMain" component={AppMainScreen} options={{headerShown:false}}/>
    </Stack.Navigator>
  );
};