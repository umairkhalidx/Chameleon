import { StyleSheet, Text, View, Platform, useWindowDimensions } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

/**
 * Screen 1 Visual: Quantum Encryption Vault
 * Represents on-device quantum-resistant cryptography, cryptographic nodes, and privacy shield.
 */
export function QuantumShieldVisual() {
  const { width } = useWindowDimensions();
  const scale = width < 380 ? Math.min(1, Math.max(0.82, (width - 48) / 330)) : 1;

  return (
    <View style={[styles.visualContainer, { transform: [{ scale }] }]}>
      {/* Ambient concentric orbital glow */}
      <View style={styles.ambientOuterRing} />
      <View style={styles.ambientInnerRing} />

      {/* Floating Cryptographic Nodes */}
      <View style={[styles.floatingPill, styles.nodeTopLeft]}>
        <Ionicons name="lock-closed" size={13} color={Colors.forestOlive} />
        <Text style={styles.floatingPillText}>AES-256-GCM</Text>
      </View>

      <View style={[styles.floatingPill, styles.nodeTopRight]}>
        <Ionicons name="flash" size={13} color="#2A6F1D" />
        <Text style={styles.floatingPillText}>Post-Quantum</Text>
      </View>

      <View style={[styles.floatingPill, styles.nodeBottomLeft]}>
        <Feather name="key" size={12} color="#6C5CE7" />
        <Text style={styles.floatingPillText}>On-Device Keys</Text>
      </View>

      <View style={[styles.floatingPill, styles.nodeBottomRight]}>
        <Ionicons name="shield-checkmark" size={13} color="#283218" />
        <Text style={styles.floatingPillText}>Zero-Knowledge</Text>
      </View>

      {/* Central Shield Vault Badge */}
      <View style={styles.centralVaultCard}>
        <View style={styles.shieldGlowCircle}>
          <Ionicons
            name="shield-checkmark"
            size={46}
            color={Colors.forestOlive}
          />
        </View>

        <View style={styles.verifiedBadge}>
          <View style={styles.greenPulseDot} />
          <Text style={styles.verifiedBadgeText}>END-TO-END SECURE</Text>
        </View>
      </View>
    </View>
  );
}

/**
 * Screen 2 Visual: Granular Chat Permission Studio
 * Represents message customization, self-destruct timers, and anti-leak controls.
 */
export function ChatControlVisual() {
  const { width } = useWindowDimensions();
  const scale = width < 380 ? Math.min(1, Math.max(0.82, (width - 48) / 330)) : 1;

  return (
    <View style={[styles.visualContainer, { transform: [{ scale }] }]}>
      {/* Ambient soft glow */}
      <View style={[styles.ambientOuterRing, { backgroundColor: "#F1EBFD" }]} />
      <View style={[styles.ambientInnerRing, { backgroundColor: "#E6DCFA" }]} />

      {/* Central Chat Card Simulation */}
      <View style={styles.chatPreviewCard}>
        {/* Chat Mini Header */}
        <View style={styles.chatCardHeader}>
          <View style={styles.chatAvatar}>
            <Text style={styles.chatAvatarText}>ER</Text>
          </View>
          <View style={styles.chatUserMeta}>
            <Text style={styles.chatUserName}>Elena Ross</Text>
            <View style={styles.chatSecurityStatus}>
              <Ionicons name="lock-closed" size={10} color="#3E7B27" />
              <Text style={styles.chatSecurityText}>Protected Channel</Text>
            </View>
          </View>
          <View style={styles.customBadgeTop}>
            <Feather name="sliders" size={13} color={Colors.forestOlive} />
          </View>
        </View>

        {/* Message Bubble with Encryption Tag */}
        <View style={styles.chatBubble}>
          <Text style={styles.chatBubbleText}>
            Confidential quarterly roadmap attached.
          </Text>
          <View style={styles.chatBubbleMeta}>
            <Text style={styles.chatTimestamp}>11:42 AM</Text>
            <Ionicons name="checkmark-done" size={14} color="#3E7B27" />
          </View>
        </View>
      </View>

      {/* Floating Permission Toggles */}
      <View style={[styles.floatingPill, styles.chatPillTop]}>
        <Ionicons name="timer-outline" size={14} color="#D97706" />
        <Text style={styles.floatingPillText}>Self-Destruct: 30s</Text>
      </View>

      <View style={[styles.floatingPill, styles.chatPillMiddle]}>
        <Ionicons name="eye-off-outline" size={14} color="#6C5CE7" />
        <Text style={styles.floatingPillText}>View-Once Media</Text>
      </View>

      <View style={[styles.floatingPill, styles.chatPillBottom]}>
        <Ionicons name="ban-outline" size={14} color="#DC2626" />
        <Text style={styles.floatingPillText}>Screenshots Blocked</Text>
      </View>
    </View>
  );
}

