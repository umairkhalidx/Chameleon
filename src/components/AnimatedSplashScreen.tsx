import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  Easing,
  Image,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

const CIRCLE_SIZE = 60;

export function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
  const { width, height } = useWindowDimensions();
  const [contentOpacity] = useState(() => new Animated.Value(1));
  const [circleScale] = useState(() => new Animated.Value(0));

  // Dynamic diagonal calculation ensuring complete screen coverage on all aspect ratios
  const screenDiagonal = Math.hypot(width, height);
  const targetScale = (screenDiagonal / (CIRCLE_SIZE / 2)) * 1.35;
  // Adaptive logo size ensuring proper prominence on both phones and tablets
  const logoSize = Math.min(width * 0.72, height * 0.42, 310);

  // Prevent back navigation on Android while splash is animating
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    // Dismiss the native OS splash screen immediately to show our animated splash
    SplashScreen.hideAsync().catch(() => { });

    // Choreographed sequence:
    // 1. Show the logo and loading spinner on green background for 1.8s
    // 2. Fade out logo & spinner smoothly (250ms)
    // 3. Expand white circle from the center to fill the entire screen (1400ms)
    // 4. Reveal the home screen
    const animation = Animated.sequence([
      Animated.delay(1800),
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(circleScale, {
        toValue: targetScale,
        duration: 1600,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }),
    ]);

    animation.start(() => {
      onFinish();
    });

    return () => {
      animation.stop();
    };
  }, [contentOpacity, circleScale, targetScale, onFinish]);

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="auto">
      <StatusBar style="dark" />

      {/* Expanding white circle transition */}
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: circleScale }],
          },
        ]}
      />

      {/* Main splash content: transparent logo & loader */}
      <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
        <Image
          source={require("../../assets/images/splash-icon.png")}
          style={{ width: logoSize, height: logoSize }}
          resizeMode="contain"
          accessibilityLabel="Chameleon Logo"
        />
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color="#283218"
            accessibilityLabel="Loading Chameleon"
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#A8E619", // Theme vibrant lime green
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  loaderContainer: {
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    position: "absolute",
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "#FFFFFF",
  },
});

