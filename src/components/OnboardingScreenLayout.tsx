import { useState, type ReactNode } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { Fonts } from "../constants/fonts";

export interface OnboardingScreenLayoutProps {
  step: 1 | 2 | 3;
  title: string;
  subtitle: string;
  heroVisual: ReactNode;
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  nextButtonLabel?: string;
}

export function OnboardingScreenLayout({
  step,
  title,
  subtitle,
  heroVisual,
  onNext,
  onBack,
  onSkip,
  nextButtonLabel = "Next",
}: OnboardingScreenLayoutProps) {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const isCompactPhone = height < 720;

  // Touch micro-animation scale for primary button (React 19 compliant)
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

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom", "left", "right"]}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: isTablet ? 48 : 24,
            maxWidth: isTablet ? 600 : "100%",
            alignSelf: "center",
            width: "100%",
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Header: Brand Wordmark + Skip Action */}
        <View style={styles.topHeader}>
          <View style={styles.brandContainer}>
            <Text style={styles.brandTitle}>Chameleon</Text>
            <View style={styles.brandDot} />
          </View>

          {onSkip ? (
            <TouchableOpacity
              onPress={onSkip}
              hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
              style={styles.skipButton}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Skip onboarding to login"
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 44 }} />
          )}
        </View>

        {/* Vertically Centered Main Body: Visual Diagram + Content */}
        <View style={styles.centerContainer}>
          <View style={styles.heroArea}>
            {heroVisual}
          </View>

          <View style={styles.textSection}>
            {/* Step Pagination Indicator */}
            <View style={styles.paginationRow}>
              {[1, 2, 3].map((i) => {
                const isActive = i === step;
                return (
                  <View
                    key={i}
                    style={[
                      styles.paginationDot,
                      isActive && styles.paginationDotActive,
                    ]}
                  />
                );
              })}
            </View>

            {/* Heading */}
            <Text
              style={[
                styles.heading,
                {
                  fontSize: isTablet ? 34 : isCompactPhone ? 25 : 29,
                  lineHeight: isTablet ? 42 : isCompactPhone ? 32 : 36,
                },
              ]}
              accessibilityRole="header"
            >
              {title}
            </Text>

            {/* Subtitle / Description */}
            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: isTablet ? 16.5 : 15.5,
                  lineHeight: isTablet ? 26 : 24,
                  maxWidth: isTablet ? 480 : 340,
                },
              ]}
            >
              {subtitle}
            </Text>
          </View>
        </View>

        {/* Bottom Interactive Navigation Controls */}
        <View
          style={[
            styles.bottomControls,
            {
              paddingBottom: Platform.OS === "ios" ? 8 : 16,
            },
          ]}
        >
          {onBack ? (
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Go back to previous step"
            >
              <Ionicons name="arrow-back" size={20} color={Colors.forestOlive} />
            </TouchableOpacity>
          ) : null}

          <Animated.View
            style={[
              styles.nextButtonWrapper,
              { transform: [{ scale: buttonScale }] },
            ]}
          >
            <Pressable
              onPress={onNext}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={[
                styles.primaryNextButton,
                { height: isTablet ? 58 : 54 },
              ]}
              accessibilityRole="button"
              accessibilityLabel={nextButtonLabel}
            >
              <Text style={styles.primaryNextButtonText}>{nextButtonLabel}</Text>
              <Ionicons
                name="arrow-forward"
                size={19}
                color={Colors.forestOlive}
                style={{ marginLeft: 6 }}
              />
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
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
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 16 : 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 14,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    width: "100%",
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
  skipButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: "rgba(40, 50, 24, 0.05)",
  },
  skipText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 0.2,
    includeFontPadding: false,
  },
  heroArea: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  textSection: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 18,
  },
  paginationDot: {
    width: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D6E3CB",
  },
  paginationDotActive: {
    width: 28,
    backgroundColor: Colors.primary,
  },
  heading: {
    fontWeight: "900",
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 10,
    includeFontPadding: false,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontWeight: "400",
    textAlign: "center",
    includeFontPadding: false,
  },
  bottomControls: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 12,
  },
  backButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.pureWhite,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: Colors.forestOlive,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  nextButtonWrapper: {
    flex: 1,
  },
  primaryNextButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 27,
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
  primaryNextButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.forestOlive,
    letterSpacing: 0.2,
    includeFontPadding: false,
  },
});