/**
 * Screen 3 Visual: Private Sovereign Server Node
 * Represents self-hosted Chameleon server, custom private domain, and data sovereignty.
 */
export function ServerNodeVisual() {
  const { width } = useWindowDimensions();
  const scale = width < 380 ? Math.min(1, Math.max(0.82, (width - 48) / 330)) : 1;

  return (
    <View style={[styles.visualContainer, { transform: [{ scale }] }]}>
      {/* Ambient soft glow */}
      <View style={[styles.ambientOuterRing, { backgroundColor: "#FFF0E1" }]} />
      <View style={[styles.ambientInnerRing, { backgroundColor: "#FFE3C7" }]} />

      {/* Server Rack Chassis Card */}
      <View style={styles.serverCard}>
        {/* Domain Terminal Bar */}
        <View style={styles.serverDomainBar}>
          <View style={styles.serverTrafficDots}>
            <View style={[styles.trafficDot, { backgroundColor: "#FF5F56" }]} />
            <View style={[styles.trafficDot, { backgroundColor: "#FFBD2E" }]} />
            <View style={[styles.trafficDot, { backgroundColor: "#27C93F" }]} />
          </View>
          <View style={styles.domainPill}>
            <Ionicons name="globe-outline" size={11} color={Colors.forestOlive} />
            <Text style={styles.domainPillText}>chat.yourdomain.com</Text>
          </View>
          <View style={styles.onlinePulseDot} />
        </View>

        {/* Server Blade 1 */}
        <View style={styles.serverBlade}>
          <View style={styles.bladeIconContainer}>
            <Feather name="server" size={14} color={Colors.primary} />
          </View>
          <View style={styles.bladeInfo}>
            <Text style={styles.bladeTitle}>Private Chameleon Relay</Text>
            <Text style={styles.bladeSubtitle}>Decentralized Architecture</Text>
          </View>
          <View style={styles.bladeStatus}>
            <Text style={styles.bladeStatusText}>ONLINE</Text>
          </View>
        </View>

        {/* Server Blade 2 */}
        <View style={[styles.serverBlade, { borderBottomWidth: 0 }]}>
          <View style={[styles.bladeIconContainer, { backgroundColor: "#364523" }]}>
            <Feather name="database" size={14} color={Colors.primary} />
          </View>
          <View style={styles.bladeInfo}>
            <Text style={styles.bladeTitle}>Isolated Storage Vault</Text>
            <Text style={styles.bladeSubtitle}>Zero Third-Party Telemetry</Text>
          </View>
          <View style={[styles.bladeStatus, { backgroundColor: "#223518" }]}>
            <Ionicons name="lock-closed" size={11} color={Colors.primary} />
          </View>
        </View>
      </View>

      {/* Floating Sovereignty Badges */}
      <View style={[styles.floatingPill, styles.serverPillTop]}>
        <Ionicons name="hardware-chip-outline" size={13} color="#2A6F1D" />
        <Text style={styles.floatingPillText}>100% Self-Hosted</Text>
      </View>

      <View style={[styles.floatingPill, styles.serverPillBottom]}>
        <Ionicons name="shield-checkmark" size={13} color="#D97706" />
        <Text style={styles.floatingPillText}>Full Data Sovereignty</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  visualContainer: {
    width: "100%",
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  ambientOuterRing: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "#EFF9DD",
    opacity: 0.65,
  },
  ambientInnerRing: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "#E2F4C5",
    opacity: 0.85,
  },
  centralVaultCard: {
    width: 130,
    height: 130,
    backgroundColor: Colors.pureWhite,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#D8EEB6",
    ...Platform.select({
      ios: {
        shadowColor: Colors.forestOlive,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 18,
      },
      android: {
        elevation: 6,
      },
      default: {},
    }),
  },
  shieldGlowCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EBF8D3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "#F2F9E8",
    borderRadius: 8,
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2ECC71",
  },
  verifiedBadgeText: {
    fontSize: 8.5,
    fontWeight: "800",
    color: Colors.forestOlive,
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  floatingPill: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 6,
    backgroundColor: Colors.pureWhite,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5EEDB",
    ...Platform.select({
      ios: {
        shadowColor: Colors.forestOlive,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  floatingPillText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: Colors.forestOlive,
    letterSpacing: -0.1,
    includeFontPadding: false,
  },
  nodeTopLeft: {
    top: 14,
    left: 8,
  },
  nodeTopRight: {
    top: 20,
    right: 8,
  },
  nodeBottomLeft: {
    bottom: 16,
    left: 10,
  },
  nodeBottomRight: {
    bottom: 12,
    right: 10,
  },

  // Screen 2 Styles
  chatPreviewCard: {
    width: "82%",
    maxWidth: 290,
    backgroundColor: Colors.pureWhite,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#EAE3F7",
    padding: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#283218",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 5,
      },
      default: {},
    }),
  },
  chatCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  chatAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accentLavender,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  chatAvatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.forestOlive,
    includeFontPadding: false,
  },
  chatUserMeta: {
    flex: 1,
  },
  chatUserName: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.forestOlive,
    includeFontPadding: false,
  },
  chatSecurityStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 1,
  },
  chatSecurityText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4A6B32",
    includeFontPadding: false,
  },
  customBadgeTop: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3EEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  chatBubble: {
    backgroundColor: "#F6F9F2",
    borderRadius: 14,
    borderTopLeftRadius: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E7F0DE",
  },
  chatBubbleText: {
    fontSize: 12.5,
    color: Colors.forestOlive,
    lineHeight: 18,
    fontWeight: "500",
    includeFontPadding: false,
  },
  chatBubbleMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 4,
  },
  chatTimestamp: {
    fontSize: 10,
    color: Colors.textMuted,
    includeFontPadding: false,
  },
  chatPillTop: {
    top: 4,
    right: 4,
    borderColor: "#FDE68A",
  },
  chatPillMiddle: {
    bottom: 24,
    left: 2,
    borderColor: "#DDD6FE",
  },
  chatPillBottom: {
    bottom: 2,
    right: 6,
    borderColor: "#FECACA",
  },

  // Screen 3 Styles
  serverCard: {
    width: "86%",
    maxWidth: 300,
    backgroundColor: Colors.forestOlive,
    borderRadius: 22,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#283218",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.16,
        shadowRadius: 20,
      },
      android: {
        elevation: 7,
      },
      default: {},
    }),
  },
  serverDomainBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#3B4A26",
    marginBottom: 10,
  },
  serverTrafficDots: {
    flexDirection: "row",
    gap: 4,
  },
  trafficDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  domainPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: Colors.pureWhite,
    borderRadius: 8,
  },
  domainPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.forestOlive,
    includeFontPadding: false,
  },
  onlinePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.primary,
  },
  serverBlade: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#354421",
    gap: 10,
  },
  bladeIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#3A4B24",
    alignItems: "center",
    justifyContent: "center",
  },
  bladeInfo: {
    flex: 1,
  },
  bladeTitle: {
    fontSize: 11.5,
    fontWeight: "700",
    color: Colors.pureWhite,
    includeFontPadding: false,
  },
  bladeSubtitle: {
    fontSize: 9.5,
    color: "#B2C69B",
    marginTop: 1,
    includeFontPadding: false,
  },
  bladeStatus: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "#1F2913",
  },
  bladeStatusText: {
    fontSize: 8.5,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: 0.4,
    includeFontPadding: false,
  },
  serverPillTop: {
    top: 6,
    left: 4,
  },
  serverPillBottom: {
    bottom: 2,
    right: 4,
  },
});
