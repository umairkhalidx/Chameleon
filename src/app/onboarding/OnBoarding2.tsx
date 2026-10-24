import { router } from "expo-router";
import { OnboardingScreenLayout } from "../../components/OnboardingScreenLayout";
import { ChatControlVisual } from "../../components/OnboardingVisuals";

export default function OnboardingScreen2() {
  return (
    <OnboardingScreenLayout
      step={2}
      title="Full Control Over Your Chats."
      subtitle="Customize each conversation to control what others can see and do with your messages."
      heroVisual={<ChatControlVisual />}
      nextButtonLabel="Next"
      onNext={() => router.push("/onboarding/OnBoarding3")}
      onBack={() => router.back()}
      onSkip={() => router.push("/auth" as any)}
    />
  );
}
