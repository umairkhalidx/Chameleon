import React from "react";
import { ScreenPlaceholder } from "../../components/ScreenPlaceholder";
import { Colors } from "../../constants/colors";

export default function ConfigurationScreen() {
  return (
    <ScreenPlaceholder
      title="Configuration"
      subtitle="System parameters, integrations, and preferences"
      badge="System"
      badgeColor={Colors.accentPeach}
      icon="options"
      iconBgColor="#FEF3EB"
    />
  );
}
