import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from "react-native-gesture-handler";


SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const router = useRouter();

  const [loaded, error] = useFonts({
    'InstrumentSerif-Regular': require('../assets/fonts/InstrumentSerif-Regular.ttf'),
    'InstrumentSans-Regular': require('../assets/fonts/InstrumentSans-Regular.ttf'),
    'InstrumentSans-Bold': require('../assets/fonts/InstrumentSans-Bold.ttf'),
    'InstrumentSerif-Italic': require('../assets/fonts/InstrumentSerif-Italic.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack>
      {/* Tabs ohne Header */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Audio Player mit eigenem Header */}
      <Stack.Screen
        name="audio-player"
        options={{
          header: () => (
            <View
              style={{
                backgroundColor: '#FFFEFC',
                paddingTop: 50,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#1D0C02',
                justifyContent: 'center',
                height: 100,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  height: 40,
                }}
              >
                {/* Zurückbutton */}
                <TouchableOpacity
                  onPress={() => {
                    if (router.canGoBack()) {
                      router.back();
                    } else {
                      router.replace("/(tabs)");
                    }
                  }}
                  style={{
                    position: 'absolute',
                    left: 16,
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: 'black',
                    width: 40,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>

                {/* Titel */}
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#1D0C02',
                    fontFamily: 'InstrumentSans-Bold',
                  }}
                >
                  Audio Guide
                </Text>
              </View>
            </View>
          ),
        }}
      />

      {/* Audio-Loading ohne Header */}
      <Stack.Screen
        name="audio-loading"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
