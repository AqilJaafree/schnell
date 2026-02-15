import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePrivy, useEmbeddedEthereumWallet, useEmbeddedSolanaWallet } from '@privy-io/expo';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';
import AvatarPlaceholder from '../../components/AvatarPlaceholder';
import Card from '../../components/Card';
import { DUMMY_USER, DUMMY_CART, DUMMY_ORDERS } from '../../data/dummy';
import { useOnboardingStatus } from '../../hooks/useOnboardingStatus';

function WalletCard({ label, address }: { label: string; address: string }) {
  const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;
  return (
    <View style={styles.walletCard}>
      <Text style={styles.walletLabel}>{label}</Text>
      <Text style={styles.walletAddress}>{truncated}</Text>
    </View>
  );
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: number;
  onPress?: () => void;
}

function MenuItem({ icon, label, badge, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={22} color={Colors.primaryText} />
        <Text style={styles.menuItemLabel}>{label}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {badge !== undefined && badge > 0 && (
          <View style={styles.menuBadge}>
            <Text style={styles.menuBadgeText}>{badge}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={18} color={Colors.mutedText} />
      </View>
    </TouchableOpacity>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    processing: '#F59E0B',
    shipped: '#3B82F6',
    delivered: '#10B981',
  };
  return (
    <View style={[styles.statusBadge, { backgroundColor: colorMap[status] ?? Colors.mutedText }]}>
      <Text style={styles.statusBadgeText}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = usePrivy();
  const { resetOnboarding } = useOnboardingStatus();
  const ethWallet = useEmbeddedEthereumWallet();
  const solWallet = useEmbeddedSolanaWallet();

  const handleLogout = async () => {
    await resetOnboarding();
    await logout();
  };

  const ethAddress = ethWallet.wallets?.[0]?.address;
  const solAddress =
    solWallet.status === 'connected' ? solWallet.wallets?.[0]?.address : undefined;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Profile</Text>

        {/* User Info */}
        <Card style={styles.profileCard}>
          <AvatarPlaceholder size={80} />
          <Text style={styles.profileName}>{DUMMY_USER.name}</Text>
          <Text style={styles.profileEmail}>{DUMMY_USER.email}</Text>
          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>{DUMMY_USER.height} cm</Text>
              <Text style={styles.profileStatLabel}>Height</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>{DUMMY_USER.weight} kg</Text>
              <Text style={styles.profileStatLabel}>Weight</Text>
            </View>
          </View>
        </Card>

        {/* Wallets */}
        <Text style={styles.sectionTitle}>Wallets</Text>
        {ethAddress ? (
          <WalletCard label="Ethereum" address={ethAddress} />
        ) : (
          <View style={styles.walletCard}>
            <Text style={styles.walletLabel}>Ethereum</Text>
            <Text style={styles.walletPending}>Creating wallet...</Text>
          </View>
        )}
        {solAddress ? (
          <WalletCard label="Solana" address={solAddress} />
        ) : (
          <View style={styles.walletCard}>
            <Text style={styles.walletLabel}>Solana</Text>
            <Text style={styles.walletPending}>Creating wallet...</Text>
          </View>
        )}

        {/* Shopping Menu */}
        <Text style={styles.sectionTitle}>Shopping</Text>
        <Card style={styles.menuCard}>
          <MenuItem icon="cart-outline" label="Cart" badge={DUMMY_CART.length} onPress={() => router.push('/cart')} />
          <MenuItem icon="card-outline" label="Payment Methods" />
          <MenuItem icon="location-outline" label="Delivery Tracking" badge={DUMMY_ORDERS.filter((o) => o.status !== 'delivered').length} />
        </Card>

        {/* Active Orders */}
        {DUMMY_ORDERS.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Active Orders</Text>
            {DUMMY_ORDERS.map((order) => (
              <Card key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <OrderStatusBadge status={order.status} />
                </View>
                {order.items.map((item, idx) => (
                  <Text key={idx} style={styles.orderItem}>
                    {item.quantity}x {item.name} (Size {item.size})
                  </Text>
                ))}
                <Text style={styles.orderDelivery}>
                  Est. delivery: {order.estimatedDelivery}
                </Text>
                <Text style={styles.orderTracking}>
                  Tracking: {order.trackingNumber}
                </Text>
              </Card>
            ))}
          </>
        )}

        {/* Settings */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <Card style={styles.menuCard}>
          <MenuItem icon="settings-outline" label="Preferences" />
          <MenuItem icon="notifications-outline" label="Notifications" />
          <MenuItem icon="help-circle-outline" label="Help & Support" />
        </Card>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  pageTitle: {
    fontFamily: Fonts.dmSerifDisplay,
    fontSize: FontSizes.xxl,
    color: Colors.primaryText,
    marginBottom: Spacing.xl,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  profileName: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.primaryText,
    marginTop: Spacing.md,
  },
  profileEmail: {
    fontSize: FontSizes.sm,
    color: Colors.mutedText,
    marginTop: Spacing.xs,
  },
  profileStats: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  profileStat: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  profileStatValue: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  profileStatLabel: {
    fontSize: FontSizes.xs,
    color: Colors.mutedText,
    marginTop: 2,
  },
  profileStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  walletCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  walletLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: Colors.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  walletAddress: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.primaryText,
    fontFamily: 'monospace',
  },
  walletPending: {
    fontSize: FontSizes.sm,
    color: Colors.mutedText,
    fontStyle: 'italic',
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuItemLabel: {
    fontSize: FontSizes.md,
    color: Colors.primaryText,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  menuBadge: {
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  menuBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  orderCard: {
    marginBottom: Spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  orderId: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusBadgeText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  orderItem: {
    fontSize: FontSizes.sm,
    color: Colors.secondaryText,
    marginBottom: 2,
  },
  orderDelivery: {
    fontSize: FontSizes.xs,
    color: Colors.mutedText,
    marginTop: Spacing.sm,
  },
  orderTracking: {
    fontSize: FontSizes.xs,
    color: Colors.mutedText,
    marginTop: 2,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  logoutText: {
    color: Colors.error,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
