import {Stack} from 'expo-router';
import {SafeAreaProvider} from "react-native-safe-area-context";
import React from "react";
import {UIManager, Platform, useColorScheme } from "react-native";
import {_routes} from "../components/_routes";
import {store, StoreContext} from "../store/store";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';


if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}


const MainLayout = () => {
    const colorScheme = useColorScheme();

    return (
        // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <StoreContext.Provider value={store}>
                <SafeAreaProvider>
                    <Stack screenOptions={{
                        headerStyle: {
                            backgroundColor: "royalblue"
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 24,
                        },
                    }}>
                        {
                            _routes.map(({name, title}, key) => (
                                <Stack.Screen key={key}
                                              name={name}
                                              options={{
                                                  title
                                              }}
                                />
                            ))
                        }
                    </Stack>
                </SafeAreaProvider>
            </StoreContext.Provider>
        // </ThemeProvider>
    );
}

export default MainLayout