import { router } from "expo-router";
import { OnboardingScreenLayout } from "../../components/OnboardingScreenLayout";
import { QuantumShieldVisual } from "../../components/OnboardingVisuals";

export default function OnboardingScreen1() {
  return (
    <OnboardingScreenLayout
      step={1}
      title="True Private Messaging."
      subtitle="On-device, quantum-resistant encryption designed to protect your messages from interception."
      heroVisual={<QuantumShieldVisual />}
      nextButtonLabel="Continue"
      onNext={() => router.push("/onboarding/OnBoarding2")}
      onSkip={() => router.push("/auth" as any)}
    />
  );
}
