import React from "react";
import { ScreenPlaceholder } from "../../components/ScreenPlaceholder";
import { Colors } from "../../constants/colors";

export default function CommunitiesScreen() {
  return (
    <ScreenPlaceholder
      title="Communities"
      subtitle="Discover topics, joined spaces, and community hubs"
      badge="Network"
      badgeColor={Colors.accentLavender}
      icon="people"
      iconBgColor="#F3EEFF"
    />
  );
}
