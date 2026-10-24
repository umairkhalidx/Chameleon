import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

interface SlideToConfirmProps {
  trackWidth: number;
  onComplete: () => boolean;
  label?: string;
}

function SlideToConfirm({
  trackWidth,
  onComplete,
  label = "Slide to Create Account",
}: SlideToConfirmProps) {
  const thumbSize = 48;
  const padding = 4;
  const maxDistance = Math.max(0, trackWidth - thumbSize - padding * 2);

  const [panX] = useState(() => new Animated.Value(0));
  const [isCompleted, setIsCompleted] = useState(false);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > 5,
        onPanResponderTerminationRequest: () => false,
        onPanResponderMove: (_, gestureState) => {
          if (maxDistance <= 0) return;
          const bounded = Math.max(0, Math.min(gestureState.dx, maxDistance));
          panX.setValue(bounded);
        },
        onPanResponderRelease: (_, gestureState) => {
          if (maxDistance <= 0) return;

          if (gestureState.dx >= maxDistance * 0.78) {
            const success = onComplete();
            if (success) {
              setIsCompleted(true);
              Animated.timing(panX, {
                toValue: maxDistance,
                duration: 120,
                useNativeDriver: true,
              }).start();
            } else {
              // Spring back if validation fails
              Animated.spring(panX, {
                toValue: 0,
                tension: 140,
                friction: 12,
                useNativeDriver: true,
              }).start(() => setIsCompleted(false));
            }
          } else {
            // Incomplete slide, spring back
            Animated.spring(panX, {
              toValue: 0,
              tension: 140,
              friction: 12,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [maxDistance, onComplete, panX]
  );

  const textOpacity = panX.interpolate({
    inputRange: [0, Math.max(1, maxDistance * 0.6)],
    outputRange: [1, 0.15],
    extrapolate: "clamp",
  });

  return (
    <View style={[styles.slideTrack, { width: trackWidth }]}>
      {/* Background Track Label */}
      <Animated.View
        style={[styles.slideTrackLabelContainer, { opacity: textOpacity }]}
        pointerEvents="none"
      >
        <Text style={styles.slideTrackLabelText}>{label}</Text>
      </Animated.View>

      {/* Draggable Thumb */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.slideThumb,
          {
            transform: [{ translateX: panX }],
          },
        ]}
      >
        <Ionicons
          name={isCompleted ? "checkmark" : "arrow-forward"}
          size={22}
          color={Colors.forestOlive}
        />
      </Animated.View>
    </View>
  );
}

export default function AuthScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Initial computed width so frame 1 has exact dimension without layout shift
  const initialWidth = isTablet ? Math.min(width - 96, 520) : width - 48;
  const [containerWidth, setContainerWidth] = useState(initialWidth);

  // Active page: 0 = Log In, 1 = Sign Up Step 1 (Username), 2 = Sign Up Step 2 (PIN)
  const [pageIndex, setPageIndex] = useState<0 | 1 | 2>(0);
  const isLogin = pageIndex === 0;

  // Form States - Log In
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [showLoginPin, setShowLoginPin] = useState(false);
  const [isLoginPinFocused, setIsLoginPinFocused] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Form States - Sign Up Step 1 (Username)
  const [signupUsername, setSignupUsername] = useState("");
  const [signupStep1Error, setSignupStep1Error] = useState<string | null>(null);

  // Form States - Sign Up Step 2 (PIN Setup & Confirmation)
  const [signupPin, setSignupPin] = useState("");
  const [signupConfirmPin, setSignupConfirmPin] = useState("");
  const [showSignupPin, setShowSignupPin] = useState(false);
  const [showSignupConfirmPin, setShowSignupConfirmPin] = useState(false);
  const [focusedPinField, setFocusedPinField] = useState<
    "signupPin" | "signupConfirmPin" | null
  >(null);
  const [signupStep2Error, setSignupStep2Error] = useState<string | null>(null);

  // Input Refs
  const loginPinRef = useRef<TextInput>(null);
  const signupUsernameRef = useRef<TextInput>(null);
  const signupPinRef = useRef<TextInput>(null);
  const signupConfirmPinRef = useRef<TextInput>(null);

  // Smooth Horizontal Page Slide Animation
  const [pageTranslateX] = useState(() => new Animated.Value(0));

  // Slider Indicator Pill Animation (0 = Log In, 1 = Sign Up)
  const [slideAnim] = useState(() => new Animated.Value(0));

  // CTA Button tactile interaction
  const [buttonScale] = useState(() => new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      tension: 300,
      friction: 12,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      tension: 200,
      friction: 9,
      useNativeDriver: true,
    }).start();
  };

  // Coordinated Page Slide Transition
  const goToPage = React.useCallback(
    (targetIndex: 0 | 1 | 2) => {
      Keyboard.dismiss();
      setPageIndex(targetIndex);

      const targetX = -targetIndex * containerWidth;

      // 1. Slide pages smoothly with natural spring physics
      Animated.spring(pageTranslateX, {
        toValue: targetX,
        tension: 72,
        friction: 12,
        useNativeDriver: true,
      }).start();

      // 2. Slide the top white switcher pill
      const sliderTarget = targetIndex === 0 ? 0 : 1;
      Animated.spring(slideAnim, {
        toValue: sliderTarget,
        tension: 130,
        friction: 14,
        useNativeDriver: true,
      }).start();
    },
    [containerWidth, pageTranslateX, slideAnim]
  );

  // Native Android hardware back navigation
  useEffect(() => {
    if (Platform.OS !== "android") return;

    const onBackPress = () => {
      if (pageIndex === 2) {
        goToPage(1);
        return true;
      }
      if (pageIndex === 1) {
        goToPage(0);
        return true;
      }
      return false;
    };

    const backSubscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    return () => backSubscription.remove();
  }, [pageIndex, goToPage]);

  // Log In Submit
  const handleLoginSubmit = () => {
    if (!loginUsername.trim()) {
      setLoginError("Please enter your username.");
      return;
    }
    if (loginPin.length < 4) {
      setLoginError("Please enter your 4-digit PIN.");
      return;
    }
    setLoginError(null);
    router.replace("/(tabs)");
  };

  // Sign Up Step 1 -> Step 2
  const handleSignupStep1Next = () => {
    const trimmed = signupUsername.trim();
    if (trimmed.length < 3) {
      setSignupStep1Error("Username must be at least 3 characters.");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setSignupStep1Error("Only letters, numbers, and underscores are allowed.");
      return;
    }
    setSignupStep1Error(null);
    goToPage(2);
  };

  // Sign Up Step 2 Submit (Returns boolean to SlideToConfirm)
  const handleSignupFinalSubmit = (): boolean => {
    if (signupPin.length < 4) {
      setSignupStep2Error("Please create a 4-digit PIN.");
      return false;
    }
    if (signupConfirmPin.length < 4) {
      setSignupStep2Error("Please confirm your 4-digit PIN.");
      return false;
    }
    if (signupPin !== signupConfirmPin) {
      setSignupStep2Error("PINs do not match. Please verify both entries.");
      return false;
    }
    setSignupStep2Error(null);
    router.replace("/(tabs)");
    return true;
  };

  // Slider pill geometry
  const tabWidth = containerWidth > 0 ? (containerWidth - 8) / 2 : 0;
  const pillTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom", "left", "right"]}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: isTablet ? 48 : 24,
              maxWidth: isTablet ? 520 : "100%",
              alignSelf: "center",
              width: "100%",
            },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Brand Header */}
          <View style={styles.topHeader}>
            <View style={styles.brandContainer}>
              <Text style={styles.brandTitle}>Chameleon</Text>
              <View style={styles.brandDot} />
            </View>

            <TouchableOpacity
              onPress={() => router.replace("/(tabs)")}
              hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
              style={styles.guestButton}
              accessibilityRole="button"
              accessibilityLabel="Explore app as guest"
            >
              <Text style={styles.guestText}>Explore</Text>
            </TouchableOpacity>
          </View>

          {/* Minimalist Top Slider Switcher with White Selected Button */}
          <View
            style={styles.sliderTrack}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              if (w > 0 && Math.abs(w - containerWidth) > 1) {
                setContainerWidth(w);
              }
            }}
          >
            {containerWidth > 0 && (
              <Animated.View
                style={[
                  styles.sliderPill,
                  {
                    width: tabWidth,
                    transform: [{ translateX: pillTranslateX }],
                  },
                ]}
              />
            )}

            <Pressable
              onPress={() => goToPage(0)}
              style={styles.sliderTab}
              accessibilityRole="tab"
              accessibilityState={{ selected: isLogin }}
              accessibilityLabel="Switch to Log In mode"
            >
              <Text
                style={[
                  styles.sliderTabText,
                  isLogin && styles.sliderTabTextActive,
                ]}
              >
                Log In
              </Text>
            </Pressable>

            <Pressable
              onPress={() => goToPage(pageIndex === 0 ? 1 : pageIndex)}
              style={styles.sliderTab}
              accessibilityRole="tab"
              accessibilityState={{ selected: !isLogin }}
              accessibilityLabel="Switch to Sign Up mode"
            >
              <Text
                style={[
                  styles.sliderTabText,
                  !isLogin && styles.sliderTabTextActive,
                ]}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>

          {/* Glitch-Free Horizontal Carousel Container */}
          <View style={[styles.viewportWrapper, { width: containerWidth }]}>
            <Animated.View
              style={[
                styles.carouselTrack,
                {
                  width: containerWidth * 3,
                  transform: [{ translateX: pageTranslateX }],
                },
              ]}
            >
              {/* ======================================================= */}
              {/* PAGE 0: LOG IN SCREEN                                   */}
              {/* ======================================================= */}
              <View style={[styles.pageContainer, { width: containerWidth }]}>
                {/* Header */}
                <View style={styles.textHeader}>
                  <Text style={styles.title} accessibilityRole="header">
                    Welcome Back.
                  </Text>
                  <Text style={styles.subtitle}>
                    Enter your username and 4-digit PIN to access your secure conversations.
                  </Text>
                </View>

                {/* Error Banner */}
                {loginError ? (
                  <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={17} color={Colors.accentCrimson} />
                    <Text style={styles.errorText}>{loginError}</Text>
                  </View>
                ) : null}

                {/* Form Fields */}
                <View style={styles.formContainer}>
                  {/* Username Field */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Username</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="at-outline"
                        size={19}
                        color="#6C7F59"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        value={loginUsername}
                        onChangeText={(t) => {
                          setLoginUsername(t);
                          if (loginError) setLoginError(null);
                        }}
                        placeholder="e.g. alex_k"
                        placeholderTextColor="#9BB088"
                        style={styles.textInput}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        onSubmitEditing={() => loginPinRef.current?.focus()}
                      />
                    </View>
                  </View>

                  {/* 4-Digit PIN Field */}
                  <View style={styles.inputGroup}>
                    <View style={styles.labelRow}>
                      <Text style={styles.inputLabel}>4-Digit PIN</Text>
                      <TouchableOpacity
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityRole="button"
                        accessibilityLabel="Forgot PIN"
                      >
                        <Text style={styles.forgotText}>Forgot PIN?</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.pinWrapper}>
                      <View style={styles.pinBoxesContainer}>
                        <View style={styles.pinBoxesRow} pointerEvents="none">
                          {[0, 1, 2, 3].map((index) => {
                            const digit = loginPin[index];
                            const isFilled = digit !== undefined;
                            const isCurrent =
                              isLoginPinFocused && loginPin.length === index;

                            return (
                              <View
                                key={index}
                                style={[
                                  styles.pinBox,
                                  isFilled && styles.pinBoxFilled,
                                  isCurrent && styles.pinBoxCurrent,
                                ]}
                              >
                                <Text style={styles.pinDigitText}>
                                  {isFilled ? (showLoginPin ? digit : "●") : ""}
                                </Text>
                              </View>
                            );
                          })}
                        </View>

                        <TextInput
                          ref={loginPinRef}
                          value={loginPin}
                          onChangeText={(text) => {
                            const cleaned = text.replace(/[^0-9]/g, "").slice(0, 4);
                            setLoginPin(cleaned);
                            if (loginError) setLoginError(null);
                          }}
                          onFocus={() => setIsLoginPinFocused(true)}
                          onBlur={() => setIsLoginPinFocused(false)}
                          keyboardType="number-pad"
                          returnKeyType="done"
                          onSubmitEditing={handleLoginSubmit}
                          maxLength={4}
                          style={styles.pinInputOverlay}
                          caretHidden
                          cursorColor="transparent"
                          contextMenuHidden={true}
                          selection={{ start: loginPin.length, end: loginPin.length }}
                          textContentType="oneTimeCode"
                          autoComplete="one-time-code"
                          accessibilityLabel="4-digit PIN"
                        />
                      </View>

                      <TouchableOpacity
                        onPress={() => setShowLoginPin(!showLoginPin)}
                        style={styles.pinEyeButton}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        accessibilityRole="button"
                        accessibilityLabel={showLoginPin ? "Hide PIN" : "Show PIN"}
                      >
                        <Ionicons
                          name={showLoginPin ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color="#6C7F59"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Primary CTA */}
                  <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <Pressable
                      onPress={handleLoginSubmit}
                      onPressIn={handlePressIn}
                      onPressOut={handlePressOut}
                      style={styles.primaryButton}
                      accessibilityRole="button"
                      accessibilityLabel="Log in to Chameleon"
                    >
                      <Text style={styles.primaryButtonText}>Log In to Chameleon</Text>
                      <Ionicons
                        name="arrow-forward"
                        size={19}
                        color={Colors.forestOlive}
                        style={{ marginLeft: 6 }}
                      />
                    </Pressable>
                  </Animated.View>

                  {/* Footer Switch */}
                  <View style={styles.footerRow}>
                    <Text style={styles.footerPrompt}>{"Don't have an account yet?"}</Text>
                    <Pressable
                      onPress={() => goToPage(1)}
                      hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
                    >
                      <Text style={styles.footerAction}> Sign Up</Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* ======================================================= */}
              {/* PAGE 1: SIGN UP - STEP 1 (Username)                     */}
              {/* ======================================================= */}
              <View style={[styles.pageContainer, { width: containerWidth }]}>
                {/* Header */}
                <View style={styles.textHeader}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>Step 1 of 2: Identity</Text>
                  </View>
                  <Text style={styles.title} accessibilityRole="header">
                    Choose Your Username.
                  </Text>
                  <Text style={styles.subtitle}>
                    Pick a unique handle. This identifier represents you across the decentralized Chameleon network.
                  </Text>
                </View>

                {/* Error Banner */}
                {signupStep1Error ? (
                  <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={17} color={Colors.accentCrimson} />
                    <Text style={styles.errorText}>{signupStep1Error}</Text>
                  </View>
                ) : null}

                {/* Form Fields */}
                <View style={styles.formContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Unique Username</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="at-outline"
                        size={19}
                        color="#6C7F59"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        ref={signupUsernameRef}
                        value={signupUsername}
                        onChangeText={(t) => {
                          setSignupUsername(t);
                          if (signupStep1Error) setSignupStep1Error(null);
                        }}
                        placeholder="e.g. alex_k"
                        placeholderTextColor="#9BB088"
                        style={styles.textInput}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        onSubmitEditing={handleSignupStep1Next}
                      />
                    </View>
                    <Text style={styles.inputHelperText}>
                      Minimum 3 characters. Letters, numbers, and underscores only.
                    </Text>
                  </View>

                  {/* Continue Button */}
                  <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <Pressable
                      onPress={handleSignupStep1Next}
                      onPressIn={handlePressIn}
                      onPressOut={handlePressOut}
                      style={styles.primaryButton}
                      accessibilityRole="button"
                      accessibilityLabel="Continue to PIN setup"
                    >
                      <Text style={styles.primaryButtonText}>Continue to PIN Setup</Text>
                      <Ionicons
                        name="arrow-forward"
                        size={19}
                        color={Colors.forestOlive}
                        style={{ marginLeft: 6 }}
                      />
                    </Pressable>
                  </Animated.View>

                  {/* Footer Switch */}
                  <View style={styles.footerRow}>
                    <Text style={styles.footerPrompt}>Already have an account?</Text>
                    <Pressable
                      onPress={() => goToPage(0)}
                      hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
                    >
                      <Text style={styles.footerAction}> Log In</Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* ======================================================= */}
              {/* PAGE 2: SIGN UP - STEP 2 (PIN & Confirm PIN)            */}
              {/* ======================================================= */}
              <View style={[styles.pageContainer, { width: containerWidth }]}>
                {/* Header */}
                <View style={styles.textHeader}>
                  <View style={styles.stepHeaderRow}>
                    <TouchableOpacity
                      onPress={() => goToPage(1)}
                      style={styles.stepBackNavButton}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      accessibilityRole="button"
                      accessibilityLabel="Go back to change username"
                    >
                      <Ionicons
                        name="arrow-back"
                        size={15}
                        color={Colors.forestOlive}
                      />
                      <Text style={styles.stepBadgeText}>Change Username</Text>
                    </TouchableOpacity>

                    <View style={styles.stepBadgeInRow}>
                      <Text style={styles.stepBadgeText}>Step 2 of 2</Text>
                    </View>
                  </View>

                  <Text style={styles.title} accessibilityRole="header">
                    Create Security PIN.
                  </Text>
                  <Text style={styles.subtitle}>
                    Choose a 4-digit PIN for @{signupUsername || "handle"} and re-enter it to confirm. This PIN encrypts your local keys.
                  </Text>
                </View>

                {/* Error Banner */}
                {signupStep2Error ? (
                  <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={17} color={Colors.accentCrimson} />
                    <Text style={styles.errorText}>{signupStep2Error}</Text>
                  </View>
                ) : null}

                {/* Form Fields */}
                <View style={styles.formContainer}>
                  {/* 1. Set PIN */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Set 4-Digit PIN</Text>
                    <View style={styles.pinWrapper}>
                      <View style={styles.pinBoxesContainer}>
                        <View style={styles.pinBoxesRow} pointerEvents="none">
                          {[0, 1, 2, 3].map((index) => {
                            const digit = signupPin[index];
                            const isFilled = digit !== undefined;
                            const isCurrent =
                              focusedPinField === "signupPin" &&
                              signupPin.length === index;

                            return (
                              <View
                                key={index}
                                style={[
                                  styles.pinBox,
                                  isFilled && styles.pinBoxFilled,
                                  isCurrent && styles.pinBoxCurrent,
                                ]}
                              >
                                <Text style={styles.pinDigitText}>
                                  {isFilled ? (showSignupPin ? digit : "●") : ""}
                                </Text>
                              </View>
                            );
                          })}
                        </View>

                        <TextInput
                          ref={signupPinRef}
                          value={signupPin}
                          onChangeText={(text) => {
                            const cleaned = text.replace(/[^0-9]/g, "").slice(0, 4);
                            setSignupPin(cleaned);
                            if (signupStep2Error) setSignupStep2Error(null);
                            if (cleaned.length === 4) {
                              signupConfirmPinRef.current?.focus();
                            }
                          }}
                          onFocus={() => setFocusedPinField("signupPin")}
                          onBlur={() => setFocusedPinField(null)}
                          keyboardType="number-pad"
                          returnKeyType="next"
                          maxLength={4}
                          style={styles.pinInputOverlay}
                          caretHidden
                          cursorColor="transparent"
                          contextMenuHidden={true}
                          selection={{ start: signupPin.length, end: signupPin.length }}
                          textContentType="oneTimeCode"
                          autoComplete="one-time-code"
                          accessibilityLabel="Set 4-digit PIN"
                        />
                      </View>

                      <TouchableOpacity
                        onPress={() => setShowSignupPin(!showSignupPin)}
                        style={styles.pinEyeButton}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        accessibilityRole="button"
                        accessibilityLabel={showSignupPin ? "Hide PIN" : "Show PIN"}
                      >
                        <Ionicons
                          name={showSignupPin ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color="#6C7F59"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* 2. Confirm PIN */}
                  <View style={styles.inputGroup}>
                    <View style={styles.labelRow}>
                      <Text style={styles.inputLabel}>Confirm 4-Digit PIN</Text>
                      {/* Live Matching Indicator Badge */}
                      {signupConfirmPin.length === 4 && (
                        <View
                          style={[
                            styles.matchBadge,
                            signupPin === signupConfirmPin
                              ? styles.matchBadgeSuccess
                              : styles.matchBadgeError,
                          ]}
                        >
                          <Ionicons
                            name={
                              signupPin === signupConfirmPin
                                ? "checkmark-circle"
                                : "close-circle"
                            }
                            size={13}
                            color={
                              signupPin === signupConfirmPin
                                ? "#2A6F1D"
                                : Colors.accentCrimson
                            }
                          />
                          <Text
                            style={[
                              styles.matchBadgeText,
                              signupPin === signupConfirmPin
                                ? styles.matchBadgeTextSuccess
                                : styles.matchBadgeTextError,
                            ]}
                          >
                            {signupPin === signupConfirmPin
                              ? "PINs Match"
                              : "Does Not Match"}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.pinWrapper}>
                      <View style={styles.pinBoxesContainer}>
                        <View style={styles.pinBoxesRow} pointerEvents="none">
                          {[0, 1, 2, 3].map((index) => {
                            const digit = signupConfirmPin[index];
                            const isFilled = digit !== undefined;
                            const isCurrent =
                              focusedPinField === "signupConfirmPin" &&
                              signupConfirmPin.length === index;

                            return (
                              <View
                                key={index}
                                style={[
                                  styles.pinBox,
                                  isFilled && styles.pinBoxFilled,
                                  isCurrent && styles.pinBoxCurrent,
                                ]}
                              >
                                <Text style={styles.pinDigitText}>
                                  {isFilled
                                    ? showSignupConfirmPin
                                      ? digit
                                      : "●"
                                    : ""}
                                </Text>
                              </View>
                            );
                          })}
                        </View>

                        <TextInput
                          ref={signupConfirmPinRef}
                          value={signupConfirmPin}
                          onChangeText={(text) => {
                            const cleaned = text.replace(/[^0-9]/g, "").slice(0, 4);
                            setSignupConfirmPin(cleaned);
                            if (signupStep2Error) setSignupStep2Error(null);
                          }}
                          onFocus={() => setFocusedPinField("signupConfirmPin")}
                          onBlur={() => setFocusedPinField(null)}
                          keyboardType="number-pad"
                          returnKeyType="done"
                          onSubmitEditing={handleSignupFinalSubmit}
                          maxLength={4}
                          style={styles.pinInputOverlay}
                          caretHidden
                          cursorColor="transparent"
                          contextMenuHidden={true}
                          selection={{
                            start: signupConfirmPin.length,
                            end: signupConfirmPin.length,
                          }}
                          textContentType="oneTimeCode"
                          autoComplete="one-time-code"
                          accessibilityLabel="Confirm 4-digit PIN"
                        />
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          setShowSignupConfirmPin(!showSignupConfirmPin)
                        }
                        style={styles.pinEyeButton}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        accessibilityRole="button"
                        accessibilityLabel={
                          showSignupConfirmPin ? "Hide PIN" : "Show PIN"
                        }
                      >
                        <Ionicons
                          name={
                            showSignupConfirmPin
                              ? "eye-off-outline"
                              : "eye-outline"
                          }
                          size={20}
                          color="#6C7F59"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Slide to Create Account (Slider instead of Button) */}
                  <SlideToConfirm
                    key={pageIndex}
                    trackWidth={containerWidth}
                    onComplete={handleSignupFinalSubmit}
                    label="Slide to Create Account"
                  />
                </View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 28,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    width: "100%",
    marginBottom: 16,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  brandTitle: {
    fontFamily: Fonts.doto.bold,
    fontSize: 22,
    color: Colors.forestOlive,
    letterSpacing: 1.5,
    includeFontPadding: false,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  guestButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: "rgba(40, 50, 24, 0.05)",
  },
  guestText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
  },

  // Minimalist Top Slider Switcher with White Selected Button
  sliderTrack: {
    flexDirection: "row",
    position: "relative",
    backgroundColor: "#E8EFE0",
    borderRadius: 24,
    padding: 4,
    marginBottom: 24,
    width: "100%",
    height: 48,
    alignItems: "center",
  },
  sliderPill: {
    position: "absolute",
    left: 4,
    top: 4,
    bottom: 4,
    backgroundColor: Colors.pureWhite,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.forestOlive,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  sliderTab: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  sliderTabText: {
    fontSize: 14.5,
    fontWeight: "600",
    color: Colors.textSecondary,
    letterSpacing: 0.1,
  },
  sliderTabTextActive: {
    color: Colors.forestOlive,
    fontWeight: "800",
  },

  // Viewport and Glitch-Free Carousel
  viewportWrapper: {
    overflow: "hidden",
  },
  carouselTrack: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  pageContainer: {
    paddingHorizontal: 2,
  },

  // Headers
  textHeader: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    lineHeight: 33,
    fontWeight: "900",
    color: Colors.textPrimary,
    letterSpacing: -0.6,
    marginBottom: 6,
    includeFontPadding: false,
  },
  subtitle: {
    fontSize: 14.5,
    color: Colors.textSecondary,
    lineHeight: 21,
    maxWidth: 390,
    includeFontPadding: false,
  },
  stepBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    height: 32,
    paddingHorizontal: 12,
    backgroundColor: "#EAF5D8",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D8E6C8",
    marginBottom: 10,
  },
  stepBadgeInRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 32,
    paddingHorizontal: 12,
    backgroundColor: "#EAF5D8",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D8E6C8",
  },
  stepBadgeText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: Colors.forestOlive,
    letterSpacing: 0.2,
    includeFontPadding: false,
  },

  // Error Banner
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FDF2F2",
    borderWidth: 1,
    borderColor: "#FADBD8",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.accentCrimson,
    flex: 1,
  },

  // Form Fields
  formContainer: {
    width: "100%",
    gap: 16,
  },
  inputGroup: {
    width: "100%",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.forestOlive,
    marginBottom: 6,
    marginLeft: 2,
    includeFontPadding: false,
  },
  inputHelperText: {
    fontSize: 11.5,
    color: Colors.textMuted,
    marginTop: 6,
    marginLeft: 4,
    lineHeight: 16,
  },
  forgotText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#4A6B32",
    marginBottom: 6,
  },
  matchBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  matchBadgeSuccess: {
    backgroundColor: "#EAF7E6",
  },
  matchBadgeError: {
    backgroundColor: "#FDF2F2",
  },
  matchBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  matchBadgeTextSuccess: {
    color: "#2A6F1D",
  },
  matchBadgeTextError: {
    color: Colors.accentCrimson,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.pureWhite,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: "#E1EBD5",
    paddingHorizontal: 14,
    height: 52,
    ...Platform.select({
      ios: {
        shadowColor: Colors.forestOlive,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
      default: {},
    }),
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: Colors.forestOlive,
    fontWeight: "600",
    includeFontPadding: false,
  },

  // 4-Digit PIN Styling
  pinWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 60,
  },
  pinBoxesContainer: {
    flex: 1,
    position: "relative",
    height: 60,
    justifyContent: "center",
  },
  pinBoxesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  pinBox: {
    flex: 1,
    height: 58,
    borderRadius: 16,
    backgroundColor: Colors.pureWhite,
    borderWidth: 1.5,
    borderColor: "#E1EBD5",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: Colors.forestOlive,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
      default: {},
    }),
  },
  pinBoxFilled: {
    borderColor: Colors.forestOlive,
    backgroundColor: "#F7FAF3",
  },
  pinBoxCurrent: {
    borderColor: Colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  pinDigitText: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.forestOlive,
    includeFontPadding: false,
    textAlign: "center",
  },
  pinEyeButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: Colors.pureWhite,
    borderWidth: 1,
    borderColor: "#E1EBD5",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: Colors.forestOlive,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
      default: {},
    }),
  },
  pinInputOverlay: {
    ...StyleSheet.absoluteFill,
    color: "transparent",
    backgroundColor: "transparent",
    fontSize: 1,
    opacity: 1,
  },

  // Primary Standard Button (Log In & Step 1)
  primaryButton: {
    width: "100%",
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.38,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.forestOlive,
    letterSpacing: 0.2,
    includeFontPadding: false,
  },

  // Slide To Confirm Slider (Final Sign Up Screen)
  slideTrack: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E6EEDC",
    borderWidth: 1.2,
    borderColor: "#D2DEC4",
    padding: 4,
    justifyContent: "center",
    position: "relative",
    marginTop: 8,
  },
  slideTrackLabelContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 24,
  },
  slideTrackLabelText: {
    fontSize: 14.5,
    fontWeight: "700",
    color: Colors.forestOlive,
    letterSpacing: 0.2,
    includeFontPadding: false,
  },
  slideThumb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary, // Vibrant Lime Green #A8E619
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
  },

  stepHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    width: "100%",
  },
  stepBackNavButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "rgba(40, 50, 24, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(40, 50, 24, 0.08)",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  footerPrompt: {
    fontSize: 13.5,
    color: Colors.textSecondary,
    includeFontPadding: false,
  },
  footerAction: {
    fontSize: 13.5,
    fontWeight: "800",
    color: Colors.forestOlive,
    includeFontPadding: false,
  },
});
