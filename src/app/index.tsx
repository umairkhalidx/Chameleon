import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text
          style={styles.welcomeText}
          className="text-2xl font-bold text-[#283218]"
          accessibilityRole="header"
        >
          Welcome to Chameleon
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#283218", // Deep forest olive from finalized palette
    textAlign: "center",
    letterSpacing: 0.5,
  },
});

