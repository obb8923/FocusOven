import "./global.css"
import React from 'react';
import { StatusBar} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { HomeScreen } from './src/domain/Home';

type RootStackParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{flex:1}} edges={[ 'left', 'right']} >
              <NavigationContainer>
                <StatusBar barStyle="dark-content" translucent={true}/>
                <Stack.Navigator screenOptions={{headerShown:false}}>
                  <Stack.Screen name="Home" component={HomeScreen} />
                </Stack.Navigator>
              </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}