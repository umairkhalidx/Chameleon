import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import type { Tabs } from "expo-router";
import { Colors } from "../constants/colors";

type TabsTabBarFn = NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]>;
export type FloatingTabBarProps = Parameters<TabsTabBarFn>[0];

interface TabConfig {
  activeIcon: string;
  inactiveIcon: string;
  iconFamily: "ionicons" | "feather";
  label: string;
}

const TAB_CONFIGS: Record<string, TabConfig> = {
  index: {
    activeIcon: "chatbubbles",
    inactiveIcon: "chatbubbles-outline",
    iconFamily: "ionicons",
    label: "Chats",
  },
  communities: {
    activeIcon: "people",
    inactiveIcon: "people-outline",
    iconFamily: "ionicons",
    label: "Communities",
  },
  configuration: {
    activeIcon: "options",
    inactiveIcon: "options-outline",
    iconFamily: "ionicons",
    label: "Configuration",
  },
  profile: {
    activeIcon: "user",
    inactiveIcon: "user",
    iconFamily: "feather",
    label: "Profile",
  },
};

const BAR_HEIGHT = 64;
const PILL_WIDTH = 56;
const PILL_HEIGHT = 44;
const PILL_TOP = (BAR_HEIGHT - PILL_HEIGHT) / 2; // 10px: exact vertical center

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: FloatingTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();

  const activeIndex = state.index;
  const tabCount = state.routes.length;

  // Responsive compact floating dock geometry (balanced spacing between icons)
  const isTablet = windowWidth >= 768;
  const targetBarWidth = isTablet ? 360 : 312;
  const barWidthConstrained = Math.min(windowWidth - 48, targetBarWidth);
  const horizontalMargin = (windowWidth - barWidthConstrained) / 2;

  const initialWidth = barWidthConstrained;
  const initialTabWidth = initialWidth / tabCount;

  const [barWidth, setBarWidth] = useState(initialWidth);
  const tabLayoutsRef = useRef<{ x: number; width: number }[]>([]);
  const prevIndexRef = useRef(activeIndex);

  // Exact bubble center calculation based on physical tab layout
  const getPillPosition = useCallback(
    (index: number) => {
      const layout = tabLayoutsRef.current[index];
      if (layout && layout.width > 0) {
        return layout.x + (layout.width - PILL_WIDTH) / 2;
      }
      const currentTabWidth =
        barWidth > 0 ? barWidth / tabCount : initialTabWidth;
      return (index + 0.5) * currentTabWidth - PILL_WIDTH / 2;
    },
    [barWidth, tabCount, initialTabWidth]
  );

  // Initialized at exact target position from frame 1
  const initialPillX =
    (activeIndex + 0.5) * initialTabWidth - PILL_WIDTH / 2;

  const [translateX] = useState(() => new Animated.Value(initialPillX));
  const [scaleX] = useState(() => new Animated.Value(1));
  const [scaleY] = useState(() => new Animated.Value(1));

  // Press feedback & icon cross-fades (React 19 / Compiler compliant)
  const [pressScales] = useState(() =>
    state.routes.map(() => new Animated.Value(1))
  );
  const [iconScales] = useState(() =>
    state.routes.map((_, i) => new Animated.Value(i === activeIndex ? 1.1 : 1))
  );
  const [activeOpacities] = useState(() =>
    state.routes.map((_, i) => new Animated.Value(i === activeIndex ? 1 : 0))
  );
  const [inactiveOpacities] = useState(() =>
    state.routes.map((_, i) => new Animated.Value(i === activeIndex ? 0 : 1))
  );

  // Synchronize liquid indicator on navigation changes
  useEffect(() => {
    const targetX = getPillPosition(activeIndex);
    const prevIndex = prevIndexRef.current;
    const distance = Math.abs(activeIndex - prevIndex);

    if (distance === 0) {
      translateX.setValue(targetX);
      return;
    }

    prevIndexRef.current = activeIndex;

    // Subtle fluid momentum stretch & squash
    const stretchAmount = Math.min(1 + distance * 0.08, 1.2);
    const squashAmount = Math.max(1 - distance * 0.05, 0.9);

    // 1. Fluid translation with snappy, authoritative spring physics
    const moveAnimation = Animated.spring(translateX, {
      toValue: targetX,
      tension: 78,
      friction: 9.5,
      useNativeDriver: true,
    });

    // 2. Refined fluid stretch & settle
    const fluidMorphAnimation = Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleX, {
          toValue: stretchAmount,
          duration: 110,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleY, {
          toValue: squashAmount,
          duration: 110,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(scaleX, {
          toValue: 1,
          tension: 130,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleY, {
          toValue: 1,
          tension: 130,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]);

    // 3. Icon scale and cross-fade between outline and filled states
    const iconTransitions = state.routes.flatMap((_, i) => {
      const isTarget = i === activeIndex;
      return [
        Animated.spring(iconScales[i], {
          toValue: isTarget ? 1.1 : 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(activeOpacities[i], {
          toValue: isTarget ? 1 : 0,
          duration: 180,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(inactiveOpacities[i], {
          toValue: isTarget ? 0 : 1,
          duration: 180,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ];
    });

    Animated.parallel([
      moveAnimation,
      fluidMorphAnimation,
      ...iconTransitions,
    ]).start();
  }, [
    activeIndex,
    getPillPosition,
    translateX,
    scaleX,
    scaleY,
    iconScales,
    activeOpacities,
    inactiveOpacities,
    state.routes,
  ]);

  const bottomPosition = Platform.select({
    ios: Math.max(insets.bottom, 16),
    android: Math.max(insets.bottom + 8, 18),
    default: 18,
  });

  return (
    <View
      style={[
        styles.outerContainer,
        {
          left: horizontalMargin,
          right: horizontalMargin,
          bottom: bottomPosition,
        },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={styles.floatingBar}
        onLayout={(e) => {
          const width = e.nativeEvent.layout.width;
          if (width > 0 && Math.abs(width - barWidth) > 1) {
            setBarWidth(width);
            translateX.setValue(
              (activeIndex + 0.5) * (width / tabCount) - PILL_WIDTH / 2
            );
          }
        }}
        accessibilityRole="tablist"
      >
        {/* Solid, Clean Vibrant Lime Pill Indicator */}
        {barWidth > 0 && (
          <Animated.View
            style={[
              styles.activePill,
              {
                transform: [
                  { translateX },
                  { scaleX },
                  { scaleY },
                ],
              },
            ]}
          />
        )}

        {/* Tab Items with Filled Icon on Active, Outline Icon on Inactive */}
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const config = TAB_CONFIGS[route.name] || TAB_CONFIGS.index;

          const label =
            options.tabBarAccessibilityLabel ||
            options.title ||
            config.label;

          const handlePressIn = () => {
            Animated.spring(pressScales[index], {
              toValue: 0.94,
              tension: 300,
              friction: 12,
              useNativeDriver: true,
            }).start();
          };

          const handlePressOut = () => {
            Animated.spring(pressScales[index], {
              toValue: 1,
              tension: 200,
              friction: 9,
              useNativeDriver: true,
            }).start();
          };

          const handlePress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={label}
              onPress={handlePress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onLayout={(e) => {
                const { x, width } = e.nativeEvent.layout;
                tabLayoutsRef.current[index] = { x, width };
                if (index === activeIndex) {
                  translateX.setValue(x + (width - PILL_WIDTH) / 2);
                }
              }}
              style={styles.tabButton}
            >
              <Animated.View
                style={[
                  styles.tabButtonContent,
                  {
                    transform: [{ scale: pressScales[index] }],
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.iconWrapper,
                    {
                      transform: [{ scale: iconScales[index] }],
                    },
                  ]}
                >
                  {/* Active Icon: Filled/Selected in Deep Forest Olive */}
                  <Animated.View
                    style={[
                      StyleSheet.absoluteFill,
                      styles.iconCenter,
                      { opacity: activeOpacities[index] },
                    ]}
                  >
                    {config.iconFamily === "feather" ? (
                      <Feather
                        name={config.activeIcon as keyof typeof Feather.glyphMap}
                        size={25}
                        color={Colors.forestOlive}
                      />
                    ) : (
                      <Ionicons
                        name={config.activeIcon as keyof typeof Ionicons.glyphMap}
                        size={26}
                        color={Colors.forestOlive}
                      />
                    )}
                  </Animated.View>

                  {/* Inactive Icon: Outline in Deep Muted Olive with Optical Bolding */}
                  <Animated.View
                    style={[
                      StyleSheet.absoluteFill,
                      styles.iconCenter,
                      { opacity: inactiveOpacities[index] },
                    ]}
                  >
                    {config.iconFamily === "feather" ? (
                      <Feather
                        name={config.inactiveIcon as keyof typeof Feather.glyphMap}
                        size={25}
                        color="#384725"
                        style={styles.inactiveIconGlyph}
                      />
                    ) : (
                      <Ionicons
                        name={config.inactiveIcon as keyof typeof Ionicons.glyphMap}
                        size={26}
                        color="#384725"
                        style={styles.inactiveIconGlyph}
                      />
                    )}
                  </Animated.View>
                </Animated.View>
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  floatingBar: {
    width: "100%",
    height: BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.pureWhite,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(40, 50, 24, 0.08)",
    paddingHorizontal: 0,
    ...Platform.select({
      ios: {
        shadowColor: "#1A250E",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
  },
  activePill: {
    position: "absolute",
    left: 0,
    top: PILL_TOP, // 10px: exact vertical center
    width: PILL_WIDTH,
    height: PILL_HEIGHT,
    borderRadius: 22,
    backgroundColor: Colors.primary, // Clean solid #A8E619 Vibrant Lime
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.28,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  tabButton: {
    flex: 1,
    height: BAR_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonContent: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveIconGlyph: {
    textShadowColor: "rgba(56, 71, 37, 0.35)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0.8,
  },
});
