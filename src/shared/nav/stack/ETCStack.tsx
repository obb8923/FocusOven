import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ETCScreen } from "@domain/ETC/ETCScreen";
const Stack = createNativeStackNavigator<ETCStackParamList>();
export type ETCStackParamList = {
  ETC: undefined;
  // WebView: {
  //   url: string;
  // };
};

export const ETCStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ETC" component={ETCScreen} />
      {/* <Stack.Screen name="WebView" component={WebView} /> */}
    </Stack.Navigator>
  );
};