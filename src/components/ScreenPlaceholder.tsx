import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { Fonts, DotoWeight } from "../constants/fonts";

export interface ScreenPlaceholderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  icon?: string;
  iconFamily?: "ionicons" | "feather";
  iconBgColor?: string;
  headerTitle?: string;
  headerTitleColor?: string;
  headerFontWeight?: DotoWeight;
  children?: React.ReactNode;
  contentPaddingBottom?: number;
}

export function ScreenPlaceholder({
  title,
  subtitle,
  badge,
  badgeColor = Colors.primary,
  icon,
  iconFamily = "ionicons",
  iconBgColor = "#EBF5D4",
  headerTitle,
  headerTitleColor = Colors.primary,
  headerFontWeight = "black",
  children,
  contentPaddingBottom,
}: ScreenPlaceholderProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isTablet = width >= 768;

  // Floating tab bar takes 64dp + bottom position (insets.bottom + 8~16)
  const defaultBottomPadding = 64 + Math.max(insets.bottom, 16) + 20;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      {headerTitle ? (
        <View style={styles.topHeader}>
          <Text
            style={[
              styles.topHeaderTitle,
              {
                color: headerTitleColor,
                fontFamily: Fonts.doto[headerFontWeight],
                fontSize: isTablet ? 40 : 33,
                letterSpacing: isTablet ? 2.8 : 2.0,
              },
            ]}
            accessibilityRole="header"
            accessibilityLabel={headerTitle}
          >
            {headerTitle}
          </Text>
        </View>
      ) : null}
      <View
        style={[
          styles.container,
          {
            paddingBottom: contentPaddingBottom ?? defaultBottomPadding,
          },
        ]}
      >
        <View
          style={[
            styles.card,
            {
              maxWidth: isTablet ? 540 : "92%",
              paddingVertical: isTablet ? 48 : 36,
              paddingHorizontal: isTablet ? 40 : 24,
            },
          ]}
        >
          {icon && (
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: iconBgColor,
                  width: isTablet ? 84 : 72,
                  height: isTablet ? 84 : 72,
                  borderRadius: isTablet ? 42 : 36,
                },
              ]}
              accessible={false}
            >
              {iconFamily === "feather" ? (
                <Feather
                  name={icon as keyof typeof Feather.glyphMap}
                  size={isTablet ? 38 : 32}
                  color={Colors.forestOlive}
                />
              ) : (
                <Ionicons
                  name={icon as keyof typeof Ionicons.glyphMap}
                  size={isTablet ? 38 : 32}
                  color={Colors.forestOlive}
                />
              )}
            </View>
          )}

          {badge && (
            <View
              style={[
                styles.badge,
                { backgroundColor: badgeColor },
              ]}
            >
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}

          <Text
            style={[
              styles.title,
              { fontSize: isTablet ? 32 : 26 },
            ]}
            accessibilityRole="header"
            accessibilityLabel={title}
          >
            {title}
          </Text>

          {subtitle && (
            <Text style={styles.subtitle}>
              {subtitle}
            </Text>
          )}

          {children}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeader: {
    width: "100%",
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  topHeaderTitle: {
    textAlign: "center",
    includeFontPadding: false,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
  },
  card: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: Colors.forestOlive,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: Fonts.doto.semiBold,
    fontSize: 12,
    color: Colors.forestOlive,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    includeFontPadding: false,
  },
  title: {
    fontFamily: Fonts.doto.bold,
    color: Colors.textPrimary,
    textAlign: "center",
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 12,
  },
});
