import React from "react";
import { ScreenPlaceholder } from "../../components/ScreenPlaceholder";
import { Colors } from "../../constants/colors";

export default function ChatsScreen() {
  return (
    <ScreenPlaceholder
      headerTitle="Chameleon"
      headerTitleColor={Colors.primary}
      headerFontWeight="black"
      title="Chats"
      subtitle="Direct messages, group conversations, and recent threads"
      badge="Messaging"
      badgeColor={Colors.primary}
      icon="chatbubbles"
      iconBgColor="#EBF5D4"
    />
  );
}
