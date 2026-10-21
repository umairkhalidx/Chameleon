import { useState } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Doto_100Thin,
  Doto_200ExtraLight,
  Doto_300Light,
  Doto_400Regular,
  Doto_500Medium,
  Doto_600SemiBold,
  Doto_700Bold,
  Doto_800ExtraBold,
  Doto_900Black,
} from "@expo-google-fonts/doto";
import { AnimatedSplashScreen } from "../components/AnimatedSplashScreen";
import { Colors } from "../constants/colors";
import "../../global.css";

// Keep native splash screen visible until React Native mounts and fonts load
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Doto_100Thin,
    Doto_200ExtraLight,
    Doto_300Light,
    Doto_400Regular,
    Doto_500Medium,
    Doto_600SemiBold,
    Doto_700Bold,
    Doto_800ExtraBold,
    Doto_900Black,
  });
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        {isSplashVisible && (
          <AnimatedSplashScreen onFinish={() => setIsSplashVisible(false)} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

