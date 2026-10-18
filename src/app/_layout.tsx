import { useState } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { AnimatedSplashScreen } from "../components/AnimatedSplashScreen";
import "../../global.css";

// Keep native splash screen visible until React Native mounts
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <Stack screenOptions={{ headerShown: false }} />
        {isSplashVisible && (
          <AnimatedSplashScreen onFinish={() => setIsSplashVisible(false)} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

