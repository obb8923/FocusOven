import "./global.css"
import React, { useEffect } from 'react';
import { StatusBar} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StackControl } from "@nav/stack/StackControl";
import { useSetAppInitialize } from "@store/appInitStore";

type RootStackParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const initialize = useSetAppInitialize();
  useEffect(() => {
    initialize();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{flex:1}} edges={[ 'left', 'right']} >
              <NavigationContainer>
                <StatusBar barStyle="dark-content" translucent={true}/>
                <Stack.Navigator screenOptions={{headerShown:false}}>
                  <Stack.Screen name="Home" component={StackControl} />
                </Stack.Navigator>
              </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}