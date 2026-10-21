import React from "react";
import { ScreenPlaceholder } from "../../components/ScreenPlaceholder";
import { Colors } from "../../constants/colors";

export default function ProfileScreen() {
  return (
    <ScreenPlaceholder
      title="Profile"
      subtitle="User profile, account credentials, and settings"
      badge="Account"
      badgeColor={Colors.border}
      icon="user"
      iconFamily="feather"
      iconBgColor="#EFF6E8"
    />
  );
}
