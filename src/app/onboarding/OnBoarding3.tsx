import { router } from "expo-router";
import { OnboardingScreenLayout } from "../../components/OnboardingScreenLayout";
import { ServerNodeVisual } from "../../components/OnboardingVisuals";

export default function OnboardingScreen3() {
  return (
    <OnboardingScreenLayout
      step={3}
      title="Your Privacy, Your Way."
      subtitle="Deploy your own Chameleon server on your private domain for greater control over your messaging, infrastructure and data."
      heroVisual={<ServerNodeVisual />}
      nextButtonLabel="Get Started"
      onNext={() => router.push("/auth" as any)}
      onBack={() => router.back()}
    />
  );
}
