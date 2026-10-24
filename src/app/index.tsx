import { Redirect } from "expo-router";

/**
 * Root Entry Router.
 * Directs the user to the appropriate flow based on their session state.
 *
 * Current Flow:
 * 1. Splash Screen
 * 2. Onboarding Screens (1 -> 2 -> 3)
 * 3. Auth Screen (Login / Signup)
 * 4. Home / Tabs (Chats, Communities, Configuration, Profile)
 *
 * Later, you can plug in your state logic here:
 *   if (isFirstTimeUser) return <Redirect href="/onboarding/OnBoarding1" />;
 *   if (!isLoggedIn) return <Redirect href="/auth" />;
 *   return <Redirect href="/(tabs)" />;
 */
export default function Index() {
  return <Redirect href="/onboarding/OnBoarding1" />;
}
