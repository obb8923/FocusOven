import './global.css'
import 'intl-pluralrules';
import '@lib/i18n';
import React, { useEffect } from 'react';
import { StatusBar} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
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
          <SafeAreaView style={{flex:1}} edges={[ 'left', 'right']} >
                <NavigationContainer>
                  <StatusBar barStyle="dark-content" translucent={true}/>
                  <StackControl />
                </NavigationContainer>
          </SafeAreaView>
        </PortalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}