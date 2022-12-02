import React from "react";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "styled-components";
import { useCachedResources } from "hooks";
import { useColorScheme } from "hooks";
import Navigation from "navigation";
import { Theme } from "constants/Theme";
import { Provider } from 'react-redux'
import store from 'store';
import { interceptor } from "utils/interceptors";
import { wsInstance } from "utils/websocket-common";
import http from "utils/http-common";
import "local/i18n"

interceptor(http, store)

export default function App() {

  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ThemeProvider theme={Theme}>
          <Provider store={store}>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </Provider>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }
}
