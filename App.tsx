import './global.css'
import 'intl-pluralrules';
import '@lib/i18n';
import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PortalProvider } from '@gorhom/portal';
import { StackControl } from "@nav/stack/StackControl";
import { useSetAppInitialize } from "@store/appInitStore";

export default function App() {
  const initialize = useSetAppInitialize();
  useEffect(() => {
    initialize();
  }, [initialize]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PortalProvider>
          <View style={{flex:1}}>
                <NavigationContainer>
                  <StatusBar barStyle="dark-content" translucent={true}/>
                  <StackControl />
                </NavigationContainer>
          </View>
        </PortalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}